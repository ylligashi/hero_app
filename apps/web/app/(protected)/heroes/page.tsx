import { prisma } from "@repo/database";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function HeroesPage() {
  const heroes = await prisma.hero.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Heroes</h1>
        <p className="text-muted-foreground">Choose a hero to start a conversation</p>
      </div>

      <div className="grid gap-4">
        {heroes.map((hero) => (
          <Card key={hero.id}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar>
                <AvatarImage src={hero.avatarUrl || ""} alt={hero.name} />
                <AvatarFallback>{hero.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{hero.name}</CardTitle>
                {hero.description && (
                  <CardDescription className="line-clamp-1">
                    {hero.description}
                  </CardDescription>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {hero.description || "No description available"}
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                Model: {hero.modelName}
              </div>
            </CardContent>
            <CardFooter>
              <Link 
                href={`/conversations/new?heroId=${hero.id}`}
                className="w-full"
              >
                <Button className="w-full">Start Conversation</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}

        {heroes.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No heroes available</p>
          </div>
        )}
      </div>
    </div>
  );
}