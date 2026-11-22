# 交互底座 POC 方案

- 状态：计划（未执行）
- 日期：2026-11-22
- 产出：实测结果写入 `ADR-001-interaction-engine.md` 的「验证结果」一节

## 目标

用同一组需求验证候选底座，回答两个问题：

1. Base UI 能否作为 P0 组件的唯一底座？
2. Base UI 的 P1 缺口（Tree、Command、Resizable 等）由谁填补：UI SDK，还是单一职责库？

## 隔离方式

- 位置：`poc/interaction-engine/`，一个私有的 Next.js App Router 应用。
- 不加入 `packages/` 的依赖图，`packages/ui` 不得 import 它。
- UI SDK 只允许安装在这个目录内。
- 结论写入 ADR 后，该目录可删除。

## 用例矩阵

| #   | 用例             | 验收点                                          | Base UI  | UI SDK |
| --- | ---------------- | ----------------------------------------------- | -------- | ------ |
| 1   | Select           | 单选、方向键、typeahead、Escape、点击外部关闭   | 实现     | 实现   |
| 2   | Combobox         | 输入过滤、空状态、异步选项、焦点管理            | 实现     | 实现   |
| 3   | Dialog / Popover | 焦点陷阱、焦点恢复、Portal、滚动锁定            | 实现     | 实现   |
| 4   | Tree             | 层级展开、方向键、Home / End、选择状态          | 无此组件 | 实现   |
| 5   | Reorder          | 鼠标、触摸、键盘替代操作                        | 无此组件 | 实现   |
| 6   | SSR / Hydration  | Next.js App Router 下无 hydration 警告          | 验证     | 验证   |
| 7   | Agent 可用性     | 安装官方 Skill 后生成组件的首次正确率与返工次数 | 对照     | 验证   |

Radix 不单独实现：其组件模型与 Base UI 相近，仅做文档层面的覆盖对比。如需完整三方实现，工作量约增加一半。

## 对比维度与取证方法

| 维度            | 取证方法                                 |
| --------------- | ---------------------------------------- |
| ARIA 语义       | axe-core 扫描 + 人工核对 APG 模式        |
| 键盘行为        | Playwright 脚本逐键验证                  |
| 受控 / 非受控   | 两种写法各实现一次                       |
| SSR / Hydration | `next build && next start`，检查控制台   |
| Portal / Focus  | Playwright 断言 `document.activeElement` |
| 触摸            | Playwright 移动设备模拟                  |
| 打包体积        | `next build` 输出的路由体积对比          |
| 调试与测试难度  | 记录实现过程中的实际障碍                 |
| API 稳定性      | UI SDK 两个相邻 beta 之间跑同一套测试    |
| Agent 正确率    | 记录每个用例从生成到通过测试的修改轮数   |

## 失败模式清单

执行前先列出可能的失败方式，测试围绕这些点设计：

- 弹出层关闭后焦点没有回到触发元素；
- Portal 内容在服务端渲染时产生 hydration 不一致；
- typeahead 与输入法组合输入冲突；
- 嵌套弹出层（Dialog 内的 Select）按 Escape 时一次关闭了两层；
- 滚动锁定导致页面布局跳动；
- 受控模式下外部状态与内部状态不同步；
- 组件卸载后残留全局事件监听器；
- 触摸设备上拖拽与页面滚动冲突；
- 键盘重排缺少屏幕阅读器播报。

## 产出物

- 一份可重复执行的 Playwright 测试套件，两套实现跑同一组断言；
- 测试报告（通过 / 失败明细）作为可核验的工件；
- 体积对比数据；
- ADR-001 的最终结论。

## 前置条件

UI SDK 发布满 7 天的版本只有 beta.1 至 beta.5（2026-11-12 至 11-15），比当前的 beta.13 落后 8 个版本；beta.6 及之后都不满 7 天。验证当前 API 需要用户明确批准在 POC 目录内豁免发布年龄策略，否则只能用旧 beta 验证，或只验证 Base UI 一侧。
