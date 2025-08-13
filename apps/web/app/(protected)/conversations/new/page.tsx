import { prisma } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

interface NewConversationPageProps {
  searchParams: {
    heroId?: string;
  };
}

export default async function NewConversationPage({ searchParams }: NewConversationPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }
  
  const { heroId } = searchParams;
  
  if (!heroId) {
    redirect("/heroes");
  }
  
  // Verify the hero exists
  const hero = await prisma.hero.findUnique({
    where: {
      id: heroId,
    },
  });
  
  if (!hero) {
    redirect("/heroes");
  }
  
  // Create a new conversation
  const conversation = await prisma.conversation.create({
    data: {
      userId: session.user.id,
      heroId: hero.id,
      title: `Conversation with ${hero.name}`,
    },
  });
  
  // Redirect to the new conversation
  redirect(`/conversations/${conversation.id}`);
}