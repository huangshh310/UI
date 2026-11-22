# Modern UI Platform：组件库与组件平台实施蓝图

> **交付对象：** Claude Code / Claude Agent\
> **文档版本：** 1.0\
> **整理日期：** 2026-11-22\
> **项目类型：** React-first、可扩展、可分发、AI-friendly 的现代 UI
> 组件库\
> **目标：**
> 从工程底座开始，逐步交付可维护的组件系统、文档站、Registry、Blocks
> 和高级视觉组件。

------------------------------------------------------------------------

## 0. 给 Claude 的执行说明

你将作为本项目的**首席前端架构师和实施工程师**。请把本文档当作产品需求、技术方案和实施约束，而不是要求一次性生成全部代码。

### 必须遵守

1.  **先检查现有工作区。**
    如果已有项目，先阅读目录、`package.json`、锁文件、配置和已有文档；不要覆盖或重建已有成果。
2.  **分阶段实施。**
    每次只完成当前阶段，完成后运行检查并汇报，再进入下一阶段。不得一次性生成所有组件。
3.  **先做架构验证，再锁定依赖。** 特别是 Vercel UI SDK 目前处于
    Beta，必须先做 POC 和兼容性验证。
4.  **版本以实施当天官方文档和 npm 元数据为准。**
    不要照抄本文档中的技术建议而安装过时版本；不要猜测 API。
5.  **不要虚构测试结果。** 只有实际运行通过的命令才能报告为通过。
6.  **不要过度抽象。**
    先实现真实需要的能力，不要为未来可能出现的需求建立大量空包、空接口或复杂插件系统。
7.  **组件必须可独立使用。** 官网、Storybook 和 Playground
    不能成为组件运行的必要依赖。
8.  **无障碍是功能要求，不是最后补丁。**
    组件必须考虑键盘、焦点、ARIA、屏幕阅读器和减少动态效果。
9.  **尊重许可证。**
    可以研究公开网站的交互和技术思路，但不能未经许可复制其专有源码、品牌、图片、插画或独特设计资产。
10. **不要擅自发布。** 未经明确批准，不执行 npm
    publish、不推送远程仓库、不部署生产环境、不创建付费服务。
11. **记录架构决策。** 重要选型写入
    `docs/architecture/`，说明背景、候选方案、验证结果、决策和后续影响。
12. **优先交付可运行成果。**
    不要只输出建议、伪代码或目录树；每个阶段都应有真实文件、命令和验证。

### 第一轮只做什么

收到本文档后，**先执行 Phase
0：仓库审计和技术选型验证**。不要直接开始批量开发组件。

Phase 0 的结果必须包括：

-   当前仓库状态和现有技术栈；
-   目标 Monorepo 结构建议；
-   依赖选型对比；
-   Vercel UI SDK / Base UI / Radix UI 的 POC 计划；
-   需要用户确认的关键决策；
-   Phase 1 的具体实施计划。

如果工作区为空，可以在 Phase 0
完成后建立最小初始化骨架；如果工作区已有项目，先提出最小侵入式改造方案。

------------------------------------------------------------------------

# 1. 产品目标与定位

## 1.1 产品愿景

开发一套现代、精致、工程化、可持续扩展的 UI 组件生态。它不只是一个
Button / Input
组件包，而是一个由设计系统、交互行为、视觉组件、页面区块、源码分发和 AI
工作流组成的平台。

目标体验参考：

-   **shadcn/ui：** 可复制、可修改的组件源码与设计系统。
-   **ReUI / beUI / COSS：** 高质量基础组件和复杂交互组件。
-   **21st.dev：** 组件发现、搜索、预览和 AI 工作流。
-   **Motion Primitives / Fancy Components：** 可复用的动画组件。
-   **ThreeUI / ShaderCN / VGPU：** 高级图形和 GPU 视觉效果。
-   **EvilCharts / MapCN：** 将成熟专业引擎封装为易用组件。
-   **Vercel Labs UI SDK：** 把复杂交互拆分成可组合的行为，让 Agent
    可以理解、选择和组合这些行为。

## 1.2 产品的四个层级

  ----------------------------------------------------------------------------------------------------
  层级                    内容                                  例子
  ----------------------- ------------------------------------- --------------------------------------
  Foundation              设计 Token、主题、基础样式和交互规范  Color、Typography、Spacing、Radius

  Components              可复用的功能组件                      Button、Dialog、Select、Upload、Data
                                                                Table

  Effects & Blocks        动效、视觉效果和完整页面区块          Animated Text、Glow、Orb、Dashboard

  Platform                文档、搜索、预览、Registry、CLI、AI   Docs、Playground、Install、MCP
  ----------------------------------------------------------------------------------------------------

## 1.3 第一版的产品范围

第一版优先交付：

-   React + TypeScript 组件库；
-   统一 Design Tokens；
-   约 20 个高质量基础组件；
-   4～6 个复杂功能组件；
-   一组轻量 Motion 组件；
-   4～6 个可复用 Blocks；
-   文档站和 Storybook；
-   npm 包构建；
-   shadcn-compatible Registry；
-   自动化测试、CI 和版本管理。

第一版**不要求**同时完成 Vue、Svelte、Solid、Web Components
全框架支持，也不要求先完成完整组件市场、用户账户、云端收藏或 AI SaaS
服务。

------------------------------------------------------------------------

# 2. 竞品研究与技术分类

