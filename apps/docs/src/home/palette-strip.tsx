/**
 * 首页的色彩条：直接用 Token 变量着色的色块。
 * 切换主题时色块跟着变化，只有信号色保持不变。
 */

/** 展示的语义色：Token 变量名、标注，以及在网格中的相对宽度 */
const SWATCHES = [
  { token: "--ui-background", label: "background", grow: "md:col-span-2" },
  { token: "--ui-card", label: "card", grow: "" },
  { token: "--ui-muted", label: "muted", grow: "" },
  { token: "--ui-accent", label: "accent", grow: "" },
  { token: "--ui-primary", label: "primary", grow: "md:col-span-2" },
  { token: "--ui-signal", label: "signal", grow: "md:col-span-3" },
  { token: "--ui-destructive", label: "destructive", grow: "" },
  { token: "--ui-success", label: "success", grow: "" },
];

/** 标注文字的颜色：浅色块上用前景色，深色或彩色块上用各自配对的前景 Token */
const labelColor = (token: string) =>
  ["--ui-primary", "--ui-signal", "--ui-destructive", "--ui-success"].includes(token)
    ? `var(${token}-foreground)`
    : "var(--ui-foreground)";

export const PaletteStrip = () => (
  <ul className="grid grid-cols-2 overflow-hidden rounded-lg border border-border md:grid-cols-12">
    {SWATCHES.map(({ token, label, grow }) => (
      <li
        key={token}
        className={`flex h-28 items-end p-3 font-mono text-xs md:h-40 ${grow}`}
        style={{ background: `var(${token})`, color: labelColor(token) }}
      >
        {label}
      </li>
    ))}
  </ul>
);
