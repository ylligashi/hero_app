"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Heroes",
      href: "/heroes",
      icon: Users,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden">
      <nav className="mx-auto max-w-screen-lg flex justify-around" aria-label="Mobile navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-3 px-4 min-w-[80px] transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-6 w-6" aria-hidden="true" />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}