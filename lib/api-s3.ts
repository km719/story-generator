import { auth } from "@clerk/nextjs/server"

import prismadb from "./prismadb"

export const addStory = async (story: string) => {
    const { userId } = auth();

    if (!userId || story === "") {
        return;
    }

    const userStories = await prismadb.userStories.findUnique({
        where: {
            userId: userId
        }
    });

    if (userStories) {
        await prismadb.userStories.update({
            where: { userId: userId },
            data: { storyLink: [...userStories.storyLink, story] },
        });
    } else {
        await prismadb.userStories.create({
            data: { userId: userId, storyLink: [story]}
        })
    }
    return "storyadded";
};

export const getStories = async () => {
    const { userId } = auth();

    if (!userId) {
        return [];
    }

    const userStories = await prismadb.userStories.findUnique({
        where: {
            userId: userId
        }
    });

    if (!userStories) {
        return [];
    } else {
        return userStories.storyLink;
    }
};