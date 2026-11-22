# matt-ui

React 组件平台的 pnpm + Turborepo 工作区。需求与分阶段计划见 `UI-Platform-Implementation-Blueprint.md`，术语见 `CONTEXT.md`，选型理由见 `docs/architecture/`。

## 完成标准

改动后依次运行，全部通过才算完成：

```bash
pnpm lint && pnpm format:check && pnpm typecheck && pnpm test && pnpm build
```

## 约定

这些约定无法从配置文件中直接看出：

- 相对导入写 `.js` 扩展名（`import { cn } from "./cn.js"`），目标是 `.ts` 或 `.tsx` 时也一样。
- 新增依赖用 `pnpm add`，版本交给发布年龄策略选择；安装被策略拦截时停下来询问用户。
- 依赖带安装脚本时，在 `pnpm-workspace.yaml` 的 `allowBuilds` 中逐个表态并写明理由。
- 测试先于实现编写，只在包的公开入口上断言行为。
- 组件只使用 `--ui-*` Token 对应的工具类；颜色、时长、层级的字面量集中在 `packages/tokens`。
- 修改 `packages/tokens/src/themes/` 的色值后，核对每组前景与表面的对比度不低于 4.5:1，input 与 ring 对背景不低于 3:1。
- 一个组件的交互行为只来自一个交互底座，底座的类型留在组件实现文件内部。
- `@ui-sdk/*` 只允许出现在 `poc/` 下；`packages/` 引入它之前需要用户批准（见 ADR-001）。
- 交互底座的对比用例在 `poc/interaction-engine/`，运行方式见该目录的 README。
- 按蓝图分阶段推进，每个阶段结束后向用户汇报并等待确认。
- npm 发布与部署需要用户逐次批准。
- 注释与文档使用简体中文。
