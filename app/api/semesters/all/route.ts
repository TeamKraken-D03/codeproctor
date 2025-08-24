import { getAllSemesters } from "@/repository/semester.repository";

export async function GET(){
    const semesters = await getAllSemesters();
    return new Response(JSON.stringify(semesters), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}