# AI Surface 语义视图协议规范（SPEC v1.0）

> **状态**：正式规范（v1.0）  
> **适用范围**：智能体（Agent）后端生产者、前端视图渲染运行时、日志/终端纯文本消费端  
> **参考实现**：`packages/ui/src/components/ai-surface/` 与 `packages/ui/src/components/ai-surface-agent/`

---

## 1. 目标与边界

本规范定义一套**受限、可流式增量更新、零脚本执行、可降级为纯文本**的智能体用户界面协议（AI Surface Protocol）。任何符合本规范的生产者（Python / Go / Rust / TypeScript 等智能体运行时）与渲染端实现，均可在不耦合具体宿主框架的前提下交换结构化界面与人机协同决议。

### 1.1 安全与设计不变量

1. **禁止样式与标记穿透（`MUST NOT`）**：协议载荷不得包含原始 HTML 字符串、CSS 类名、内联样式或像素坐标；所有视觉层级、间距、颜色与状态均由渲染端按宿主设计 Token 映射。
2. **零任意代码求值（`MUST NOT`）**：所有显隐/禁用联动规则（`SurfaceRule`）与数据校验（`SurfaceDataSchema`）必须是纯数据求值，严禁调用 `eval`、`Function` 或动态脚本解释器。
3. **未知节点零崩溃（`MUST`）**：渲染端遇到未注册的扩展节点（`x-*`）或未知 `kind` 时，必须回退至最低优先级兜底块或纯文本表示，不得抛出未捕获异常。
4. **流式稳定与协同闭环（`MUST`）**：增量更新不得重置无关受控字段状态；流式未完结期间必须锁定主提交动作。

### 1.2 规范关键词

本文档中的 `MUST`（必须）、`MUST NOT`（禁止）、`SHOULD`（应当）、`MAY`（可选）按 RFC 2119 语义解释。

---

## 2. 基础枚举与顶层视图（`SurfaceView`）

### 2.1 语义色调与执行状态

- **`SurfaceTone`**：`"neutral" | "signal" | "success" | "warning" | "danger" | "info"`
- **`SurfaceStatus`**：`"idle" | "pending" | "running" | "done" | "error" | "cancelled"`

### 2.2 顶层区域契约

一个合法的 `SurfaceView` 对象包含以下字段：

| 字段    | 类型                           | 必填                       | 语义要求                                                                  |
| :------ | :----------------------------- | :------------------------- | :------------------------------------------------------------------------ |
| `title` | `string`                       | 否                         | 视图总标题，参与纯文本降级首行输出                                        |
| `main`  | `SurfaceNode \| SurfaceNode[]` | 是（当未提供 `schema` 时） | 主工作区，承载核心信息卡片、数据表或表单                                  |
| `dock`  | `SurfaceNode \| SurfaceNode[]` | 否                         | 辅助停靠栏（宽屏侧栏 / 窄屏次级区域），承载上下文键值或目录树             |
| `layer` | `SurfaceNode \| SurfaceNode[]` | 否                         | 模态或浮层确认区；存在 `layer` 时，宿主必须响应键盘 `Escape` 触发取消决议 |

当调用方未提供 `uischema` 但提供了 `schema`（见第 5 节）时，渲染端 `MUST` 自动推导默认表单 `SurfaceView`。

---

## 3. 受限语义节点词表（`SurfaceNode`）

所有节点共享基础属性 `SurfaceNodeBase`：

```json
{
  "key": "可选稳定键名（用于路径 ID 推导）",
  "id": "可选显式或派生唯一标识",
  "tone": "neutral | signal | success | warning | danger | info",
  "status": "idle | pending | running | done | error | cancelled",
  "rule": { "effect": "SHOW", "condition": { "scope": "#/properties/flag", "eq": true } },
  "options": {}
}
```

### 3.1 容器与分区节点（5 种）

