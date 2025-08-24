import sql from "@/lib/db";

export interface testCase {
  input: string;
  output: string;
}

export interface createProblem {
  problemid: string;
  title: string;
  description: string;
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
    
    // Validate sortBy to prevent SQL injection
    const allowedSortColumns = ["id", "title", "description", "created_at"];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : "id";
    const safeSortOrder = sortOrder === "desc" ? "DESC" : "ASC";

    let problems, totalResult;

    if (search) {
      // Search with pagination and sorting
      const searchPattern = `%${search}%`;
      
      problems = await sql`
        SELECT id, title, description, created_at FROM problems
        WHERE title ILIKE ${searchPattern} OR description ILIKE ${searchPattern} OR id::text ILIKE ${searchPattern}
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      // Get total count for search
      totalResult = await sql`
        SELECT COUNT(*) as count FROM problems
        WHERE title ILIKE ${searchPattern} OR description ILIKE ${searchPattern} OR id::text ILIKE ${searchPattern}
      `;
    } else {
      // No search, just pagination and sorting
      problems = await sql`
        SELECT id, title, description, created_at FROM problems
        ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      // Get total count
      totalResult = await sql`SELECT COUNT(*) as count FROM problems`;
    }

    const total = parseInt(totalResult[0].count);

    return {
      data: problems,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  } catch (error) {
    console.error("Error getting paginated problems:", error);
    throw error;
  }
}

export async function createProblem(newProblem: createProblem) {
  try {
    const result =
      await sql`INSERT INTO problems (id, title, description) VALUES (${newProblem.problemid},${newProblem.title}, ${newProblem.description}) RETURNING *`;
    return result[0];
  } catch (error) {
    console.error("Error creating problem:", error);
    throw error;
  }
}

export async function getProblemById(id: string) {
  try {
    const problem = await sql`SELECT * FROM problems WHERE id = ${id}`;
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

interface updateProblemDTO{
  title?: string;
  description?: string;
}

export async function editProblem(id: string, updatedProblem: updateProblemDTO) {
  try {
    const result = await sql`UPDATE problems SET title = ${updatedProblem.title}, description = ${updatedProblem.description} WHERE id = ${id} RETURNING *`;
    return result[0] || null;
  } catch (error) {
    console.error("Error editing problem:", error);
    throw error;
  }
}