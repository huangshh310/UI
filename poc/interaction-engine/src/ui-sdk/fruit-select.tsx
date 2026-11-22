"use client";

/**
 * UI SDK 版的水果单选。Select 页面与 Dialog 内部共用。
 * 不传 value 时为非受控；传入 value 与 onValueChange 时为受控。
 */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select";
import { FRUITS } from "@/shared/fruits";

interface FruitSelectProps {
  /** 受控值；null 表示未选择 */
  value?: string | null;
  onValueChange?: (value: string | null) => void;
}

export const FruitSelect = ({ value, onValueChange }: FruitSelectProps) => (
  <Select placeholder="Select a fruit" value={value} onValueChange={onValueChange}>
    <SelectLabel>Fruit</SelectLabel>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    {/* 浮层使用浏览器的 top layer，不需要 Portal 与 Positioner */}
    <SelectContent sideOffset={4}>
      {FRUITS.map(({ value: itemValue, label }) => (
        <SelectItem key={itemValue} value={itemValue}>
          {label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