不要把所有参考站点当成相同类型的组件库。它们属于不同技术层，应按类别研究。

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------
  类别                    重点参考                                                                                    研究重点
  ----------------------- ------------------------------------------------------------------------------------------- ---------------------------------------------
  基础组件与设计系统      shadcn/ui、COSS、ReUI、beUI、RareUI、EasyUI、Great                                          组件 API、状态、可访问性、主题、源码组织
                          UI、Seraui、HexTaui、BunUI、Kumo、ObsidianUI、VengeanceUI、GPUI Kit                         

  组件区块与模板          shadcnblocks、blocks.so、PanelUI、BoardUI、useLayouts、HTMLRev、shadcn-admin、Admin-panel   页面组合、Dashboard、侧边栏、表单、模板复用

  组件市场和发现          21st.dev、DesignIndex、VibeIndex、Libraries.dev、Shoogle、UI Maxxing、VibePrompts           分类、搜索、预览、源码分发、AI 集成

  React 动画              Motion Primitives、Fancy Components、Animata、Transitions.dev、NumberFlow、Kinetics、Motion 布局过渡、手势、弹簧、文字动画
                          Panels、Morph UI                                                                            

  CSS 动效和微交互        Animated Buttons、Evil Buttons、Loading、Butter Nav、Typehug、Calligraph、Neat              CSS Animation、hover、光效、文字与导航动效
                          Annotations、Interior Ripple                                                                

  3D / Shader / GPU       ThreeUI、VGPU、ShaderCN、MetalForge、Shaders.com、ThreeJSAssets、Orb、Holo Card Studio      Three.js、React Three
                                                                                                                      Fiber、WebGL、WebGPU、GLSL、WGSL

  Canvas / SVG / 视觉素材 CanvasUI、CodedVisuals、AICSS、Drawably、Blobatar、Bloub、FeralUI、Backgrounds              SVG、Canvas、粒子、渐变、滤镜、背景
                          Supply、Libraries.dev Orbs                                                                  

  图表和数据展示          EvilCharts、Mono Charts、Gauge UI                                                           SVG / Canvas 渲染、数据接口、图表配置

  地图与专业组件          MapCN、PDFCN、EmailCN、AudioCN、MDXCN、MCPCN、MailDev                                       专业引擎封装、复杂交互 API

  产品交互与编辑器        DialKit、Tempad、LocalMode、Spell、CRM AI Agent、MyGo                                       编辑器、窗口系统、AI 产品交互

  设计语言和排版          Fluid Functionalism、GetDesign、Design.how、TypeUI、RemoCN、Spectrum UI                     设计 Token、字体、排版、视觉体系
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------

### 研究方法

第一轮只深度拆解 30
个代表性组件，不要平均研究全部网站。每个组件建立一张技术档案：

-   组件名称、来源 URL、访问日期；
-   DOM / 组件层级；
-   视觉样式和 Token；
-   交互状态与状态转换；
-   键盘行为、焦点行为、ARIA；
-   使用 CSS、SVG、Canvas、WebGL 还是 WebGPU；
-   动画引擎；
-   Props、Events、Slots / Compound Parts；
-   依赖和包体积；
-   响应式策略；
-   SSR / Hydration 行为；
-   许可证和资产复用限制；
-   我们可以借鉴的设计原则；
-   我们需要原创实现的部分。

不要因为某个效果看起来很复杂就默认它使用 Three.js。先检查 DOM、CSS、SVG
和 Canvas，再判断是否真的需要 GPU。

------------------------------------------------------------------------

# 3. 核心技术选型

以下是推荐候选，不是不可变的版本锁定。实施时必须查阅官方文档、维护状态和当前兼容性。

  -----------------------------------------------------------------------------------------
  层级                    首选候选                   备选 / 说明
  ----------------------- -------------------------- --------------------------------------
  语言                    TypeScript                 开启严格类型检查

  UI 框架                 React                      第一版只承诺 React

  Monorepo                pnpm workspaces +          避免不必要的多仓库
                          Turborepo                  

  文档站                  Next.js + MDX              文档与组件包分离

  样式                    Tailwind CSS + CSS         优先设计 Token，不写死颜色
                          Variables                  

  组件变体                CVA 或同类轻量工具         统一 variant / size

  类名工具                clsx + tailwind-merge      统一 `cn()`

  交互行为                Vercel UI SDK / Base UI /  不要在同一交互原语中混用多套行为引擎
                          Radix 评估后选型           

  动画                    Motion                     GSAP 用于确有需要的时间轴或复杂序列

  图表                    Recharts 或 ECharts 适配层 按数据量和定制需求选择

  地图                    MapLibre GL                独立 package，按需加载

  3D                      Three.js + React Three     独立 package，按需加载
                          Fiber                      

  单元测试                Vitest + Testing Library   配合 user-event

  浏览器测试              Playwright                 验证真实浏览器行为

  可访问性测试            axe-core / Storybook a11y  自动检查 + 人工键盘验证

  组件开发工作台          Storybook                  Stories 是组件状态用例

  版本管理                Changesets                 管理多包版本和 Changelog

  CI                      GitHub Actions             lint、typecheck、test、build

  包构建                  Vite Library Mode          输出 ESM、类型和 CSS
                          或经验证的维护中构建工具   

  Registry                shadcn Registry 协议       第一版优先复用现有 CLI
  -----------------------------------------------------------------------------------------

### 3.1 选型原则

-   React、React DOM 等框架依赖通常应作为
    `peerDependencies`，避免用户项目出现重复 React。
