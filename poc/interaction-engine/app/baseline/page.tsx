/**
 * 基线页面：不引入任何交互底座。
 * 它的 JS 体积就是 React 与 Next.js 运行时的固定开销，用来从其他页面的体积中扣除。
 */
const Page = () => (
  <main>
    <h1>Baseline</h1>
  </main>
);

export default Page;
