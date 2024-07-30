"use client";

import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "@/components/mobile-sidebar";
import { Coins } from "lucide-react";
import { Button } from "./ui/button";
import { useProModal } from "@/hooks/use-pro-modal";

interface NavbarProps {
    creditCount: number;
}

const Navbar = ({
    creditCount = 0
}: NavbarProps) => {
    const proModal = useProModal()
    return(
        <div className="flex items-center p-4">
            <MobileSidebar creditCount={creditCount}/>
            <div className="flex flex-row w-full justify-end text-md">
                <Button onClick={proModal.onOpen} variant="default" className="mr-4 ml-1 h-6 p-2">
                    <p className="font-semibold">{creditCount}</p>
                    <Coins className="w-4 h-4 ml-2 fill-white" />
                </Button>
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    );
}

export default Navbar;