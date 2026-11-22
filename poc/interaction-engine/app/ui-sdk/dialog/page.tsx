/** UI SDK · Dialog 与 Popover 用例页面。 */
import { DialogPageShell } from "@/shared/dialog-page-shell";
import { DetailsPopover, ProfileDialog } from "@/ui-sdk/dialog-demo";

const Page = () => (
  <DialogPageShell title="UI SDK · Dialog">
    <ProfileDialog />
    <DetailsPopover />
  </DialogPageShell>
);

export default Page;
