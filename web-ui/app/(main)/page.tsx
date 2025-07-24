"use client";

import { ContactItem } from "@/components/contact-item";
import { EmojiPicker } from "@/components/emoji-picker";
import { ImageUpload } from "@/components/image-upload";
import { MessageBubble } from "@/components/message-bubble";
import { ModeToggle } from "@/components/mode-toggle";
import { SettingsPanel } from "@/components/settings-panel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { backendUrl } from "@/config";
import { useSocket } from "@/context/SocketProvider";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import {
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  Users,
  Video,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastActive: string;
  isOnline: boolean;
  unreadCount: number;
  conversationId?: string; // Add conversationId as optional
  clerkId?: string; // Add clerkId as optional for type safety
}

interface Message {
  id: string;
  sender: string; // Clerk ID
  content: string;
  timestamp: string;
  type: "text" | "image";
  conversationId: string | null;
  imageUrl?: string;
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  // REMOVE: const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isLoaded, isSignedIn } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const { sendMessage, messages, setMessages, joinRoom, leaveRoom } =
    useSocket(); // Use messages from context
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [dialogTab, setDialogTab] = useState("addUser");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedGroupContacts, setSelectedGroupContacts] = useState<string[]>(
    []
  );
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupSearch, setGroupSearch] = useState("");
  const [groupSearchResults, setGroupSearchResults] = useState<any[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations from backend
  useEffect(() => {
    const fetchContactsAndGroups = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(
          `${backendUrl}/conversation?clerkId=${user.id}`
        );
        const conversations = res.data.conversations || [];
        // Contacts: type SINGLE
        // Show the name of the user whose clerkId does NOT match the current user's id
        const contactsList = conversations
          .filter((conv: any) => conv.type === "SINGLE")
          .map((conv: any) => {
            const otherUser = conv.users.find(
              (u: any) => u.clerkId !== user.id
            );
            return {
              id: otherUser?.id || conv.id,
              name: otherUser?.name || otherUser?.email || "Unknown",
              avatar: otherUser?.imageUrl || otherUser?.avatar || "",
              lastMessage: conv.lastMessage || "",
              lastActive: "recently",
              isOnline: false,
              unreadCount: 0,
              clerkId: otherUser?.clerkId || otherUser?.id,
              conversationId: conv.id,
            };
          });
        // Groups: type GROUP
        const groupsList = conversations
          .filter((conv: any) => conv.type === "GROUP")
          .map((conv: any) => ({
            id: conv.id,
            name: conv.name || "Unnamed Group",
            avatar: conv.avatar || "", // If you have a group avatar field
            lastMessage: conv.lastMessage || "",
            lastActive: "recently",
            isOnline: false,
            unreadCount: 0,
            conversationId: conv.id,
          }));
        setContacts(contactsList);
        setGroups(groupsList);
      } catch (err) {
        setContacts([]);
        setGroups([]);
      }
    };
    fetchContactsAndGroups();
  }, [user?.id]);

  // Fetch conversation details when a contact is selected
  const fetchConversationDetails = async (conversationId: string) => {
    try {
      const res = await axios.get(
        `${backendUrl}/conversation/${conversationId}`
      );
      const { conversation } = res.data;
      const mappedMessages = (conversation.messages || []).map((msg: any) => ({
        id: msg.id,
        sender: msg.sender, // include sender object for group messages
        senderId: msg.senderId,
        content: msg.content,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: msg.type === "TEXT" ? "text" : "image",
        conversationId: msg.conversationId,
        imageUrl: msg.imageUrl,
      }));
      setMessages(mappedMessages);
    } catch (err) {
      // For now, skip setMessages here
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: any = {
        id: Date.now().toString(),
        sender: {
          clerkId: user?.id || "",
          name: user?.fullName || "",
          email: user?.emailAddresses[0].emailAddress || "",
          imageUrl: user?.imageUrl || "",
        },
        senderId: user?.id || "", // Keep senderId for backend
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
        conversationId: selectedContact.conversationId,
        receiverId: selectedContact.clerkId,
      };
      // REMOVE: setMessages([...messages, message]);
      sendMessage(message);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
  };

  const handleImageSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    const message: any = {
      id: Date.now().toString(),
      sender: user?.id || "", // Clerk ID or empty string
      content: file.name,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "image",
      imageUrl,
    };
    // REMOVE: setMessages([...messages, message]);
    sendMessage(message);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add user to contacts and select
  const handleAddUser = async (clickedUser: any) => {
    // Add user to contacts if not already present
    setContacts((prev) => {
      if (prev.some((c) => c.id === clickedUser.id)) return prev;
      return [
        {
          id: clickedUser.id,
          name: clickedUser.name,
          avatar: clickedUser.imageUrl || clickedUser.avatar || "",
          lastMessage: "",
          lastActive: "just now",
          isOnline: true,
          unreadCount: 0,
          clerkId: clickedUser.clerkId || clickedUser.id, // fallback if needed
        },
        ...prev,
      ];
    });
    setSelectedContact({
      id: clickedUser.id,
      name: clickedUser.name,
      avatar: clickedUser.imageUrl || clickedUser.avatar || "",
      lastMessage: "",
      lastActive: "just now",
      isOnline: true,
      unreadCount: 0,
      clerkId: clickedUser?.clerkId,
    });
    await axios.post(`${backendUrl}/conversation`, {
      senderId: user?.id,
      receiverId: clickedUser?.clerkId,
    });
    setIsAddUserOpen(false);
    setSearchEmail("");
    setSearchResults([]);
  };

  // Search handler
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchEmail(value);
    if (value.length > 2 && user?.id) {
      try {
        const res = await axios.post(`${backendUrl}/user/search-users`, {
          clerkId: user.id,
          email: value,
        });

        setSearchResults(res.data.users || []);
      } catch (err) {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleToggleContact = (contactId: string) => {
    setSelectedGroupContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedGroupContacts.length < 2) return;
    setIsCreatingGroup(true);
    try {
      const res = await axios.post(`${backendUrl}/conversation/group/create`, {
        name: groupName,
        description: groupDescription,
        users: selectedGroupContacts,
        clerkId: user?.id,
      });
      // Add the new group to the top of the groups list
      const newGroup = res.data?.group || {
        id: res.data?.group?.id || Date.now().toString(),
        name: groupName,
        avatar: "", // Optionally set a default or from response
        lastMessage: "",
        lastActive: "just now",
        isOnline: false,
        unreadCount: 0,
        conversationId: res.data?.group?.id || undefined,
      };
      setGroups((prev) => [newGroup, ...prev]);
      setGroupName("");
      setGroupDescription("");
      setSelectedGroupContacts([]);
      setIsAddUserOpen(false);
      setDialogTab("addUser");
    } catch (err) {
      // handle error
    } finally {
      setIsCreatingGroup(false);
    }
  };

  // Group search handler
  const handleGroupSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGroupSearch(value);
    if (value.length > 2 && user?.id) {
      try {
        const res = await axios.post(`${backendUrl}/user/search-users`, {
          clerkId: user.id,
          email: value,
        });
        setGroupSearchResults(res.data.users || []);
      } catch (err) {
        setGroupSearchResults([]);
      }
    } else {
      setGroupSearchResults([]);
    }
  };

  // Merge contacts and search results, dedupe by clerkId
  const allGroupCandidates = [
    ...contacts,
    ...groupSearchResults.filter(
      (u) => u.clerkId && !contacts.some((c) => c.clerkId === u.clerkId)
    ),
  ];

  // Always show selected contacts at the top
  const sortedGroupCandidates = [
    ...allGroupCandidates.filter((c) =>
      selectedGroupContacts.includes(c.clerkId)
    ),
    ...allGroupCandidates.filter(
      (c) => !selectedGroupContacts.includes(c.clerkId)
    ),
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-80 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 h-full flex flex-col`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b bg-card flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Quark Chat
              </h1>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search contacts or groups..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {dialogTab === "addUser"
                        ? "Add User by Email"
                        : "Create Group"}
                    </DialogTitle>
                  </DialogHeader>
                  <Tabs
                    value={dialogTab}
                    onValueChange={setDialogTab}
                    className="mb-4"
                  >
                    <TabsList>
                      <TabsTrigger value="addUser">Add User</TabsTrigger>
                      <TabsTrigger value="createGroup">
                        Create Group
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="addUser">
                      <Input
                        placeholder="Search user by email..."
                        value={searchEmail}
                        onChange={handleSearch}
                        className="mb-4"
                      />
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {searchResults.length === 0 &&
                          searchEmail.length > 2 && (
                            <div className="text-sm text-muted-foreground">
                              No users found.
                            </div>
                          )}
                        {searchResults.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center p-2 rounded hover:bg-accent cursor-pointer"
                            onClick={() => handleAddUser(user)}
                          >
                            <Avatar className="w-8 h-8 mr-2">
                              <AvatarImage src={user.imageUrl} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="createGroup">
                      <Input
                        placeholder="Group Name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="mb-2"
                      />
                      <Input
                        placeholder="Group Description (optional)"
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        className="mb-2"
                      />
                      <Input
                        placeholder="Search users to add..."
                        value={groupSearch}
                        onChange={handleGroupSearch}
                        className="mb-4"
                      />
                      <div className="mb-2 text-sm font-medium">
                        Select Contacts (at least 2):
                      </div>
                      <div className="max-h-40 overflow-y-auto mb-4 space-y-2">
                        {sortedGroupCandidates.map((contact) => {
                          if (!contact.clerkId) return null;
                          return (
                            <div
                              key={contact.clerkId}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                checked={selectedGroupContacts.includes(
                                  contact.clerkId
                                )}
                                onCheckedChange={() =>
                                  handleToggleContact(contact.clerkId!)
                                }
                                id={`contact-${contact.clerkId}`}
                              />
                              <label
                                htmlFor={`contact-${contact.clerkId}`}
                                className="flex items-center cursor-pointer"
                              >
                                <Avatar className="w-6 h-6 mr-2">
                                  <AvatarImage
                                    src={contact.avatar || contact.imageUrl}
                                  />
                                  <AvatarFallback>
                                    {(
                                      contact.name ||
                                      contact.fullName ||
                                      contact.email ||
                                      "?"
                                    )
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span>
                                  {contact.name ||
                                    contact.fullName ||
                                    contact.email}
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                      <Button
                        onClick={handleCreateGroup}
                        disabled={
                          isCreatingGroup ||
                          !groupName ||
                          selectedGroupContacts.length < 2
                        }
                        className="w-full"
                      >
                        {isCreatingGroup ? "Creating..." : "Create Group"}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
              <ModeToggle />
            </div>
          </div>

          {/* Contacts and Groups */}
          <ScrollArea className="flex-1 px-4 min-h-0">
            <div className="py-4">
              {/* Contacts */}
              {filteredContacts.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Contacts
                    </h2>
                  </div>
                  <div className="space-y-1">
                    {filteredContacts.map((contact) => (
                      <ContactItem
                        key={contact.id}
                        contact={contact}
                        selected={
                          selectedContact && selectedContact.id === contact.id
                        }
                        onClick={() => {
                          // Leave previous room if any
                          if (
                            selectedContact &&
                            selectedContact.conversationId
                          ) {
                            leaveRoom(selectedContact.conversationId);
                          }
                          setSelectedContact(contact);
                          setIsSidebarOpen(false);
                          fetchConversationDetails(
                            (contact as Contact & { conversationId: string })
                              .conversationId
                          );
                          joinRoom(
                            (contact as Contact & { conversationId: string })
                              .conversationId
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Separator className="mb-6" />

              {/* Groups */}
              {filteredGroups.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Groups
                    </h2>
                  </div>
                  <div className="space-y-1">
                    {filteredGroups.map((group) => (
                      <ContactItem
                        key={group.id}
                        contact={group}
                        isGroup
                        selected={
                          selectedContact && selectedContact.id === group.id
                        }
                        onClick={() => {
                          if (
                            selectedContact &&
                            selectedContact.conversationId
                          ) {
                            leaveRoom(selectedContact.conversationId);
                          }
                          setSelectedContact(group);
                          setIsSidebarOpen(false);
                          fetchConversationDetails(
                            (group as Contact & { conversationId: string })
                              .conversationId
                          );
                          joinRoom(
                            (group as Contact & { conversationId: string })
                              .conversationId
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* My Account */}
          <div className="p-4 border-t bg-card flex-shrink-0">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                  {isSignedIn &&
                    isLoaded &&
                    user &&
                    user.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {isSignedIn && isLoaded && user && user.fullName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {isSignedIn &&
                    isLoaded &&
                    user &&
                    user.emailAddresses[0].emailAddress}
                </p>
              </div>
              <SettingsPanel>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </SettingsPanel>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="px-4 py-3 border-b bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2"></div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={selectedContact.avatar}
                      alt={selectedContact.name}
                    />
                    <AvatarFallback>
                      {selectedContact.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold">
                      {selectedContact.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedContact.isOnline
                        ? "Online"
                        : `Last active ${selectedContact.lastActive}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message: any, index: number) => (
                  <MessageBubble key={index} message={message} user={user} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="px-4 py-3 border-t bg-card">
              <div className="flex items-center space-x-2">
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                <ImageUpload onImageSelect={handleImageSelect} />
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button variant="ghost" size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <div className="text-2xl mb-2">
              Select a contact to start chatting
            </div>
            <div className="text-sm">Your conversations will appear here.</div>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
