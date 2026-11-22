# matt-ui 组件功能与分批实施计划

> **文档状态：** 持续维护（2026-11-22 起）  
> **对齐基线：** `UI-Platform-Implementation-Blueprint.md`、`docs/architecture/ADR-001-interaction-engine.md`、`AGENTS.md`  
> **设计语言：** 纯净中性灰阶 + 钴蓝信号/焦点色、8px 标准控件圆角、1px 发丝边线 + 轻盈多层阴影（综合参考 EasyUI、shadcn/ui、BeUI 与 BoardUI）

---

## 一、核心原则与研发闭环

结合蓝图第 19 节与本仓库工程规范，每个组件批次严格执行以下闭环：

1. **先研后写（视觉对齐主流开源库）**：每批开工前，先通过浏览器实地调研对应参考站（来自蓝图第 18 节索引）的布局比例、状态细节、动效节奏与无障碍设计；**只吸收设计模式与工程思路，不复制专有源码与品牌资产**。
2. **交互底座单一且隔离（ADR-001）**：
   - 原生 HTML 足够时零底座（如输入框、卡片、分隔线、徽章）；
   - 通用交互原语统一用 `@base-ui/react`；
   - Base UI 缺口（Tree、Reorder、Command、Resizable）采用精确锁版本的 `@ui-sdk/*`；
   - 底座类型不泄漏到公开 Props，所有样式只依赖语义 Token 与 `data-*` 属性。
3. **包职责边界清晰**：
   - 基础与交互组件放 `@matt-ui/ui`（禁止依赖 `motion`）；
   - 需要弹簧物理、拖拽手势、布局过渡或列表进出场动效的组件放 `@matt-ui/motion`；
   - 图表、地图、3D/Shader 作为后期按需独立包，绝不污染核心包体积。
4. **测试先行与双通道分发**：
   - Vitest + Testing Library 从包公开入口断言行为；
   - 每次改动后运行完整门禁：`pnpm lint && pnpm format:check && pnpm typecheck && pnpm test && pnpm build && pnpm registry:generate && pnpm test:consumer && pnpm test:registry && pnpm --filter @matt-ui/docs e2e`；
   - 重启 `http://localhost:3000` 并在亮/暗双主题下实机巡检视觉效果，确认无重边框、无裁切、无对比度违规后再向用户汇报。

---

## 二、当前已完成基线（19 个组件）

| 批次                         | 包                                        | 已完成组件                                                                                                                                                                                                   | 备注                                                                                                       |
| ---------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **B1 · 按钮与操作（12 个）** | `@matt-ui/ui` (8) / `@matt-ui/motion` (4) | `Button`、`PressButton`、`LiquidRippleButton`、`NeonEdgeButton`、`BookCallButton`、`TypewriterButton`、`SplitButton`、`CodeSnippetDeck`、`MagneticButton`、`MorphingButton`、`DragToConfirm`、`LiquidToggle` | 含 Typewriter 机械音效、DragToConfirm 触觉震动、Storybook 与消费方双包验证                                 |
| **F1 · 核心表单（7 个）**    | `@matt-ui/ui` (5) / `@matt-ui/motion` (2) | `LockInput`、`DrawCheckbox`、`StretchSwitch`、`SpringSelect`、`Combobox`、`OtpInput`、`Form`                                                                                                                 | 含 ADR-001 的 Select 焦点空窗与 Combobox `aria-hidden-focus` 回归用例；已完成去重边框与钴蓝 Token 视觉重做 |

---

## 三、分批次组件实施路线图

### 批次 F2：日期、上传与 AI 输入器（4 个组件）— **下一执行批次**

