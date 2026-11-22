/**
 * llms.txt：面向 AI 助手的站点索引，列出文档与全部组件及其安装命令。构建时生成。
 */
import { cliCommand, COMPONENTS } from "@/registry/registry";
import { SITE_NAME, SITE_URL } from "@/site/constants";

export const dynamic = "force-static";

const body = () =>
  [
    `# ${SITE_NAME}`,
    "",
    "> 开源的 React 组件库。组件以 TypeScript 源码的形式通过 shadcn Registry 分发，基于 Tailwind CSS v4。",
    "",
    "## 文档",
    "",
    `- [快速开始](${SITE_URL}/docs): 初始化 shadcn、安装组件、主题说明。`,
    `- [组件目录](${SITE_URL}/components): 全部组件的实时预览。`,
    "",
    "## 组件",
    "",
    ...COMPONENTS.map(
      (component) =>
        `- [${component.name}](${SITE_URL}/components/${component.slug}): ${component.description} 安装：\`${cliCommand(component)}\``,
    ),
    "",
  ].join("\n");

export const GET = () =>
  new Response(body(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
