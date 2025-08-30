import { prisma } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import ChatInput from "./ChatInput";

interface ConversationPageProps {
  params: {
    id: string;
  };
}

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      hero: true,
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!conversation) {
    notFound();
  }

  return (
    <div className="container flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Avatar>
          <AvatarImage
            src={conversation.hero.avatarUrl || ""}
            alt={conversation.hero.name}
          />
          <AvatarFallback>
            {conversation.hero.name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-semibold">
            {conversation.title ||
              `Conversation with ${conversation.hero.name}`}
          </h1>
          <p className="text-xs text-muted-foreground">
            {conversation.hero.name}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          conversation.messages.map((message) => {
            const isUser = message.role === "USER";
            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-[80%] ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  <CardContent className="p-3">
                    <p className="text-sm">{message.content}</p>
                    <div className="text-xs mt-1 opacity-70">
                      {formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <ChatInput conversationId={conversation.id} />
      </div>
    </div>
  );
}
