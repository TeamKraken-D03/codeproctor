import sql from "@/lib/db";
import { assignRoleToUser } from "@/repository/user.repository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { newRole } = body;

    await assignRoleToUser(id, newRole);

    return NextResponse.json(
      { message: "Role assigned successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Failed to assign role:", e);

    return NextResponse.json(
      { error: "Failed to assign role" },
      { status: 500 }
    );
  }
}


