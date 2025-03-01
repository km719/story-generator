"use client";

import { cn } from "@/lib/utils";
import { Book, BookOpenText, ImageIcon, Info, LayoutDashboard, Library, MessageSquare, Music, Settings, VideoIcon } from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCounter } from "./credit-counter";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"]})

const routes = [
    {
        label: "My Stories",
        icon: Library,
        href: "/my-stories",
        color: "text-red-500",
    },
    {
        label:"Generate New Story",
        icon: BookOpenText,
        href: "/story",
        color: "text-green-500",
    },
    {
        label:"About",
        icon: Info,
        href: "/about",
        color: "text-sky-500",
    },
    {
        label:"Settings",
        icon: Settings,
        href: "/settings",
    },
];

interface SidebarProps {
    creditCount: number;
};

const Sidebar = ({
    creditCount = 0
}: SidebarProps) => {

    const pathname = usePathname();
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-2 mb-14">
                    <div className="relative w-8 h-8 m-4">
                        <Image className="invert" fill alt="Logo" src="/logo.png" />
                    </div>
                    <h1 className={cn("text-2xl font-bold", montserrat.className)}>
                        Storygen
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link href={route.href} key={route.href} className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition", pathname === route.href ? "text-white bg-white/10" : "text-zing-400")} >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <CreditCounter creditCount={creditCount}/>
        </div>
    );
}

export default Sidebar;