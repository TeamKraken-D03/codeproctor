import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 p-6">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to CodeProctor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A comprehensive code evaluation platform for students, educators,
            and administrators.
          </p>
          <Link href="/auth/login">
            <Button className="mt-4">Get started</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
