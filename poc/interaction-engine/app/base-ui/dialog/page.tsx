/** Base UI · Dialog 与 Popover 用例页面。 */
import { DetailsPopover, ProfileDialog } from "@/base-ui/dialog-demo";
import { DialogPageShell } from "@/shared/dialog-page-shell";

const Page = () => (
  <DialogPageShell title="Base UI · Dialog">
    <ProfileDialog />
    <DetailsPopover />
  </DialogPageShell>
);

export default Page;
