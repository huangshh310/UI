import { cva } from "class-variance-authority";
import type { AiTestFile, AiTestRunSummary } from "./ai-test-results.types.js";

export const aiTestResultsContainerVariants = cva("w-full text-foreground", {
  variants: {
    variant: {
      card: "rounded-2xl border border-border bg-card/95 p-4 shadow-sm sm:p-5",
      seamless: "bg-transparent p-0",
    },
  },
  defaultVariants: {
    variant: "card",
  },
});

export const TEST_RESULTS_DEFAULT_SUMMARY: AiTestRunSummary = {
  passed: 39,
  failed: 2,
  skipped: 1,
  duration: "6.3s",
};

export const TEST_RESULTS_DEFAULT_FILES: AiTestFile[] = [
  {
    id: "file-pricing",
    path: "src/cart/pricing.test.ts",
    durationMs: 134,
    totalCount: 6,
    cases: [
      {
        id: "t-1",
        suite: "applyCoupon",
        name: "按小计减免 10% 折扣",
        status: "passed",
        durationMs: 3,
      },
      {
        id: "t-2",
        suite: "applyCoupon",
        name: "同一张优惠券仅生效一次",
        status: "failed",
        durationMs: 4,
        failure: {
          name: "AssertionError",
          message:
            "expected { subtotal: 4200, discount: 840, ...(1) } to deeply equal { subtotal: 4200, discount: 420, ...(1) }",
          diff: [
            { type: "context", text: "Object {" },
            { type: "expected", text: '  "discount": 420,' },
            { type: "received", text: '  "discount": 840,' },
            { type: "context", text: '  "subtotal": 4200,' },
            { type: "expected", text: '  "total": 3780,' },
            { type: "received", text: '  "total": 3360,' },
            { type: "context", text: "}" },
          ],
        },
      },
      {
        id: "t-3",
        suite: "applyCoupon",
        name: "兼容旧版多币种四舍五入",
        status: "skipped",
        durationMs: 0,
      },
    ],
  },
  {
    id: "file-checkout",
    path: "src/cart/checkout.test.ts",
    durationMs: 812,
    totalCount: 4,
    cases: [
      {
        id: "t-4",
        suite: "checkoutBatch",
        name: "批量结算 500 笔订单",
        status: "passed",
        durationMs: 418,
      },
      {
        id: "t-5",
        suite: "checkoutBatch",
        name: "幂等键防重放校验",
        status: "failed",
        durationMs: 265,
        failure: {
          name: "AssertionError",
          message: "expected 200 to strictly equal 409",
          diff: [
            { type: "expected", text: "409" },
            { type: "received", text: "200" },
          ],
        },
      },
    ],
  },
];