-   Three.js、MapLibre、ECharts 等专业依赖必须按需安装，不能污染核心 UI
    包。
-   Motion 不应成为最简单 Button 的强制依赖。
-   不要为了"技术先进"同时引入 GSAP、Motion、React Spring 三套动画引擎。
-   不要让文档站直接 import 私有源码路径；通过 workspace package
    的公开入口使用组件。
-   所有 package 必须定义清楚 exports、类型声明、CSS 入口和
    peerDependencies。

------------------------------------------------------------------------

# 4. Vercel Labs UI SDK：重点研究与架构决策

官方项目：

-   GitHub：<https://github.com/vercel-labs/ui>
-   文档：<https://ui-sdk.dev/>
-   官方安装示例：`npm install @ui-sdk/react @ui-sdk/core`
-   官方 Agent
    Skill：`npx skills@latest add vercel-labs/ui --skill ui-sdk`

## 4.1 它的定位

Vercel UI SDK
不是传统意义上的完整视觉组件库。它把键盘导航、焦点管理、选择、弹出层、关闭行为、拖放和
ARIA 等复杂交互抽象为可组合的 behaviors。

官方示例采用：

-   `definePrimitive()` 定义行为原语；
-   `createParts()` 在框架中生成可组合的组件 parts；
-   `@ui-sdk/core` 提供核心行为；
-   `@ui-sdk/react`、`@ui-sdk/vue`、`@ui-sdk/svelte`、`@ui-sdk/solid`、`@ui-sdk/web`
    提供框架适配。

官方站点当前展示 50+ behaviors。常见行为包括：

-   `createRovingFocus`
-   `createTypeahead`
-   `createPopup`
-   `createSelection`
-   `createReorder`
-   `createResize`
-   `createViewport`
-   `createVirtualizer`

注意：UI SDK 当前为 Beta，API、行为和文档可能变化。不得在未经 POC
的情况下将其作为整个生产组件库唯一且不可替换的基础。

## 4.2 与其他底座的区别

  -----------------------------------------------------------------------------------------------------
  方案              定位              优点                         风险 / 代价
  ----------------- ----------------- ---------------------------- ------------------------------------
  Vercel UI SDK     行为组合与        行为颗粒度细、跨框架、适合   Beta，API 变化风险，需要验证
                    Agent-first       Agent 组合                   

  Base UI           Headless React    适合构建可定制 React 组件    React
                    primitives                                     优先，组件行为仍以其既定原语为中心

  Radix UI          Headless React    生态成熟、shadcn 兼容案例多  需要遵循其组件模型，跨框架不是目标
                    primitives                                     
  -----------------------------------------------------------------------------------------------------

## 4.3 必须做的 POC

在正式选型前，使用相同需求分别实现或验证以下交互：

1.  Select：单选、键盘导航、typeahead、Escape、Outside Click。
2.  Combobox：输入过滤、空状态、异步选项、焦点管理。
3.  Tree：层级展开、方向键、Home / End、选择状态。
4.  Dialog / Popover：焦点陷阱、焦点恢复、Portal、滚动锁定。
5.  Drag & Drop / Reorder：鼠标、触摸、键盘替代操作。
6.  SSR / Hydration：Next.js App Router 环境。
7.  Agent usability：Claude 能否通过 UI SDK Skill
    正确组合行为，生成可维护组件。

对比维度：

-   ARIA 语义正确性；
-   键盘和屏幕阅读器行为；
-   受控 / 非受控 API；
-   SSR / Hydration；
-   Portal / Focus 管理；
-   触摸和移动端；
-   组件组合自由度；
-   包体积和依赖数量；
-   调试和测试难度；
-   API 稳定性、维护活跃度；
-   Claude Agent 生成代码的正确率和返工成本。

## 4.4 预设决策

-   第一版架构必须保留"交互行为"和"视觉样式"的分离。
-   UI SDK 作为高优先级研究对象，先通过 POC 验证。
-   如果 POC 达到稳定性、可访问性和维护性标准，可以将 UI SDK
    用于新建的复杂行为原语。
-   如果 UI SDK Beta 风险过高，则优先选 Base UI 或 Radix 作为 React
    交互底座。
-   不要在同一个 Select / Dialog 中同时混用 UI SDK、Base UI 和 Radix。
-   原生 `<button>`、`<input>` 等简单语义元素优先使用原生
    HTML，不要为所有元素引入 Headless 库。
-   记录最终决策到 `docs/architecture/ADR-001-interaction-engine.md`。

------------------------------------------------------------------------

# 5. Monorepo 工程结构

建议目标结构如下。实际初始化时只创建当前阶段需要的
package，不要为了目录完整而创建大量空包。

``` text
ui-platform/
├── apps/
│   ├── docs/                 # Next.js + MDX 文档站
│   ├── storybook/            # Storybook 工作台（可独立配置）
│   └── playground/           # 在线 Playground，后期建设
│
├── packages/
│   ├── tokens/               # Design Tokens、主题 CSS
│   ├── utils/                # cn、通用工具
│   ├── ui/                   # 基础 React 组件
│   ├── motion/               # 动画组件，独立依赖
│   ├── charts/               # 图表适配层，后期
│   ├── maps/                 # 地图适配层，后期
│   ├── three/                # Three.js / Shader，后期
│   ├── registry/             # Registry schema、构建和校验
│   └── cli/                  # 自有 CLI，后期；第一版可复用 shadcn CLI
│
├── registry/
│   └── default/
│       ├── ui/
│       ├── blocks/
│       ├── effects/
│       ├── hooks/
│       └── lib/
│
├── docs/
│   └── architecture/         # ADR、架构图、技术研究记录
│
├── scripts/
├── tests/
├── .changeset/
├── .github/workflows/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── eslint.config.*
├── prettier.config.*
└── README.md
```

