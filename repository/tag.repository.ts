import sql from "@/lib/db";

export async function getAllTags() {
  const res = await sql`SELECT * FROM tags`;
  return res;
}

export async function addTagToProblem(problemId: string, tagId: string) {
  const res =
    await sql`INSERT INTO problems_tags (problem_id, tag_id) VALUES (${problemId}, ${tagId})`;
  return res;
}

export async function createTag(tagName: string) {
  try {
    await sql`INSERT INTO tags (name) VALUES (${tagName})`;
  } catch (error) {
    console.error("Error creating tag:", error);
    throw error;
  }
}

export async function getTags() {
  try {
    return await sql`SELECT * FROM tags`;
  } catch (error) {
    console.error("Error getting tags:", error);
    throw error;
  }
}

export async function addTagToTestcase(tagId: string, testcaseId: string) {
  try {
    const data =
      await sql`INSERT INTO testcases_tags (testcase_id, tag_id) VALUES (${testcaseId}, ${tagId})`;
    return data;
  } catch (error) {
    console.error("Error adding tag to test case:", error);
    throw error;
  }
}

export async function getTagsForProblem(problemId: string) {
  try {
    const tags = await sql`
      SELECT t.id, t.name 
      FROM tags t 
      JOIN problems_tags pt ON t.id = pt.tag_id 
      WHERE pt.problem_id = ${problemId}
    `;
    return tags;
  } catch (error) {
    console.error("Error getting tags for problem:", error);
    throw error;
  }
}

export async function removeTagFromProblem(problemId: string, tagId: string) {
  try {
    const result = await sql`
      DELETE FROM problems_tags 
      WHERE problem_id = ${problemId} AND tag_id = ${tagId}
    `;
    return result;
  } catch (error) {
    console.error("Error removing tag from problem:", error);
    throw error;
  }
}

export async function updateProblemTag(
  problemId: string,
  oldTagId: string,
  newTagId: string
) {
  try {
    await removeTagFromProblem(problemId, oldTagId);
    await addTagToProblem(problemId, newTagId);
  } catch (error) {
    console.error("Error updating problem tag:", error);
    throw error;
  }
}
