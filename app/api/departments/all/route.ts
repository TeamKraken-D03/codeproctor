import { getAllDepartments } from "@/repository/department.repository";

export async function GET(){
    const departments = await getAllDepartments();
    return new Response(JSON.stringify(departments), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}