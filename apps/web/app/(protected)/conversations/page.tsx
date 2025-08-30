import { prisma } from "@repo/database";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default async function ConversationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Unauthorized</div>;
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      hero: true,
      messages: {
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Conversations</h1>
          <p className="text-muted-foreground">
            Your conversations with heroes
          </p>
        </div>
        <Link href="/heroes">
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            New
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {conversations.map((conversation) => {
          const lastMessage =
            conversation.messages[0]?.content || "No messages yet";
          const formattedDate = conversation.updatedAt
            ? formatDistanceToNow(new Date(conversation.updatedAt), {
                addSuffix: true,
              })
            : "";

          return (
            <Link
              key={conversation.id}
              href={`/conversations/${conversation.id}`}
            >
              <Card className="hover:bg-accent/50 transition-colors">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar>
                    <AvatarImage
                      src={conversation.hero.avatarUrl || ""}
                      alt={conversation.hero.name}
                    />
                    <AvatarFallback>
                      {conversation.hero.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <CardTitle className="text-lg">
                      {conversation.title ||
                        `Conversation with ${conversation.hero.name}`}
                    </CardTitle>
                    <CardDescription className="truncate">
                      {conversation.hero.name}
                    </CardDescription>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formattedDate}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground truncate">
                    {lastMessage}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}

        {conversations.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">No conversations yet</p>
            <Link href="/heroes">
              <Button>Start a Conversation</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