| 组件                   | 包                | 交互底座                                            | 核心功能与无障碍要点                                                                                                                                                                                                                      | 重点参考来源                                                                                                                |
| ---------------------- | ----------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Calendar**           | `@matt-ui/ui`     | 原生 `grid` + `Intl.DateTimeFormat`                 | 单日（`single`）与区间（`range`）选择、月/年切换、今天标记、`minDate` / `maxDate` / `disabledDates`、相邻月份补齐、完整键盘导航（方向键、Home/End、PageUp/PageDown、Enter/Space）、中英本地化                                             | `easyui.site/components/calendar`、`ui.shadcn.com/docs/components/calendar`、`coss.com/ui`、`boardui.com`                   |
| **DatePicker**         | `@matt-ui/ui`     | Base UI `Popover` + 复用 `../calendar`              | 触发按钮带日历图标与格式化展示、单日/区间模式、快捷预设栏（今天/明天/近 7 天/本月末等）、一键清空、Escape 关闭并恢复焦点                                                                                                                  | `easyui.site/components/date-picker`、`ui.shadcn.com/docs/components/date-picker`、`reui.io`                                |
| **AnimatedFileUpload** | `@matt-ui/motion` | 原生 `<input type="file">` + Drag & Drop + `motion` | 拖拽区域（拖入态磁性虚线与微缩放）、多文件选择、`accept`/`maxSize`/`maxFiles` 校验、图片缩略图预览（自动 `URL.revokeObjectURL` 清理）、基于 `uploadAdapter` 注入的进度/成功/错误/重试状态、列表进出场动效与 `prefers-reduced-motion` 降级 | `beui.dev/components/blocks/file-upload`、`easyui.site/components/animated-file-upload`、`reui.io`、`motion-primitives.com` |
| **PromptInput**        | `@matt-ui/ui`     | 原生 `<textarea>` + 组合子插槽                      | 自动增高多行输入、顶部/底部工具栏（模型/模式标签、附件 chip 预览与移除）、`Enter` 提交 / `Shift+Enter` 换行 / 中文输入法 `isComposing` 防误触、`status`（`idle` / `streaming` / `disabled`）含停止按钮、快捷提示词建议                    | `easyui.site/components/prompt-input`、`spell.sh`、`coss.com/ui`                                                            |

---

### 批次 F3：数据表格（2 个组件）

| 组件                  | 包            | 交互底座                                             | 核心功能与无障碍要点                                                                                                                           | 重点参考来源                                                                                              |
| --------------------- | ------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **DataTable**         | `@matt-ui/ui` | TanStack Table（按需评估入 catalog）+ 原生 `<table>` | 声明式列定义、单列排序（`aria-sort`）、全局搜索过滤、客户端分页、行选择复选框（复用 `DrawCheckbox`）、空状态与加载骨架态、窄屏横向滚动键盘可达 | `easyui.site/components/data-table`、`ui.shadcn.com/docs/components/data-table`、`reui.io`、`boardui.com` |
| **AdvancedDataTable** | `@matt-ui/ui` | TanStack Table + Base UI `Popover`/`Menu`            | 在 `DataTable` 基础上扩展列显隐控制、多条件分面筛选（Faceted Filter）、密度切换（紧凑/标准/宽松）、批量行操作浮动栏、固定表头与 CSV 导出钩子   | `easyui.site/components/advanced-data-table`、`reui.io`、`boardui.com`、`obsidianui.dev`                  |

---

### 批次 O1：核心浮层（6 个组件）

> **必须包含**：ADR-001 记录的 Base UI 偏差 #1（Dialog 连续快速按 Tab 时焦点陷阱瞬时外泄，`test.fail` 监控上游修复）。

