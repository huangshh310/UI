/**
 * 消费方验证：确认 @matt-ui 的包能被一个真实的外部项目安装和使用。
 *
 * 流程：
 *   1. 把各包打成 tarball，与发布到 npm 的内容完全一致；
 *   2. 在 tests/consumer-fixture（独立于工作区的项目）中从 tarball 安装；
 *   3. 类型检查，确认类型声明与 exports 可用；
 *   4. 安装测试用的浏览器（已安装则跳过），在真实浏览器中运行端到端测试。
 *
 * 运行前需要先构建各包（pnpm build）。用法：pnpm test:consumer
 */
import { execSync } from "node:child_process";
import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE = join(ROOT, "tests/consumer-fixture");
const TARBALLS = join(FIXTURE, ".tarballs");

/** 需要打包的包：目录名，以及 tarball 的固定文件名（不随版本号变化） */
const PACKAGES = [
  { dir: "packages/utils", tarball: "utils.tgz" },
  { dir: "packages/ui", tarball: "ui.tgz" },
  { dir: "packages/motion", tarball: "motion.tgz" },
];

/** 执行命令并把输出直接打印出来；命令失败时抛错，中止整个流程 */
const run = (command, cwd) => {
  console.log(`\n$ ${command}  (${cwd.replace(ROOT, ".") || "."})`);
  execSync(command, { cwd, stdio: "inherit" });
};

/** 把一个包打成 tarball，并重命名为固定文件名 */
const pack = ({ dir, tarball }) => {
  const before = new Set(readdirSync(TARBALLS));
  run(`pnpm pack --pack-destination "${TARBALLS}"`, join(ROOT, dir));
  const created = readdirSync(TARBALLS).find((name) => !before.has(name));
  if (!created) throw new Error(`${dir} 没有产出 tarball`);
  renameSync(join(TARBALLS, created), join(TARBALLS, tarball));
};

rmSync(TARBALLS, { recursive: true, force: true });
mkdirSync(TARBALLS, { recursive: true });
PACKAGES.forEach(pack);

// 每次都重新安装：tarball 的内容会变，不能复用上一次的 node_modules
rmSync(join(FIXTURE, "node_modules"), { recursive: true, force: true });
run("pnpm install --no-frozen-lockfile", FIXTURE);
run("pnpm typecheck", FIXTURE);
// 已安装时这一步立即返回；CI 的全新环境还需要一并安装浏览器的系统依赖
run(`pnpm exec playwright install ${process.env.CI ? "--with-deps " : ""}chromium`, FIXTURE);
run("pnpm e2e", FIXTURE);

console.log("\n消费方验证通过。");
