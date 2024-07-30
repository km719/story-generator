import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

import { decreaseCredits, checkCredits } from "@/lib/api-limit";

const configuration = {
    apiKey: "process.env.OPENAI_API_KEY",
};

const openai = new OpenAI(configuration);

export async function POST(
    req: Request
) {
    try{
         const { userId } = auth();
         const body = await req.json();
         const { messages } = body;

         if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
         }

        if (!configuration.apiKey) {
            console.log(configuration.apiKey)
            return new NextResponse("OpenAI API Key not configured", { status: 500 })
        }

        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 })
        }

        const balanceCheck = await checkCredits();

        if (!balanceCheck) {
            return new NextResponse("Out of credits.", { status: 403 });
        }
        
        const response = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-3.5-turbo",
        });

        await decreaseCredits();

        return NextResponse.json(response.choices[0].message)

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}