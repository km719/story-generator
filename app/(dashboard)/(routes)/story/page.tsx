"use client";

import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { Book, Download } from "lucide-react";
import { useForm } from "react-hook-form";

import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { BotAvatar } from "@/components/bot-avatar";
import { UserAvatar } from "@/components/user-avatar";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { StoryBlock } from "@/components/story-view";
import { useProModal } from "@/hooks/use-pro-modal";

const StoryPage = () => {
    const proModal = useProModal()
    const router = useRouter();
    
    const [storyView, setStoryView] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [story, setStory] = useState<string>("");
    const [image, setImage] = useState<string>("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            
            const response = await axios.post("/api/story", {
                prompt: values.prompt,
            });
            
            const jsonString = JSON.parse(response.data)
            console.log(jsonString.image);
            setTitle(jsonString.title);
            setStory(jsonString.story);
            setImage(jsonString.illustration);
            setStoryView(true);

            form.reset()
        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
            }
        } finally {
            router.refresh();
        }
    }

    const stringSplitter = (text: string) => {
        return (text.match(/\(?[^\.\?\!]+[\.!\?]\)?/g)?.map((string, index) =>
            <span><span key={index} className="py-0.5 hover:bg-blue-600/25">{string.trim()}</span> </span>
        ))
    }

    return(
        <div>
            <Heading title="Generate a Story" description="Use the latest AI models to generate a personalized story." icon={Book} iconColor="text-green-700" bgColor="bg-green-700/10"/>
            <div className="px-4 lg:px-8 md-20">
                {!storyView && !isLoading && (
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                                <FormField name="prompt" render={({field}) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading} placeholder="Tell me a story about a man living on the moon" {...field}/>
                                        </FormControl>
                                    </FormItem>
                                )} />
                                <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                    Generate
                                </Button>
                            </form>
                        </Form>
                    </div>
                )}
                {isLoading && (
                    <div className="p-8">
                        <Loader />
                    </div>
                )}
                {storyView &&
                    <StoryBlock 
                        title={title}
                        story={story}
                        image={image}
                    />
                }
            </div>
        </div>
    );
};

export default StoryPage;