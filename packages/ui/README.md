# @matt-ui/ui

matt-ui 的 React 组件。需要 React 19。

> 尚未发布到 npm。

## 使用

```tsx
import { Button } from "@matt-ui/ui";
import "@matt-ui/ui/styles.css";

export const Example = () => <Button variant="signal">Get started</Button>;
```

`styles.css` 包含 Design Token 和组件用到的全部样式，使用者的项目不需要安装 Tailwind。它不重置页面的全局样式。

默认是浅色主题。在任意祖先元素上添加 `.dark` 类或 `data-theme="dark"` 属性切换为深色。

组件带有 `"use client"` 指令，可以直接在 React Server Components 中渲染。用 Vite 等工具打包纯客户端应用时，构建日志里会出现一条「"use client" 指令被忽略」的提示，不影响运行。

## Button

触发一个操作。基于原生 `<button>`，接受它的全部属性。

| 属性      | 类型                                                                                      | 默认值      | 说明                              |
| --------- | ----------------------------------------------------------------------------------------- | ----------- | --------------------------------- |
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "destructive" \| "link" \| "signal"` | `"primary"` | 视觉变体                          |
| `size`    | `"sm" \| "md" \| "lg" \| "icon"`                                                          | `"md"`      | 尺寸；`icon` 是只含图标的方形按钮 |
| `loading` | `boolean`                                                                                 | `false`     | 加载中，见下文                    |
| `type`    | `"button" \| "submit" \| "reset"`                                                         | `"button"`  | 注意默认值与原生按钮不同          |

`signal` 使用全系统唯一的信号色，一个页面上只应该有一个，留给最需要被看到的操作。

### 与原生按钮的两处不同

- **`type` 默认是 `"button"`。** 放进表单不会被意外当作提交按钮；需要提交时写 `type="submit"`。
- **`loading` 时不可重复触发。** 点击、Enter、空格都被忽略，提交按钮也不会再次提交表单。按钮此时仍然可以聚焦，正停留在按钮上的键盘用户不会丢失焦点。

### 可访问性

- 焦点环只在键盘聚焦时出现，颜色取自 `--ui-ring`。
- `loading` 时设置 `aria-busy` 与 `aria-disabled`，旋转指示器对辅助技术隐藏。
- 用户要求减少动态效果时，旋转指示器停止旋转。
- `size="icon"` 的按钮没有可见文字，必须提供 `aria-label`。

### 图标

把 SVG 图标作为子元素传入，尺寸会统一为 16px：

```tsx
<Button>
  Continue
  <ArrowIcon aria-hidden="true" />
</Button>

<Button size="icon" variant="outline" aria-label="Search">
  <SearchIcon aria-hidden="true" />
</Button>
```
