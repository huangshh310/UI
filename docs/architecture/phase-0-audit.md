# Phase 0：仓库审计与技术选型核实

> 审计日期：2026-11-22
> 依据：`UI-Platform-Implementation-Blueprint.md` 第 0、3、4、5、14 节
> 状态：已完成，关键决策已由用户确认（见第 8 节）

本文只记录**实际核实过**的事实。未能核实的内容单独列在「未核实事项」中，不作为结论使用。

---

## 1. 工作区现状

| 项目                    | 结果                                           | 核实方式     |
| ----------------------- | ---------------------------------------------- | ------------ |
| 目录内容                | 仅有 `UI-Platform-Implementation-Blueprint.md` | `ls -la`     |
| Git 仓库                | 不存在（`fatal: not a git repository`）        | `git status` |
| `package.json` / 锁文件 | 不存在                                         | `ls -la`     |
| Node                    | v22.20.0                                       | `node -v`    |
| pnpm                    | 12.3.4                                         | `pnpm -v`    |
| npm                     | 10.9.3                                         | `npm -v`     |
| git / gh                | 2.55.0 / 2.100.0                               | `--version`  |

结论：**空工作区**，不存在需要保护的既有成果，按蓝图可在 Phase 0 确认后建立最小骨架。

---

## 2. 依赖核实表

数据来源：2026-11-22 执行 `npm view <pkg>` 取得的 npm 元数据。
「距今」以 2026-11-22 计算；「7 天规则」指优先采用发布满 7 天的版本以降低供应链风险。

| 层级     | 包                         | latest                               | 发布日期                      | 许可证     | 7 天规则   | 备注                                    |
| -------- | -------------------------- | ------------------------------------ | ----------------------------- | ---------- | ---------- | --------------------------------------- |
| UI 框架  | `react`                    | 19.3.1                               | 2026-10-14                    | MIT        | 通过       |                                         |
| 文档站   | `next`                     | 16.4.6                               | 2026-11-09                    | MIT        | 通过       | Phase 5 才引入                          |
| 样式     | `tailwindcss`              | 4.3.5                                | 2026-11-06                    | MIT        | 通过       | v4，使用 `@theme` 映射 Token            |
| Monorepo | `turbo`                    | 2.11.13                              | 2026-11-18                    | MIT        | **不通过** | 安装时回退到满 7 天的版本               |
| 语言     | `typescript`               | 7.0.2                                | 2026-07-08                    | Apache-2.0 | 通过       | **与 typescript-eslint 不兼容，见 3.1** |
| 语言     | `typescript`               | 6.0.3                                | 2026-04-16                    | Apache-2.0 | 通过       | 6.x 最新                                |
| Lint     | `eslint`                   | 10.15.0                              | 2026-11-13                    | MIT        | 通过       |                                         |
| Lint     | `typescript-eslint`        | 8.73.0                               | —                             | —          | —          | peer：`typescript >=4.8.4 <6.1.0`       |
| 格式化   | `prettier`                 | 3.10.1                               | —                             | MIT        | 安装时核对 |                                         |
| 构建     | `vite`                     | 8.3.8                                | 2026-11-11                    | MIT        | 通过       | Library Mode                            |
| 构建     | `@vitejs/plugin-react`     | 6.3.0                                | —                             | —          | 安装时核对 | peer：`vite ^8`                         |
| 测试     | `vitest`                   | 5.1.1                                | 2026-11-18                    | MIT        | **不通过** | 安装时回退                              |
| 测试     | `@testing-library/react`   | 16.3.3                               | —                             | MIT        | 安装时核对 |                                         |
| 测试     | `@playwright/test`         | 1.65.1                               | —                             | Apache-2.0 | 安装时核对 | Phase 6 才引入                          |
| 工作台   | `storybook`                | 10.6.8                               | 2026-11-20                    | MIT        | **不通过** | Phase 2 引入，届时回退                  |
| 变体     | `class-variance-authority` | 0.7.1                                | 2024-11                       | Apache-2.0 | 通过       | 两年未发版，功能稳定                    |
| 类名     | `clsx`                     | 2.1.1                                | 2024-04                       | MIT        | 通过       |                                         |
| 类名     | `tailwind-merge`           | 3.7.1                                | 2026-11-19                    | MIT        | **不通过** | 安装时回退                              |
| 动画     | `motion`                   | 14.14.0                              | —                             | MIT        | 安装时核对 | Phase 4，独立包                         |
| 版本     | `@changesets/cli`          | 3.0.3                                | —                             | MIT        | 通过       |                                         |
| Registry | `shadcn`                   | 4.23.0                               | —                             | MIT        | 通过       | Phase 5                                 |
| 交互     | `@base-ui/react`           | 1.9.0                                | 2026-10-09                    | MIT        | 通过       | 见 ADR-001                              |
| 交互     | `radix-ui`                 | 1.8.1                                | 2026-10-12                    | MIT        | 通过       | 见 ADR-001                              |
| 交互     | `@ui-sdk/core`             | 0.1.0-beta.13                        | 2026-11-19                    | Apache-2.0 | **不通过** | 见 ADR-001                              |
| 交互     | `@ui-sdk/react`            | 0.1.0-beta.13（beta 标签为 beta.14） | 包元数据最后修改于 2026-11-21 | Apache-2.0 | **不通过** | 见 ADR-001                              |

