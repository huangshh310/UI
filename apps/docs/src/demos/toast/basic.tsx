"use client";

import { Button, ToastProvider, useToast } from "@matt-ui/ui";

const ToastTriggers = () => {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="signal"
        onClick={() =>
          toast({
            title: "已同步最新 Registry",
            description: "全部组件通过类型检查与浏览器验证。",
            tone: "success",
            actionLabel: "撤销",
          })
        }
      >
        成功通知
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          toast({
            title: "构建已被取消",
            description: "上次部署队列已安全终止。",
            tone: "destructive",
          })
        }
      >
        错误通知
      </Button>
    </div>
  );
};

export default function ToastBasicDemo() {
  return (
    <ToastProvider placement="bottom-right">
      <ToastTriggers />
    </ToastProvider>
  );
}
