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
