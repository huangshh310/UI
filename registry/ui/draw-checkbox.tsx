// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * DrawCheckbox：勾选时对勾沿 SVG 路径平滑绘制出来的复选框。
 * 内置完整的无障碍复选框语义与键盘空格切换，支持行内、卡片、胶囊、列表行与待办划线模式。
 */

import { cn } from "@/lib/utils";
import { Checkbox } from "@base-ui/react/checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle } from "lucide-react";
import { type ReactNode, useId } from "react";

const BOX_BASE = [
  "group/cb relative inline-flex shrink-0 cursor-pointer items-center justify-center",
  "border border-solid border-foreground/22 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:bg-card",
  "transition-[transform,background-color,border-color,box-shadow] duration-(--ui-duration-fast) ease-[cubic-bezier(0.34,1.56,0.64,1)]",
  "hover:border-foreground/38 active:scale-[0.88] motion-reduce:active:scale-100",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "data-invalid:border-destructive data-disabled:pointer-events-none data-disabled:opacity-50",
].join(" ");

export const drawCheckboxBoxVariants = cva(BOX_BASE, {
  variants: {
    size: {
      sm: "size-4",
      md: "size-[18px]",
      lg: "size-[22px]",
    },
    shape: {
      rounded: "rounded-[6px]",
      circle: "rounded-full",
      square: "rounded-[3px]",
    },
    tone: {
      primary:
        "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground",
      signal:
        "data-checked:border-signal data-checked:bg-signal data-checked:text-signal-foreground data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.24)] data-indeterminate:border-signal data-indeterminate:bg-signal data-indeterminate:text-signal-foreground",
      destructive:
        "data-checked:border-destructive data-checked:bg-destructive data-checked:text-destructive-foreground data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] data-indeterminate:border-destructive data-indeterminate:bg-destructive data-indeterminate:text-destructive-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    shape: "rounded",
    tone: "primary",
  },
});

export const drawCheckboxGlyphVariants = cva("shrink-0", {
  variants: {
    size: {
      sm: "size-2.5",
      md: "size-3",
      lg: "size-3.5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const ITEM_BASE = [
  "group/item cursor-pointer font-sans select-none",
  "data-disabled:cursor-not-allowed data-disabled:opacity-55",
].join(" ");

export const drawCheckboxItemVariants = cva(ITEM_BASE, {
  variants: {
    variant: {
      default: "inline-flex gap-3",
      card: [
        "flex w-full gap-3.5 rounded-2xl border border-solid border-border bg-card p-4",
        "shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-[border-color,background-color,box-shadow,transform] duration-(--ui-duration-fast)",
        "hover:border-foreground/22 hover:shadow-xs active:scale-[0.99] motion-reduce:active:scale-100",
        "data-invalid:border-destructive",
      ].join(" "),
      pill: [
        "inline-flex items-center gap-2 rounded-full border border-solid border-border bg-card px-3.5 py-2",
        "shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-[border-color,background-color,transform] duration-(--ui-duration-fast)",
        "hover:border-foreground/22 hover:bg-secondary/50 active:scale-[0.97] motion-reduce:active:scale-100",
        "data-invalid:border-destructive",
      ].join(" "),
      tile: [
        "flex w-full gap-3 rounded-xl px-3 py-2.5",
        "transition-colors duration-(--ui-duration-fast) hover:bg-secondary/65 has-[[data-checked]]:bg-secondary/45",
      ].join(" "),
    },
    tone: {
      primary: "",
      signal: "",
      destructive: "",
    },
    align: {
      start: "items-start",
      center: "items-center",
    },
  },
  compoundVariants: [
    {
      variant: "card",
      tone: "primary",
      class:
        "has-[[data-checked]]:border-primary has-[[data-checked]]:bg-secondary/35 has-[[data-checked]]:ring-1 has-[[data-checked]]:ring-primary has-[[data-checked]]:ring-inset",
    },
    {
      variant: "card",
      tone: "signal",
      class:
        "has-[[data-checked]]:border-signal has-[[data-checked]]:bg-signal/[0.04] has-[[data-checked]]:ring-1 has-[[data-checked]]:ring-signal has-[[data-checked]]:ring-inset",
    },
    {
      variant: "card",
      tone: "destructive",
      class:
        "has-[[data-checked]]:border-destructive has-[[data-checked]]:bg-destructive/[0.04] has-[[data-checked]]:ring-1 has-[[data-checked]]:ring-destructive has-[[data-checked]]:ring-inset",
    },
    {
      variant: "pill",
      tone: "primary",
      class: "has-[[data-checked]]:border-primary has-[[data-checked]]:bg-secondary/75",
    },
    {
      variant: "pill",
      tone: "signal",
      class: "has-[[data-checked]]:border-signal has-[[data-checked]]:bg-signal/[0.08]",
    },
    {
      variant: "pill",
      tone: "destructive",
      class: "has-[[data-checked]]:border-destructive has-[[data-checked]]:bg-destructive/[0.08]",
    },
  ],
  defaultVariants: {
    variant: "default",
    tone: "primary",
    align: "center",
  },
});

export const drawCheckboxTitleVariants = cva(
  [
    "font-medium text-foreground transition-colors duration-(--ui-duration-fast)",
    "group-data-strikethrough/item:group-has-[[data-checked]]/item:text-muted-foreground",
    "group-data-strikethrough/item:group-has-[[data-checked]]/item:line-through",
    "group-data-strikethrough/item:group-has-[[data-checked]]/item:decoration-muted-foreground/60",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "text-xs leading-snug",
        md: "text-[13px] leading-snug",
        lg: "text-sm leading-snug",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
type BoxVariantProps = VariantProps<typeof drawCheckboxBoxVariants>;
type ItemVariantProps = VariantProps<typeof drawCheckboxItemVariants>;

export type DrawCheckboxVariant = NonNullable<ItemVariantProps["variant"]>;
export type DrawCheckboxShape = NonNullable<BoxVariantProps["shape"]>;
export type DrawCheckboxSize = NonNullable<BoxVariantProps["size"]>;
export type DrawCheckboxTone = NonNullable<BoxVariantProps["tone"]>;
export type DrawCheckboxControlPosition = "left" | "right";

export interface DrawCheckboxProps {
  id?: string;
  name?: string;
  value?: string;
  /** 容器外观：行内默认、C 端服务卡片、胶囊标签或轻盈列表行 */
  variant?: DrawCheckboxVariant;
  /** 复选框几何形状：圆角方块、全圆胶囊或利落方角 */
  shape?: DrawCheckboxShape;
  /** 复选框与文案尺寸 */
  size?: DrawCheckboxSize;
  /** 勾选态语义色：墨色 primary、品牌信号色 signal 或警示 destructive */
  tone?: DrawCheckboxTone;
  /** 复选框位于文案左侧还是右侧（卡片/设置行常用 right） */
  controlPosition?: DrawCheckboxControlPosition;
  /** 复选框旁的标签文字 */
  label?: string;
  /** 标签下方的补充说明 */
  description?: string;
  /** 左侧图标或徽标（适合 card / pill / tile 变体） */
  icon?: ReactNode;
  /** 标签旁的轻盈徽章（如「推荐」「新功能」「PRO」） */
  badge?: ReactNode;
  /** 右侧附加信息（如价格「￥28/月」或截止时间） */
  trailing?: ReactNode;
  /** 待办清单划线模式：勾选后文案柔和淡出并添加删除线 */
  strikethrough?: boolean;
  /** 错误提示文案；传入后自动标记 aria-invalid 并播报 alert */
  error?: string;
  /** 受控勾选状态 */
  checked?: boolean;
  /** 非受控初始勾选状态，默认否 */
  defaultChecked?: boolean;
  /** 半选态（部分选中） */
  indeterminate?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
}
const CheckGlyph = ({
  indeterminate,
  size,
}: {
  indeterminate: boolean;
  size: DrawCheckboxSize;
}) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={cn(
      drawCheckboxGlyphVariants({ size }),
      "opacity-0 transition-opacity duration-(--ui-duration-instant) group-data-checked/cb:opacity-100 group-data-indeterminate/cb:opacity-100",
    )}
  >
    {indeterminate ? (
      <path d="M5 10H15" />
    ) : (
      <path
        d="M4.5 10.5L8.2 14.2L15.5 6.2"
        strokeDasharray={22}
        className="[stroke-dashoffset:22] transition-[stroke-dashoffset] duration-(--ui-duration-normal) ease-out group-data-checked/cb:[stroke-dashoffset:0]"
      />
    )}
  </svg>
);

const LeadingIcon = ({ icon, variant }: { icon?: ReactNode; variant: DrawCheckboxVariant }) => {
  if (!icon) return null;
  if (variant === "card") {
    return (
      <span
        aria-hidden="true"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-secondary/65 text-foreground transition-colors duration-(--ui-duration-fast) group-has-[[data-checked]]/item:border-border group-has-[[data-checked]]/item:bg-card"
      >
        {icon}
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="inline-flex shrink-0 items-center text-muted-foreground">
      {icon}
    </span>
  );
};

const LabelContent = ({
  label,
  description,
  badge,
  size,
}: {
  label: string;
  description?: string;
  badge?: ReactNode;
  size: DrawCheckboxSize;
}) => (
  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className={drawCheckboxTitleVariants({ size })}>{label}</span>
      {badge && (
        <span className="inline-flex items-center rounded-full border border-border/80 bg-secondary px-2 py-0.5 font-mono text-[10px] leading-none font-medium text-muted-foreground">
          {badge}
        </span>
      )}
    </span>
    {description && (
      <span className="text-xs leading-relaxed text-muted-foreground transition-opacity duration-(--ui-duration-fast) group-data-strikethrough/item:group-has-[[data-checked]]/item:opacity-60">
        {description}
      </span>
    )}
  </span>
);

const TrailingMeta = ({ trailing }: { trailing?: ReactNode }) =>
  trailing ? (
    <span className="shrink-0 font-mono text-xs font-medium text-muted-foreground tabular-nums">
      {trailing}
    </span>
  ) : null;

const CheckboxError = ({ id, error }: { id: string; error?: string }) =>
  error ? (
    <p id={id} role="alert" className={cn("m-0 flex items-start gap-1.5 text-xs text-destructive")}>
      <AlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
      <span>{error}</span>
    </p>
  ) : null;
const resolveConfig = (props: DrawCheckboxProps) => ({
  variant: (props.variant ?? "default") as DrawCheckboxVariant,
  shape: (props.shape ?? "rounded") as DrawCheckboxShape,
  size: (props.size ?? "md") as DrawCheckboxSize,
  tone: (props.tone ?? "primary") as DrawCheckboxTone,
  controlPosition: (props.controlPosition ?? "left") as DrawCheckboxControlPosition,
  indeterminate: Boolean(props.indeterminate),
});

const stripVisualProps = (props: DrawCheckboxProps) => {
  const {
    id: _id,
    variant: _variant,
    shape: _shape,
    size: _size,
    tone: _tone,
    controlPosition: _pos,
    label: _label,
    description: _desc,
    icon: _icon,
    badge: _badge,
    trailing: _trailing,
    strikethrough: _strike,
    error: _error,
    indeterminate: _indet,
    onCheckedChange: _onChange,
    className: _className,
    "aria-label": _ariaLabel,
    ...checkboxProps
  } = props;
  return checkboxProps;
};

const CheckboxControl = ({
  props,
  controlId,
  errorId,
  alignStart,
}: {
  props: DrawCheckboxProps;
  controlId: string;
  errorId: string;
  alignStart: boolean;
}) => {
  const { shape, size, tone, indeterminate } = resolveConfig(props);
  const invalid = Boolean(props.error);

  return (
    <Checkbox.Root
      {...stripVisualProps(props)}
      id={controlId}
      indeterminate={indeterminate}
      aria-label={props.label ? undefined : props["aria-label"]}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? errorId : undefined}
      onCheckedChange={(next) => props.onCheckedChange?.(next)}
      data-slot="draw-checkbox"
      data-shape={shape}
      data-size={size}
      data-invalid={invalid ? "" : undefined}
      className={cn(
        drawCheckboxBoxVariants({ size, shape, tone }),
        alignStart && "mt-0.5",
        !props.label && props.className,
      )}
    >
      <Checkbox.Indicator keepMounted className="inline-flex items-center justify-center">
        <CheckGlyph indeterminate={indeterminate} size={size} />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
};

const LabeledCheckbox = ({
  props,
  controlId,
  align,
  control,
}: {
  props: DrawCheckboxProps;
  controlId: string;
  align: "start" | "center";
  control: ReactNode;
}) => {
  const { variant, size, tone, controlPosition } = resolveConfig(props);

  return (
    <label
      htmlFor={controlId}
      data-slot="draw-checkbox-item"
      data-variant={variant}
      data-disabled={props.disabled ? "" : undefined}
      data-invalid={props.error ? "" : undefined}
      data-strikethrough={props.strikethrough ? "" : undefined}
      className={cn(drawCheckboxItemVariants({ variant, tone, align }), props.className)}
    >
      {controlPosition === "left" && control}
      <LeadingIcon icon={props.icon} variant={variant} />
      <LabelContent
        label={props.label ?? ""}
        description={props.description}
        badge={props.badge}
        size={size}
      />
      <TrailingMeta trailing={props.trailing} />
      {controlPosition === "right" && control}
    </label>
  );
};

export const DrawCheckbox = (props: DrawCheckboxProps) => {
  const autoId = useId();
  const controlId = props.id ?? autoId;
  const errorId = `${controlId}-error`;
  const { variant } = resolveConfig(props);
  const align = variant === "pill" || !props.description ? "center" : "start";
  const control = (
    <CheckboxControl
      props={props}
      controlId={controlId}
      errorId={errorId}
      alignStart={Boolean(props.description) && align === "start"}
    />
  );

  const body = props.label ? (
    <LabeledCheckbox props={props} controlId={controlId} align={align} control={control} />
  ) : (
    control
  );

  if (!props.error) return body;

  const isInline = !props.label || variant === "default" || variant === "pill";
  return (
    <div className={cn("flex flex-col gap-1.5", isInline && "inline-flex")}>
      {body}
      <CheckboxError id={errorId} error={props.error} />
    </div>
  );
};