| 组件                   | 包                | 交互底座                               | 核心功能与无障碍要点                                                                                                              | 重点参考来源                                                                                            |
| ---------------------- | ----------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **SettleModal**        | `@matt-ui/ui`     | Base UI `Dialog`                       | 居中模态框、阻尼落位入场/退场、背景磨砂遮罩、标题/描述/底部操作区插槽、滚锁、初始焦点、焦点陷阱与关闭焦点恢复、嵌套 Escape        | `easyui.site/components/settle-modal`、`ui.shadcn.com/docs/components/dialog`、`coss.com/ui`            |
| **Sheet**              | `@matt-ui/ui`     | Base UI `Dialog` / `Drawer`            | 四方向抽屉（`right` / `left` / `top` / `bottom`）、平滑滑入遮罩、尺寸预设（`sm`/`md`/`lg`）、页头吸顶与主体独立滚动               | `easyui.site/components/sheet`、`ui.shadcn.com/docs/components/sheet`、`beui.dev`                       |
| **DirectionalTooltip** | `@matt-ui/ui`     | Base UI `Tooltip`                      | 方向感知位移弹出（按 `top`/`right`/`bottom`/`left` 沿对应轴滑入）、箭头指示、延迟防抖、共享 Provider 组快速切换、键盘聚焦同步触发 | `easyui.site/components/directional-tooltip`、`base-ui.com/react/components/tooltip`、`transitions.dev` |
| **OriginDropdown**     | `@matt-ui/ui`     | Base UI `Menu`                         | 从触发器锚点 `transform-origin` 缩放展开的下拉菜单、分组标题、分隔线、快捷键提示（`kbd`）、危险操作项、子菜单与勾选/单选项        | `easyui.site/components/origin-dropdown`、`ui.shadcn.com/docs/components/dropdown-menu`、`boardui.com`  |
| **PeekCard**           | `@matt-ui/ui`     | Base UI `PreviewCard`                  | 悬停/聚焦链接时延迟浮现的富内容预览卡（头像、摘要、元信息指标）、安全三角形鼠标路径容错、触控与键盘降级                           | `easyui.site/components/peek-card`、`base-ui.com/react/components/preview-card`、`coss.com/ui`          |
| **MorphingDialog**     | `@matt-ui/motion` | Base UI `Dialog` + `motion` `layoutId` | 卡片点击无缝形变展开为详情模态框（共享元素过渡）、`prefers-reduced-motion` 自动回退淡入淡出、完整 Dialog 无障碍焦点管理           | `easyui.site/components/morphing-dialog`、`motion-primitives.com/docs`、`transitions.dev`               |

---

### 批次 O2：命令与辅助浮层（5 个组件）

| 组件                | 包                | 交互底座                                                                         | 核心功能与无障碍要点                                                                                             | 重点参考来源                                                                                                       |
| ------------------- | ----------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **CommandMenu**     | `@matt-ui/ui`     | `@ui-sdk/*`（锁版本，ADR-001）或 Base UI `Dialog` + `Autocomplete`（开工前复核） | 全局 `⌘K`/`Ctrl+K` 面板、分组命令、拼音/关键词模糊搜索、高亮匹配、键盘上下循环、子级页面栈（嵌套命令）、空态提示 | `easyui.site/components/command-menu`、`ui-sdk.dev/docs/react/components`、`ui.shadcn.com/docs/components/command` |
| **SpotlightSearch** | `@matt-ui/motion` | Base UI `Dialog` + `motion`                                                      | 轻量聚焦搜索弹层、最近搜索记录、分类标签快速过滤、结果预览分栏与弹性进出场                                       | `easyui.site/components/spotlight-search`、`great-ui.com/components`、`motion-primitives.com`                      |
| **SelectionBasket** | `@matt-ui/motion` | 原生 + `motion` `AnimatePresence` / `layout`                                     | 底部悬浮多选动作栏、已选计数跳动、头像/项缩略叠放、主/次批量动作按钮、一键清空与 `aria-live` 播报                | `easyui.site/components/selection-basket`、`transitions.dev`、`uselayouts.com`                                     |
| **AvatarStack**     | `@matt-ui/ui`     | Base UI `Avatar` + 复用 `DirectionalTooltip`                                     | 叠放头像组、悬停微散开、图片加载回退首字母、在线状态点、`max` 溢出 `+N` 计数徽章                                 | `easyui.site/components/avatar-stack`、`hamur.dev/ui/components/avatar`、`reui.io`                                 |
| **IntroLoader**     | `@matt-ui/motion` | 原生 + `motion`                                                                  | 品牌/页面首屏入场过渡遮罩、进度或字标编排、可控退出回调、`prefers-reduced-motion` 立即跳过不阻塞首屏             | `easyui.site/components/intro-loader`、`loading.daniasyrofi.com`、`transitions.dev`                                |

---

### 批次 D1：展示与反馈基础件（9 个组件，补齐蓝图 7.1 P0）

