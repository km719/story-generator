import { auth } from "@clerk/nextjs/server"

import prismadb from "./prismadb"
import { MIN_CREDITS } from "@/constants"

export const decreaseCredits = async () => {
    const { userId } = auth();

    if (!userId) {
        return;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId: userId
        }
    });

    if (userApiLimit) {
        await prismadb.userApiLimit.update({
            where: { userId: userId },
            data: { credits: userApiLimit.credits - 50 },
        });
    } else {
        await prismadb.userApiLimit.create({
            data: { userId: userId, credits: 500}
        })
    }
};

export const checkCredits = async () => {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId: userId
        }
    });

    if (!userApiLimit || userApiLimit.credits > MIN_CREDITS) {
        return true;
    } else {
        return false;
    }
};

export const getCredits = async () => {
    const { userId } = auth();

    if (!userId) {
        return 0;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId: userId
        }
    });

    if (!userApiLimit) {
        return 0;
    }
    
    return userApiLimit.credits;
};