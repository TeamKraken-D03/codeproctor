import sql from "@/lib/db";

export async function GET() {
  try {
    const users = await sql`SELECT id, name, email, role FROM users`;
    return Response.json(users);
  } catch (e) {
    console.log(e);
    return Response.error();
  }
}
