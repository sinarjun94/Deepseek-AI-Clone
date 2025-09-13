import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User } from "lucide-react";

const CodeRenderer = ({ node, inline, className, children, ...props }) => {
  // Same as previous step, for styling code blocks
  const match = /language-(\w+)/.exec(className || "");
  if (!inline) {
    return (
      <div className="code-block-container">
        <pre className="code-block-pre">
          <code>{String(children)}</code>
        </pre>
      </div>
    );
  }
  return <code className="inline-code">{children}</code>;
};

const MessageBubble = React.memo(({ message, isTyping = false }) => {
  const isUser = message.role === "user";

  const bubbleClasses = isUser
    ? "bg-blue-600 text-white self-end"
    : "bg-[#2d2d2d] text-gray-200 self-start";

  const Icon = isUser ? User : Bot;

  return (
    <div
      className={`flex items-start gap-3 w-full max-w-full my-2 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="w-8 h-8 flex-shrink-0 bg-[#2d2d2d] rounded-full flex items-center justify-center mt-1">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div
        className={`rounded-xl px-4 py-3 max-w-[85%] md:max-w-[75%] ${bubbleClasses} ${
          isTyping ? "animate-pulse" : ""
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{ code: CodeRenderer }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
});

export default MessageBubble;