| 组件           | 包            | 交互底座                          | 核心功能与无障碍要点                                                                                                   | 重点参考来源                                                       |
| -------------- | ------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Card**       | `@matt-ui/ui` | 原生                              | `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`，支持默认、微抬升与交互悬停变体 | `ui.shadcn.com`、`boardui.com`、`coss.com/ui`                      |
| **Badge**      | `@matt-ui/ui` | 原生                              | `default` / `secondary` / `outline` / `signal` / `success` / `warning` / `destructive` 变体，支持状态小圆点与图标插槽  | `boardui.com`、`reui.io`、`beui.dev`                               |
| **Alert**      | `@matt-ui/ui` | 原生（`role="alert"` / `status`） | 信息/成功/警告/错误横幅，带图标、标题、正文与右侧操作/关闭槽                                                           | `coss.com/ui`、`ui.shadcn.com`、`beui.dev`                         |
| **Toast**      | `@matt-ui/ui` | Base UI `Toast`                   | 堆叠通知、多方位定位、自动消失与悬停暂停、撤销动作按钮、Promise 状态流转与无障碍播报                                   | `base-ui.com/react/components/toast`、`coss.com/ui`、`easyui.site` |
| **Progress**   | `@matt-ui/ui` | Base UI `Progress`                | 线性进度条、不确定加载态、标签与百分比读数、`signal`/`primary`/`success` 色调                                          | `base-ui.com/react/components/progress`、`boardui.com`             |
| **Skeleton**   | `@matt-ui/ui` | 原生                              | 脉冲与流光（Shimmer）两种骨架变体，减弱动效时静止显示                                                                  | `ui.shadcn.com`、`beui.dev`、`loading.daniasyrofi.com`             |
| **Separator**  | `@matt-ui/ui` | Base UI `Separator`               | 水平/垂直发丝分隔线，支持中间嵌入文字标签                                                                              | `base-ui.com/react/components/separator`、`coss.com/ui`            |
| **Spinner**    | `@matt-ui/ui` | 原生（`role="status"`）           | 精致 SVG 环形加载器，多尺寸（`xs`/`sm`/`md`/`lg`）与减弱动效回退                                                       | `coss.com/ui`、`loading.daniasyrofi.com`                           |
| **EmptyState** | `@matt-ui/ui` | 原生                              | 统一的空列表/无搜索结果占位卡片（图标框、标题、说明、主次操作按钮）                                                    | `coss.com/ui`、`boardui.com`、`reui.io`                            |

---

### 批次 N1：导航、布局与 P1 复杂交互（8 个组件，补齐蓝图 7.1 & 7.2）

| 组件                        | 包                                 | 交互底座                                  | 核心功能与无障碍要点                                                           | 重点参考来源                                                                   |
| --------------------------- | ---------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| **Tabs**                    | `@matt-ui/motion` 或 `@matt-ui/ui` | Base UI `Tabs`（滑动指示器可选 `motion`） | 胶囊分段、下划线与卡片三种风格，平滑滑动激活指示器、键盘方向切换               | `base-ui.com/react/components/tabs`、`butter-nav.vercel.app`、`boardui.com`    |
| **Accordion**               | `@matt-ui/ui`                      | Base UI `Accordion`                       | 单开/多开折叠面板、平滑高度过渡、自定义图标与细分隔变体                        | `base-ui.com/react/components/accordion`、`coss.com/ui`                        |
| **Slider**                  | `@matt-ui/ui`                      | Base UI `Slider`                          | 单滑块与双端点区间滑块（Range）、刻度标记、悬停气泡读数、键盘微调              | `base-ui.com/react/components/slider`、`dialkit.dev`                           |
| **NumberInput**             | `@matt-ui/ui`                      | Base UI `NumberField`                     | 数值输入、加减步进按钮、拖动微调（Scrub）、千分位/货币格式化、上下界约束       | `base-ui.com/react/components/number-field`、`coss.com/ui`、`dialkit.dev`      |
| **Tree**                    | `@matt-ui/ui`                      | `@ui-sdk/*`（精确锁版本，ADR-001）        | 层级树形视图、展开折叠、单选/多选、键盘上下左右/Home/End 导航、文件/目录图标槽 | `ui-sdk.dev/docs/react/components`、`reui.io`                                  |
| **ReorderList**             | `@matt-ui/motion`                  | `@ui-sdk/*` + `motion`                    | 鼠标/触摸/键盘拖拽重排列表、Escape 取消、屏幕阅读器实时播报、弹簧换位          | `ui-sdk.dev/docs/react/components`、`motion-primitives.com`                    |
| **ResizablePanels**         | `@matt-ui/ui`                      | `@ui-sdk/*`（精确锁版本，ADR-001）        | 水平/垂直可拖拽分栏面板、最小/最大尺寸约束、键盘方向键调整替代、双击重置       | `ui-sdk.dev/docs/react/components`、`motion-panels.letstri.dev`、`panelui.dev` |
| **Breadcrumb & Pagination** | `@matt-ui/ui`                      | 原生                                      | 面包屑溢出折叠菜单 + 语义化分页器                                              | `ui.shadcn.com`、`boardui.com`                                                 |

