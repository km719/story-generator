"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Coins, CoinsIcon, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { useProModal } from "@/hooks/use-pro-modal";

interface CreditCounterProps {
    creditCount: number;
};

export const CreditCounter = ({
    creditCount = 0
}: CreditCounterProps) => {
    const proModal = useProModal()
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="px-6">
            <Card className="bg-white/10 border-0">
                <CardContent className="py-4">
                    <div className="text-center text-sm font-semibold text-white mb-4 space-y-2">
                        <p>
                            {creditCount} Credits Remaining
                        </p>
                    </div>
                    <Button onClick={proModal.onOpen} variant="purchase" className="w-full">
                        <span className="font-semibold">Get more Credits</span>
                        <Coins className="w-4 h-4 ml-2 fill-white" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}