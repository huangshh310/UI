"use client";

/**
 * 示例：Message 无框助手排版、多版本分支切换与原位编辑。
 */
import {
  Message,
  MessageAction,
  MessageActions,
  MessageBranch,
  MessageBranchContent,
  MessageBranchSelector,
  MessageContent,
  MessageEditForm,
} from "@matt-ui/ui";
import { Copy, Pencil, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

const UserEditableTurn = () => {
  const [userText, setUserText] = useState("如何设计不显杂乱的智能体多步工具轨迹？");
  const [editing, setEditing] = useState(false);

  return (
    <Message from="user" timestamp="14:20">
      {editing ? (
        <MessageEditForm
          defaultValue={userText}
          onCancel={() => setEditing(false)}
          onSave={(next) => {
            setUserText(next);
            setEditing(false);
          }}
        />
      ) : (
        <>
          <MessageContent>{userText}</MessageContent>
          <MessageActions revealOnHover>
            <MessageAction label="编辑提问" onClick={() => setEditing(true)}>
              <Pencil aria-hidden="true" className="size-3.5" />
            </MessageAction>
          </MessageActions>
        </>
      )}
    </Message>
  );
};

export default function MessageBasicDemo() {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-5">
      <UserEditableTurn />
      <Message from="assistant" author="Matt AI" model="Claude 4.5" timestamp="14:20">
        <MessageBranch>
          <MessageBranchContent>
            <MessageContent key="v1">
              将连续的只读检索收敛为单行轨迹触发器，仅在用户需要排查细节时沿 1px
              左侧引导线展开，助手正文直接流淌在无框画布上。
            </MessageContent>
            <MessageContent key="v2">
              遵循「状态即摘要」原则：思考中显示微光秒表，完成后自动收起为「已思考 2.4
              秒」，把视觉重心留给最终结论与输入器。
            </MessageContent>
          </MessageBranchContent>
          <MessageActions>
            <MessageAction
              label="复制回复"
              copyText="将连续的只读检索收敛为单行轨迹触发器，助手正文直接铺在无框画布上。"
            >
              <Copy aria-hidden="true" className="size-3.5" />
            </MessageAction>
            <MessageAction
              label="赞同回复"
              active={vote === "up"}
              onClick={() => setVote(vote === "up" ? null : "up")}
            >
              <ThumbsUp aria-hidden="true" className="size-3.5" />
            </MessageAction>
            <MessageAction
              label="改进回复"
              active={vote === "down"}
              onClick={() => setVote(vote === "down" ? null : "down")}
            >
              <ThumbsDown aria-hidden="true" className="size-3.5" />
            </MessageAction>
            <MessageAction label="重新生成">
              <RefreshCw aria-hidden="true" className="size-3.5" />
            </MessageAction>
            <MessageBranchSelector />
          </MessageActions>
        </MessageBranch>
      </Message>
    </div>
  );
}
