/**
 * API 表格：列出组件在原生属性之外新增或改变的属性。
 */
import type { ApiProp } from "@/registry/registry.types";

const HEADERS = ["属性", "类型", "默认值", "说明"];

export const ApiTable = ({ props }: { props: ApiProp[] }) => (
  <section
    aria-labelledby="api-title"
    className="rounded-2xl border border-border bg-(--site-tile) p-6"
  >
    <h2 id="api-title" className="mb-4 text-lg font-semibold tracking-tight">
      API
    </h2>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {HEADERS.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-2 py-3 font-mono text-xs font-normal text-muted-foreground"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map(({ name, type, defaultValue, description }) => (
            <tr key={name} className="border-b border-border align-top last:border-b-0">
              <td className="px-2 py-4 font-mono font-medium">{name}</td>
              <td className="px-2 py-4">
                <code className="rounded-sm bg-accent px-1.5 py-0.5 font-mono text-xs leading-loose">
                  {type}
                </code>
              </td>
              <td className="px-2 py-4 font-mono text-xs text-muted-foreground">{defaultValue}</td>
              <td className="px-2 py-4 text-muted-foreground">{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