---

### 批次 M1：精选 Motion 与微交互特效（蓝图 7.3）

| 组件                             | 包                | 技术实现                          | 核心亮点                                                               | 重点参考来源                                                                        |
| -------------------------------- | ----------------- | --------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **NumberFlow**                   | `@matt-ui/motion` | `motion` + `Intl.NumberFormat`    | 金融/仪表盘滚动数字过渡，按位独立滚轮进出、支持货币与百分比            | `number-flow.barvian.me`、`transitions.dev`                                         |
| **AnimatedText**                 | `@matt-ui/motion` | `motion`                          | 逐词/逐字淡入模糊显现、文字切换轮播（Morph/Blur Reveal），遵守减弱动效 | `motion-primitives.com/docs`、`fancycomponents.dev`、`calligraph.raphaelsalaja.com` |
| **SpotlightCard / GlowBorder**   | `@matt-ui/ui`     | 纯 CSS + 指针坐标变量             | 指针跟随径向高光卡片与流动渐变边框，零额外运行时依赖                   | `animata.design`、`feralui.dev/gradients`、`great-ui.com`                           |
| **FolderTabCard**                | `@matt-ui/motion` | `motion`                          | 立体文件夹标签切换卡片与平滑布局展开                                   | `rewampui.com/components/folder-tab-card`、`motion-panels.letstri.dev`              |
| **StaggeredList / ScrollReveal** | `@matt-ui/motion` | `motion` + `IntersectionObserver` | 列表错峰入场与视口滚入显现包装器，自动清理 Observer                    | `motion-primitives.com/docs`、`kinetics.colorion.co`                                |

---

### 批次 B1：组合页面区块 Blocks（蓝图 7.4，全部由本库基础组件拼装）

> 放在独立 Blocks 目录与 Registry `registry:block` 条目，严禁复制独立样式系统。

1. **Auth / Login & Signup Block**：组合 `Card`、`Form`、`LockInput`、`OtpInput`、`Button`（参考 `blocks.so`、`shadcnblocks.com`）。
2. **Pricing Comparison Block**：周期切换 `StretchSwitch` + 滚动价格 `NumberFlow` + 推荐档钴蓝高亮（参考 `collectui.com/designs/pricing-ui-design-inspiration`、`boardui.com`）。
3. **Dashboard Shell Block**：可折叠侧边栏 + 吸顶搜索栏 + `CommandMenu` + KPI 卡片（参考 `obsidianui.dev/docs/dashboard-shell`、`shadcn-admin`、`panelui.dev`）。
4. **Settings Workspace Block**：分节表单 + `DrawCheckbox` + `SpringSelect` + `AvatarStack`（参考 `boardui.com`、`blocks.so`）。
5. **File Manager Block**：`AnimatedFileUpload` + `DataTable` + `SelectionBasket` + `Sheet` 详情抽屉（参考 `beui.dev/components/blocks/file-upload`）。

---

### 阶段 Post-v1：独立按需扩展包（不进入核心 `@matt-ui/ui`）

| 独立包                               | 选型方向                                                     | 典型组件                                                  | 参考来源                                                                                     |
| ------------------------------------ | ------------------------------------------------------------ | --------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `@matt-ui/charts`                    | ECharts 或 Recharts 适配层 + 统一 Token 主题                 | Mono Area / Bar / Line / Radial Gauge                     | `evilcharts.com`、`amicro.vercel.app/mono-charts`、`gauge-ui.dev`                            |
| `@matt-ui/maps`                      | MapLibre GL JS（动态 import）                                | 交互式暗/亮主题地图、标记聚合、路线图层                   | `mapcn.dev`                                                                                  |
| `@matt-ui/canvas` / `@matt-ui/three` | Canvas 2D / WebGL / Three.js（动态加载 + 无 WebGL 静态降级） | Audio Waves、Iridescent Orb、Holo Card、Shader Background | `aicss.dev/components/audio-waves`、`threeui.com`、`shadercn.run`、`vgpu.sh`、`canvasui.dev` |
| 专业垂直扩展（按需评估）             | 单一职责引擎封装                                             | Email / PDF / MDX / Audio 预览器                          | `emailcn.run`、`pdfcn.dev`、`mdxcn.dev`、`audiocn.dev`                                       |

