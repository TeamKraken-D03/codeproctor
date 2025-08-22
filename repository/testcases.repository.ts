import sql from "@/lib/db";

export interface testCase {
  input: string;
  output: string;
}


export async function createTestCase(newTestCase: testCase) {
  try {
    await sql`INSERT INTO testcases (input, output) VALUES (${newTestCase.input}, ${newTestCase.output})`;
  } catch (error) {
    console.error("Error creating test case:", error);
    throw error;
  }
}

export async function getTestCasesByProblemId(problemId: string) {
  try {
    const testcases = await sql`SELECT * FROM testcases WHERE id IN (SELECT testcase_id FROM problems_testcases WHERE problem_id = ${problemId})`;
    return testcases;
  } catch (error) {
    console.error("Error getting test cases by problem ID:", error);
    throw error;
  }
}

export async function getAllTestCases() {
  try {
    const testcases = await sql`SELECT * FROM testcases`;
    return testcases;
  } catch (error) {
    console.error("Error getting test cases:", error);
    throw error;
  }
}

export async function addTestCaseToProblem(
  problemId: string,
  testcaseId: string
) {
  try {
    return await sql`INSERT INTO problems_testcases (problem_id, testcase_id) VALUES (${problemId}, ${testcaseId})`;
  } catch (error) {
    console.error("Error adding test case to problem:", error);
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


export async function createAndAssignTestcase(problemId: string, testcase: { name: string; input: string; output: string }) {
    const { input, output } = testcase;

    const res = await sql`INSERT INTO testcases (input, output) VALUES (${input}, ${output}) RETURNING id`;
    const testcaseId = res[0].id;

    await addTestCaseToProblem(problemId, testcaseId);
}