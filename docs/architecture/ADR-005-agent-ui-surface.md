# ADR-005：面向 Agent 的语义组件契约与 Schema Renderer 架构

- 状态：**已确认方案，待分阶段实施**（2026-11-24）
- 日期：2026-11-24
- 关联：[ADR-001](./ADR-001-interaction-engine.md)、[ADR-002](./ADR-002-typescript-7-and-oxlint.md)、[ADR-004](./ADR-004-shadcn-registry.md)、[CONTEXT.md](../../CONTEXT.md)

## 背景

`packages/ui` 目前已具备一套完整的基础交互组件，以及一组面向 AI 场景的组件（如 `AiApprovalCard`、`AiToolCall`、`AiDiffReview`、`AiArtifact`、`AiCitation`、`Conversation`、`Message`）。但这些组件目前只能由前端工程师手写 JSX 调用。

当 AI Agent 需要在对话流或工作台中动态输出结构化看板、展示工具执行状态、发起参数补全表单或请求人工审批时，现有工程面临两个典型问题：

1. **直接让 Agent 生成 JSX / Tailwind 代码不可靠。** 模型容易拼错类名、硬编码色值破坏浅色/深色对比度、丢失键盘与 ARIA 属性，且在无图形环境（终端日志、测试快照、回填给后续模型上下文）中无法优雅降级为可读文本。
2. **用单一硬编码 `switch-case` 渲染器不可持续。** 随着节点类型增加，集中式分支判断会迅速突破本仓库单文件 300 行、单函数 50 行、圈复杂度 10 的静态检查红线（见 ADR-002），也无法让业务方按数据语义覆盖特定控件，还会把 `@tanstack/react-table`、`@ui-sdk/react` 等较重依赖强绑给所有轻量使用者。

因此，需要建立一套「Agent 只输出受限语义意图与数据契约，前端通过可扩展优先级注册表映射为工业级源码组件」的中间层。

## 五层参考体系与职责边界

本架构由五个正交参考标杆组成，各层只解决本层问题，不越界耦合：

| 架构层级         | 参考标杆          | 核心借鉴点                                                                                           | 本仓库落地边界                                                                                             |
| ---------------- | ----------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 工程与源码分发层 | **shadcn/ui**     | `--ui-*` Token 驱动、组件自治、`registry.json` 单文件合并与按需复制安装                              | 内聚于 `packages/ui/src/components/`，同时支持 npm 公开入口导出与 `shadcn add` 源码分发                    |
| 基础交互实现层   | **Base UI**       | 键盘导航、焦点环、浮层定位、ARIA 状态机，内部消化底座类型                                            | 交互节点全部复用仓库已有组件（P0 基于 `@base-ui/react` 或原生 HTML），Schema 层不感知任何底座类型          |
| 语义组件定义层   | **Stencil Tern**  | 三层视图区域、固定容器槽位、受限语义节点词表、只传 `tone`/`status` 不传色值、派生稳定 ID、纯文本降级 | 定义 `SurfaceView` / `SurfaceNode` 语义契约、增量 `SurfacePatch` 与 `renderSurfaceText` 纯文本序列化       |
| Schema 渲染分发  | **JSON Forms**    | `schema`（数据契约）与 `uischema`（视图结构）分离、`scope` 字段绑定、`tester + rankWith` 优先级匹配  | 自研零第三方重依赖的轻量分发内核，支持缺省 `uischema` 自动推导、声明式联动 `rule` 与高优先级渲染器升权覆盖 |
| AI 交互行为层    | **Vercel UI SDK** | 流式状态保护、细粒度可组合交互原语、结构化人机协同回传与面向 Agent 的紧凑自描述规范                  | 统一流式生命周期、`SurfaceAnswer`（`submitted` / `cancelled` / `unsupported`）闭环回传与 Agent 提示词契约  |

## 候选方案对比

### 1. 包边界选型

| 方案                                                                        | 结论     | 原因                                                                                                                               |
| --------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 新建独立工作区包 `packages/surface`                                         | 未采纳   | `@matt-ui/*` 尚未发布 npm；若 `packages/ui` 依赖未发布的内部新包，外部使用者通过 `shadcn add` 安装单文件源码时会因找不到依赖而失败 |
| 单一巨型目录 `packages/ui/src/components/ai-surface/` 强绑全部高阶组件      | 未采纳   | 会把 `DataTable`（`@tanstack/react-table`）、`Tree`（`@ui-sdk/react`）及全部 `Ai*` 组件变成最小安装的强制连带依赖                  |
| **拆分为 `ai-surface`（轻量核心）+ `ai-surface-agent`（高阶扩展）兄弟目录** | **采纳** | 完美契合 shadcn Registry 兄弟依赖机制：轻量场景只装核心条目；Agent 工作台场景按需加装扩展条目并自动升权渲染器                      |

### 2. Schema Renderer 内核选型

| 方案                                                    | 结论     | 原因                                                                                                                            |
| ------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 直接安装 `@jsonforms/core` + `@jsonforms/react`         | 未采纳   | 强耦合表单中心模型与 Ajv 等运行时重依赖（需额外走供应链发布年龄核查），对 `stats`、`kv`、`diff`、`tool-call` 等展示语义水土不服 |
| **借鉴 JSON Forms 范式，TypeScript 自研轻量无依赖内核** | **采纳** | 体积可控（零新增第三方包）、完美适配 TypeScript 7 与 Oxlint 复杂度红线，原生统一展示类语义节点与表单数据双向绑定                |

## 核心技术设计

### 1. 语义视图协议（参考 Tern Surface Protocol）

Agent 输出的顶层结构为 `SurfaceView`，严禁包含 `className`、`style` 或任何颜色字面量：

- **三层视图区域（Regions）**：
  - `main`：主内容区（必填，接收单个节点或节点数组，数组自动按纵向 `stack` 排布）；
  - `dock`：侧边停靠辅助区（选填，用于详情面板、代码片段或上下文预览）；
  - `layer`：浮层/模态交互区（选填，用于阻塞式确认或抽屉详情）。
- **固定容器槽位（Semantic Slots）**：
  - 容器节点（如 `card`、`group`）统一通过 `head`（标题、副标题、`status`、`badge`）、`end`（头部尾端动作或分段切换）、`foot`（底栏说明与操作组）组织版式，避免让模型自由拼装脆弱的嵌套布局。
- **语义色与状态契约（`Tone` & `Status`）**：
  - 遵循 Tern _"Color carries meaning only: use tones, not colors"_ 原则：
    - `SurfaceTone`：`"neutral" | "signal" | "success" | "warning" | "danger" | "info"`；
    - `SurfaceStatus`：`"idle" | "pending" | "running" | "done" | "error" | "cancelled"`。
  - 渲染器内部将 `tone` 与 `status` 严格映射至本项目的 `--ui-*` 语义色与信号色 Token。
- **核心语义节点词表（`kind`）**：
  - **布局容器**：`stack`（纵向/横向间距容器）、`grid`（响应式等分网格，列数受限为 1～4）、`tabs`、`group`、`card`；
  - **结构化展示**：`text`、`kv`（键值对列表）、`stats`（指标条，规范上限 4 项）、`badge`、`progress`、`table`（支持列对齐、语义状态微标与进度列）、`code`、`alert`、`empty`；
  - **数据输入与动作**：`control`（通过 `scope: "#/properties/<字段>"` 绑定数据 Schema）、`button`、`actions`；
  - **Agent 领域高阶节点**：`approval`、`diff`、`tool-call`、`artifact`、`citation`、`tree`。

### 2. 数据契约与 `rankWith` 优先级注册表（参考 JSON Forms）

- **`schema` 与 `uischema` 解耦**：
  - `schema`（`SurfaceDataSchema`）：采用 JSON Schema 核心子集（`type`、`properties`、`required`、`enum`、`oneOf`、`minimum`/`maximum`、`minLength`/`maxLength`、`pattern`、`default`、`title`、`description`），负责数据结构描述与提交前同步校验。
  - `uischema`（`SurfaceView`）：负责布局分区、展示节点排布及 `control` 的 `scope` 绑定。当调用方只传入 `schema` 而省略 `uischema` 时，内核自动按 `properties` 顺序推导默认纵向表单视图。
