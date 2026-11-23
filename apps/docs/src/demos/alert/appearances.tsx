"use client";

import { Alert } from "@matt-ui/ui";

export default function AlertAppearancesDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Alert
        appearance="accent"
        variant="success"
        title="左侧强调条（Accent）"
        description="干净卡片底色搭配 3px 左侧语义线，适合表单与详情页嵌入式状态反馈。"
      />
      <Alert
        appearance="soft"
        variant="info"
        title="柔和底色（Soft）"
        description="低饱和语义底色与发丝边线，适合常规提示与校验说明。"
      />
      <Alert
        appearance="solid"
        variant="info"
        title="实色高强调（Solid）"
        description="面向重要系统发布或阻断性状态的高辨识度实底横幅。"
      />
      <Alert
        appearance="banner"
        variant="warning"
        title="通栏公告条（Banner）"
        description="去除左右圆角与侧边线，适合直接贴合页面顶部或容器分隔区域。"
      />
    </div>
  );
}
