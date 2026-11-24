import { IntroLoader, MorphingDialog, SelectionBasket, SpotlightSearch } from "@matt-ui/motion";
import {
  AvatarStack,
  Button,
  CommandMenu,
  DirectionalTooltip,
  DirectionalTooltipProvider,
  OriginDropdown,
  PeekCard,
  SettleModal,
  Sheet,
} from "@matt-ui/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Overlays/浮层集合",
};

export default meta;

export const ModalsAndSheets: StoryObj = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <SettleModal
        trigger={<Button variant="outline">SettleModal</Button>}
        title="发布确认"
        description="内置完整焦点陷阱与背景锁定的居中磨砂模态框。"
      >
        确认发布新版本。
      </SettleModal>
      <Sheet side="right" trigger={<Button variant="outline">Sheet 抽屉</Button>} title="运行配置">
        抽屉主体内容。
      </Sheet>
      <MorphingDialog title="边缘节点" subtitle="东京 · 14ms" tag="运行中">
        共享元素展开详情内容。
      </MorphingDialog>
    </div>
  ),
};

export const MenusAndPreviews: StoryObj = {
  render: () => (
    <DirectionalTooltipProvider delay={120}>
      <div className="flex flex-wrap items-center gap-4">
        <DirectionalTooltip content="上方提示" side="top">
          <Button variant="outline" size="sm">
            Tooltip
          </Button>
        </DirectionalTooltip>
        <OriginDropdown
          label="OriginDropdown"
          items={[
            { kind: "action", id: "edit", label: "编辑", shortcut: "⌘E" },
            { kind: "separator" },
            { kind: "action", id: "del", label: "删除", tone: "destructive" },
          ]}
        />
        <PeekCard
          triggerLabel="ORD-2026-089"
          title="ORD-2026-089"
          value="¥1,290.00"
          status="已结算"
        />
        <AvatarStack
          items={[
            { id: "1", name: "林知远", initials: "林", status: "online" },
            { id: "2", name: "周宁", initials: "周" },
            { id: "3", name: "陈屿", initials: "陈" },
          ]}
          max={2}
        />
      </div>
    </DirectionalTooltipProvider>
  ),
};

export const CommandAndAux: StoryObj = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <CommandMenu
        triggerLabel="CommandMenu"
        groups={[{ heading: "导航", items: [{ id: "docs", label: "查看文档" }] }]}
      />
      <SpotlightSearch
        triggerLabel="SpotlightSearch"
        items={[{ id: "1", title: "Button", category: "基础", description: "核心按钮" }]}
      />
      <SelectionBasket
        count={2}
        floating={false}
        actions={[{ id: "archive", label: "归档", onClick: () => {} }]}
        onClear={() => {}}
      />
      <IntroLoader active fullscreen={false} />
    </div>
  ),
};
