import { getAllTags } from "@/repository/tag.repository";

export async function GET(){
    const tags = await getAllTags();
    return new Response(JSON.stringify(tags), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}