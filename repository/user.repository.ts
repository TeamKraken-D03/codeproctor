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

export async function getUsersWithPagination(
  page: number,
  pageSize: number,
  search: string,
  sortBy: string,
  sortOrder: string
) {
  try {
    const offset = (page - 1) * pageSize;
    
    // Validate sortBy to prevent SQL injection
    const allowedSortColumns = ["id", "name", "email", "role"];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : "id";
    const safeSortOrder = sortOrder === "desc" ? "DESC" : "ASC";

    let users, totalResult;

    if (search) {
      // Search with pagination and sorting
      search = search.trim();
      const searchPattern = `%${search}%`;
      
      
      users = await sql`
        SELECT id, name, email, role FROM users
        WHERE name ILIKE ${searchPattern} OR role ILIKE ${searchPattern}
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      // Get total count for search
      totalResult = await sql`
        SELECT COUNT(*) as count FROM users
        WHERE name ILIKE ${searchPattern} OR email ILIKE ${searchPattern}
      `;
    } else {
      // No search, just pagination and sorting
      users = await sql`
        SELECT id, name, email, role FROM users
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      // Get total count
      totalResult = await sql`SELECT COUNT(*) as count FROM users`;
    }

    const total = parseInt(totalResult[0].count);

    return {
      data: users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  } catch (error) {
    console.error("Error getting paginated users:", error);
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