| `kind`  | 关键字段                                                                                                      | 槽位与行为要求                                                                           |
| :------ | :------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------- |
| `stack` | `direction?: "vertical" \| "horizontal"`, `gap?: "sm" \| "md" \| "lg"`, `align?`, `children: SurfaceNode[]`   | 线性堆叠子节点                                                                           |
| `grid`  | `columns?: 1 \| 2 \| 3 \| 4`, `gap?: "sm" \| "md" \| "lg"`, `children: SurfaceNode[]`                         | 响应式多列网格（窄屏自动折叠单列）                                                       |
| `card`  | `variant?: "default" \| "elevated" \| "subtle"`, `head?: string \| SurfaceHead`, `end?`, `foot?`, `children?` | 标准语义卡片；`head` 支持标题、副标题、状态点与徽章，`end` 置于头部右侧，`foot` 置于底栏 |
| `group` | `title?`, `description?`, `end?`, `foot?`, `children: SurfaceNode[]`                                          | 轻量分组区段                                                                             |
| `tabs`  | `defaultTab?: string`, `tabs: { key, label, badge?, children }[]`                                             | 多页签切换容器                                                                           |

### 3.2 信息展示节点（9 种）

| `kind`     | 关键字段                                                                                                                                                     | 语义说明                                                               |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| `text`     | `text: string`, `variant?: "body" \| "muted" \| "heading" \| "caption" \| "code"`                                                                            | 文本段落或标题                                                         |
| `kv`       | `columns?: 1 \| 2`, `items: { key?, label, value, tone?, mono? }[]`                                                                                          | 结构化键值摘要列表                                                     |
| `stats`    | `items: { key?, label, value, delta?, tone? }[]`                                                                                                             | 指标数值与环比/同比变化网格                                            |
| `badge`    | `label: string`                                                                                                                                              | 状态或分类胶囊标记                                                     |
| `progress` | `value: number`, `max?: number`, `label?`, `valueLabel?`                                                                                                     | 进度水位条（默认 `max = 100`）                                         |
| `table`    | `columns: { key, header, align?, cellKind?, sortable? }[]`, `rows: Record<string, unknown>[]`, `searchable?`, `selectable?`, `rowActionId?`, `emptyMessage?` | 结构化数据表；`cellKind` 支持 `"text" \| "badge" \| "meter" \| "mono"` |
| `code`     | `code: string`, `language?`, `title?`                                                                                                                        | 只读代码与命令片段                                                     |
| `alert`    | `title: string`, `description?`                                                                                                                              | 内联状态提示横幅                                                       |
| `empty`    | `title: string`, `description?`, `actionLabel?`, `actionId?`                                                                                                 | 空数据占位与引导操作                                                   |

### 3.3 表单与动作节点（3 种）

| `kind`    | 关键字段                                                                                                                                                                  | 语义说明                                                                                                                                               |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `control` | `scope: string`, `label?`, `description?`, `placeholder?`, `required?`, `readOnly?`, `controlType?`                                                                       | 绑定 `schema` 字段（`#/properties/<field>`）；`controlType` 支持 `"text" \| "textarea" \| "number" \| "select" \| "radio" \| "checkbox" \| "combobox"` |
| `button`  | `actionId: string`, `label: string`, `intent?: "primary" \| "secondary" \| "outline" \| "ghost" \| "danger" \| "signal" \| "submit" \| "cancel"`, `payload?`, `disabled?` | 触发动作或终结决议                                                                                                                                     |
| `actions` | `align?: "start" \| "end" \| "between"`, `items: SurfaceButtonNode[]`                                                                                                     | 按钮操作组                                                                                                                                             |

### 3.4 智能体高阶领域节点（6 种）与扩展节点（`x-*`）