## 5.1 依赖方向

建议依赖方向：

``` text
tokens / utils
      ↓
   core ui
      ↓
 blocks / templates

motion / charts / maps / three
      ↓
  可按需依赖 tokens / ui

docs / storybook / registry
      ↓
消费并展示各个 package
```

约束：

-   `ui` 不依赖 `three`、`maps`、`charts`。
-   `tokens` 不依赖 React。
-   `utils` 不依赖具体业务组件。
-   `docs` 不允许成为 `ui` 的运行时依赖。
-   `motion`、`charts`、`maps`、`three` 是可选扩展包。
-   Registry 的源码安装方式不能要求用户安装完整文档站。

------------------------------------------------------------------------

# 6. Design System 与组件 API 规范

## 6.1 Design Tokens

先建立语义化 Token，不要在组件里到处写十六进制颜色。

建议目录：

``` text
packages/tokens/
├── src/
│   ├── colors.css
│   ├── typography.css
│   ├── spacing.css
│   ├── radius.css
│   ├── shadows.css
│   ├── motion.css
│   ├── z-index.css
│   └── themes.css
└── package.json
```

至少支持：

-   Light / Dark；
-   Background / Foreground；
-   Primary / Secondary / Accent；
-   Muted / Border / Input / Ring；
-   Success / Warning / Destructive / Info；
-   字体族、字号、字重、行高；
-   spacing、radius、shadow；
-   duration、easing、reduced motion；
-   z-index 层级。

CSS 变量建议统一前缀，例如 `--ui-*`，避免污染宿主项目。

Tailwind 版本应在实施时核对。若采用 Tailwind
v4，使用其官方主题变量机制映射设计 Token；不要把 Tailwind v3 与 v4
配置混用。

## 6.2 统一 API 约定

交互组件尽可能遵循：

-   受控：`value` + `onValueChange`；
-   非受控：`defaultValue`；
-   `disabled`、`readOnly`、`required`；
-   `name`、`id`、`aria-*`；
-   `className`；
-   统一的 `size`、`variant`；
-   明确的 TypeScript Props；
-   合理的 `data-slot`、`data-state`；
-   Compound Components 用于复杂组合。

不要强制所有组件都拥有所有 Props。只在语义合理时采用。

## 6.3 Button 作为规范示例

建议 API：

``` tsx
<Button
  variant="primary"
  size="md"
  disabled={false}
>
  Save changes
</Button>
```

Button 至少支持：

-   variant：primary、secondary、outline、ghost、destructive、link；
-   size：sm、md、lg、icon；
-   disabled；
-   loading（如果支持，必须明确加载时是否禁止重复触发）；
-   icon / icon-only；
-   `asChild` 或 polymorphic 能力只有在确实需要并完成类型验证后再引入；
-   focus-visible、hover、active、disabled；
-   键盘可用性和可见焦点。

## 6.4 组件质量要求

每个组件至少检查：

-   Default；
-   Hover；
-   Active；
-   Focus-visible；
-   Disabled；
-   Loading（适用时）；
-   Empty / Error（适用时）；
-   Light / Dark；
-   Mobile；
-   Reduced Motion；
-   Keyboard；
-   Screen reader；
-   SSR / Hydration（适用时）。

------------------------------------------------------------------------

# 7. 组件研发清单

## 7.1 P0：基础组件

第一批建议约 20 个：

**表单与输入**

-   Button
-   Input
-   Textarea
-   Checkbox
-   Radio Group
-   Switch
-   Select
-   Label

**交互与导航**

-   Dialog
-   Popover
-   Tooltip
-   Dropdown Menu
-   Tabs
-   Accordion
-   Toast / Sonner adapter（选型后）

**展示与反馈**

-   Card
-   Badge
-   Avatar
-   Skeleton
-   Separator
-   Progress
-   Spinner
-   Alert

实际数量可根据质量和依赖情况调整。不要为了凑数量而牺牲完整性。

## 7.2 P1：复杂功能组件

-   File
    Upload：拖拽、文件选择、预览、限制、删除、重试、上传进度、错误状态。
-   Data Table：排序、筛选、分页、列显隐、行选择、空状态。
-   Calendar / Date Picker：日期、范围、禁用日期、本地化。
-   Command：搜索、键盘导航、分组、快捷键。
-   Combobox：输入过滤、异步选项、空状态。
-   Tree：层级展开、键盘导航、选择。
-   Resizable：面板拖动、键盘替代、边界约束。
-   Slider / Range Slider：鼠标、触摸、键盘。
-   Number Input：输入、步进、边界。
-   OTP Input：粘贴、焦点移动、错误状态。

File Upload 的上传网络请求应通过 `uploadAdapter`
或回调注入，组件本身负责交互与状态，不绑定某个云存储供应商。

Data Table 可研究 TanStack Table；Calendar
可研究成熟日期逻辑库。不要把复杂业务逻辑从零重复造轮子。

## 7.3 P2：Motion 与视觉效果

轻量 CSS：

