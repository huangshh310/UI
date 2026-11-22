/**
 * 可排序列表的行为原语。
 *
 * UI SDK 没有现成的排序组件，这里按官方文档「Drag and Drop · Sort a List」
 * 把三个行为组合起来：
 * - createChange      把顺序变化交给 onValueChange，并支持受控
 * - createRovingFocus 整个列表只占一个 Tab 停靠点，方向键在条目间移动焦点
 * - createReorder     指针拖动与键盘（空格拿起、方向键移动、空格放下）重排
 *
 * 本文件只描述行为，不依赖 React；渲染见 sortable-list-parts.ts。
 */
import {
  createChange,
  createReorder,
  createRovingFocus,
  definePrimitive,
  type ChangeDetails,
  type ReorderDraft,
} from "@ui-sdk/core";

export interface SortableListOptions {
  /** 受控的顺序：条目 key 的数组 */
  value?: string[];
  /** 非受控时的初始顺序 */
  defaultValue?: string[];
  onValueChange?: (value: string[], details: ChangeDetails<string>) => void;
}

export const sortableList = definePrimitive({
  name: "sortable-list",
  options: { value: "list", defaultValue: "list", onValueChange: "callback" },
  controlled: ["value"],
  state: (options: SortableListOptions) => ({
    /** 已提交的顺序 */
    value: options.value ?? options.defaultValue ?? [],
    /** 移动过程中的草稿；没有条目被拿起时为 null */
    moving: null as ReorderDraft | null,
    /** 当前持有 Tab 停靠点的条目 */
    focused: null as string | null,
  }),
  sync: (options) => (options.value === undefined ? {} : { value: options.value }),
  api: (context) => {
    const change = createChange(context);
    const roving = createRovingFocus(context, {
      slot: "item",
      key: "focused",
      orientation: () => "vertical",
    });
    const reorder = createReorder(context, {
      slot: "item",
      key: "value",
      draft: "moving",
      set: (value, details) => change("value", value, details),
    });

    return { roving, reorder };
  },
  slots: (slot) => ({
    root: slot({
      // 暴露「当前应当展示的顺序」：移动中读草稿，否则读已提交的值
      state: (state, part) => ({ order: part.api.reorder.order(state) }),
      attrs: () => ({ role: "listbox", "aria-roledescription": "sortable list" }),
    }),
    item: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, part) => ({
        role: "option",
        "aria-roledescription": "sortable item",
        "aria-selected": String(state.moving?.key === part.key),
        tabindex: part.api.roving.tabIndex(state, part),
        "data-grabbed": state.moving?.key === part.key ? "" : undefined,
      }),
      on: {
        // 先交给重排处理；条目未被拿起时返回 false，再由 roving focus 移动焦点
        keydown: (event, { el, api, key }) =>
          api.reorder.keydown(event, key) || api.roving.keydown(event, el!),
        pointerdown: (event, { api, key }) => api.reorder.pointerdown(event, key),
      },
      bind: (el, part) => {
        const cleanups = [part.api.roving.bind(el, part), part.api.reorder.bind(el, part)];
        return () => cleanups.forEach((cleanup) => cleanup());
      },
    }),
  }),
});
