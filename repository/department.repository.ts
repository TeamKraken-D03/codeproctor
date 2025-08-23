import sql from "@/lib/db";
import { department } from "@/types/types";

export async function getAllDepartments() {
  try {
    const data = await sql`select id,name from departments`;

    return { status: true, data: data };
  } catch (e) {
    console.log(e);
    return { status: false, error: e };
  }
}

export async function getDepartmentsWithPagination(
  page: number,
  pageSize: number,
  search: string,
  sortBy: string,
  sortOrder: string
) {
  try {
    const offset = (page - 1) * pageSize;
    
    const allowedSortColumns = ["id", "name"];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : "id";
    const safeSortOrder = sortOrder === "desc" ? "DESC" : "ASC";

    let departments, totalResult;

    if (search) {

      const searchPattern = `%${search}%`;
      
      departments = await sql`
        SELECT id, name FROM departments
        WHERE name ILIKE ${searchPattern}
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      totalResult = await sql`
        SELECT COUNT(*) as count FROM departments
        WHERE name ILIKE ${searchPattern}
      `;
    } else {

      departments = await sql`
        SELECT id, name FROM departments
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      totalResult = await sql`SELECT COUNT(*) as count FROM departments`;
    }

    const total = parseInt(totalResult[0].count);

    return {
      data: departments,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  } catch (error) {
    console.error("Error getting paginated departments:", error);
    throw error;
  }
}

export async function editDepartment(body: department) {
  try {
    await sql`UPDATE departments
        SET name=${body.name}
        WHERE id=${body.id}`;

    return {
      success: true,
      message: `Successfully updated department ${body.id}`,
    };
  } catch (e) {
    console.log(e);
    return { success: false, message: `Update department ${body.id} failed` };
  }
}

export async function createDepartment(body: department) {
  try {
    const res = await sql`INSERT INTO departments VALUES(${body.name})`;

    return {
      success: true,
      message: `Added new department ${res[0].id} ${res[0].name}`,
    };
  } catch (e) {
    return { success: false, message: `Add new department failed` };
  }
}

export async function deleteDepartment(id: string) {
  try {
    await sql`DELETE departments WHERE id=${id}`;

    return { success: true, message: `Deleted department ${id}` };
  } catch (e) {
    console.log(e);
    return { success: false, message: `Delete department ${id} failed` };
  }
}
