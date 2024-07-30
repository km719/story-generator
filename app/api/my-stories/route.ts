import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

import { addStory, getStories } from "@/lib/api-s3";

const configuration = {
    apiKey: "process.env.OPENAI_API_KEY",
};

const openai = new OpenAI(configuration);

export async function POST(
    req: Request
) {
    try{
         const { userId } = auth();
         
         if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
         }

        
        const stories = await getStories()
        
        return NextResponse.json(stories)

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}