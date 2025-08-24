import { getAllTags, createTag } from "@/repository/tag.repository";

export async function GET(){
    const tags = await getAllTags();
    return new Response(JSON.stringify(tags), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name || !name.trim()) {
            return new Response(JSON.stringify({ error: "Tag name is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const tag = await createTag(name.trim());
        return new Response(JSON.stringify(tag), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error creating tag:", error);
        return new Response(JSON.stringify({ error: "Failed to create tag" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}