- **`tester` 与 `rankWith` 分发机制**：
  - 每个渲染器条目定义为 `{ id: string; tester: SurfaceTester; renderer: ComponentType<SurfaceRendererProps> }`。
  - `SurfaceTester` 签名为 `(node: SurfaceNode, ctx: SurfaceTesterContext) => number`，返回 `-1`（`NOT_APPLICABLE`）表示不处理；渲染引擎遍历注册表并选取**得分最高**的渲染器（同分时后注册者优先，便于业务覆盖）。
  - 提供与 JSON Forms 同构的声明式谓词组合子：`rankWith(rank, predicate)`、`isKind(kind)`、`isControl`、`schemaTypeIs(type)`、`hasEnum`、`scopeEndsWith(segment)`、`optionIs(key, value)`、`and(...)`、`or(...)`。
  - **优先级刻度规范**：
    - `0`：未知 `kind` 的安全降级兜底渲染器（渲染结构化提示块，绝不白屏报错）；
    - `1`～`2`：`ai-surface` 内置默认轻量渲染器（覆盖基础布局、展示节点与原生/基础表单控件）；
    - `5`：`ai-surface-agent` 高阶领域渲染器（如将带搜索/排序选项的 `table` 升权至 `DataTable`，将长枚举或 `searchable` 的 `control` 升权至 `Combobox`，以及接管 `approval`、`diff`、`tool-call`、`artifact`、`citation`、`tree`）；
    - `10+`：消费方业务项目按特定 `scope` 或业务语义注入的自定义渲染器。
- **声明式显隐与禁用规则（`SurfaceRule`）**：
  - 节点可选配 `rule: { effect: "SHOW" | "HIDE" | "ENABLE" | "DISABLE"; condition: { scope: string; eq?: unknown; neq?: unknown; truthy?: boolean } }`，全程纯数据求值，不执行 `eval` 或任意脚本，满足沙箱安全要求。

### 3. 派生 ID、流式增量 Patch、纯文本降级与 AI 协同行为（参考 Tern + Vercel UI SDK）

- **路径派生稳定 ID 与增量更新**：
  - 若节点声明了 `key`，派生路径为 `<parentId>.<key>`；否则按槽位与下标派生（如 `main.0`、`main.deploy.head`、`main.deploy.end.0`）。
  - 提供纯函数 `applySurfacePatch(view, patches)`，支持 `replace`（替换指定路径节点）、`mergeProps`（局部更新状态或进度，如 `running` → `done`）、`appendItems`（向 `stack` / `table` / `kv` 流式追加条目）与 `remove`，避免 Agent 流式输出时反复重传整棵大树。
- **纯文本优雅降级（`renderSurfaceText`）**：
  - 提供零 DOM 依赖的纯函数 `renderSurfaceText(view, data?) => string`，将任意语义树与当前表单值渲染为层次分明的纯文本（例如卡片标题附带 `(done)` 状态、`kv` 渲染为对齐键值行、`table` 渲染为对齐文本表、`control` 输出当前标签与取值）。
  - 该输出既可用于日志归档与 CLI 降级，也可在多轮对话中作为「用户当前看到的界面摘要」低 Token 消耗地回填给 Agent。
- **流式保护与人机协同闭环（`SurfaceAnswer`）**：
  - `<AiSurface />` 接收 `streaming?: boolean`：流式构建未完成时，主提交按钮自动处于加载/禁用保护态，同时已挂载输入框保持受控编辑焦点不被增量 Patch 打断。
  - 对标 Tern `ask` 交互闭环，统一定义两类回调：
    - 非终结交互 `onAction?: (event: SurfaceActionEvent) => void`（按钮触发、表格行点击、工具重试等）；
    - 终结协同决议 `onResolve?: (answer: SurfaceAnswer) => void`：
      - 提交且通过 `schema` 校验：`{ status: "submitted", actionId: string, values: Record<string, unknown> }`；
      - 用户主动取消/拒绝或按 `Escape`：`{ status: "cancelled", actionId?: string, reason?: string }`；
      - 环境显式声明不支持交互：`{ status: "unsupported", fallbackText: string }`。

### 4. Registry 单文件合并与工程红线适配

根据 [flatten.mjs](../../scripts/registry/flatten.mjs) 的合并规则，组件目录内除 `<name>.variants.ts`（rank 0）、`<name>.types.ts`（rank 1）与 `<name>.tsx`（rank 3）外的内部模块（rank 2）在合并为 `registry/ui/<name>.tsx` 时会自动剥离行首 `export ` 关键字。因此必须遵守以下模块组织约束：

1. **所有对外承诺的类型**统一定义在 `<name>.types.ts` 中。
2. **所有对外承诺的组件、渲染器集合与纯函数**（如 `AiSurface`、`defaultSurfaceRenderers`、`rankWith`、`applySurfacePatch`、`renderSurfaceText`）在 `<name>.tsx` 主文件中汇总导出，并在 `index.ts` 中原样转发，确保 `@matt-ui/ui` 公开入口与 `shadcn add` 单文件产物的导出接口 100% 一致。
3. **文件内部标识符不重名**（合并到单文件后共享同一模块作用域），且每个源文件的每个函数严格控制在 50 行以内、嵌套不超过 3 层、圈复杂度不超过 10（`rankWith` 表驱动天然消除巨型分支）。

