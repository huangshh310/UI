/**
 * 首页的设计取向一节：每一条都对应组件库里可以验证的事实。
 */

const COMMITMENTS = [
  {
    title: "对比度是核对过的",
    body: "每一组前景与表面的对比度不低于 4.5:1，输入框边线与焦点环不低于 3:1。",
  },
  {
    title: "键盘用户不会被丢下",
    body: "焦点环只在键盘聚焦时出现。按钮进入加载中仍然可以聚焦，不会让焦点凭空消失。",
  },
  {
    title: "动效听用户的",
    body: "系统开启「减少动态效果」后，所有过渡时长压到接近零，加载指示器停止旋转。",
  },
];

export const CommitmentsSection = () => (
  <section
    aria-labelledby="commitments-title"
    className="grid gap-10 border-t border-border py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16"
  >
    <h2 id="commitments-title" className="text-3xl font-semibold tracking-tight">
      看不见的部分，
      <br />
      也按规矩来
    </h2>
    <dl className="divide-y divide-border border-y border-border">
      {COMMITMENTS.map(({ title, body }) => (
        <div key={title} className="grid gap-2 py-6 md:grid-cols-[12rem_1fr] md:gap-8">
          <dt className="font-medium">{title}</dt>
          <dd className="leading-relaxed text-muted-foreground">{body}</dd>
        </div>
      ))}
    </dl>
  </section>
);