-   Shimmer；
-   Glow；
-   Gradient Border；
-   Spotlight；
-   Hover Card；
-   Animated Underline；
-   Ripple；
-   Skeleton Variants。

Motion：

-   Animated Text；
-   Number Flow；
-   Staggered List；
-   Layout Transition；
-   Scroll Reveal；
-   Drag / Spring；
-   Shared Layout。

高级 GPU：

-   Liquid Glass；
-   3D Orb；
-   Particle Background；
-   Shader Background；
-   Iridescent Material；
-   3D Card。

高级 GPU 组件放在独立 `@scope/three` 或类似包中，动态加载，提供无 WebGL
时的静态 fallback，并遵循 `prefers-reduced-motion`。

## 7.4 Blocks

第一批页面区块：

-   Login / Signup；
-   Pricing；
-   Dashboard Shell；
-   Settings；
-   File Manager；
-   Analytics Dashboard。

Blocks 应尽量由基础组件组合，不要复制一套独立样式系统。

------------------------------------------------------------------------

# 8. Registry、安装和分发

第一版支持两种方式：

## 8.1 npm 安装

``` bash
pnpm add @your-scope/ui
```

使用示例：

``` tsx
import { Button } from "@your-scope/ui";
import "@your-scope/ui/styles.css";
```

## 8.2 源码安装

第一版优先兼容 shadcn Registry 协议，不要急着自研 CLI。

示例形式：

``` bash
pnpm dlx shadcn@latest add @your-scope/button
```

必须先查阅 shadcn 官方 Registry 文档，确认当前 Registry JSON
Schema、文件类型、依赖、registryDependencies、CSS Vars 和 Tailwind
配置字段。不要自行猜测字段。

Registry 应包含：

-   组件名称；
-   类型：registry:ui / registry:block / registry:hook 等，按官方
    schema；
-   文件路径和目标路径；
-   npm dependencies；
-   registryDependencies；
-   CSS Variables；
-   Tailwind 配置（确有需要时）；
-   许可证和作者信息；
-   版本和兼容范围。

第一版只需要静态 JSON Registry
和构建校验。用户登录、收藏、付费、云端同步等不是 v1 的必要条件。

------------------------------------------------------------------------

# 9. 文档站、Storybook 与 Playground

## 9.1 文档站

Next.js + MDX。每个组件文档至少包含：

1.  组件说明；
2.  交互预览；
3.  安装命令；
4.  基础用法；
5.  Variants；
6.  Props；
7.  组合用法；
8.  Accessibility；
9.  依赖；
10. 版本和变更记录。

## 9.2 Storybook

Storybook 负责开发期状态展示和测试，不替代用户文档站。

每个组件建立 Stories，覆盖不同状态和组合。

## 9.3 Playground

Playground 后期实现。可评估 Sandpack、WebContainers 或隔离 iframe。

安全要求：

-   用户输入代码不能在主站同源环境中无隔离执行；
-   对第三方组件源码展示和预览做沙箱隔离；
-   不要把服务端密钥注入浏览器；
-   预览失败时提供静态 Demo 或错误提示。

------------------------------------------------------------------------

# 10. 测试、可访问性和质量门禁

  类型         工具候选                           验证内容
  ------------ ---------------------------------- --------------------
  单元测试     Vitest                             状态、函数、边界
  组件测试     Testing Library + user-event       点击、输入、键盘
  浏览器 E2E   Playwright                         浏览器真实交互
  无障碍       axe-core / Storybook a11y          ARIA、对比度、标签
  视觉回归     Chromatic 或自建截图对比           样式意外变化
  类型检查     TypeScript                         Props 和 exports
  构建验证     package build + consumer fixture   包能被真实项目安装

### 最低质量门禁

每次 PR 至少运行：

``` bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

如果仓库脚本命名不同，以实际 `package.json` 为准。

关键交互组件必须有键盘测试。自动 axe
检查不能替代真实键盘和屏幕阅读器测试。

------------------------------------------------------------------------

# 11. 发布、版本和 CI/CD

建议使用 Changesets：

1.  组件变更时添加 Changeset；
2.  PR 自动运行 lint、typecheck、test、build；
3.  合并后生成版本和 Changelog；
4.  经批准后发布 npm；
5.  Registry 和文档同步更新。

CI 不应包含未经批准的生产部署或 npm 发布步骤。

发布前验证：

-   ESM 入口；
-   类型声明；
-   CSS 文件；
-   exports；
-   peerDependencies；
-   Tree-shaking；
-   React 单实例；
-   package README；
-   LICENSE；
-   真实消费项目安装；
-   npm pack 内容检查。

------------------------------------------------------------------------

# 12. 性能、安全与许可证

## 12.1 性能

-   基础包避免大型依赖；
-   专业引擎按需加载；
-   3D 和地图动态 import；
-   尽量避免不必要的客户端组件；
-   避免在组件顶层访问 `window` / `document`；
-   大列表使用虚拟化；
-   动画避免不必要的 layout thrashing；
-   对图片、Canvas、WebGL 提供尺寸和资源释放策略；
-   组件卸载时清理监听器、Observer、RAF 和 GPU 资源。

## 12.2 安全

-   Registry 文件来源可信、构建过程可审计；
-   外部代码安装前展示依赖和文件变更；
-   Playground 使用沙箱；
-   不在客户端暴露密钥；
-   依赖扫描和锁文件检查；
-   不执行用户提供的任意脚本。

## 12.3 许可证

-   对所有第三方依赖记录许可证；
-   对参考网站只借鉴公开的技术模式和交互思想；
-   不复制受版权保护的源码、品牌资产、插画、图标集或付费内容；
-   Registry 的每个外部组件必须有来源和授权记录。

------------------------------------------------------------------------

# 13. 16 周路线图

以一名主力开发者、AI
辅助为估算前提；这是计划值，不是交付承诺。复杂度、选型和现有仓库状态可能改变工期。

  -------------------------------------------------------------------------------------------
  周期                    阶段                    主要交付
  ----------------------- ----------------------- -------------------------------------------
  第 1 周                 研究和选型              竞品档案、技术对比、UI SDK POC 方案、ADR

  第 2～3 周              工程底座                Monorepo、Tokens、Utils、Lint、TS、CI

  第 4～6 周              基础组件                Button、Input、Dialog、Select 等；Stories
                                                  和测试

  第 7～8 周              复杂组件                Upload、Data Table、Calendar、Command、Tree

  第 9～10 周             动画系统                Motion 包、Shimmer、Glow、Animated
                                                  Text、Number Flow

  第 11～12 周            Blocks                  Login、Pricing、Dashboard、Settings、File
                                                  Manager

  第 13～14 周            文档和 Registry         Next.js Docs、MDX、组件预览、Registry JSON

  第 15～16 周            发布准备                E2E、a11y、视觉测试、Changesets、npm 包验证
  -------------------------------------------------------------------------------------------

v1.0 之后再做：

-   Charts；
-   Maps；
-   Three.js / Shader；
-   自有 CLI；
-   组件搜索市场；
-   MCP；
-   AI Agent 组件生成与操作能力；
-   多框架适配。

------------------------------------------------------------------------

# 14. 分阶段验收标准

## Phase 0：仓库审计与选型

-   [ ] 检查现有仓库，不覆盖已有文件；
-   [ ] 输出技术栈和风险清单；
-   [ ] 完成 UI SDK / Base UI / Radix 比较计划；
-   [ ] 核实官方文档和包状态；
-   [ ] 输出 ADR 草案；
-   [ ] 输出下一阶段实施计划。

## Phase 1：工程底座

-   [ ] pnpm workspace 可安装；
-   [ ] Turborepo 任务可运行；
-   [ ] TypeScript strict；
-   [ ] ESLint / Prettier；
-   [ ] `tokens`、`utils`、`ui` 基础 package；
-   [ ] CI 可运行 lint / typecheck / test / build；
-   [ ] README 和架构文档。

## Phase 2：第一个可发布组件

-   [ ] Button 有完整 API 和变体；
-   [ ] Light / Dark 正常；
-   [ ] Focus / Disabled 正常；
-   [ ] 单元测试通过；
-   [ ] Storybook 展示；
-   [ ] npm 包构建；
-   [ ] 在独立 consumer fixture 中安装成功。

## Phase 3：交互组件体系

-   [ ] Dialog / Popover / Select；
-   [ ] 键盘导航；
-   [ ] 焦点管理和恢复；
-   [ ] ARIA 检查；
-   [ ] SSR / Hydration 检查；
-   [ ] 组件 API 一致。

## Phase 4：复杂组件和动效

-   [ ] File Upload 使用 adapter；
-   [ ] Data Table 有排序、筛选和分页；
-   [ ] Motion 独立依赖；
-   [ ] Reduced Motion 支持；
-   [ ] 组件卸载时清理资源。

## Phase 5：文档和 Registry

-   [ ] 文档站可以浏览组件；
-   [ ] 组件 Demo 可运行；
-   [ ] 安装命令可用；
-   [ ] Registry JSON 通过官方 schema 验证；
-   [ ] 源码安装到干净的测试项目成功。

## Phase 6：v1.0 发布准备

-   [ ] 全部公开 exports 明确；
-   [ ] 类型声明可用；
-   [ ] ESM 和 CSS 正常；
-   [ ] Playwright E2E；
-   [ ] a11y 测试；
-   [ ] 视觉回归；
-   [ ] Changelog；
-   [ ] npm pack 检查；
-   [ ] 发布需用户批准。

------------------------------------------------------------------------

# 15. Claude 的实施工作流

每个阶段遵循以下顺序：

1.  **Inspect：** 读取当前代码和官方文档。
2.  **Plan：** 列出本阶段目标、文件变更和风险。
3.  **Implement：** 小步实现，避免一次改动大量无关文件。
4.  **Verify：** 实际运行 lint、typecheck、test、build 等适用命令。
5.  **Review：** 检查 API、可访问性、性能、依赖和许可证。
6.  **Document：** 更新 README、组件文档和 ADR。
7.  **Report：** 汇报完成内容、实际测试结果、未解决问题和下一步。

每次阶段汇报格式：

``` text
阶段：
本次目标：
完成的文件：
关键架构决策：
运行过的命令：
测试结果：
未解决问题：
风险：
下一阶段建议：
需要用户确认的事项：
```

如果某个官方 API
或依赖版本无法确认，不要编造。先查看官方文档、仓库源码和包声明；仍无法确认时，记录阻塞原因并提出选项。

------------------------------------------------------------------------

# 16. 给 Claude Code 的第一条执行 Prompt

将以下内容与本文件一起提供给 Claude：

``` text
你现在是这个 UI Platform 项目的首席前端架构师和实现工程师。

请先完整阅读 UI-Platform-Implementation-Blueprint.md。

重要：不要一次性实现整套组件库。请严格按照文档的 Phase 0 开始。

