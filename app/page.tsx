"use client";

import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        landing page
        <p>Signed in as {session.user?.email}</p>
        <img src={session.user?.image || ""} alt="Profile" width={50} />
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }

  return (
    <div>
      landing page
      <p>Not signed in</p>
      <Button onClick={() => signIn("google")}>Sign in with Google</Button>
    </div>
  );
}
