"use client";
import { Code, LogOut } from "lucide-react";
import { signOut, useSession, signIn } from "next-auth/react";
import { Button } from "./ui/button";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Code className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">CodeProctor</h1>
        </div>

        {/* Conditional User Section */}
        {session ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={session.user?.image || ""}
                alt="Profile"
                className="w-9 h-9 rounded-full ring-2 ring-border"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  {session.user?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session.user?.email}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </div>
        ) : (
          <Button variant="default" onClick={() => signIn("google")}>
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
