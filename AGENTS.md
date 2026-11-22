# matt-ui

React 组件平台的 pnpm + Turborepo 工作区。需求与分阶段计划见 `UI-Platform-Implementation-Blueprint.md`，术语见 `CONTEXT.md`，选型理由见 `docs/architecture/`。

## 完成标准

改动后依次运行，全部通过才算完成：

```bash
pnpm lint && pnpm format:check && pnpm typecheck && pnpm test && pnpm build
```

改动了 `packages/ui` 的组件时，再运行 `pnpm registry:generate`、`pnpm test:consumer` 和 `pnpm test:registry`。

## 约定

这些约定无法从配置文件中直接看出：

- 相对导入写 `.js` 扩展名（`import { cn } from "./cn.js"`），目标是 `.ts` 或 `.tsx` 时也一样。
- 依赖版本只写在 `pnpm-workspace.yaml` 的 `catalog` 中，`package.json` 里写 `catalog:`。新增依赖用 `pnpm add`，它会把版本写进 catalog；依赖已在 catalog 中时，直接在 `package.json` 里加一行 `catalog:` 再 `pnpm install`。
- 版本交给发布年龄策略选择；安装被策略拦截时停下来询问用户。
- 依赖带安装脚本时，在 `pnpm-workspace.yaml` 的 `allowBuilds` 中逐个表态并写明理由。
- 测试先于实现编写，只在包的公开入口上断言行为。组件自己做出的行为决定用 Vitest 验证；样式、主题、焦点环在 `tests/consumer-fixture` 的端到端测试里验证。
- Stories 与消费方验证项目只从 `@matt-ui/ui` 的公开入口引入组件，改了组件源码要先重新构建才能看到变化。
- 每个组件一个目录，放在 `packages/ui/src/components/` 下，类型在 `*.types.ts`，样式定义在 `*.variants.ts`。
- 新组件用 `pnpm component:new <名称>` 起步，它会创建源码、测试、Registry 元数据、展示站示例与文档数据的起始文件。
- Tailwind 靠扫描源码文本生成样式：类名必须写成完整的字面量，不能用模板字符串拼接变体前缀。
- 组件之间复用时，从兄弟目录的出口引入（`../button/index.js`），Registry 生成器会把它登记为条目依赖。
- `registry.json` 与 `registry/` 是生成物，只能通过 `pnpm registry:generate` 更新。组件目录里有 `<名称>.meta.json` 才会进入 Registry。
- 通过 Registry 分发的组件运行在使用者自己的 shadcn 主题里：只使用标准 shadcn 主题已有的颜色名，新增的颜色要登记到 `scripts/registry/constants.mjs` 的 `EXTRA_COLOR_TOKENS`。
- 展示站展示的源码直接读自示例文件与生成的 Registry 文件。站点的版式对齐 easyui.site，只参考它的版式与功能，不复制它的源码。
- 改动展示站后运行 `pnpm --filter @matt-ui/docs e2e`。
- 组件只使用 `--ui-*` Token 对应的工具类；颜色、时长、层级的字面量集中在 `packages/tokens`。
- 修改 `packages/tokens/src/themes/` 的色值后，核对每组前景与表面的对比度不低于 4.5:1，input 与 ring 对背景不低于 3:1。
- 一个组件的交互行为只来自一个交互底座，底座的类型留在组件实现文件内部。
- `@ui-sdk/*` 只用于 Base UI 没有的组件（Tree、排序、Command、Resizable），版本精确锁定；其余交互组件用 Base UI，原生元素够用时两者都不用（见 ADR-001）。
- 交互底座的对比用例在 `poc/interaction-engine/`，运行方式见该目录的 README。
- 按蓝图分阶段推进，每个阶段结束后向用户汇报并等待确认。
- npm 发布与部署需要用户逐次批准。
- 注释与文档使用简体中文。
