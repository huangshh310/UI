import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  EmptyState,
  Progress,
  Separator,
  Skeleton,
  Spinner,
  ToastProvider,
  useToast,
} from "@matt-ui/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Display/展示与反馈",
};

export default meta;

const ToastStoryInner = () => {
  const { toast } = useToast();
  return (
    <Button
      size="sm"
      variant="signal"
      onClick={() => toast({ title: "部署完成", description: "所有节点已同步", tone: "success" })}
    >
      推送 Toast
    </Button>
  );
};

export const Overview: StoryObj = {
  render: () => (
    <ToastProvider>
      <div className="flex max-w-md flex-col gap-5">
        <Card variant="interactive">
          <CardHeader>
            <CardTitle>指标概览</CardTitle>
            <CardDescription>克制发丝边线卡片容器</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="signal" dot>
              运行中
            </Badge>
            <Badge variant="success">已通过</Badge>
            <Badge variant="warning">待审核</Badge>
            <Badge variant="destructive">已阻断</Badge>
          </CardContent>
          <CardFooter muted>
            <ToastStoryInner />
            <Spinner size="sm" />
          </CardFooter>
        </Card>
        <Alert variant="info" title="无障碍就绪" description="全部颜色满足 4.5:1 对比度。" />
        <Progress value={72} label="上传进度" showValue />
        <Separator label="占位状态" />
        <div className="flex items-center gap-3">
          <Skeleton shape="circle" />
          <Skeleton className="flex-1" />
        </div>
        <EmptyState compact title="暂无通知" description="有新动态时会第一时间提醒你。" />
      </div>
    </ToastProvider>
  ),
};
