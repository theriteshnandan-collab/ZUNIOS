"use client";

import { Share2, Twitter, Link as LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./DropdownMenu";
import { useState } from "react";
import { toast } from "sonner";

interface SocialShareProps {
    title: string;
    description: string;
    className?: string;
}

export function SocialShare({ title, description, className }: SocialShareProps) {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = `Check out my dream on Zunios: ${title}\n\n${description}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${shareUrl}\n\n${shareText}`);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTwitterShare = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(url, "_blank");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={className}>
                    <Share2 className="w-4 h-4 text-white/40 hover:text-white transition-colors" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white">
                <DropdownMenuItem onClick={handleTwitterShare} className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                    <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                    Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                    {copied ? (
                        <Check className="w-4 h-4 mr-2 text-green-400" />
                    ) : (
                        <LinkIcon className="w-4 h-4 mr-2" />
                    )}
                    {copied ? "Copied!" : "Copy Link"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
