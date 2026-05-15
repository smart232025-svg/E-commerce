"use client";
import { MessageCircle } from 'lucide-react';

export default function FloatingChatButton() {
    return (
        <button
            onClick={() =>
                window.open("https://wa.me/201026970269", "_blank")
            }
            className="cursor-pointer fixed bottom-6 right-6 z-50 p-4 bg-linear-to-r from-green-400 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group" aria-label="Open Chat"
        >
            <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
        </button >
    )
}