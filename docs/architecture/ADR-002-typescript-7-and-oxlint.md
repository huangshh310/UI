# ADR-002：采用 TypeScript 7，并以 Oxlint 取代 ESLint

- 状态：已采纳
- 日期：2026-11-22

## 背景

用户要求使用最新版 TypeScript。npm 上的 `latest` 是 `typescript@7.0.2`。

蓝图指定的 lint 工具是 ESLint。ESLint 检查 TypeScript 源码依赖 `typescript-eslint`，而它通过 `typescript` 包的 JavaScript 编译器 API 解析代码。核实结果：

- `typescript-eslint@8.73.0` 的 peer 范围是 `typescript >=4.8.4 <6.1.0`，canary 版本也没有放宽。
- `typescript@7.0.2` 的主入口只导出版本号，编译器 API 位于 `./unstable/*` 路径下。`typescript-eslint` 无法在它之上运行。

因此「最新版 TypeScript」与「ESLint」无法同时满足。

## 决策

使用 TypeScript 7 做类型检查与构建，使用 Oxlint 做静态检查，Prettier 负责格式化。

Oxlint 自带解析器，不依赖 `typescript` 包，内置了 typescript、react、jsx-a11y、import、vitest 等规则集。配置见根目录 `.oxlintrc.json`，其中把单文件 300 行、函数 50 行、嵌套 3 层、圈复杂度 10 这些工程红线写成了报错规则。

## 候选方案

| 方案                                             | 结论   | 原因                                            |
| ------------------------------------------------ | ------ | ----------------------------------------------- |
| TypeScript 6.0.3 + ESLint                        | 未采纳 | 用户明确要求最新版 TypeScript                   |
| TypeScript 7 编译，另装 TypeScript 6 专供 ESLint | 未采纳 | 两个版本并存，lint 与编译对语法的理解可能不一致 |
| TypeScript 7 + Oxlint                            | 采纳   | 不依赖编译器 API，没有版本耦合                  |

## 后续影响

- 目前只启用了不需要类型信息的规则。需要类型感知规则时，可评估 `oxlint-tsgolint`，它基于与 TypeScript 7 相同的原生编译器。
- 凡是依赖 `typescript` 编译器 API 的工具都要先验证兼容性再引入。类型声明直接由 `tsc` 产出，不经过第三方插件。
- 如果 `typescript-eslint` 之后支持 TypeScript 7，且出现 Oxlint 无法覆盖的规则需求，再重新评估。
