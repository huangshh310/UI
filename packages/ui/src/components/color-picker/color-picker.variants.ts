/**
 * ColorPicker 样式变体定义：二维色盘、通道滑轨、预设色板与色值输入静态类名。
 */

export const COLOR_PICKER_SHELL_CLASS =
  "flex w-full max-w-xs flex-col gap-3 rounded-2xl border border-solid border-border bg-card p-3.5 font-sans text-card-foreground shadow-2xs data-[disabled]:opacity-55";

export const COLOR_AREA_CLASS =
  "relative h-40 w-full cursor-crosshair overflow-hidden rounded-xl border border-solid border-border/80 bg-muted/30 [background:var(--color-area-background)] data-[disabled]:cursor-not-allowed";

export const COLOR_AREA_THUMB_CLASS =
  "size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-solid border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_2px_4px_rgba(0,0,0,0.25)] outline-none [background:var(--color-picker-color)] focus-visible:ring-2 focus-visible:ring-ring data-[out-of-gamut]:border-dashed";

export const COLOR_SLIDER_TRACK_CLASS =
  "relative h-3.5 w-full cursor-pointer rounded-full border border-solid border-border/75 [background:var(--color-slider-background)] data-[disabled]:cursor-not-allowed";

export const COLOR_SLIDER_THUMB_CLASS =
  "top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-solid border-white bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_1px_3px_rgba(0,0,0,0.25)] outline-none focus-visible:ring-2 focus-visible:ring-ring";

export const COLOR_SWATCH_PREVIEW_CLASS =
  "size-8 shrink-0 rounded-lg border border-solid border-border shadow-2xs [background:var(--color-picker-color)]";

export const COLOR_HEX_INPUT_CLASS =
  "h-8 min-w-0 flex-1 rounded-lg border border-solid border-input bg-background px-2.5 font-mono text-xs text-foreground outline-none transition-[border-color,box-shadow] duration-(--ui-duration-fast) focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-not-allowed";

export const COLOR_CHANNEL_INPUT_CLASS =
  "h-7 w-full min-w-0 rounded-md border border-solid border-input bg-background px-1.5 text-center font-mono text-[11px] text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-not-allowed";

export const COLOR_EYEDROPPER_BTN_CLASS =
  "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-solid border-border bg-background text-muted-foreground transition-colors duration-(--ui-duration-fast) outline-none hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 data-[unsupported]:hidden";

export const COLOR_PRESET_LIST_CLASS = "flex flex-wrap items-center gap-1.5 outline-none";

export const COLOR_PRESET_ITEM_CLASS =
  "size-6 cursor-pointer rounded-md border border-solid border-border/80 shadow-2xs transition-transform duration-(--ui-duration-fast) outline-none [background:var(--color-picker-color)] hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring data-[selected]:ring-2 data-[selected]:ring-foreground data-[selected]:ring-offset-1 data-[selected]:ring-offset-background disabled:cursor-not-allowed";
