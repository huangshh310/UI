"use client";

import { Button, ToastProvider, useToast } from "@matt-ui/ui";

const ToneTriggers = () => {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          toast({ title: "部署成功", description: "edge-gateway 已上线", tone: "success" })
        }
      >
        成功通知
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          toast({ title: "版本已更新", description: "工作区已同步至 v2.4", tone: "signal" })
        }
      >
        信号通知
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          toast({ title: "配额提醒", description: "本月调用量已达 85%", tone: "warning" })
        }
      >
        警告通知
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          toast({
            title: "同步失败",
            description: "请检查私有仓库访问令牌",
            tone: "destructive",
            actionLabel: "重试",
          })
        }
      >
        错误通知
      </Button>
    </div>
  );
};

export default function ToastTonesDemo() {
  return (
    <ToastProvider placement="bottom-right">
      <ToneTriggers />
    </ToastProvider>
  );
}
