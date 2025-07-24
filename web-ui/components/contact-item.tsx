import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastActive: string;
  isOnline: boolean;
  unreadCount: number;
}

interface ContactItemProps {
  contact: Contact;
  isGroup?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  contact,
  isGroup = false,
  selected = false,
  onClick,
}) => (
  <div
    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent ${
      selected ? "bg-accent" : ""
    }`}
    onClick={onClick}
  >
    <div className="relative">
      <Avatar className="w-12 h-12">
        <AvatarImage src={contact.avatar} alt={contact.name} />
        <AvatarFallback>
          {contact.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      {!isGroup && (
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
            contact.isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium truncate">{contact.name}</p>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">
            {contact.lastActive}
          </span>
          {contact.unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center"
            >
              {contact.unreadCount}
            </Badge>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground truncate">
        {contact.lastMessage}
      </p>
    </div>
  </div>
);
