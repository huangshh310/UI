/**
 * NEW 标记：标示最近收录的组件，以极克制的信号色圆点与细边线呈现。
 */
export const NewBadge = () => (
  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-signal/25 bg-signal/8 px-1.5 py-0.5 font-mono text-[10px] leading-none font-medium tracking-wide text-foreground">
    <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
    NEW
  </span>
);
