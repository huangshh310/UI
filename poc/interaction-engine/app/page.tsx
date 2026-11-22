/**
 * POC 索引页：列出每个交互底座的每个用例页面。
 */
import Link from "next/link";

const PAGES = [
  "/base-ui/select",
  "/base-ui/combobox",
  "/base-ui/dialog",
  "/ui-sdk/select",
  "/ui-sdk/combobox",
  "/ui-sdk/dialog",
  "/ui-sdk/tree",
  "/ui-sdk/reorder",
];

const IndexPage = () => (
  <main>
    <h1>交互底座 POC</h1>
    <ul>
      {PAGES.map((href) => (
        <li key={href}>
          <Link href={href}>{href}</Link>
        </li>
      ))}
    </ul>
  </main>
);

export default IndexPage;
