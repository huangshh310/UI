/**
 * NEW 标记：标示最近收录的组件，以无边框柔和色底呈现。
 */
export const NewBadge = () => (
  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-signal/12 px-2 py-0.5 font-mono text-[10px] leading-none font-medium tracking-wide text-info dark:bg-signal/22">
    <span aria-hidden="true" className="size-1.5 rounded-full bg-signal dark:bg-info" />
    NEW
  </span>
);
