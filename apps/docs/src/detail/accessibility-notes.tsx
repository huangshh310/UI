/**
 * 可访问性说明：组件在键盘、焦点与辅助技术方面的行为。
 */
export const AccessibilityNotes = ({ notes }: { notes: string[] }) => (
  <section
    aria-labelledby="a11y-title"
    className="rounded-2xl border border-border bg-(--site-tile) p-6"
  >
    <h2 id="a11y-title" className="mb-3 text-lg font-semibold tracking-tight">
      可访问性
    </h2>
    <ul className="divide-y divide-border">
      {notes.map((note) => (
        <li key={note} className="py-3 text-sm text-muted-foreground last:pb-0">
          {note}
        </li>
      ))}
    </ul>
  </section>
);
