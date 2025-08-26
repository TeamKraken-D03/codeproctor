import { getAllTestCases } from "@/repository/testcases.repository";

export async function GET(){
    const testcases = await getAllTestCases();
    return new Response(JSON.stringify(testcases), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}


