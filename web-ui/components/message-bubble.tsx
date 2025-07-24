import { formatDistanceToNow } from "date-fns";
import React from "react";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: "text" | "image";
  imageUrl?: string;
}

interface MessageBubbleProps {
  message: any;
  user: any;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  user,
}) => (
  <div
    className={`flex mb-4 ${
      message.senderId === user?.id ? "justify-end" : "justify-start"
    }`}
  >
    <div className="flex flex-col max-w-xs lg:max-w-md">
      {/* Show sender name for group messages if not from current user */}
      {message.sender &&
        message.sender.name &&
        message.senderId !== user?.id && (
          <span className="text-xs font-semibold text-muted-foreground mb-1 ml-2">
            {message.sender.name}
          </span>
        )}
      <div
        className={`px-4 py-2 rounded-2xl ${
          message.senderId === user?.id
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {message.type === "image" && message.imageUrl ? (
          <div className="mb-2">
            <img
              src={message.imageUrl}
              alt={message.content}
              className="max-w-full h-auto rounded-lg"
            />
            <p className="text-xs mt-1 opacity-70">{message.content}</p>
          </div>
        ) : (
          <p className="text-sm break-words">{message.content}</p>
        )}
        <p
          className={`text-xs mt-1 ${
            message.senderId === user?.id
              ? "text-primary-foreground/70"
              : "text-muted-foreground/70"
          }`}
        >
         { message.timestamp}
        </p>
      </div>
    </div>
  </div>
);
