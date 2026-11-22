/**
 * 类名合并工具。
 *
 * 所有组件都通过它把「组件默认样式」与「使用者传入的 className」合并，
 * 保证使用者的类名能覆盖默认样式，而不是两者同时生效。
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并任意数量的类名输入，并消解 Tailwind 工具类之间的冲突。
 *
 * @param inputs 字符串、数组、对象或假值；假值会被忽略，便于写条件类名
 * @returns 合并后的类名字符串；同一类样式冲突时，靠后的输入胜出
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