第一步：
1. 检查当前工作区和现有文件。
2. 检查 Node、包管理器、Git、现有 package.json 和锁文件。
3. 判断这是空仓库还是已有项目。
4. 阅读与当前任务相关的官方文档，尤其是：
   - https://github.com/vercel-labs/ui
   - https://ui-sdk.dev/
   - https://ui.shadcn.com/docs/registry
   - https://base-ui.com/
   - https://www.radix-ui.com/
5. 重点研究 Vercel UI SDK 的：
   - @ui-sdk/core
   - @ui-sdk/react
   - definePrimitive
   - createParts
   - behaviors
   - Agent Skill
6. 对 Vercel UI SDK、Base UI、Radix UI 做交互底座比较。
7. 不要未经验证就同时引入多套交互引擎。
8. 先输出架构审计、依赖选型表、风险和 ADR 草案。

如果可以运行命令，请用真实命令验证，不要虚构结果。
如果仓库为空，可以提出初始化计划，但先不要批量创建组件。
如果仓库已有代码，必须先提出最小侵入式方案。

Phase 0 完成后暂停，给我报告并等待确认。
```

------------------------------------------------------------------------

# 17. 官方技术资料

实施前应优先阅读官方文档，具体 API 以最新版本为准。

## 核心架构

-   Vercel Labs UI SDK：<https://github.com/vercel-labs/ui>
-   UI SDK 文档：<https://ui-sdk.dev/>
-   shadcn/ui：<https://ui.shadcn.com/>
-   shadcn Registry：<https://ui.shadcn.com/docs/registry>
-   Base UI：<https://base-ui.com/>
-   Radix UI：<https://www.radix-ui.com/>

## 工程化

-   pnpm：<https://pnpm.io/>
-   Turborepo：<https://turbo.build/repo/docs>
-   TypeScript：<https://www.typescriptlang.org/docs/>
-   Vite：<https://vite.dev/guide/build.html#library-mode>
-   Next.js：<https://nextjs.org/docs>
-   Storybook：<https://storybook.js.org/docs>
-   Vitest：<https://vitest.dev/>
-   Playwright：<https://playwright.dev/docs/intro>
-   Testing Library：<https://testing-library.com/docs/>
-   Changesets：<https://github.com/changesets/changesets>
-   Tailwind CSS：<https://tailwindcss.com/docs>

## 动画和图形

-   Motion：<https://motion.dev/>
-   GSAP：<https://gsap.com/docs/>
-   Three.js：<https://threejs.org/docs/>
-   React Three Fiber：<https://r3f.docs.pmnd.rs/>
-   WebGPU：<https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API>

## 专业组件引擎

-   TanStack Table：<https://tanstack.com/table/latest>
-   Recharts：<https://recharts.org/>
-   Apache ECharts：<https://echarts.apache.org/>
-   MapLibre GL JS：<https://maplibre.org/maplibre-gl-js/docs/>

------------------------------------------------------------------------

# 18. 用户提供的参考网站索引

以下是用户提供的研究链接，已按研究方向归类；重复链接已合并。它们是研究参考，不代表都需要安装或依赖。

## 18.1 基础组件、设计系统和组件集合

-   <https://reui.io/>
-   <https://www.beui.dev/>
-   <https://beui.dev/components/blocks/file-upload>
-   <https://www.rareui.com/>
-   <https://www.rareui.com/components>
-   <https://ui.shadcn.com/>
-   <https://coss.com/ui>
-   <https://www.easyui.site/>
-   <https://www.easyui.site/components>
-   <https://www.great-ui.com/components>
-   <https://seraui.com/>
-   <https://www.hextaui.com/>
-   <https://www.bunui.xyz/components>
-   <https://kumo-ui.com/>
-   <https://www.obsidianui.dev/components>
-   <https://www.temp.obsidianui.dev/components#component-gallery>
-   <https://www.obsidianui.dev/docs/dashboard-shell>
-   <https://www.vengeanceui.com/>
-   <https://gpui-kit.com/>
-   <https://elygpui.com/components/>
-   <https://ui.halaska.com/>
-   <https://ui.spectrumhq.in/docs>
-   <https://hamur.dev/ui/components/avatar>
-   <https://ui.nexvyn.dev/components>
-   <https://ui.devclubxnst.online/components>
-   <https://www.devl.dev/>
-   <https://www.opensourceui.in/>
-   <https://www.vibeui.online/>
-   <https://www.ui.watermelon.sh/>
-   <https://ui.watermelon.sh/home>
-   <https://www.canvasui.dev/components>
-   <https://canvasui.dev/docs>
-   <https://www.beautifului.dev/>
-   <https://www.shadcncraft.com/components>
-   <https://www.rewampui.com/components>
-   <https://www.rewampui.com/components/folder-tab-card>
-   <https://www.chanhdai.com/components>
-   <https://www.vue-bits.dev/>
-   <https://www.dialkit.dev/>
-   <https://www.aicss.dev/>
-   <https://www.aicss.dev/components/audio-waves>
-   <https://www.typeui.sh/ui-foundations/configurator>

## 18.2 Blocks、模板、Dashboard 和页面灵感

-   <https://www.shadcnblocks.com/>
-   <https://blocks.so/>
-   <https://www.panelui.dev/>
-   <https://www.boardui.com/>
-   <https://uselayouts.com/>
-   <https://uselayouts.com/browse>
-   <https://htmlrev.com/free-nextjs-templates.html>
-   <https://github.com/satnaing/shadcn-admin>
-   <https://github.com/jubayer910/Admin-panel>
-   <https://dev.cards/>
-   <https://collectui.com/designs/pricing-ui-design-inspiration>
-   <https://ui.soralabs.studio/catalog>
-   <https://www.elygpui.com/components/>
-   <https://www.akshatsingh.site/>
-   <https://rahulbhadoriya.com/#top>
-   <https://emmanuelngoka.work/>
-   <https://astryx.atmeta.com/>
-   <https://crm-ai-agent-tau.vercel.app/>

## 18.3 组件市场、索引和 AI 开发工作流

-   <https://21st.dev/community/components>
-   <https://www.designindex.xyz/ui>
-   <https://vibeindex.dev/>
-   <https://libraries.dev/>
-   <https://libraries.dev/orbs>
-   <https://uimaxx.ing/#library>
-   <https://shoogle.dev/>
-   <https://shoogle.dev/search?tab=explore>
-   <https://vibeprompts.dev/>
-   <https://vibecafe.ai/usage>
-   <https://spell.sh/>
-   <https://localmode.ai/>
-   <https://www.mcpcn.dev/>
-   <https://ui-sdk.dev/docs/react/components>
-   <https://github.com/vercel-labs/ui>

## 18.4 动画、微交互和 Motion

-   <https://motion-primitives.com/docs>
-   <https://www.fancycomponents.dev/docs/components/text/breathing-text>
-   <https://number-flow.barvian.me/>
-   <https://transitions.dev/>
-   <https://animata.design/>
-   <https://kinetics.colorion.co/#library>
-   <https://animatedbuttons.colorion.co/>
-   <https://www.evilbuttons.com/>
-   <https://loading.daniasyrofi.com/>
-   <https://motion-panels.letstri.dev/>
-   <https://butter-nav.vercel.app/>
-   <https://neat-annotations.syabro.com/>
-   <https://interior.dev/docs/ripple>
-   <https://typehug.aliszu.com/>
-   <https://calligraph.raphaelsalaja.com/>
-   <https://www.feralui.dev/gradients>
-   <https://www.morph-ui.anmol16.workers.dev/>
-   <https://vue-bits.dev/>

## 18.5 3D、Shader、Canvas 和视觉效果

-   <https://vgpu.sh/examples/earth>
-   <https://threeui.com/three-js/woven-cloth/iridescent>
-   <https://metalforge.xyz/editor>
-   <https://canvasui.dev/components>
-   <https://codedvisuals.com/visuals>
-   <https://www.shaders.com/>
-   <https://www.shadercn.run/docs/components>
-   <https://threejsassets.com/assets/free>
-   <https://github.com/EverettFish/holo-card-studio>
-   <https://blobatar.dev/?expression=mad>
-   <https://bloub.vercel.app/>
-   <https://drawably.dev/>
-   <https://backgrounds.supply/freebies>
-   <https://www.limeplay.winoffrg.dev/>
-   <https://www.aicss.dev/components/audio-waves>
-   <https://lersent001.github.io/orb/>

## 18.6 图表、地图和数据可视化

-   <https://www.mapcn.dev/>
-   <https://amicro.vercel.app/mono-charts>
-   <https://evilcharts.com/>
-   <https://evilcharts.com/docs/echarts/bar-chart/blocks>
-   <https://www.gauge-ui.dev/>
-   <https://www.gauge-ui.dev/#examples>

## 18.7 专业组件和开发工具

-   <https://www.emailcn.run/docs>
-   <https://www.pdfcn.dev/>
-   <https://www.mdxcn.dev/>
-   <https://www.audiocn.dev/>
-   <https://maildev.github.io/maildev/>
-   <https://mygo.egoist.dev/docs/windows#flyouts>
-   <https://tempad.dev/#connect>
-   <https://skills.wheresryan.sh/anatomy>
-   <https://github.com/qunqin24/Pulse/blob/main/README.zh-CN.md>

## 18.8 设计语言、排版和其他视觉参考

-   <https://www.fluidfunctionalism.com/>
-   <https://getdesign.md/>
-   <https://remocn.dev/docs/typography>
-   <https://design.how/systems/quartz>
-   <https://www.typeui.sh/ui-foundations/configurator>
-   <https://torph.lochie.me/>
-   <https://squig.sh/>
-   <https://pele.run/>
-   <https://bencho.dev/>
-   <https://sv-chan.vercel.app/>
-   <https://www.vibeui.online/>
-   <https://www.limeplay.winoffrg.dev/>

------------------------------------------------------------------------

# 19. 最终原则

这个项目的成功标准不是组件数量，也不是首页有多炫。

真正的成功标准是：

1.  基础组件 API 一致、可访问、可测试；
2.  复杂交互有清晰的行为层和状态模型；
3.  设计 Token 能统一控制整个系统；
4.  npm 和 Registry 两种分发方式都可靠；
5.  组件不依赖官网也能独立运行；
6.  动画、图表、地图和 3D 能按需扩展；
7.  文档、Demo、测试和版本发布可以持续维护；
8.  Claude 等 AI Agent 能理解组件 API、查询
    Registry、组合组件，并通过自动化测试验证结果；
9.  每次技术选型都经过验证，而不是因为某个网站流行就盲目引入。

**从 Phase 0 开始。先做仓库审计和交互底座
POC，再搭建工程底座。不要跳过验证直接批量生成组件。**