标「—」或「安装时核对」的条目：本次只取了 latest 版本号，未取该版本的精确发布时间，Phase 1 安装前逐个核对。

### 2.1 需要注意的三个事实

1. **TypeScript 7 与 typescript-eslint 不兼容。** `typescript-eslint@8.73.0` 的 peer 范围是 `typescript >=4.8.4 <6.1.0`，而 npm `latest` 是 `typescript@7.0.2`。直接 `pnpm add typescript` 会装上 lint 工具链不支持的版本。
2. **UI SDK 发布仅 10 天。** `@ui-sdk/core` 首个版本发布于 2026-11-12，至 11-19 的 7 天内发布了 13 个 beta。官方 README 声明「the framework, APIs, documentation, and behavior may change before general availability」。
3. **Base UI 是 shadcn/ui 当前的默认无样式底座。** Base UI 官方 Quick start 写明 shadcn/ui「uses Base UI as its unstyled foundation」，shadcn 文档的组件路径为 `/docs/components/base/*`。这直接影响 Registry 兼容性（Phase 5）。

---

## 3. 风险清单

| #   | 风险                                                 | 影响                   | 应对                                       |
| --- | ---------------------------------------------------- | ---------------------- | ------------------------------------------ |
| R1  | UI SDK 处于 Beta 且发布极频繁                        | API 破坏性变更导致返工 | 仅在隔离 POC 中使用，不进入 `packages/ui`  |
| R2  | `latest` 标签指向工具链尚未支持的大版本（TS 7）      | lint 失效或安装告警    | 显式锁定版本范围，不依赖 `latest`          |
| R3  | 多个工具的 latest 发布不足 7 天                      | 供应链风险             | 配置 pnpm 发布年龄策略，安装满 7 天的版本  |
| R4  | Base UI 不提供 Tree / Command / Calendar / Resizable | P1 复杂组件需另寻底座  | POC 中评估 UI SDK 或单一职责库填补缺口     |
| R5  | npm scope `@matt-ui` 归属未核实                      | 发布时改名成本         | 发布前核实；Phase 1 包名集中配置，便于替换 |
| R6  | 全局规则与蓝图存在冲突（见第 5 节）                  | 方向性返工             | 本轮请用户确认                             |

---

## 4. 目标 Monorepo 结构

遵循蓝图第 5 节「只创建当前阶段需要的 package」。Phase 1 结束时的目录：

```text
matt-ui/
├── packages/
│   ├── tokens/              # Design Tokens：纯 CSS 变量，不依赖 React
│   ├── utils/               # cn() 等通用工具，不依赖组件
│   └── ui/                  # React 组件包，Phase 1 只含构建骨架与公开入口
├── docs/
│   └── architecture/        # ADR 与审计记录
├── .github/workflows/ci.yml # lint / typecheck / test / build，不含发布
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── eslint.config.js
├── prettier.config.js
├── .gitignore
└── README.md
```

后续阶段按需增加，不提前建空目录：

| 阶段      | 新增                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------ |
| POC       | `poc/interaction-engine/`（私有 Next.js 应用，与 `packages/` 无依赖关系，结论写入 ADR 后可删除） |
| Phase 2   | `apps/storybook/`、`tests/consumer-fixture/`                                                     |
| Phase 4   | `packages/motion/`                                                                               |
| Phase 5   | `apps/docs/`、`registry/`、`packages/registry/`                                                  |
| v1.0 之后 | `packages/charts`、`maps`、`three`、`cli`                                                        |

依赖方向（蓝图 5.1）：`tokens`、`utils` → `ui` → blocks；`docs` / `storybook` / `registry` 只消费，不被依赖。

---

