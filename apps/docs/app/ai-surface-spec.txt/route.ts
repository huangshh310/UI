/**
 * ai-surface-spec.txt：面向外部智能体与跨语言实现者的机器可读协议规范端点。构建时静态生成。
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";

const SPEC_PATH = join(process.cwd(), "../../docs/specs/ai-surface-spec.md");

export const GET = async () => {
  const markdown = await readFile(SPEC_PATH, "utf8");
  return new Response(markdown, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
