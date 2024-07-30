import { checkCredits, decreaseCredits } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

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
        const { prompt, amount = 1, resolution = "512x512" } = body;

        if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!configuration.apiKey) {
            console.log(configuration.apiKey)
            return new NextResponse("OpenAI API Key not configured", { status: 500 })
        }

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 })
        }

        if (!amount) {
            return new NextResponse("Amount is required", { status: 400 })
        }

        if (!resolution) {
            return new NextResponse("Resolution is required", { status: 400 })
        }

        const balanceCheck = await checkCredits();

        if (!balanceCheck) {
            return new NextResponse("Out of credits.", { status: 403 });
        }
        
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            quality: "standard",
            size: "1024x1024",
        });

        await decreaseCredits();

        return NextResponse.json(response.data)

    } catch (error) {
        console.log("[IMAGE_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}