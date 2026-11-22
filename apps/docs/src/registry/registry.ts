/**
 * 展示站的清单：全部组件、全部分类，以及查询它们的函数。
 * 新增组件时，在这里登记它的文档数据即可出现在目录与详情页。
 */
import { REGISTRY_ADDRESS } from "@/site/constants";
import { ACCORDION_DOC } from "./accordion.doc";
import { ACTIVITY_FEED_BLOCK_DOC } from "./activity-feed-block.doc";
import { ADVANCED_DATA_TABLE_DOC } from "./advanced-data-table.doc";
import { AI_WORKSPACE_BLOCK_DOC } from "./ai-workspace-block.doc";
import { ALERT_DOC } from "./alert.doc";
import { ANIMATED_FILE_UPLOAD_DOC } from "./animated-file-upload.doc";
import { ANIMATED_TEXT_DOC } from "./animated-text.doc";
import { AUTH_BLOCK_DOC } from "./auth-block.doc";
import { AVATAR_STACK_DOC } from "./avatar-stack.doc";
import { BADGE_DOC } from "./badge.doc";
import { BILLING_USAGE_BLOCK_DOC } from "./billing-usage-block.doc";
import { BOOK_CALL_BUTTON_DOC } from "./book-call-button.doc";
import { BREADCRUMB_DOC } from "./breadcrumb.doc";
import { BUTTON_DOC } from "./button.doc";
import { CALENDAR_DOC } from "./calendar.doc";
import { CARD_DOC } from "./card.doc";
import { CODE_SNIPPET_DECK_DOC } from "./code-snippet-deck.doc";
import { COMBOBOX_DOC } from "./combobox.doc";
import { COMMAND_MENU_DOC } from "./command-menu.doc";
import { DASHBOARD_SHELL_BLOCK_DOC } from "./dashboard-shell-block.doc";
import { DATA_TABLE_DOC } from "./data-table.doc";
import { DATE_PICKER_DOC } from "./date-picker.doc";
import { DIRECTIONAL_TOOLTIP_DOC } from "./directional-tooltip.doc";
import { DRAG_TO_CONFIRM_DOC } from "./drag-to-confirm.doc";
import { DRAW_CHECKBOX_DOC } from "./draw-checkbox.doc";
import { EMPTY_STATE_DOC } from "./empty-state.doc";
import { FILE_MANAGER_BLOCK_DOC } from "./file-manager-block.doc";
import { FOLDER_TAB_CARD_DOC } from "./folder-tab-card.doc";
import { FORM_DOC } from "./form.doc";
import { HERO_BENTO_BLOCK_DOC } from "./hero-bento-block.doc";
import { INTRO_LOADER_DOC } from "./intro-loader.doc";
import { LIQUID_RIPPLE_BUTTON_DOC } from "./liquid-ripple-button.doc";
import { LIQUID_TOGGLE_DOC } from "./liquid-toggle.doc";
import { LOCK_INPUT_DOC } from "./lock-input.doc";
import { MAGNETIC_BUTTON_DOC } from "./magnetic-button.doc";
import { MORPHING_BUTTON_DOC } from "./morphing-button.doc";
import { MORPHING_DIALOG_DOC } from "./morphing-dialog.doc";
import { NEON_EDGE_BUTTON_DOC } from "./neon-edge-button.doc";
import { NUMBER_FLOW_DOC } from "./number-flow.doc";
import { NUMBER_INPUT_DOC } from "./number-input.doc";
import { ONBOARDING_WIZARD_BLOCK_DOC } from "./onboarding-wizard-block.doc";
import { ORIGIN_DROPDOWN_DOC } from "./origin-dropdown.doc";
import { OTP_INPUT_DOC } from "./otp-input.doc";
import { PAGINATION_DOC } from "./pagination.doc";
import { PEEK_CARD_DOC } from "./peek-card.doc";
import { PRESS_BUTTON_DOC } from "./press-button.doc";
import { PRICING_BLOCK_DOC } from "./pricing-block.doc";
import { PROGRESS_DOC } from "./progress.doc";
import { PROMPT_INPUT_DOC } from "./prompt-input.doc";
import { REORDER_LIST_DOC } from "./reorder-list.doc";
import { RESIZABLE_PANELS_DOC } from "./resizable-panels.doc";
import { SELECTION_BASKET_DOC } from "./selection-basket.doc";
import { SEPARATOR_DOC } from "./separator.doc";
import { SETTINGS_BLOCK_DOC } from "./settings-block.doc";
import { SETTLE_MODAL_DOC } from "./settle-modal.doc";
import { SHEET_DOC } from "./sheet.doc";
import { SKELETON_DOC } from "./skeleton.doc";
import { SLIDER_DOC } from "./slider.doc";
import { SPINNER_DOC } from "./spinner.doc";
import { SPLIT_BUTTON_DOC } from "./split-button.doc";
import { SPOTLIGHT_CARD_DOC } from "./spotlight-card.doc";
import { SPOTLIGHT_SEARCH_DOC } from "./spotlight-search.doc";
import { SPRING_SELECT_DOC } from "./spring-select.doc";
import { STAGGERED_LIST_DOC } from "./staggered-list.doc";
import { STATS_OVERVIEW_BLOCK_DOC } from "./stats-overview-block.doc";
import { STRETCH_SWITCH_DOC } from "./stretch-switch.doc";
import { TABS_DOC } from "./tabs.doc";
import { TEAM_MEMBERS_BLOCK_DOC } from "./team-members-block.doc";
import { TOAST_DOC } from "./toast.doc";
import { TREE_DOC } from "./tree.doc";
import { TYPEWRITER_BUTTON_DOC } from "./typewriter-button.doc";
import type { Category, ComponentDoc, Specimen } from "./registry.types";

