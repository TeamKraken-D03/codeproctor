import sql from "@/lib/db";

export async function getAllUsers() {
  try {
    const users = await sql`SELECT * FROM users`;
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    await sql`DELETE FROM users WHERE id = ${userId}`;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function assignRoleToUser(userId: string, role: string) {
  try {
    await sql`UPDATE users SET role = ${role} WHERE id = ${userId}`;
  } catch (error) {
    console.error("Error assigning role to user:", error);
    throw error;
  }
}
