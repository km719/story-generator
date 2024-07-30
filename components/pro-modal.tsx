"use client";

import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { ArrowRight, Coins, Zap } from "lucide-react";
import { Button } from "./ui/button";

const options = [
    {
        credits: 700,
        text: "2 stories per day for a week!"
    },
    {
        credits: 3000,
        text: "2 stories per day for a month!"
    },
]

export const ProModal = () => {
    const proModal = useProModal()

    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                        <div className="flex items-center gap-x-2 fond-bold py-1">
                            Need more credits?
                            {/* <Badge variant="purchase" className="uppercase text-sm py-1">pro</Badge> */}
                        </div>
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
                            {options.map(option => (
                                <Card key={option.credits} className="p-2 border-black/5 flex items-center justify-between">
                                <div className="flex items-center gap-x-2">
                                    <div className="p-2 w-fit roudned-md">
                                        <Coins />
                                    </div>
                                    <div className="text-sm font-semibold">
                                        {option.credits} Credits
                                        </div>
                                </div>
                                <div className="text-sm">
                                    {option.text}
                                </div>
                                <ArrowRight className="mr-2 text-primary h-5 w-5"/>
                                </Card>
                            ))}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button size="lg" variant="purchase" className="w-full">
                        Purchase
                        <Zap className="h-4 w-4 ml-2 fill-white" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};