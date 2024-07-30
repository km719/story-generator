import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import {v4 as uuidv4} from "uuid";
import { addStory, getStories } from "@/lib/api-s3";
import AWS from 'aws-sdk';
import axios from "axios";
import { checkCredits, decreaseCredits } from "@/lib/api-limit";

const configuration = {
    apiKey: "process.env.OPENAI_API_KEY",
};

const openai = new OpenAI(configuration);

const s3 = new AWS.S3({
    accessKeyId: "process.env.S3_ACCESS_KEY",
    secretAccessKey: "process.env.S3_SECRET_ACCESS_KEY",
    region: "us-east-1",
});

export const uploadImageToS3 = async (imageData: Buffer, fileName: string): Promise<string> => {
    const params = {
      Bucket: "storycut",
      Key: `${fileName}.jpg`,
      Body: imageData,
    };
  
    try {
      await s3.upload(params).promise();
      return `https://storycut.s3.amazonaws.com/${fileName}.jpg`;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      throw new Error('Failed to upload image to S3')
    }
};

async function getImageData(imageUrl: string) {
    try {
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer', // Set response type to array buffer
        });
        return response.data; // Return the image data
    } catch (error) {
        console.error('Error fetching image data:', error);
        throw new Error('Failed to fetch image data')
    }
  }

export async function POST(
    req: Request
) {
    try{
         const { userId } = auth();
         const body = await req.json();
         const { prompt } = body;

         if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
         }

        if (!configuration.apiKey) {
            return new NextResponse("OpenAI API Key not configured", { status: 500 })
        }

        if (!prompt) {
            return new NextResponse("Messages are required", { status: 400 })
        }

        const balanceCheck = await checkCredits();

        if (!balanceCheck) {
            return new NextResponse("Out of credits.", { status: 403 });
        }

        const storyResponse = await openai.chat.completions.create({
            messages: [{"role": "system", "content": "You are a creative writer. Your job is to write a long 1000+ word bedtime story about whatever I say. Provide a relevant title and descriptive AI prompt for an illustration of the story as well. The title, story, and illustration should all be returned as a valid JSON object in the following format: {\"title\": \"\", \"story\": \"\", \"illustration\": \"\"}"},
            {"role": "user", "content": prompt}],
            model: "gpt-3.5-turbo-0125",
        });

        console.log(storyResponse)
        
        const imageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: JSON.parse(storyResponse.choices[0].message.content as string).illustration,
            n: 1,
            quality: "standard",
            size: "1024x1024",
        });

        const imageUrl = imageResponse.data[0].url as string

        const imageData = await getImageData(imageUrl)
        
        const imageS3 = await uploadImageToS3(imageData, uuidv4());
        
        var illustrated = storyResponse.choices[0].message.content || ""
        var illustratedJSON = JSON.parse(illustrated)
        console.log('s3image', imageS3)
        illustratedJSON.illustration = imageS3
        
        await addStory(JSON.stringify(illustratedJSON))
        console.log("images")
        console.log(imageResponse.data)
        console.log(illustratedJSON.illustration)
        
        await decreaseCredits();

        return NextResponse.json(JSON.stringify(illustratedJSON))

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}