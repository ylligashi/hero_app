"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOutIcon, UserIcon } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
            <AvatarFallback>
              <UserIcon className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{session?.user?.name || "User"}</CardTitle>
            <CardDescription>{session?.user?.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{session?.user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role</span>
              <span>{session?.user?.role ? String(session.user.role) : "User"}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={handleSignOut}
            disabled={isLoading}
          >
            <LogOutIcon className="h-4 w-4 mr-2" />
            {isLoading ? "Signing out..." : "Sign out"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}