## 5. 全局规则与蓝图的冲突

用户全局规则（`~/.claude/CLAUDE.md`）与蓝图有两处不一致。按规则自身的优先级（当前会话明确要求 > 仓库文档 > 全局规则），默认以蓝图为准，但需要用户确认：

| 项            | 全局规则                    | 蓝图                        | 默认采用          |
| ------------- | --------------------------- | --------------------------- | ----------------- |
| UI 框架       | 默认 UI 组件为 `shadcn-vue` | React-first，v1 不承诺 Vue  | 蓝图（React）     |
| Monorepo 工具 | 提及 Nx Monorepo            | pnpm workspaces + Turborepo | 蓝图（Turborepo） |

全局规则中的其余约束（中文注释、单文件 ≤ 300 行、函数 ≤ 50 行、类型与常量独立文件、端到端测试优先）与蓝图不冲突，全部适用。

关于测试策略的说明：全局规则要求「强烈优先端到端测试」，蓝图要求「关键交互组件必须有键盘测试」。两者合并执行为：组件行为通过真实渲染与用户事件验证（Testing Library + user-event / Playwright），不为实现细节编写单元测试。

---

## 6. 未核实事项

以下内容本次未能确认，不作为结论：

- npm scope `@matt-ui` 是否可注册（`npmjs.com/org/matt-ui` 返回 403，无法匿名判断；`@matt-ui/ui` 包本身不存在）。
- UI SDK 在 Next.js App Router 下的 SSR / Hydration 表现（需 POC 实测）。
- UI SDK、Base UI、Radix 的实际打包体积（npm `unpackedSize` 不能代表 tree-shaking 后的体积，需 POC 实测）。
- pnpm 12 的发布年龄策略配置项的确切名称与默认值（Phase 1 配置前查阅 pnpm 官方文档）。
- shadcn Registry JSON Schema 的全部字段约束（已阅读文档中的字段列表；Phase 5 实现前以 `https://ui.shadcn.com/schema/registry-item.json` 为准校验）。

---

## 7. Phase 1 实施计划

前置条件：用户确认本轮关键决策。

| 步骤 | 内容                                                                     | 验证命令           |
| ---- | ------------------------------------------------------------------------ | ------------------ |
| 1    | `git init`，添加 `.gitignore`                                            | `git status`       |
| 2    | 根 `package.json`、`pnpm-workspace.yaml`（含发布年龄策略）、`turbo.json` | `pnpm install`     |
| 3    | `tsconfig.base.json`（`strict: true`）                                   | `pnpm typecheck`   |
| 4    | ESLint flat config + Prettier                                            | `pnpm lint`        |
| 5    | `packages/tokens`：语义化 CSS 变量，Light / Dark，`--ui-*` 前缀          | `pnpm build`       |
| 6    | `packages/utils`：`cn()`                                                 | `pnpm test`        |
| 7    | `packages/ui`：Vite Library Mode 构建骨架、`exports`、`peerDependencies` | `pnpm build`       |
| 8    | `.github/workflows/ci.yml`：lint / typecheck / test / build              | 本地执行同一组命令 |
| 9    | `README.md`、更新架构文档                                                | —                  |

Phase 1 不包含任何业务组件。Button 属于 Phase 2。

Phase 1 验收对应蓝图第 14 节 Phase 1 的七项勾选。

---

## 8. 用户确认的决策（2026-11-22）

| 事项                | 决策                                |
| ------------------- | ----------------------------------- |
| 交互底座            | Base UI                             |
| POC 范围            | 只实测 Base UI 与 UI SDK            |
| UI SDK 发布年龄豁免 | 同意，仅限 POC 目录                 |
| UI 框架             | React                               |
| TypeScript 版本     | 最新版（7.0.2）                     |
| 包名与 React 版本   | `@matt-ui/*`，React `^19`           |
| 远程仓库            | `https://github.com/huangshh310/UI` |
| 许可证              | MIT                                 |
| 执行顺序            | 先 Phase 1 工程底座，再做 POC       |
| Token 视觉方向      | 墨色与信号                          |

### Phase 1 相对第 7 节计划的两处调整

1. **Oxlint 取代 ESLint。** 选择 TypeScript 7 之后，`typescript-eslint` 无法运行。详见 `ADR-002-typescript-7-and-oxlint.md`。第 4 节目录树中的 `eslint.config.js` 相应变为 `.oxlintrc.json`。
2. **tsc 取代 Vite Library Mode。** 详见 `ADR-003-build-with-tsc.md`。
