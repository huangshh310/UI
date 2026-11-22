"use client";

/**
 * Base UI · Dialog 与 Popover 用例。
 * 对话框内嵌一个 Select，用于验证嵌套浮层的 Escape 逐层关闭。
 */
import { Dialog } from "@base-ui/react/dialog";
import { Popover } from "@base-ui/react/popover";
import { FruitSelect } from "./fruit-select";

export const ProfileDialog = () => (
  <Dialog.Root>
    <Dialog.Trigger>Edit profile</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop className="backdrop" />
      <Dialog.Popup className="dialog-popup">
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>Change your display name and favourite fruit.</Dialog.Description>
        <label>
          Name <input type="text" defaultValue="Ada" />
        </label>
        <FruitSelect />
        <Dialog.Close>Save</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
);

export const DetailsPopover = () => (
  <Popover.Root>
    <Popover.Trigger>Details</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner sideOffset={8}>
        <Popover.Popup>
          <Popover.Title>Details</Popover.Title>
          <Popover.Description>Last updated today.</Popover.Description>
          <Popover.Close>Close</Popover.Close>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
);
