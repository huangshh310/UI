/**
 * Registry 安装验证：确认组件能通过 shadcn CLI 装进一个全新的项目并正常工作。
 *
 * 流程：
 *   1. 用 shadcn CLI 创建一个全新的 Vite 项目；
 *   2. 把 registry.json 构建成 CLI 可读取的条目，安装全部组件；
 *   3. 类型检查并构建该项目；
 *   4. 在真实浏览器里检查按钮的样式与行为。
 *
 * 项目建在系统临时目录，结束后删除。用法：pnpm test:registry
 */
import { execSync, spawn } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { ROOT } from "./registry/constants.mjs";
import { checkInstalledButton } from "./registry/browser-check.mjs";

const PORT = 3400;
const WORK = mkdtempSync(join(tmpdir(), "matt-ui-registry-"));
const APP = join(WORK, "app");
const ITEMS = join(WORK, "r");

/** 执行命令并打印输出；标准输入关闭，CLI 遇到交互式提问会直接失败而不是挂起 */
const run = (command, cwd) => {
  console.log(`\n$ ${command}`);
  execSync(command, { cwd, stdio: ["ignore", "inherit", "inherit"] });
};

/** 启动预览服务，等它可以访问 */
/**
 * 结束预览服务。
 * 服务经由 pnpm 启动，真正监听端口的是它的子进程；只结束 pnpm 会把子进程留下来占着端口，
 * 所以这里结束整个进程组。
 */
const stopPreview = (server) => {
  try {
    process.kill(-server.pid);
  } catch {
    // 进程组已经不存在，无需处理
  }
};

const startPreview = async () => {
  const server = spawn(
    "pnpm",
    ["exec", "vite", "preview", "--port", String(PORT), "--strictPort"],
    {
      cwd: APP,
      stdio: "ignore",
      // 自成一个进程组，结束时才能连同真正监听端口的子进程一起结束
      detached: true,
    },
  );
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const ready = await fetch(`http://localhost:${PORT}`).then(
      (response) => response.ok,
      () => false,
    );
    if (ready) return server;
    await sleep(250);
  }
  stopPreview(server);
  throw new Error(`预览服务没有启动，请确认端口 ${PORT} 没有被占用`);
};

try {
  run(`pnpm exec shadcn init -t vite -b base -p nova --no-monorepo -y -n app -c "${WORK}"`, ROOT);
  run(`pnpm exec shadcn build ./registry.json -o "${ITEMS}"`, ROOT);
  // 安装 Registry 中的每一个条目：类型检查与构建会覆盖全部组件，浏览器检查只针对 Button
  const items = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8")).items;
  const files = items.map(({ name }) => `"${join(ITEMS, `${name}.json`)}"`).join(" ");
  run(`pnpm exec shadcn add ${files} --overwrite -y -c "${APP}"`, ROOT);

  copyFileSync(join(ROOT, "scripts/registry/fixture-app.tsx.txt"), join(APP, "src/App.tsx"));
  run("pnpm exec tsc -b", APP);
  run("pnpm exec vite build", APP);

  const server = await startPreview();
  try {
    console.log("\n浏览器检查：");
    mkdirSync(join(ROOT, "test-results"), { recursive: true });
    await checkInstalledButton(
      `http://localhost:${PORT}`,
      join(ROOT, "test-results/registry-install.png"),
    );
  } finally {
    stopPreview(server);
  }
  console.log("\nRegistry 安装验证通过。");
} finally {
  rmSync(WORK, { recursive: true, force: true });
}
