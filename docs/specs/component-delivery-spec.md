# 组件与扩展包研发交付契约（Component Delivery Spec）

> **用途**：面向人工工程师与自主编码智能体（单会话或并行多工作区）的标准交付契约与工作证明（Proof-of-Work）核对单。  
> **配套规则**：[AGENTS.md](../../AGENTS.md)、[CONTEXT.md](../../CONTEXT.md)、[ADR-001](../architecture/ADR-001-interaction-engine.md)、[ADR-004](../architecture/ADR-004-shadcn-registry.md)、[ADR-005](../architecture/ADR-005-agent-ui-surface.md)

---

## 1. 任务输入规格模板（Task Input Spec）

每次新建或大改组件/区块前，任务描述必须明确以下 6 项契约（可直接粘贴至工单或子智能体任务书）：

```yaml
component:
  name: "<kebab-case 名称，如 ai-surface-agent>"
  package: "@matt-ui/ui | @matt-ui/motion"
  category: "buttons | forms | overlays | display | navigation | motion | ai | blocks"
  interaction_base: "none | @base-ui/react | @ui-sdk/* (仅限 Tree/Reorder/Command/Resizable)"
  siblings_reused:
    - "../button/index.js"
  public_exports:
    components: ["PascalName"]
    types: ["PascalNameProps"]
```

### 包边界判定准则

- 需要弹簧物理、拖拽手势或布局过渡动效 → 放入 `packages/motion`；
- 其余所有基础原语、表单、数据表、浮层与语义协议组件 → 放入 `packages/ui`（**严禁引入 `motion` 依赖**）。

---

## 2. 编码与架构硬性红线（Invariants）

1. **第一方品牌纯净度**：
   - 组件注释、`.meta.json`、生成的 `registry/` 产物、Storybook 故事与 `apps/docs` 示例文案中，**严禁出现任何外部竞品、第三方组件库或外部商业大模型名称**（真实 npm 依赖导入与 CLI 安装命令除外；架构选型对比仅允许写入 `docs/architecture/ADR-*.md`）。
2. **单文件源码分发兼容（`flatten.mjs`）**：
   - 组件内相对导入必须写 `.js` 扩展名（如 `./foo.js`）；复用兄弟组件必须从 `../<sibling>/index.js` 导入。
   - 公开类型统一放在 `<name>.types.ts`（rank 1），切勿在 `<name>.tsx`（rank 3）重复 `export type` 同一标识符，防止合并成 `registry/ui/<name>.tsx` 后产生 `TS2484` 导出冲突。
   - 若拆分为多个内部模块（rank 2），按字母序命名（如 `<name>-1-*.ts`、`<name>-2-*.tsx`），确保模块顶层常量在合并后不存在暂时性死区（TDZ）。
3. **样式与无障碍底线**：
   - 只使用 `--ui-*` 设计 Token 对应的完整静态工具类字面量，禁止模板字符串拼接类名。
   - 浅色与深色双主题下，正文前景与表面对比度 ≥ `4.5:1`，边框/输入框/焦点环对比度 ≥ `3:1`，统一使用单层焦点环且支持键盘全流程操作与 `prefers-reduced-motion`。
4. **静态复杂度上限（`.oxlintrc.json`）**：
   - 单文件有效代码 ≤ `300` 行、单函数 ≤ `50` 行、块嵌套深度 ≤ `3`、圈复杂度 ≤ `10`、禁用 `var`。
5. **展示站示例导入一致性**：
   - `apps/docs/src/demos/<name>/*.tsx` 中从 `@matt-ui/ui` 导入的标识符会在构建时改写为 `@/components/ui/<name>`，因此示例的 `@matt-ui/ui` 导入行只允许引入该组件自身公开导出的成员。

---

## 3. 标准执行流水线（TDD Loop）

1. **脚手架初始化**：运行 `pnpm component:new <name>`，并在包入口 `index.ts` 登记导出。
2. **测试先行（Red）**：在 `<name>.test.tsx` 中仅从包公开入口（`../../index.js`）引入组件，编写覆盖核心状态机、键盘/ARIA 交互与回调契约的失败断言（若涉及树形动效面板，在 `jsdom` 的 `beforeAll` 中补齐 `Element.prototype.getAnimations = () => []`）。
3. **最小完备实现（Green）**：实现类型、变体与视图逻辑，使单元测试全部转绿。
4. **生成源码分发产物**：运行 `pnpm registry:generate` 更新 `registry/ui/<name>.tsx` 与 `registry.json`。
5. **展示站与无障碍补齐**：完善 `apps/docs/src/demos/<name>/` 与 `apps/docs/src/registry/<name>.doc.ts`，在 `apps/docs/src/registry/registry.ts` 登记后同步更新 `apps/docs/e2e/site.spec.ts` 的 `SPECIMEN_COUNT` 并补充双主题 `axe` 用例。

---

## 4. 工作证明核对单（Proof-of-Work Checklist）

提交阶段汇报或发起合并前，必须实际运行并附上以下全部门禁结果（严禁跳步或推算）：

- [ ] **品牌词零残留扫描**：扫描 `packages/ui/src`、`packages/motion/src`、`registry/ui`、`apps/docs/src`、`apps/storybook/stories` 无外部项目/模型品牌词。
- [ ] **静态与格式门禁**：`pnpm lint && pnpm format:check`（0 warnings / 0 errors）。
- [ ] **全仓类型门禁**：`pnpm typecheck`（全部子包通过）。
- [ ] **单元行为门禁**：`pnpm test`（全仓通过且无未捕获异步异常）。
- [ ] **生产构建门禁**：`pnpm build`（含组件包、Storybook 与展示站全量静态路由生成）。
- [ ] **Registry 真实安装门禁**：`pnpm registry:generate && pnpm test:registry`（独立临时工程 CLI 安装、`tsc -b`、`vite build` 与 Chromium 浏览器校验通过）。
- [ ] **展示站端到端与无障碍门禁**：改动 `apps/docs` 时运行 `pnpm --filter @matt-ui/docs e2e`（亮/暗双主题 `axe` 零违规）。
