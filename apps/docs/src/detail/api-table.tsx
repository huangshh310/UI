/**
 * API 表格：去网格线留白排布组件属性、类型、默认值与说明。
 */
import type { ApiProp } from "@/registry/registry.types";

const HEADERS = ["属性", "类型", "默认值", "说明"];

export const ApiTable = ({ props }: { props: ApiProp[] }) => (
  <section aria-labelledby="api-title" className="rounded-3xl bg-(--site-surface) p-6 shadow-xs">
    <h2 id="api-title" className="mb-4 text-lg font-semibold tracking-tight">
      API
    </h2>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-(--site-stage)">
            {HEADERS.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-4 py-2.5 font-mono text-xs font-medium text-muted-foreground first:rounded-l-xl last:rounded-r-xl"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map(({ name, type, defaultValue, description }) => (
            <tr
              key={name}
              className="align-top transition-colors duration-(--ui-duration-fast) hover:bg-(--site-stage)/55"
            >
              <td className="rounded-l-xl px-4 py-3.5 font-mono text-[13px] font-medium text-foreground">
                {name}
              </td>
              <td className="px-4 py-3.5">
                <code className="rounded-md bg-(--site-stage) px-1.5 py-0.5 font-mono text-xs leading-loose text-foreground">
                  {type}
                </code>
              </td>
              <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">
                {defaultValue}
              </td>
              <td className="rounded-r-xl px-4 py-3.5 text-muted-foreground">{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
