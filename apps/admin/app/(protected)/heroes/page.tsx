import Link from "next/link";
import { prisma } from "@repo/database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Fetch heroes data from the database
async function getHeroes() {
  try {
    return await prisma.hero.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to fetch heroes:", error);
    throw new Error("Failed to fetch heroes");
  }
}

export default async function HeroesPage() {
  const heroes = await getHeroes();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Heroes</h1>
          <p className="text-muted-foreground">
            Manage your AI hero personalities
          </p>
        </div>
        <div>
          <Link href="/heroes/create">
            <Button>Add Hero</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Heroes List</CardTitle>
          <CardDescription>
            View and manage your hero characters that users can chat with
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {heroes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No heroes found. Create your first hero!
                  </TableCell>
                </TableRow>
              ) : (
                heroes.map((hero) => (
                  <TableRow key={hero.id}>
                    <TableCell className="font-medium">{hero.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {hero.description || "No description"}
                    </TableCell>
                    <TableCell>{hero.modelName}</TableCell>
                    <TableCell>
                      {new Date(hero.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(hero.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/heroes/${hero.id}/edit`}>Edit</Link>
                      </Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}