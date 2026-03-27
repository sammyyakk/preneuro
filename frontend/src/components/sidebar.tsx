"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Brain,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Assessments", href: "/assessments", icon: ClipboardList },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClick}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
              isActive
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <item.icon className={cn(
              "h-4 w-4 transition-transform duration-200",
              "group-hover:scale-105",
            )} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/90 backdrop-blur-sm transition-all duration-200 hover:bg-muted active:scale-95">
            <Menu className="h-4 w-4" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 border-r border-border">
            <div className="h-full flex flex-col bg-background">
              {/* Logo */}
              <div className="flex items-center gap-3 h-16 px-5 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                  <Brain className="h-4 w-4 text-background" />
                </div>
                <div>
                  <span className="text-sm font-semibold tracking-tight">PreNeuro</span>
                  <p className="text-[0.625rem] text-muted-foreground uppercase tracking-widest font-medium">AI Diagnostics</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 p-3 pt-4">
                <p className="text-[0.625rem] font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-3">
                  Menu
                </p>
                <NavLinks onClick={() => setOpen(false)} />
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-border">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
                      <span className="text-[0.625rem] font-semibold text-background">AM</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium">Dr. Arjun Mehta</p>
                      <p className="text-[0.625rem] text-muted-foreground">Neurologist</p>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile theme toggle */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-background border-r border-border">
        {/* Logo */}
        <div className="flex items-center gap-3 h-16 px-5 border-b border-border animate-fade-in">
          <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
            <Brain className="h-4 w-4 text-background" />
          </div>
          <div>
            <span className="text-sm font-semibold tracking-tight">PreNeuro</span>
            <p className="text-[0.625rem] text-muted-foreground uppercase tracking-widest font-medium">AI Diagnostics</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-3 pt-6">
          <p className="text-[0.625rem] font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-3">
            Menu
          </p>
          <NavLinks />
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-[0.625rem] font-semibold text-background">AM</span>
              </div>
              <div>
                <p className="text-xs font-medium">Dr. Arjun Mehta</p>
                <p className="text-[0.625rem] text-muted-foreground">Neurologist</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