| `kind`        | 关键字段                                                                                                                                                                          | 交互桥接要求                                                                                                       |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| `approval`    | `title`, `description?`, `agentName?`, `command?`, `workingDir?`, `impact?`, `riskLevel?: "low" \| "medium" \| "high"`, `approvalOptions?`, `approveActionId?`, `rejectActionId?` | 批准必须产出 `status: "submitted"` 的 `SurfaceAnswer`（携带 `approvalOption`），拒绝必须产出 `status: "cancelled"` |
| `diff`        | `fileName?`, `summary?`, `language?`, `lines: { id, lineNumber, type: "context" \| "remove" \| "add", content }[]`, `applyActionId?`, `rejectActionId?`                           | 行级差异审阅；应用时通过 `onAction` 回传选中行 `acceptedLineIds`                                                   |
| `tool-call`   | `toolName`, `provider?`, `durationLabel?`, `tokensLabel?`, `summary?`, `inputJson?`, `outputJson?`, `retryActionId?`                                                              | 工具执行轨迹与失败重试回调                                                                                         |
| `artifact`    | `title`, `artifactType?: "code" \| "markdown" \| "html" \| "json"`, `language?`, `versionLabel?`, `summary?`, `content`                                                           | 独立生成产物预览与源码视图                                                                                         |
| `citation`    | `index?`, `title`, `url?`, `domain?`, `snippet?`                                                                                                                                  | 知识来源引用与摘录                                                                                                 |
| `tree`        | `title?`, `items: { id, label, badge?, children? }[]`, `defaultExpandedIds?`, `selectActionId?`                                                                                   | 层级目录树与节点选中事件                                                                                           |
| `x-${string}` | `props?: Record<string, unknown>`, `fallbackText?: string`                                                                                                                        | 宿主自定义扩展协议节点                                                                                             |

---

## 4. 路径派生稳定 ID 算法（`deriveSurfaceIds`）

为保证流式增量更新无需每次携带手写全局 UUID，渲染端 `MUST` 按以下确定性规则为所有节点推导 `id`：

1. **子路径公式**：`childPath(prefix, key, index) = "${prefix}.${key ?? index}"`。
2. **顶层区域根路径**：
   - 若区域（`main` / `dock` / `layer`）为数组 `nodes`，第 `i` 项路径为 `childPath(regionName, nodes[i].key, i)`（例如 `main.0` 或 `main.rollout`）。
   - 若区域为单个节点 `node`，路径为 `childPath(regionName, node.key, 0)`（例如 `main.0` 或 `main.rollout`）。
3. **容器嵌套路径**：
   - `stack` / `grid` / `card` / `group` 的 `children[i]`：`childPath(parentId, child.key, i)`。
   - `card` / `group` 的 `end` 槽位：前缀为 `${parentId}.end`；`foot` 槽位：前缀为 `${parentId}.foot`。
   - `tabs` 的每个页签 `tab`：其 `children[i]` 前缀为 `${parentId}.${tab.key}`（即 `${parentId}.${tab.key}.${child.key ?? i}`）。
   - `actions` 的每个按钮 `items[i]`：`childPath(parentId, btn.key, i)`。

---

## 5. 数据契约、缺省推导与同步校验（`SurfaceDataSchema`）

### 5.1 作用域解析与默认值推导

1. `scopeToField(scope)`：若 `scope` 以 `"#/properties/"` 开头，剥离该前缀得到字段名；否则原样作为字段名。
2. `deriveDefaultData(schema, initial)`：先遍历 `schema.properties` 提取所有 `default !== undefined` 的字段值，再用外部传入的 `initial` 浅合并覆盖。

### 5.2 缺省 `uischema` 自动生成（`deriveUiSchema`）

当未提供 `uischema` 且提供了 `schema` 时：

1. 按 `schema.properties` 键顺序逐一生成 `control` 节点（`key = field`，`scope = "#/properties/" + field`，`label = prop.title ?? field`，`required = schema.required?.includes(field)`）。
2. 生成尾部 `actions` 节点（含 `cancel` 与 `submit` 两个按钮）。
3. 若 `schema.title` 存在，外层包裹 `card`（`key: "auto-form"`，`head` 为 `title` 与 `description`，`foot` 为 `actions`）；否则直接置于 `main: [...controls, actions]`。

### 5.3 同步字段校验顺序（`validateSurfaceData`）

对 `schema.properties` 中的每个字段按以下短路顺序校验（`label = prop.title ?? field`）：

1. **空值判定**：`value === undefined || value === null || value === ""` 时，若在 `schema.required` 中则返回必填错误，否则通过（跳过后续校验）。
2. **枚举校验**：若声明了 `enum` 或 `oneOf`，`String(value)` 不在允许集合内时返回枚举错误。
3. **数值校验**（`type` 为 `"number"` 或 `"integer"`）：依次检查 `!Number.isNaN(Number(value))`、`Number.isInteger`（仅 `"integer"`）、`minimum` 下限、`maximum` 上限。
4. **字符串校验**（`type` 为 `"string"`）：依次检查 `minLength`、`maxLength`、`new RegExp(pattern).test(String(value))`。

