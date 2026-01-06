"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

interface Profile {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
}

interface FollowModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    profiles: Profile[];
}

export default function FollowModal({ isOpen, onClose, title, profiles }: FollowModalProps) {
    // Lock scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                {title}
                            </h3>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                            {profiles.length > 0 ? (
                                <div className="space-y-2">
                                    {profiles.map((profile) => (
                                        <Link
                                            key={profile.id}
                                            href={`/${profile.username}`}
                                            onClick={onClose}
                                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all group"
                                        >
                                            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700 bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                                                {profile.avatar_url ? (
                                                    <Image
                                                        src={profile.avatar_url}
                                                        alt={profile.full_name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    profile.full_name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                                    {profile.full_name}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    @{profile.username}
                                                </p>
                                            </div>
                                            <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                                    <p className="font-medium">No one here yet.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