## 分阶段实施计划

每个阶段严格执行「测试先行（Vitest 公开入口断言）→ 实现 → 全套门禁验证 → 向用户汇报确认」的工作流：

### Stage 1：语义契约、`rankWith` 内核、增量 Patch 与纯文本降级（纯逻辑层 + 最小挂载外壳）

- **范围**：
  - 使用脚手架初始化 `packages/ui/src/components/ai-surface/`，细分为契约类型、路径派生与 `applySurfacePatch`、`schema` 缺省推导与同步校验、`rankWith` 匹配器与 `rule` 求值、`renderSurfaceText` 纯文本序列化。
  - 先编写完整的单元测试规约（覆盖稳定 ID 推导、流式增量 Patch、JSON Schema 必填/范围/枚举校验、`rankWith` 优先级覆盖与同分后注册覆盖、`rule` 显隐禁用、纯文本降级格式）。
- **验证门禁**：`pnpm lint && pnpm format:check && pnpm typecheck && pnpm test && pnpm build`。

### Stage 2：`<AiSurface />` 默认轻量渲染器与 `SurfaceAnswer` 协同闭环

- **范围**：
  - 在 `ai-surface` 中实现 `defaultSurfaceRenderers`（`main`/`dock`/`layer` 三区域布局、`stack`/`grid`/`tabs`/`group`/`card` 容器与 `head`/`end`/`foot` 槽位、`text`/`kv`/`stats`/`badge`/`progress`/`table`/`code`/`alert`/`empty` 展示节点、基于 `Form` 原语与原生/Base UI 控件的 `control` 双向绑定与错误提示、`actions`/`button` 及未知节点安全兜底）。
  - 打通 `streaming` 流式保护态、`onDataChange` 受控/非受控模式、`onAction` 事件与 `onResolve(SurfaceAnswer)` 提交/取消闭环。
  - 生成 Registry 产物并通过消费方与 Registry 端到端测试。
- **验证门禁**：全套基础门禁 + `pnpm registry:generate && pnpm test:consumer && pnpm test:registry`。

### Stage 3：`ai-surface-agent` 高阶领域渲染器扩展包

- **范围**：
  - 创建兄弟组件 `packages/ui/src/components/ai-surface-agent/`，导出 `agentSurfaceRenderers`（rank `5`）与便捷封装 `<AiAgentSurface />`。
  - 对接仓库现有高阶组件：`approval` → `AiApprovalCard`（自动映射批准/拒绝为 `SurfaceAnswer`）、`diff` → `AiDiffReview`、`tool-call` → `AiToolCall`、`artifact` → `AiArtifact`、`citation` → `AiCitation`、`tree` → `Tree`、可搜索/排序 `table` → `DataTable`、可搜索枚举 `control` → `Combobox`。
  - 编写单元规约验证高阶渲染器对默认渲染器的升权替换与事件桥接。
- **验证门禁**：全套基础门禁 + `pnpm registry:generate && pnpm test:consumer && pnpm test:registry`。

### Stage 4：展示站示例、Agent 提示词规范与端到端验收

- **范围**：
  - 在 `apps/docs` 的 `ai` 分类下完善 `AiSurface` 与 `AiAgentSurface` 的详情页文档、API 表、无障碍说明与多场景交互示例（① 流式增量 Patch 看板、② JSON Schema 自动表单与 `ask` 审批闭环、③ `rankWith` 自定义业务渲染器升权覆盖、④ 图形 Surface 与 `renderSurfaceText` 纯文本降级实时对照）。
  - 在文档中附上可直接复制给 LLM 的紧凑语义 Schema 提示词契约说明。
- **验证门禁**：全套基础门禁 + Registry 校验 + `pnpm --filter @matt-ui/docs e2e`。

## 后续影响

- `packages/ui` 不新增任何第三方 npm 依赖，所有能力基于现有目录内组件与标准 TypeScript 实现。
- 未来若需要将协议内核与 `renderSurfaceText` 单独提供给纯后端 Node / Rust / Python Agent 进程使用，由于契约层与纯文本序列化本身零 React / DOM 耦合，在 `@matt-ui/*` 正式发布 npm 后可平滑抽离或双入口导出，不影响现有 `<AiSurface />` 的公开 Props 与 Schema 结构。
