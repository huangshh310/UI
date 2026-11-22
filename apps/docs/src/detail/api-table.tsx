/**
 * API 表格：列出组件在原生属性之外新增或改变的属性。
 */
import type { ApiProp } from "@/registry/registry.types";

const HEADERS = ["属性", "类型", "默认值", "说明"];

export const ApiTable = ({ props }: { props: ApiProp[] }) => (
  <section
    aria-labelledby="api-title"
    className="overflow-hidden rounded-2xl border border-border bg-(--site-surface) shadow-xs"
  >
    <div className="border-b border-border/75 px-6 py-4">
      <h2 id="api-title" className="text-lg font-semibold tracking-tight">
        API
      </h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border/75 bg-(--site-stage)/60">
            {HEADERS.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 font-mono text-xs font-medium text-muted-foreground"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">
          {props.map(({ name, type, defaultValue, description }) => (
            <tr
              key={name}
              className="align-top transition-colors duration-(--ui-duration-fast) hover:bg-(--site-stage)/45"
            >
              <td className="px-6 py-4 font-mono text-[13px] font-medium text-foreground">
                {name}
              </td>
              <td className="px-6 py-4">
                <code className="rounded-md border border-border/80 bg-(--site-stage) px-1.5 py-0.5 font-mono text-xs leading-loose text-foreground">
                  {type}
                </code>
              </td>
              <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{defaultValue}</td>
              <td className="px-6 py-4 text-muted-foreground">{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
