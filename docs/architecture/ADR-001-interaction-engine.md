# ADR-001：交互行为底座选型

- 状态：**已采纳**（2026-11-22）。P0 用 Base UI；Base UI 未覆盖的 P1 组件用 UI SDK
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

## 验证结果

POC 于 2026-11-22 执行，代码在 `poc/interaction-engine/`，可用 `pnpm poc:test` 重跑。

### 环境

| 项                              | 版本                                             |
| ------------------------------- | ------------------------------------------------ |
| `@base-ui/react`                | 1.9.0                                            |
| `@ui-sdk/core`、`@ui-sdk/react` | 0.1.0-beta.13                                    |
| Next.js / React                 | 16.4.6（App Router，生产构建）/ 19.3.1           |
| Playwright                      | 1.65.1，无头 Chromium；触摸用例使用 Pixel 7 模拟 |

共 94 个用例，92 个通过，2 个是记录在案的 Base UI 偏差（用 `test.fail` 标记，上游修复后会报警）。整套用例连续重复三轮，没有偶发失败。

### 同一组断言下的结果

| 用例                                                                              | Base UI                                    | UI SDK   |
| --------------------------------------------------------------------------------- | ------------------------------------------ | -------- |
| Select：键盘导航、typeahead、Escape、点击外部、受控、触摸（8 项）                 | 8 / 8                                      | 8 / 8    |
| Combobox：过滤、空状态、异步、过期结果丢弃（4 项）                                | 4 / 4                                      | 4 / 4    |
| Dialog：初始焦点、焦点陷阱、焦点恢复、滚动锁定、背景不可交互、嵌套 Escape（7 项） | 6 / 7                                      | 7 / 7    |
| Popover：具名 dialog、Escape、点击外部（2 项）                                    | 2 / 2                                      | 2 / 2    |
| Tree：展开折叠、方向键、Home / End、选中（4 项）                                  | 无此组件                                   | 4 / 4    |
| Reorder：键盘、Escape 取消、鼠标、触摸、播报（6 项）                              | 无此组件                                   | 6 / 6    |
| 服务端 HTML 含语义标记、Hydration 无告警、初始状态 axe 无违规                     | 全部通过                                   | 全部通过 |
| 浮层打开时的 WCAG 规则（3 个页面）                                                | 2 / 3                                      | 3 / 3    |
| 浮层打开时的 axe best-practice 提示                                               | `region` 两处、`page-has-heading-one` 一处 | 无       |

### Base UI 的三处偏差

1. **焦点陷阱有瞬间外泄。** 连续快速按 Tab 时，焦点会先落到对话框外再被拉回。20 轮共 140 次按键中有 82 次在按键后的瞬间位于对话框外：焦点哨兵 34 次、`body` 29 次、触发按钮 16 次、背景按钮 3 次。300ms 后全部回到对话框内，没有真正逃出。UI SDK 是 0 次。原因是 Base UI 的陷阱由脚本实现，而 UI SDK 使用浏览器原生的 top layer。
2. **Combobox 打开时触发 `aria-hidden-focus`（WCAG 4.1.2）。** Base UI 给浮层外的内容加了 `aria-hidden`，但这些内容仍可被 Tab 聚焦。焦点一旦移走浮层就会关闭，所以这个状态是短暂的。
3. **Select 打开后有一帧多的按键空窗。** 列表在按键后约 13ms 可见，焦点约 29ms 才移入列表，期间按下的导航键会丢失。不等待直接发键时 20 次中丢了 1 次；UI SDK 的可见与聚焦在同一帧，20 次全部成功。真人按键落不进这个间隙。

三处都不妨碍功能可用，但它们是真实存在的行为差异，后续做 Dialog、Combobox、Select 时需要在组件测试里保留对应断言。

### 体积

页面加载的 JS（gzip 传输量），已扣除不含任何交互底座的基线页面（137.2 KB）：

