/**
 * 两套实现共用的数据与模拟的异步搜索。
 * 数据相同，测试才能用同一组断言比较两个交互底座。
 */

/** 一个可选项：value 是提交值，label 是展示文本 */
export interface Fruit {
  value: string;
  label: string;
}

export const FRUITS: Fruit[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
];

/** 模拟的网络延迟，足够让测试观察到加载中的状态 */
export const SEARCH_DELAY_MS = 300;

/**
 * 模拟远程搜索：延迟后返回 label 包含关键字的选项。
 *
 * @param query 搜索关键字，忽略首尾空白与大小写
 * @param signal 取消信号；取消后 Promise 以 signal.reason 拒绝，调用方据此丢弃过期结果
 */
export const searchFruits = (query: string, signal?: AbortSignal): Promise<Fruit[]> =>
  new Promise((resolve, reject) => {
    const needle = query.trim().toLowerCase();
    const timer = setTimeout(
      () => resolve(FRUITS.filter(({ label }) => label.toLowerCase().includes(needle))),
      SEARCH_DELAY_MS,
    );
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });
