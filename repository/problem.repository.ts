import sql from "@/lib/db";

export interface testCase {
    input: string;
    output: string;
    tags: string[]; // tag ids
}

export interface createProblem {
    title: string;
    description: string;
    tags: string[]; // tag ids
    testCases: string[]; // test case ids
}

export async function createTestCase(newTestCase: testCase) {
    const tags = newTestCase.tags;
    for (const tag of tags) {
        sql`INSERT INTO testcases (input, output, tagid) VALUES (${newTestCase.input}, ${newTestCase.output}, ${tag})`;
    }
}


export function createProblem(newProblem: createProblem){
    const tags = newProblem.tags;
    const testCases = newProblem.testCases;
}

export function getTestCases(){
    
}

export function getTags(){


}

export function createTag(){

}

export function addTagToProblem(){

}

export function addTestCaseToProblem(){

}