export const CATEGORIES: Category[] = [
  { id: "buttons", label: "按钮" },
  { id: "forms", label: "表单" },
  { id: "overlays", label: "浮层" },
  { id: "display", label: "展示" },
  { id: "navigation", label: "导航与布局" },
  { id: "motion", label: "动效" },
  { id: "blocks", label: "区块" },
];

export const COMPONENTS: ComponentDoc[] = [
  BUTTON_DOC,
  PRESS_BUTTON_DOC,
  LIQUID_RIPPLE_BUTTON_DOC,
  NEON_EDGE_BUTTON_DOC,
  BOOK_CALL_BUTTON_DOC,
  TYPEWRITER_BUTTON_DOC,
  SPLIT_BUTTON_DOC,
  MAGNETIC_BUTTON_DOC,
  MORPHING_BUTTON_DOC,
  DRAG_TO_CONFIRM_DOC,
  LIQUID_TOGGLE_DOC,
  CODE_SNIPPET_DECK_DOC,
  LOCK_INPUT_DOC,
  DRAW_CHECKBOX_DOC,
  STRETCH_SWITCH_DOC,
  SPRING_SELECT_DOC,
  COMBOBOX_DOC,
  OTP_INPUT_DOC,
  FORM_DOC,
  CALENDAR_DOC,
  DATE_PICKER_DOC,
  ANIMATED_FILE_UPLOAD_DOC,
  PROMPT_INPUT_DOC,
  DATA_TABLE_DOC,
  ADVANCED_DATA_TABLE_DOC,
  SETTLE_MODAL_DOC,
  SHEET_DOC,
  DIRECTIONAL_TOOLTIP_DOC,
  ORIGIN_DROPDOWN_DOC,
  PEEK_CARD_DOC,
  MORPHING_DIALOG_DOC,
  COMMAND_MENU_DOC,
  SPOTLIGHT_SEARCH_DOC,
  SELECTION_BASKET_DOC,
  AVATAR_STACK_DOC,
  INTRO_LOADER_DOC,
  CARD_DOC,
  BADGE_DOC,
  ALERT_DOC,
  TOAST_DOC,
  PROGRESS_DOC,
  SKELETON_DOC,
  SEPARATOR_DOC,
  SPINNER_DOC,
  EMPTY_STATE_DOC,
  TABS_DOC,
  ACCORDION_DOC,
  SLIDER_DOC,
  NUMBER_INPUT_DOC,
  TREE_DOC,
  REORDER_LIST_DOC,
  RESIZABLE_PANELS_DOC,
  BREADCRUMB_DOC,
  PAGINATION_DOC,
  NUMBER_FLOW_DOC,
  ANIMATED_TEXT_DOC,
  SPOTLIGHT_CARD_DOC,
  FOLDER_TAB_CARD_DOC,
  STAGGERED_LIST_DOC,
  AUTH_BLOCK_DOC,
  PRICING_BLOCK_DOC,
  DASHBOARD_SHELL_BLOCK_DOC,
  SETTINGS_BLOCK_DOC,
  FILE_MANAGER_BLOCK_DOC,
  HERO_BENTO_BLOCK_DOC,
  STATS_OVERVIEW_BLOCK_DOC,
  TEAM_MEMBERS_BLOCK_DOC,
  BILLING_USAGE_BLOCK_DOC,
  ACTIVITY_FEED_BLOCK_DOC,
  AI_WORKSPACE_BLOCK_DOC,
  ONBOARDING_WIZARD_BLOCK_DOC,
];

