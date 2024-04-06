"use client";
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { ExitIcon } from "@radix-ui/react-icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import LogoutButton from "./auth/logout-button";
import Link from "next/link";


export const UserButton = () => {
    const user = useCurrentUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image ? user.image : ''} />
                    <AvatarFallback className="bg-sky-500">
                        <FaUser className="text-white" />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4" align="end">
                <div className="flex items-center px-2  gap-x-2">
                    <Avatar>
                        <AvatarImage src={user?.image ? user.image : ''} />
                        <AvatarFallback className="bg-sky-500">
                            <FaUser className="text-white" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center">
                        <span className="text-sm font-medium">{user?.name}</span>
                        <p className="text-xs text-gray-700">{user?.email}</p>
                    </div>
                </div>
                <Link href="/settings">
                    <DropdownMenuItem className="mt-4 p-2 cursor-pointer">
                        <div className="flex items-center">
                            <IoMdSettings className="h-4 w-4 mr-5 ml-3" />
                            Manage Account
                        </div>
                    </DropdownMenuItem>
                </Link>
                <LogoutButton>
                    <DropdownMenuItem className="mt-4 p-2 cursor-pointer">
                        <div className="flex items-center">
                            <ExitIcon className="h-4 w-4 mr-5 ml-3" />
                            Logout
                        </div>
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}