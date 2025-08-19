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
    
}


export function createProblem(newProblem: createProblem){

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

