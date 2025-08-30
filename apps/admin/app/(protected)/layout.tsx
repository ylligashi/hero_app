"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/BottomNav";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium",
            pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent hover:text-accent-foreground",
          )}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const navItems = [
    { title: "Dashboard", href: "/" },
    { title: "Heroes", href: "/heroes" },
  ];

  const userInitials = session?.user?.name
    ? session.user.name.slice(0, 2).toUpperCase()
    : session?.user?.email?.slice(0, 2).toUpperCase() || "AD";

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Navigation Header - now much simpler since we're using bottom nav */}
      <header className="sticky top-0 z-40 border-b bg-background lg:hidden">
        <div className="flex h-14 items-center justify-center px-4">
          <div className="font-semibold">Admin Dashboard</div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-muted/10">
          <div className="flex flex-col space-y-6 p-6">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage
                  src={session?.user?.image || ""}
                  alt={session?.user?.name || "Admin"}
                />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {session?.user?.name || session?.user?.email || "Admin"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <SidebarNav className="flex-1" items={navItems} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl pb-20 lg:pb-6">
          {children}
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
