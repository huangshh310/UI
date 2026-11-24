export type AiTestStatus = "passed" | "failed" | "skipped";

export type AiTestFilter = "all" | "failed" | "skipped" | "slow";

export type AiTestResultsVariant = "card" | "seamless";

export interface AiTestDiffLine {
  type: "context" | "expected" | "received";
  text: string;
}

export interface AiTestFailure {
  name: string;
  message: string;
  diff?: AiTestDiffLine[];
}

export interface AiTestCase {
  id: string;
  suite?: string;
  name: string;
  status: AiTestStatus;
  durationMs: number;
  failure?: AiTestFailure;
}

export interface AiTestFile {
  id: string;
  path: string;
  durationMs: number;
  /** 文件真实总用例数（可选，不传则按 cases.length 计算） */
  totalCount?: number;
  cases: AiTestCase[];
}

export interface AiTestRunSummary {
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
}

export interface AiTestResultsProps {
  /** 测试文件分组列表；不传则使用内置演示数据 */
  files?: AiTestFile[];
  /** 汇总计数（可选，不传则自动从 files 聚合） */
  summary?: AiTestRunSummary;
  /** 判定为“慢速”用例的阈值（毫秒），默认 200 */
  slowThresholdMs?: number;
  /** 初始激活的筛选条件，默认 "all" */
  defaultFilter?: AiTestFilter;
  /** 是否默认展开整体面板，默认 true */
  defaultOpen?: boolean;
  /** 容器视觉风格：标准卡片（card）或无框画布（seamless） */
  variant?: AiTestResultsVariant;
  /** 复制测试报告回调 */
  onCopy?: (summaryText: string) => void;
  /** 自定义类名 */
  className?: string;
}
