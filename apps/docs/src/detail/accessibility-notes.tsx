/**
 * 可访问性说明：组件在键盘、焦点与辅助技术方面的行为。
 */
export const AccessibilityNotes = ({ notes }: { notes: string[] }) => (
  <section aria-labelledby="a11y-title">
    <h2 id="a11y-title" className="mb-4 text-xl font-semibold tracking-tight">
      可访问性
    </h2>
    <ul className="divide-y divide-border rounded-lg border border-border bg-card">
      {notes.map((note) => (
        <li key={note} className="px-5 py-3.5 text-sm text-muted-foreground">
          {note}
        </li>
      ))}
    </ul>
  </section>
);
