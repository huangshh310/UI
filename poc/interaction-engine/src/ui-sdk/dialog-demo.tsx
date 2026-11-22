"use client";

/**
 * UI SDK · Dialog 与 Popover 用例。
 * 对话框内嵌一个 Select，用于验证嵌套浮层的 Escape 逐层关闭。
 */
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover";
import { FruitSelect } from "./fruit-select";

export const ProfileDialog = () => (
  <Dialog>
    <DialogTrigger>Edit profile</DialogTrigger>
    <DialogBackdrop />
    <DialogContent>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Change your display name and favourite fruit.</DialogDescription>
      <label>
        Name <input type="text" defaultValue="Ada" />
      </label>
      <FruitSelect />
      <DialogClose>Save</DialogClose>
    </DialogContent>
  </Dialog>
);

export const DetailsPopover = () => (
  <Popover>
    <PopoverTrigger>Details</PopoverTrigger>
    <PopoverContent sideOffset={8}>
      <PopoverTitle>Details</PopoverTitle>
      <PopoverDescription>Last updated today.</PopoverDescription>
      <PopoverClose>Close</PopoverClose>
    </PopoverContent>
  </Popover>
);
