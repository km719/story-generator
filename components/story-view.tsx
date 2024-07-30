import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface StoryProps {
    title: string; 
    story: string; 
    image: string;
}

export const StoryBlock = ({
    title,
    story,
    image,
}: StoryProps) => {
    const { user } = useUser();

    const stringSplitter = (text: string) => {
        return (text.match(/\(?[^\.\?\!]+[\.!\?]\)?/g)?.map((string, index) =>
            <span><span key={index} className="py-0.5 hover:bg-blue-600/25 rounded-sm">{string.trim()}</span> </span>
        ))
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] mt-8">
            <div className="mb-4">
                <div className="h-auto max-w-xl ml-auto mr-auto">
                    {image !== "" &&
                        <Card key={image} className="rounded-lg overflow-hidden">
                            <div className="relative aspect-square">
                                <Image alt="Image" fill src={image} />
                            </div>
                        </Card>
                    }
                </div>
            </div>
            <div className="lg:pl-4">
                <div className="h-auto max-w-xl ml-auto mr-auto">
                    <Card key={title} className="p-8 w-full flex items-start gap-x-8 rounded-lg bg-muted">
                        <div className="flex flex-col">
                            <h1 className="text-xl">
                                <span className="py-1 hover:bg-blue-600/25 rounded-md">{title}</span>
                            </h1>
                            <p className="text-md pt-6">
                                {stringSplitter(story)}
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};