---

## 6. 声明式规则求值（`SurfaceRule`）

节点可选配 `rule: { effect, condition: { scope, eq?, neq?, truthy? } }`：

1. **条件命中判定（`matched`）**：取 `actual = data[scopeToField(condition.scope)]`，仅当已声明的所有子条件同时满足时 `matched = true`：
   - 若声明 `eq !== undefined`：要求 `actual === condition.eq`；
   - 若声明 `neq !== undefined`：要求 `actual !== condition.neq`；
   - 若声明 `truthy !== undefined`：要求 `Boolean(actual) === condition.truthy`。
2. **效果真值表**：

| `effect`  | `matched === true`                    | `matched === false`                   |
| :-------- | :------------------------------------ | :------------------------------------ |
| `SHOW`    | `{ visible: true, disabled: false }`  | `{ visible: false, disabled: false }` |
| `HIDE`    | `{ visible: false, disabled: false }` | `{ visible: true, disabled: false }`  |
| `ENABLE`  | `{ visible: true, disabled: false }`  | `{ visible: true, disabled: true }`   |
| `DISABLE` | `{ visible: true, disabled: true }`   | `{ visible: true, disabled: false }`  |

当 `visible === false` 时，图形渲染端与 `renderSurfaceText` 均 `MUST` 跳过该节点及其子树。

---

## 7. 优先级渲染器注册表（`rankWith`）

渲染端按 `[兜底渲染器, ...内置默认渲染器, ...领域扩展渲染器, ...宿主自定义渲染器]` 顺序维护注册表，每个条目包含 `tester(node, ctx) => number`：

### 7.1 标准分值刻度

- **`-1`（`NOT_APPLICABLE`）**：当前渲染器不适用。
- **`0`**：未知节点安全兜底渲染器（始终返回 `0`）。
- **`2 ~ 4`**：基础语义节点与基础表单控件默认渲染器（如通用 `control` 为 `2`，布尔/枚举/多行为 `3`，显式指定 `controlType: "radio"` 为 `4`）。
- **`5`**：智能体高阶领域渲染器（接管 `approval` / `diff` / `tool-call` / `artifact` / `citation` / `tree`，并将可搜索/排序 `table` 升权至高阶数据表、长枚举或 `combobox` 升权至可搜索组合框）。
- **`10+`**：业务消费方注入的专属组件渲染器。

### 7.2 决胜规则（`selectSurfaceRenderer`）

遍历注册表，任何满足 `score > -1 && score >= bestScore` 的条目更新 `bestEntry`。**同分时，后注册的条目 `MUST` 覆盖先注册的条目**。

---

## 8. 流式增量更新规范（`applySurfacePatch`）

`applySurfacePatch(view, patches)` 必须是**纯函数（不可变更新）**，每次应用前与结束后均重新执行 `deriveSurfaceIds` 以保证新增子节点的派生 ID 立即生效：

| `op`          | 载荷字段            | 命中 `node.id === targetId` 时的行为                                                                                        |
| :------------ | :------------------ | :-------------------------------------------------------------------------------------------------------------------------- |
| `replace`     | `targetId`, `node`  | 用新 `node` 替换目标节点，保留原位置派生 `id`                                                                               |
| `mergeProps`  | `targetId`, `patch` | 将 `patch` 浅合并进目标节点属性，保留原派生 `id`                                                                            |
| `appendItems` | `targetId`, `items` | 容器节点追加至 `children`；`table` 追加至 `rows`；`diff` 追加至 `lines`；`kv` / `stats` / `actions` / `tree` 追加至 `items` |
| `remove`      | `targetId`          | 从所在数组、槽位或顶层区域中移除目标节点                                                                                    |

**未知路径容错要求（`MUST`）**：当 `targetId` 在当前视图中不存在时，`applySurfacePatch` 必须无副作用返回等价视图，不得抛出异常。

---

## 9. 人机协同生命周期与事件状态机

### 9.1 流式提交门控

当 `streaming === true` 时：

- 所有 `intent === "submit"` 的按钮 `MUST` 处于加载/禁用态，且控制器 `MUST` 拦截任何 `submit` 触发；
- 非提交类控件（如正在填写的输入框）`MUST` 保持可交互且不丢失焦点。

