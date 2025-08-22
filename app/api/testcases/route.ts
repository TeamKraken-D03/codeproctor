import { createAndAssignTestcase, createTestCase, getAllTestCases } from "@/repository/testcases.repository";

interface createTestCaseDTO {
    input: string
    output: string
}

export async function GET(){
    const testcases = await getAllTestCases();
    return new Response(JSON.stringify(testcases), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}


