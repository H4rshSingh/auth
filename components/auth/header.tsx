import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

interface HeaderProps {
    label : string;
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <header className="flex flex-col justify-center items-center gap-y-4 w-full ">
            <h1 className={cn("text-3xl font-semibold text-black", font.className)}>Auth</h1>
            <p className="text-muted-foreground text-sm">{label}</p>
        </header>
    );
}