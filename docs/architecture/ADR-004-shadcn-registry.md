# ADR-004：通过 shadcn GitHub Registry 分发组件源码

- 状态：已采纳
- 日期：2026-11-22

## 背景

用户要求参照 easyui.site 的功能与版式。easyui 的安装方式、详情页的 CLI 命令、给 AI 的提示词都建立在 shadcn Registry 之上：使用者运行一条命令，组件的源文件就被复制进自己的项目。此前本项目只有 npm 包一条分发途径，蓝图把 Registry 排在 Phase 5。

## 决策

把仓库本身作为 shadcn GitHub Registry。仓库根目录的 `registry.json` 描述全部条目，使用者通过 `pnpm dlx shadcn@latest add huangshh310/UI/<组件名>` 安装。npm 包保留，两条途径并存。

组件只在 `packages/ui` 里实现一次，Registry 的全部内容由 `pnpm registry:generate` 生成：

- **单文件源码。** 组件在 `packages/ui` 中按职责拆成多个文件，而 shadcn 的使用者期望一个组件一个文件。生成脚本把它们合并为 `registry/ui/<名称>.tsx`，并把 `@matt-ui/utils` 的导入改写为 `@/lib/utils`。
- **沿用使用者的主题。** 组件使用标准 shadcn 的颜色名（`primary`、`accent` 等），直接融入使用者现有的主题。只有标准主题里没有的颜色（`signal`、`destructive-foreground`）和动效变量随条目一起分发，由 CLI 写进使用者的样式表。取值从 `packages/tokens` 读取，不重复维护。
- **`cn()` 来自 shadcn 内置的 `utils` 条目**，不再分发一份自己的。

## 验证

- shadcn 官方 CLI（4.23.0）的 `registry validate` 通过。
- `pnpm test:registry` 用 CLI 创建一个全新的 Vite 项目，安装 Button，类型检查并构建，然后在 Chromium 里确认：信号色取自随组件安装的变量；点击可以触发；加载中不可重复触发。
- CI 中 `pnpm registry:check` 保证提交的生成物与组件源码一致。

## 对 easyui 的参考范围

easyui 以 MIT 许可开源。本项目参考的是它的站点版式、功能清单与组件清单，实现全部重写，没有复制它的源码、配色或素材。

## 后续影响

- 每个要进入 Registry 的组件需要一个 `<名称>.meta.json`。
- 组件新增的颜色必须登记到生成脚本的额外颜色清单，否则在使用者项目里没有定义。
- 依赖 Base UI 的组件进入 Registry 时，`@base-ui/react` 会作为 npm 依赖列出；组件之间的依赖要用 `huangshh310/UI/<名称>` 的完整地址声明。
