/**
 * 可访问性说明：组件在键盘、焦点与辅助技术方面的行为。
 */
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";

export const AccessibilityNotes = ({ notes }: { notes: string[] }) => (
  <section aria-labelledby="a11y-title" className="rounded-3xl bg-(--site-surface) p-6 shadow-xs">
    <h2 id="a11y-title" className="mb-4 text-lg font-semibold tracking-tight">
      可访问性
    </h2>
    <ul className="flex flex-col gap-3">
      {notes.map((note) => (
        <li
          key={note}
          className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
        >
          <span
            aria-hidden="true"
            className="mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-signal/12 text-info dark:bg-signal/22"
          >
            <CheckIcon weight="bold" className="size-2.5" />
          </span>
          <span>{note}</span>
        </li>
      ))}
    </ul>
  </section>
);
