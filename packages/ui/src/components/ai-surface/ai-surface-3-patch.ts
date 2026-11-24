/**
 * AiSurface 路径稳定节点 ID 推导与流式增量更新补丁纯函数。
 */
import type { SurfaceButtonNode, SurfaceNode, SurfaceTabItem } from "./ai-surface-0-nodes.js";
import type { SurfacePatch, SurfaceRegionInput, SurfaceView } from "./ai-surface.types.js";

const childPath = (prefix: string, key: string | undefined, index: number): string =>
  `${prefix}.${key ?? index}`;

const deriveSlotInput = (
  slot: SurfaceNode | SurfaceNode[] | undefined,
  slotPrefix: string,
): SurfaceNode | SurfaceNode[] | undefined => {
  if (!slot) return undefined;
  if (Array.isArray(slot)) {
    return slot.map((item, idx) => deriveNodeIds(item, childPath(slotPrefix, item.key, idx)));
  }
  return deriveNodeIds(slot, childPath(slotPrefix, slot.key, 0));
};

const deriveTabsList = (tabs: SurfaceTabItem[], prefix: string): SurfaceTabItem[] =>
  tabs.map((tab) => ({
    ...tab,
    children: deriveNodeArray(tab.children, `${prefix}.${tab.key}`),
  }));

const deriveActionsItems = (items: SurfaceButtonNode[], prefix: string): SurfaceButtonNode[] =>
  items.map((btn, idx) => ({
    ...btn,
    id: childPath(prefix, btn.key, idx),
  }));

const deriveContainerExtras = (node: SurfaceNode, id: string): SurfaceNode => {
  if (node.kind === "card") {
    return {
      ...node,
      id,
      end: deriveSlotInput(node.end, `${id}.end`),
      foot: deriveSlotInput(node.foot, `${id}.foot`),
      children: node.children ? deriveNodeArray(node.children, id) : undefined,
    };
  }
  if (node.kind === "group") {
    return {
      ...node,
      id,
      end: deriveSlotInput(node.end, `${id}.end`),
      foot: deriveSlotInput(node.foot, `${id}.foot`),
      children: deriveNodeArray(node.children, id),
    };
  }
  if (node.kind === "stack" || node.kind === "grid") {
    return { ...node, id, children: deriveNodeArray(node.children, id) };
  }
  if (node.kind === "tabs") {
    return { ...node, id, tabs: deriveTabsList(node.tabs, id) };
  }
  if (node.kind === "actions") {
    return { ...node, id, items: deriveActionsItems(node.items, id) };
  }
  return { ...node, id };
};

const deriveNodeIds = (node: SurfaceNode, pathId: string): SurfaceNode =>
  deriveContainerExtras(node, pathId);

const deriveNodeArray = (nodes: SurfaceNode[], prefix: string): SurfaceNode[] =>
  nodes.map((node, index) => deriveNodeIds(node, childPath(prefix, node.key, index)));

const deriveRegion = (
  region: SurfaceRegionInput | undefined,
  regionName: string,
): SurfaceRegionInput | undefined => {
  if (!region) return undefined;
  if (Array.isArray(region)) return deriveNodeArray(region, regionName);
  return deriveNodeIds(region, childPath(regionName, region.key, 0));
};

export const deriveSurfaceIds = (view: SurfaceView): SurfaceView => ({
  ...view,
  main: deriveRegion(view.main, "main") as SurfaceRegionInput,
  dock: deriveRegion(view.dock, "dock"),
  layer: deriveRegion(view.layer, "layer"),
});

const appendToNode = (node: SurfaceNode, added: unknown[]): SurfaceNode => {
  if ("children" in node && Array.isArray(node.children)) {
    return { ...node, children: [...node.children, ...(added as SurfaceNode[])] };
  }
  if (node.kind === "table") {
    return { ...node, rows: [...node.rows, ...(added as Record<string, unknown>[])] };
  }
  if (node.kind === "diff") {
    return { ...node, lines: [...node.lines, ...(added as typeof node.lines)] };
  }
  if ("items" in node && Array.isArray(node.items)) {
    return { ...node, items: [...node.items, ...added] } as SurfaceNode;
  }
  return node;
};

const applyNodeHit = (node: SurfaceNode, patch: SurfacePatch): SurfaceNode => {
  if (patch.op === "replace") return { ...patch.node, id: node.id };
  if (patch.op === "mergeProps") return { ...node, ...patch.patch, id: node.id } as SurfaceNode;
  if (patch.op === "appendItems") return appendToNode(node, patch.items);
  return node;
};

const patchSlot = (
  slot: SurfaceNode | SurfaceNode[] | undefined,
  patch: SurfacePatch,
): SurfaceNode | SurfaceNode[] | undefined => {
  if (!slot) return undefined;
  if (Array.isArray(slot)) return patchArray(slot, patch);
  if (patch.op === "remove" && slot.id === patch.targetId) return undefined;
  return patchSingleNode(slot, patch);
};

const patchChildrenOf = (node: SurfaceNode, patch: SurfacePatch): SurfaceNode => {
  if (node.kind === "card") {
    return {
      ...node,
      end: patchSlot(node.end, patch),
      foot: patchSlot(node.foot, patch),
      children: node.children ? patchArray(node.children, patch) : undefined,
    };
  }
  if (node.kind === "group") {
    return {
      ...node,
      end: patchSlot(node.end, patch),
      foot: patchSlot(node.foot, patch),
      children: patchArray(node.children, patch),
    };
  }
  if (node.kind === "stack" || node.kind === "grid") {
    return { ...node, children: patchArray(node.children, patch) };
  }
  if (node.kind === "tabs") {
    return {
      ...node,
      tabs: node.tabs.map((t) => ({ ...t, children: patchArray(t.children, patch) })),
    };
  }
  return node;
};

const patchSingleNode = (node: SurfaceNode, patch: SurfacePatch): SurfaceNode => {
  const updated = node.id === patch.targetId ? applyNodeHit(node, patch) : node;
  return patchChildrenOf(updated, patch);
};

const patchArray = (nodes: SurfaceNode[], patch: SurfacePatch): SurfaceNode[] =>
  nodes
    .filter((item) => !(patch.op === "remove" && item.id === patch.targetId))
    .map((item) => patchSingleNode(item, patch));

const patchRegion = (
  region: SurfaceRegionInput | undefined,
  patch: SurfacePatch,
): SurfaceRegionInput | undefined => {
  if (!region) return undefined;
  if (Array.isArray(region)) return patchArray(region, patch);
  if (patch.op === "remove" && region.id === patch.targetId) return [];
  return patchSingleNode(region, patch);
};

const applyOnePatch = (view: SurfaceView, patch: SurfacePatch): SurfaceView => {
  const withIds = deriveSurfaceIds(view);
  return deriveSurfaceIds({
    ...withIds,
    main: patchRegion(withIds.main, patch) as SurfaceRegionInput,
    dock: patchRegion(withIds.dock, patch),
    layer: patchRegion(withIds.layer, patch),
  });
};

export const applySurfacePatch = (
  view: SurfaceView,
  patches: SurfacePatch | SurfacePatch[],
): SurfaceView => {
  const list = Array.isArray(patches) ? patches : [patches];
  return list.reduce(applyOnePatch, deriveSurfaceIds(view));
};
