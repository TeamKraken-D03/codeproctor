import sql from "@/lib/db";

export async function getAllTags(){
    const res = await sql`SELECT * FROM tags`;
    return res;
}

export async function addTagToProblem(problemId: string, tagId: string) {
    const res = await sql`INSERT INTO problems_tags (problem_id, tag_id) VALUES (${problemId}, ${tagId})`;
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