---

## 四、进度总览

- [x] **阶段 0 / 1**：工程底座、Token 体系、交互引擎 POC（ADR-001）、Registry 与消费方验证
- [x] **批次 B1**：按钮与微交互操作（12 个）
- [x] **批次 F1**：核心表单（7 个）+ Token 配色/边框/圆角整体视觉重做
- [x] **批次 F2**：日期、上传与 AI 输入器（4 个：Calendar、DatePicker、AnimatedFileUpload、PromptInput）
- [x] **批次 F3**：数据表格（2 个：DataTable、AdvancedDataTable）
- [x] **批次 O1**：核心浮层（6 个：SettleModal、Sheet、DirectionalTooltip、OriginDropdown、PeekCard、MorphingDialog）
- [x] **批次 O2**：命令与辅助浮层（5 个：CommandMenu、SpotlightSearch、SelectionBasket、AvatarStack、IntroLoader）
- [x] **批次 D1**：展示与反馈基础件（9 个：Card、Badge、Alert、Toast、Progress、Skeleton、Separator、Spinner、EmptyState）
- [x] **批次 N1**：导航、布局与 P1 复杂交互（9 个：Tabs、Accordion、Slider、NumberInput、Tree、ReorderList、ResizablePanels、Breadcrumb、Pagination）
- [x] **批次 M1**：Motion 与微交互特效（5 个：NumberFlow、AnimatedText、SpotlightCard、FolderTabCard、StaggeredList）
- [x] **批次 B1**：可复用页面区块 Blocks（13 个 `registry:block`：AuthBlock、PricingBlock、DashboardShellBlock、SettingsBlock、FileManagerBlock、HeroBentoBlock、StatsOverviewBlock、TeamMembersBlock、BillingUsageBlock、ActivityFeedBlock、AiWorkspaceBlock、AiAgentCockpitBlock、OnboardingWizardBlock）
- [x] **交互与展示精修**：Sheet 默认升级四周圆角悬浮留白样式（保留 `inset=false` 贴边切换）；展示站区块目录单行全宽自适应展示 + 详情页桌面/平板/移动宽度切换器；全量 83 个组件均提供多场景交互示例（共 178 个实时场景）
- [x] **批次 AI1 & C 端高质感视觉系统升级**：参考 `aicss.dev`、`interior.dev`、`beautifului.dev`、`bencho.dev`、`calligraph`、`hextaui.com`、`rewampui.com`、`localmode.ai`，为 `@matt-ui/tokens` 注入顶部 1px 内高光（`--ui-specular`）、底部微斜切唇边（`--ui-bevel`）与多层触感阴影；新增「AI 与智能体」分类及 12 个 AI / C 端触感组件（`AiOrb`、`AudioWaves`、`AiReasoning`、`AiToolCall`、`AiApprovalCard`、`AiCitation`、`AiArtifact`、`AiTokenMeter`、`AiDiffReview`、`HoldToConfirm`、`SegmentedControl`、`AiAgentCockpitBlock`）
- [x] **批次 AI2 & 全站 C 端瓷白/曜石设计体系重构（89 个组件与区块、190 个场景实例）**：将浅色画布升级为柔润瓷白（`oklch(0.98 0.003 255)`）配陶瓷纯白悬浮卡片与宝石钴蓝信号色，深色画布升级为深曜石蓝黑配微光高光边；修复并全面重构 `CodeSnippetDeck`、`Form`、`OtpInput`、`PromptInput`、`DataTable`、`AdvancedDataTable`、`AvatarStack`、`IntroLoader`、`ResizablePanels`、`FolderTabCard`、`HeroBentoBlock`、`StatsOverviewBlock`、`FileManagerBlock` 及全部 9 款既有 AI 组件；新增 6 款旗舰 C 端 AI 组件（`AiChatThread`、`AiModelSelector`、`AiPromptGallery`、`AiAgentPlan`、`AiVoiceStage`、`AiCanvasCard`），使「AI 与智能体」分类扩展至 15 个核心组件 + 2 个全宽 AI 区块。
