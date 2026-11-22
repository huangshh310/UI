"use client";

/**
 * Base UI 版的水果单选。Select 页面与 Dialog 内部共用。
 * 不传 value 时为非受控；传入 value 与 onValueChange 时为受控。
 */
import { Select } from "@base-ui/react/select";
import { FRUITS } from "@/shared/fruits";

interface FruitSelectProps {
  /** 受控值；null 表示未选择 */
  value?: string | null;
  onValueChange?: (value: string | null) => void;
}

export const FruitSelect = ({ value, onValueChange }: FruitSelectProps) => (
  <Select.Root items={FRUITS} value={value} onValueChange={onValueChange}>
    <Select.Label>Fruit</Select.Label>
    <Select.Trigger>
      <Select.Value placeholder="Select a fruit" />
    </Select.Trigger>
    <Select.Portal>
      {/* 关闭「选中项对齐触发器」，让浮层固定出现在触发器下方，与 UI SDK 的默认表现一致 */}
      <Select.Positioner sideOffset={4} alignItemWithTrigger={false}>
        <Select.Popup>
          <Select.List>
            {FRUITS.map(({ value: itemValue, label }) => (
              <Select.Item key={itemValue} value={itemValue}>
                <Select.ItemText>{label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.List>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
);