### 9.2 动作与终结决议（`SurfaceActionEvent` vs `SurfaceAnswer`）

1. **普通动作（`intent` 不为 `"submit"` / `"cancel"`）**：触发 `onAction({ actionId, nodeId, payload, values })`，不结束当前协同回合。
2. **提交决议（`intent === "submit"`）**：先执行 `validateSurfaceData(schema, activeData)`：
   - 若存在校验错误：渲染字段级 `role="alert"` 错误提示，不触发 `onResolve`；
   - 若校验通过：触发 `onResolve({ status: "submitted", actionId, values: { ...activeData, ...payload } })`。
3. **取消决议（`intent === "cancel"` 或 `layer` 激活时按下 `Escape`）**：跳过表单校验，立即触发 `onResolve({ status: "cancelled", actionId, reason })`。
4. **环境不支持图形交互（如纯 CLI 管道）**：消费端可调用 `renderSurfaceText` 展示摘要，并回传 `{ status: "unsupported", fallbackText }`。

---

## 10. 纯文本降级规范（`renderSurfaceText`）

`renderSurfaceText(view, data, schema) => string` `MUST` 在零 DOM 环境下运行：

1. 按 `view.title` → `main` → `dock` → `layer` 顺序拼接非空段落（顶层段落以双换行 `"\n\n"` 分隔）。
2. 先对每个节点执行 `evaluateSurfaceRule(node.rule, data)`，`visible === false` 的节点输出空串并跳过。
3. 关键节点文本格式：
   - `card`：首行输出 `<title>`（若存在 `status` 则附加 ` (<status>)`），依次输出描述、`end`、`children`、`foot`；
   - `kv`：每行 `<label>: <value>`；
   - `stats`：每行 `<label>: <value>`（含 `delta` 时附加 ` (<delta>)`）；
   - `table`：表头与数据行均以 `" | "` 连接各列；
   - `control`：`<label>: <currentValue>`；
   - `badge` / `button`：`[<label>]`；
   - `alert`：`! <title>`；
   - `approval`：`[approval:<riskLevel>] <title>`；
   - `diff`：文件名后逐行输出 `+ <content>` / `- <content>` / `  <content>`；
   - `tool-call`：`<toolName> (<status>) - <summary>`；
   - `x-*` 扩展节点：优先输出 `node.fallbackText`，否则输出 `[<kind>]`。

---

## 11. 一致性测试向量（Conformance Vectors）

任何跨语言实现均应通过以下最小基准测试：

### 向量 A：路径 ID 推导与增量更新

- **输入视图**：
  ```json
  {
    "main": {
      "kind": "card",
      "key": "deploy",
      "end": { "kind": "badge", "label": "准备中" },
      "children": [{ "kind": "progress", "key": "bar", "value": 20 }]
    }
  }
  ```
- **期望派生 ID**：卡片为 `"main.deploy"`，右侧徽章为 `"main.deploy.end.0"`，进度条为 `"main.deploy.bar"`。
- **输入补丁**：`{ "op": "mergeProps", "targetId": "main.deploy.bar", "patch": { "value": 100 } }`
- **期望纯文本输出**（`renderSurfaceText`）：
  ```text
  [准备中]
  100/100
  ```

### 向量 B：联动显隐与提交校验

- **输入 `schema`**：`{ "required": ["host"], "properties": { "host": { "type": "string", "minLength": 3 }, "tls": { "type": "boolean", "default": false }, "cert": { "type": "string" } } }`
- **规则**：`cert` 控件声明 `rule: { "effect": "SHOW", "condition": { "scope": "#/properties/tls", "eq": true } }`。
- **期望行为**：
  1. 初始 `tls = false` 时，`cert` 控件不渲染且不出现在 `renderSurfaceText` 输出中；
  2. 当 `host = "ab"` 时触发 `submit`，`validateSurfaceData` 返回 `host` 长度错误，`onResolve` 不得触发；
  3. 当 `host = "edge-01"` 时触发 `submit`，`onResolve` 收到 `{ "status": "submitted", "actionId": "submit", "values": { "tls": false, "host": "edge-01" } }`。