| 页面                             | Base UI  | UI SDK   |
| -------------------------------- | -------- | -------- |
| Select                           | +52.2 KB | +61.1 KB |
| Combobox（本地过滤与异步各一个） | +53.6 KB | +62.8 KB |
| Dialog + Popover + Select        | +63.0 KB | +68.0 KB |
| Tree                             | —        | +32.3 KB |
| Reorder（自行组合的原语）        | —        | +23.7 KB |

两者在同一量级，UI SDK 每页多 5 到 9 KB。

### 实现成本

同等用例的实现代码行数（不含空行与注释）：

| 用例             | Base UI | UI SDK |
| ---------------- | ------- | ------ |
| Select           | 45      | 46     |
| Combobox         | 34      | 34     |
| 异步 Combobox    | 66      | 43     |
| Dialog + Popover | 35      | 44     |

- 异步搜索：UI SDK 自带 `useAsyncOptions`，负责防抖、取消和丢弃过期结果；Base UI 需要自己管理 `AbortController`。
- 浮层：Base UI 需要 Portal、Positioner 和自己写的居中样式；UI SDK 使用 top layer，原位渲染。
- Reorder 用 `createReorder`、`createRovingFocus`、`createChange` 组合而成，共 101 行。

### Agent 可用性

- 依据的是随包分发的文档（`node_modules/@ui-sdk/react/docs/`）。官方 Skill 没有安装，因为它会写入本机的 Agent 配置。
- UI SDK 的全部代码，包括自行组合的排序原语，第一次类型检查就是零错误。
- 首轮测试中 UI SDK 侧只有触摸拖动一项失败，原因是我把样式选择器里的 `data-slot` 名字写错了，改一处即通过。键盘与鼠标重排首轮即通过。
- Base UI 侧没有实现错误，首轮失败的都是上面列出的库行为。
- 样本只有一个 Agent 的一次会话，不足以推广为一般结论。

### API 稳定性

同一份代码不做任何修改，换装 beta.5 和 beta.10 后类型检查零错误，UI SDK 相关的 54 个用例全部通过。也就是说，本次用到的 API 在 beta.5 到 beta.13 之间没有变化。

需要注意的反面证据：`@ui-sdk/react@0.1.0-beta.14` 已经发布，但它要求的 `@ui-sdk/core@^0.1.0-beta.14` 截至 2026-11-22 还不存在，这个版本无法安装。发布流程尚不稳定。

### 没有验证的内容

- 输入法组合输入与 typeahead 的冲突；
- 组件卸载后全局监听器是否清理干净；
- 滚动锁定引起的布局跳动；
- 真实屏幕阅读器（只做了 axe、ARIA 角色断言和播报区域是否存在的检查）；
- Safari 与 Firefox；
- 真实触摸设备（触摸拖动通过 CDP 派发事件模拟）；
- RTL、虚拟化长列表。

## 结论

**问题一：Base UI 能否作为 P0 组件的唯一底座？** 能。三类共用用例的功能全部通过，三处偏差都是瞬时或边缘情况。维持 P0 采用 Base UI 的决策。

**问题二：P1 缺口由谁填补？** 用 UI SDK。用户已于 2026-11-22 确认，适用于 Tree、排序、Command、Resizable 等 Base UI 没有的组件：

- Tree 与 Reorder 的全部用例通过，SSR 与 axe 无问题，用到的 API 在抽样的三个 beta 之间稳定。
- 采用条件：版本精确锁定；每个组件都包在本项目自己的 Props 之后；键盘与 ARIA 行为测试随组件一起提交，作为升级时的保护。
- 代价：`@matt-ui/ui` 将直接依赖一个 Beta 包，发布年龄豁免随之从 `poc/` 扩大到 `packages/ui`，但只限这些组件。
- 没有评估的替代方案：为每个缺口各选一个单一职责库（例如命令面板、面板拖拽、拖放排序各一个）。它们更成熟，但每个库有各自的 API 与行为模型。

UI SDK 在三处行为上优于 Base UI，这不足以推翻 P0 的决策：它发布才十天，Beta 条款明确保留了修改 API 的权利。等它正式发布后再重新评估 P0。由于组件对外只暴露本项目自己的 Props，届时更换底座的改动限制在各组件的实现文件内。
