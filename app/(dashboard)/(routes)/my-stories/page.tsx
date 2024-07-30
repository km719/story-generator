"use client";

import { Card, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Book, Code, MessageSquare, Music, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import axios from "axios";
import { StoryBlock } from "@/components/story-view";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const MyStoriesPage = () => {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("calling")

        const response = await axios.post("/api/my-stories");

        console.log("response")
        console.log(response)
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [storyView, setStoryView] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [story, setStory] = useState<string>("");
  const [image, setImage] = useState<string>("");

  const openStory = (string: string) => {
    const jsonString = JSON.parse(string)
    console.log(jsonString.image);
    setTitle(jsonString.title);
    setStory(jsonString.story);
    setImage(jsonString.illustration);
    setStoryView(true);
  
  }
  const closeStory = () => {
    setStoryView(false);
    setTitle("");
    setStory("");
    setImage("");
  }

  return (
    <div className="px-4 lg:px-8 md-20 mb-4">
      {!storyView &&
      <div className="mb-8">
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center">
            My Stories
          </h2>
          <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
            View your generated stories
          </p>
        </div>
        <div className="px-4 md:px-20 lg:px-32 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
            <Card key="storyLink" onClick={() => router.push("/story")} className="rounded-lg overflow-hidden hover:cursor-pointer">
                <div className="relative aspect-square">
                    <Image alt="Image" fill src="/add.png" />
                </div>
                <CardFooter className="p-2">
                    <Button variant="secondary" className="w-full">
                        Generate New Story
                    </Button>
                </CardFooter>
            </Card>
            {data && data.toReversed().map((string) => (
                <Card key={JSON.parse(string).illustration} onClick={() => openStory(string)} className="rounded-lg overflow-hidden hover:cursor-pointer">
                    <div className="relative aspect-square">
                        <Image alt="Image" fill src={JSON.parse(string).illustration} />
                    </div>
                    <CardFooter className="p-2">
                        <Button variant="secondary" className="w-full text-balance text-sm resize-x object-fill">
                            {JSON.parse(string).title}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
          </div>
        </div>
      </div>
      }
      {storyView &&
        <div>
          <StoryBlock 
            title={title}
            story={story}
            image={image}
          />
          <div className="w-24 mx-auto my-4 space-y-4">
            <Card onClick={() => closeStory()} key="back" className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
              <div className="flex items-center gap-x-4">
                <div className="font-semibold">
                  Back
                </div>
              </div>
            </Card>
          </div>
        </div>
      }
    </div>
  );
}

export default MyStoriesPage;