/** 收录后多少天内算「最近」 */
const RECENT_DAYS = 30;

/** 目录页的一个条目：示例，加上它所属的组件 */
export interface DirectoryEntry {
  specimen: Specimen;
  component: ComponentDoc;
}

/** 全部详情页包含的实时交互场景总数 */
export const TOTAL_SPECIMEN_COUNT: number = COMPONENTS.reduce(
  (sum, component) => sum + component.specimens.length,
  0,
);

/** 把目录页展示的代表性示例摊平，供画廊筛选使用 */
export const DIRECTORY: DirectoryEntry[] = COMPONENTS.flatMap((component) =>
  component.specimens
    .filter((specimen) => specimen.directory !== false)
    .map((specimen) => ({ specimen, component })),
);

/**
 * 首页精选顺序：按组件去重，优先展示形态各异的交互组件，
 * 避免同一组件的多组基础变体占满首屏网格。
 */
const FEATURED_SLUGS = [
  "button",
  "drag-to-confirm",
  "otp-input",
  "prompt-input",
  "calendar",
  "command-menu",
  "number-flow",
  "folder-tab-card",
  "tree",
];

/** 首页展示的精选示例（每个组件取代表性主示例） */
export const FEATURED_DIRECTORY: DirectoryEntry[] = FEATURED_SLUGS.flatMap((slug) => {
  const component = COMPONENTS.find((item) => item.slug === slug);
  const specimen = component?.specimens[0];
  return component && specimen ? [{ component, specimen }] : [];
});

export const findComponent = (slug: string): ComponentDoc | undefined =>
  COMPONENTS.find((component) => component.slug === slug);

/** 示例在详情页上的地址 */
export const specimenHref = ({ specimen, component }: DirectoryEntry): string =>
  `/components/${component.slug}#${specimen.slug}`;

/** 通过 shadcn CLI 安装组件的命令 */
export const cliCommand = ({ registryName }: ComponentDoc): string =>
  `pnpm dlx shadcn@latest add ${REGISTRY_ADDRESS}/${registryName}`;

export const isRecent = ({ createdAt }: ComponentDoc, now: Date): boolean =>
  now.getTime() - new Date(createdAt).getTime() <= RECENT_DAYS * 24 * 60 * 60 * 1000;

export const recentComponentSlugs = (): string[] => {
  const now = new Date();
  return COMPONENTS.filter((component) => isRecent(component, now)).map(({ slug }) => slug);
};

export const neighbours = (slug: string) => {
  const index = COMPONENTS.findIndex((component) => component.slug === slug);
  return { previous: COMPONENTS[index - 1], next: COMPONENTS[index + 1] };
};

export const relatedComponents = ({ slug, category }: ComponentDoc): ComponentDoc[] =>
  COMPONENTS.filter((other) => other.slug !== slug && other.category === category).slice(0, 3);
