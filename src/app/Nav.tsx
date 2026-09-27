'use client';

import Link from "next/link";

export default function Footer(){
    return(
        <nav className="w-full flex flex-col gap-4 rounded-lg md:flex-row md:items-center md:justify-between md:gap-[24px]">
          <div className="font-bold text-2xl leading-relaxed tracking-tight whitespace-nowrap md:text-3xl">
            <Link href="/">Hi, I'm Anmol</Link>
          </div>
          <div className="flex gap-6 items-center whitespace-nowrap">
            <Link href="/blogs">Blog</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/goodReads">Good Read</Link>
            <Link href="/lab">Lab</Link>
          </div>
        </nav>
    )
}