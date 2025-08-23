import sql from "@/lib/db";
import { getAllUsers } from "@/repository/user.repository";

export async function GET() {
  try {
    const users = await getAllUsers();
    return Response.json(users);
  } catch (e) {
    console.log(e);
    return Response.error();
  }
}
