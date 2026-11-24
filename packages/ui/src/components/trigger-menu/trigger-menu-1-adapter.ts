/**
 * TriggerMenu 输入框适配器：封装标准文本框/文本域的光标几何与用户输入变更分发。
 */
import { textFieldAdapter, type TextEditorAdapter } from "@ui-sdk/react/trigger-menu";
import { useCallback, useState } from "react";

type NativeField = HTMLInputElement | HTMLTextAreaElement;

export const createInteractiveFieldAdapter = (field: NativeField): TextEditorAdapter => {
  const base = textFieldAdapter(field);
  let replacing = false;
  let hadBeforeInput = false;
  const markBeforeInput = () => {
    hadBeforeInput = true;
  };

  return {
    ...base,
    replace(range, content) {
      replacing = true;
      try {
        base.replace(range, content);
      } finally {
        replacing = false;
      }
    },
    subscribe(listener) {
      field.addEventListener("beforeinput", markBeforeInput, true);
      const unsub = base.subscribe((change) => {
        if (change.type === "input") {
          const promoteUser = !change.user && !replacing && hadBeforeInput;
          hadBeforeInput = false;
          listener(promoteUser ? { ...change, user: true } : change);
          return;
        }
        listener(change);
      });
      return () => {
        field.removeEventListener("beforeinput", markBeforeInput, true);
        unsub();
      };
    },
  };
};

export const useFieldAdapter = () => {
  const [editor, setEditor] = useState<TextEditorAdapter | undefined>(undefined);

  const hostRef = useCallback((host: HTMLDivElement | null) => {
    if (!host) {
      setEditor(undefined);
      return;
    }
    const field = host.querySelector<NativeField>("textarea, input");
    setEditor((prev) => {
      if (!field) return undefined;
      return prev?.element === field ? prev : createInteractiveFieldAdapter(field);
    });
  }, []);

  return { hostRef, editor };
};
