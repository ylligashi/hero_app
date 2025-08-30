"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";

interface ChatInputProps {
  conversationId: string;
}

export default function ChatInput({ conversationId }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isLoading) return;

    setIsLoading(true);

    try {
      // Send message to server
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Clear input and refresh messages
      setMessage("");
      router.refresh();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <Textarea
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="resize-none min-h-[80px]"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
        <SendIcon className="h-4 w-4" />
      </Button>
    </form>
  );
}
