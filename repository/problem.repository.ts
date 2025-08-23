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