import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample hero data
const heroes = [
  {
    id: "1",
    name: "Einstein",
    description: "The brilliant physicist who will explain complex concepts in simple terms",
    modelName: "llama3.2:latest",
    avatarUrl: null,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-07-20"),
  },
  {
    id: "2",
    name: "Shakespeare",
    description: "The legendary playwright who will respond in eloquent verse",
    modelName: "llama3.2:latest",
    avatarUrl: null,
    createdAt: new Date("2025-02-10"),
    updatedAt: new Date("2025-06-18"),
  },
  {
    id: "3",
    name: "Marie Curie",
    description: "The pioneering scientist who will inspire with her dedication to research",
    modelName: "llama3.2:latest",
    avatarUrl: null,
    createdAt: new Date("2025-03-05"),
    updatedAt: new Date("2025-08-02"),
  },
  {
    id: "4",
    name: "Aristotle",
    description: "The philosopher who will guide you through logical reasoning",
    modelName: "llama3.2:latest",
    avatarUrl: null,
    createdAt: new Date("2025-04-20"),
    updatedAt: new Date("2025-07-30"),
  },
  {
    id: "5",
    name: "Ada Lovelace",
    description: "The first computer programmer who will discuss technology with vision",
    modelName: "mistral:latest",
    avatarUrl: null,
    createdAt: new Date("2025-05-12"),
    updatedAt: new Date("2025-08-05"),
  },
];

export default function HeroesPage() {
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
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Add Hero
          </button>
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
              {heroes.map((hero) => (
                <TableRow key={hero.id}>
                  <TableCell className="font-medium">{hero.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {hero.description}
                  </TableCell>
                  <TableCell>{hero.modelName}</TableCell>
                  <TableCell>
                    {hero.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {hero.updatedAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3">
                      Edit
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 px-3">
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}