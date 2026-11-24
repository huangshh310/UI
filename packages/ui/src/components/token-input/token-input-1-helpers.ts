/**
 * TokenInput 纯数据转换工具：在自有公开类型与底层编辑器数据模型之间无损映射。
 */
import { toText, type Token, type TokenInputValue } from "@ui-sdk/react/token-input";
import type { TriggerDefinition } from "@ui-sdk/react/trigger-menu";
import type {
  ContextToken,
  ContextTokenTone,
  TokenInputSegment,
  TokenTriggerSource,
} from "./token-input.types.js";

export const toSdkValue = (
  segments: TokenInputSegment[] | undefined,
): TokenInputValue | undefined =>
  segments?.map((seg) =>
    typeof seg === "string"
      ? seg
      : {
          id: seg.id,
          type: seg.type,
          value: seg.value,
          label: seg.label,
          data: {
            tone: seg.tone,
            status: seg.status,
            trigger: seg.type === "skill" || seg.type === "command" ? "/" : "@",
          },
        },
  );

const extractTone = (raw: unknown): ContextTokenTone | undefined =>
  raw === "default" || raw === "signal" || raw === "success" || raw === "warning" ? raw : undefined;

const extractStatus = (raw: unknown): ContextToken["status"] =>
  raw === "idle" || raw === "loading" || raw === "done" ? raw : undefined;

export const fromSdkToken = (token: Token): ContextToken => ({
  id: token.id,
  type: token.type,
  value: token.value,
  label: token.label,
  tone: extractTone(token.data?.tone),
  status: extractStatus(token.data?.status),
});

export const fromSdkValue = (val: TokenInputValue): TokenInputSegment[] =>
  val.map((seg) => (typeof seg === "string" ? seg : fromSdkToken(seg)));

export const serializeTokenValue = (segments: TokenInputSegment[]): string =>
  toText(toSdkValue(segments) ?? []);

export const toTokenTriggerDefs = (sources: TokenTriggerSource[]): TriggerDefinition[] =>
  sources.map((src) => ({
    char: src.char,
    type: src.type,
    boundary: src.boundary,
    items: src.items.map((item) => ({
      value: item.value,
      label: item.label,
      keywords: item.keywords,
      disabled: item.disabled,
    })),
  }));
