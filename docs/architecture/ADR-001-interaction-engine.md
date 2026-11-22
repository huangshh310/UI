# ADR-001：交互行为底座选型

- 状态：**P0 部分已采纳**（2026-11-22 用户确认）；P1 缺口由谁填补，待 POC 验证
- 日期：2026-11-22
- 关联：蓝图第 4 节；POC 方案见 `poc-plan-interaction-engine.md`

## 背景

组件库需要一套无样式的交互行为层，负责键盘导航、焦点管理、弹出层、选择与 ARIA。蓝图要求在 Vercel UI SDK、Base UI、Radix UI 之间经验证后选型，并且同一个交互原语内不得混用多套行为引擎。

## 候选方案

以下数据均来自 2026-11-22 的 npm 元数据与各项目官方文档。

| 维度             | Vercel UI SDK                                 | Base UI                       | Radix UI            |
| ---------------- | --------------------------------------------- | ----------------------------- | ------------------- |
| 包               | `@ui-sdk/core` + `@ui-sdk/react`              | `@base-ui/react`              | `radix-ui`          |
| 版本             | 0.1.0-beta.13                                 | 1.9.0                         | 1.8.1               |
| 成熟度           | Beta，首发 2026-11-12                         | 稳定版，约每月一个 minor      | 稳定版              |
| 发布节奏         | 7 天 13 个 beta                               | 1.4.0（4 月）→ 1.9.0（10 月） | 最近一次 2026-10-12 |
| 许可证           | Apache-2.0                                    | MIT                           | MIT                 |
| React peer       | `>=19`                                        | `^17 \|\| ^18 \|\| ^19`       | `^16.8` 起          |
| 抽象层级         | 行为（behaviors）+ 现成组件                   | 组件级 primitives             | 组件级 primitives   |
| 跨框架           | React / Vue / Svelte / Solid / Web Components | 仅 React                      | 仅 React            |
| 与 shadcn 的关系 | 无                                            | shadcn/ui 当前默认底座        | shadcn/ui 旧版底座  |
| Agent 支持       | 官方 Skill、包内 `docs/llms.txt`              | 官方 `llms.txt`               | 未核实              |

### 组件覆盖对比（按包的 `exports` 字段核实）

| 蓝图所需组件                                           | UI SDK         | Base UI        |
| ------------------------------------------------------ | -------------- | -------------- |
| Dialog / Popover / Tooltip / Menu / Tabs / Accordion   | 有             | 有             |
| Select / Checkbox / Radio / Switch / Slider / Progress | 有             | 有             |
| Combobox / Autocomplete                                | 有             | 有             |
| Toast                                                  | 有             | 有             |
| Number Input                                           | `number-input` | `number-field` |
| OTP Input                                              | `otp-input`    | `otp-field`    |
| **Tree**                                               | 有             | **无**         |
| **Command**                                            | 有             | **无**         |
| **Calendar / Date Picker**                             | 有             | **无**         |
| **Resizable**                                          | 有             | **无**         |
| **File Input**                                         | 有             | **无**         |

Radix 的逐项覆盖本次未核实，POC 阶段补齐。

## 初步判断

1. **UI SDK 目前不适合作为生产底座。** 发布仅 10 天、API 明确声明可能变更、要求 React 19 以上。把 20 多个组件建立在它之上，返工风险不可接受。
2. **Base UI 覆盖 P0 全部交互组件。** 稳定、MIT、持续发版，并且与 shadcn Registry 生态的方向一致，对 Phase 5 的源码分发有利。
3. **Base UI 在 P1 存在缺口。** Tree、Command、Calendar、Resizable 都没有，正是 UI SDK 的行为模型最有价值的地方。这部分需要 POC 来决定用 UI SDK 还是用单一职责库填补。
4. **Radix 与 Base UI 的组件模型高度相似。** Base UI 官方称其 API 有意贴近 Radix。两者同时引入没有收益。注意：Base UI 官方文档中关于 Radix 维护状态的说法是竞品方的陈述；npm 显示 Radix 在 2026-10 仍有发版，不应据此认定 Radix 已停止维护。

## 决策

- **P0 基础组件：采用 Base UI 作为唯一交互底座。**
- **UI SDK：仅进入隔离的 POC 目录，不进入 `packages/ui`。** POC 通过后，可用于 Base UI 未覆盖的复杂行为原语（Tree、Command、Resizable 等）。用户已批准在 POC 目录内对 `@ui-sdk/*` 豁免 7 天发布年龄策略。
- **POC 范围：只实测 Base UI 与 UI SDK。** Radix 只做文档层面的覆盖对比。
- **Radix：不采用。**
- **原生语义元素优先。** Button、Input、Textarea、Label 等直接使用原生 HTML，不引入任何 Headless 库。
- **不混用。** 每个组件的交互行为只来自一个来源，在组件文件头部注明。

## 架构约束（与最终选型无关，立即生效）

为了让底座可替换，组件库保持「行为」与「样式」分离：

- `packages/ui` 的每个组件对外只暴露自己的 Props 类型，不向使用者泄漏底座的类型。
- 底座的 import 只出现在组件实现文件中，公开入口不 re-export 底座。
- 样式只依赖 `data-slot`、`data-state` 等属性与 Design Token，不依赖底座的内部类名。

这样更换底座时，改动范围限制在单个组件的实现文件内。

## 后续影响

- 采用 Base UI 后，`packages/ui` 的 React peer 范围可以自行决定（建议 `^19`，见审计文档的待确认事项）。
- 若 POC 结论是 P1 缺口由 UI SDK 填补，则 UI SDK 的版本必须精确锁定，并为每个使用它的组件准备键盘与 ARIA 的行为测试作为升级保护。
- 若 UI SDK 进入 GA，重新评估本 ADR。

## 待办

1. 执行 POC，将实测结果补入下方「验证结果」；
2. 根据 POC 结论决定 P1 缺口的填补方案，并更新本文状态。

## 验证结果

（POC 完成后填写）
