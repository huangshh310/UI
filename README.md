# matt-ui

一套 React-first 的现代 UI 组件平台：设计 Token、组件、页面区块和源码分发。

> 项目处于早期阶段，各包尚未发布到 npm。

## 当前进度

| 阶段     | 内容                                                         | 状态        |
| -------- | ------------------------------------------------------------ | ----------- |
| Phase 0  | 仓库审计与技术选型                                           | 完成        |
| Phase 1  | 工程底座：Monorepo、Token、工具链                            | 完成        |
| POC      | 交互底座实测（Base UI 与 UI SDK）                            | 完成        |
| Phase 2  | 第一个可发布组件 Button                                      | 完成        |
| 展示站   | 组件目录、详情页、命令面板、文档页（原定 Phase 5，提前搭建） | 已有 Button |
| Registry | 通过 shadcn CLI 分发组件源码（原定 Phase 5，提前搭建）       | 已有 Button |

完整路线见 [`UI-Platform-Implementation-Blueprint.md`](./UI-Platform-Implementation-Blueprint.md)。

## 包

| 包                | 职责                                                | 状态        |
| ----------------- | --------------------------------------------------- | ----------- |
| `@matt-ui/tokens` | Design Token：纯 CSS 变量，不依赖 React 与 Tailwind | 可用        |
| `@matt-ui/utils`  | 通用工具函数，目前只有类名合并函数 `cn()`           | 可用        |
| `@matt-ui/ui`     | React 组件                                          | 已有 Button |

依赖方向：`tokens`、`utils` → `ui`。`tokens` 不依赖 React，`ui` 不依赖任何图表、地图或 3D 引擎。

## 安装组件

组件以源码的形式通过 shadcn Registry 分发。在已初始化 shadcn 的项目里运行：

```bash
pnpm dlx shadcn@latest add huangshh310/UI/button
```

CLI 会把组件的源文件写入 `components/ui/`，安装依赖，并把组件用到的颜色与动效变量加进样式表。

`registry.json` 与 `registry/` 下的文件由 `pnpm registry:generate` 从 `packages/ui` 的源码生成，不要手工修改。

## Design Token

视觉方向是「墨色与信号」：近黑的墨色与近白的纸色构成高对比的中性底，全系统只有一个高饱和的信号色，配合柔和的大圆角与等宽字体标签。

所有变量以 `--ui-` 为前缀。默认是浅色主题，在任意祖先元素上添加 `.dark` 类或 `data-theme="dark"` 属性即可切换为深色，可以作用于整页，也可以只作用于一块区域。

```css
/* 引入全部 --ui-* 变量 */
@import "@matt-ui/tokens";

/* 使用 Tailwind CSS v4 的项目再引入主题映射，之后可直接写 bg-primary、text-signal 等工具类 */
@import "@matt-ui/tokens/tailwind.css";
```

## 开发

需要 Node.js 22 以上和 pnpm 12。

```bash
pnpm install        # 安装依赖
pnpm build          # 构建所有包
pnpm test           # 运行测试
pnpm typecheck      # 类型检查
pnpm lint           # Oxlint 静态检查
pnpm format         # Prettier 格式化
pnpm test:consumer  # 把包打成 tarball，装进独立项目做端到端验证（需先 pnpm build）
pnpm test:registry  # 用 shadcn CLI 把组件装进一个全新的项目并在浏览器里检查
pnpm registry:generate   # 从组件源码重新生成 Registry
pnpm component:new <名称> # 为新组件创建起始文件
pnpm site           # 构建并以生产模式启动展示站（http://localhost:3000），看效果用这个
pnpm --filter @matt-ui/docs dev        # 展示站的开发模式，改站点代码时用（需先 pnpm build）
pnpm --filter @matt-ui/storybook dev   # 启动组件工作台（读取构建产物，运行期间不要重新构建组件库）
```

依赖由 `pnpm-workspace.yaml` 统一管理：所有外部依赖的版本都写在其中的 `catalog`，各包的 `package.json` 只写 `catalog:`。同一个文件还规定了只安装发布满 7 天的版本。

唯一的例外是 `tests/consumer-fixture`：它有意独立于工作区，用来模拟一个从外部安装本库的项目。

## 文档

- [`packages/ui/README.md`](./packages/ui/README.md)：组件的用法与 API
- [`CONTEXT.md`](./CONTEXT.md)：项目术语表
- [`docs/architecture/`](./docs/architecture/)：架构决策记录与审计报告
- [`AGENTS.md`](./AGENTS.md)：面向 AI Agent 的协作约定

## 许可证

[MIT](./LICENSE)
