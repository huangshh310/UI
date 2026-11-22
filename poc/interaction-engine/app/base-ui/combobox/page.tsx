/** Base UI · Combobox 用例页面：本地过滤与异步搜索各一个。 */
import { AsyncComboboxDemo } from "@/base-ui/async-combobox-demo";
import { ComboboxDemo } from "@/base-ui/combobox-demo";

const Page = () => (
  <main>
    <h1>Base UI · Combobox</h1>
    <ComboboxDemo />
    <AsyncComboboxDemo />
  </main>
);

export default Page;
