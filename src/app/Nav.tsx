'use client';

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Footer(){
    return(
        <nav className="w-full justify-between items-center flex gap-[24px] rounded-lg">
          <div className="font-bold text-xl">
            <Link href="/">Hi, I'm Anmol</Link>
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/blogs">Blog</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/goodReads">Good Read</Link>
            <Link href="/lab">Lab</Link>
            <ThemeToggle />
          </div>
        </nav>
    )
}