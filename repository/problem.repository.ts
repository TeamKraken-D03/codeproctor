import sql from "@/lib/db";

export interface testCase {
  input: string;
  output: string;
}

export interface createProblem {
  problemid: string;
  title: string;
  description: string;
  created_by: string;
}

export async function getAllProblems() {
  try {
    const problems = await sql`SELECT * FROM problems`;
    return problems;
  } catch (error) {
    console.error("Error getting all problems:", error);
    throw error;
  }
}

export async function getProblemsWithPagination(
  page: number,
  pageSize: number,
  search: string,
  sortBy: string,
  sortOrder: string
) {
  try {
    const offset = (page - 1) * pageSize;

    const allowedSortColumns = ["id", "title", "description", "created_at"];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : "id";
    const safeSortOrder = sortOrder === "desc" ? "DESC" : "ASC";

    let problems, totalResult;

    if (search) {
      const searchPattern = `%${search}%`;

      problems = await sql`
        SELECT p.id, p.title, p.description, p.created_at, u.name AS created_by
        FROM problems p INNER JOIN users u ON p.created_by = u.id
        WHERE p.title ILIKE ${searchPattern} OR p.description ILIKE ${searchPattern} OR p.id::text ILIKE ${searchPattern}
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      totalResult = await sql`
        SELECT COUNT(*) as count FROM problems p
        WHERE p.title ILIKE ${searchPattern} OR p.description ILIKE ${searchPattern} OR p.id::text ILIKE ${searchPattern}
      `;
    } else {
      problems = await sql`
        SELECT p.id, p.title, p.description, p.created_at, u.name AS created_by
        FROM problems p INNER JOIN users u ON p.created_by = u.id
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      totalResult = await sql`
        SELECT COUNT(*) as count FROM problems
      `;
    }

    const total = parseInt(totalResult[0].count);

    return {
      data: problems,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Error getting paginated problems:", error);
    throw error;
  }
}

export async function createProblem(newProblem: createProblem) {
  try {
    const result =
      await sql`INSERT INTO problems (id, title, description, created_by) VALUES (${newProblem.problemid},${newProblem.title}, ${newProblem.description}, ${newProblem.created_by}) RETURNING *`;
    return result[0];
  } catch (error) {
    console.error("Error creating problem:", error);
    throw error;
  }
}

export async function getProblemById(id: string) {
  try {
    const problem = await sql`SELECT p.id, p.title, p.description, p.created_at, u.name AS created_by
      FROM problems p INNER JOIN users u ON p.created_by = u.id
      WHERE p.id = ${id}`;
      
    return problem[0] || null;
  } catch (error) {
    console.error("Error getting problem by id:", error);
    throw error;
  }
}

export async function deleteProblem(id: string) {
  try {
    const result = await sql`DELETE FROM problems WHERE id = ${id} RETURNING *`;
    return result[0] || null;
  } catch (error) {
    console.error("Error deleting problem:", error);
    throw error;
  }
}

interface updateProblemDTO {
  title?: string;
  description?: string;
}

export async function editProblem(
  id: string,
  updatedProblem: updateProblemDTO
) {
  try {
    const result =
      await sql`UPDATE problems SET title = ${updatedProblem.title}, description = ${updatedProblem.description} WHERE id = ${id} RETURNING *`;
    return result[0] || null;
  } catch (error) {
    console.error("Error editing problem:", error);
    throw error;
  }
}
