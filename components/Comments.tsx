"use client";

import { useEffect, useState } from "react";
import { getComments, addComment, Comment } from "@/lib/comments";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export default function CommentsSection({ postSlug }: { postSlug: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [userName, setUserName] = useState("");
    const [newComment, setNewComment] = useState("");

    const getAvatarUrl = (user: User | null) => {
        return user?.user_metadata?.engine_avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
    };

    useEffect(() => {
        const setupAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setUserName(user.user_metadata?.username || user.email?.split('@')[0] || "");
            }
        };

        setupAuth();
        fetchComments();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                setUserName(session.user.user_metadata?.username || session.user.email?.split('@')[0] || "");
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [postSlug]);

    const fetchComments = async () => {
        const data = await getComments(postSlug);
        setComments(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName || !newComment) return;

        await addComment({
            postSlug,
            userName,
            comment: newComment,
            userId: user?.id,
            userAvatar: getAvatarUrl(user)
        });
        setNewComment("");
        fetchComments();
    };

    return (
        <div className="mt-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">💬</span>
                Comments
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-12 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    {!user ? (
                        <input
                            type="text"
                            placeholder="Your name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                            required
                        />
                    ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/30 rounded-xl">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-[10px] font-bold overflow-hidden">
                                {getAvatarUrl(user) ? (
                                    <img
                                        src={getAvatarUrl(user)}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    userName.charAt(0).toUpperCase()
                                )}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Commenting as <span className="font-bold text-blue-600 dark:text-blue-400">{userName}</span>
                            </span>
                        </div>
                    )}
                    <textarea
                        placeholder="What are your thoughts?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white resize-none"
                        rows={4}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
                >
                    Post Comment
                </button>
            </form>

            {/* Comment List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    <ul className="space-y-6">
                        {comments.map((c) => (
                            <li key={c.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm overflow-hidden">
                                            {c.user_avatar ? (
                                                <img
                                                    src={c.user_avatar}
                                                    alt={c.user_name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                c.user_name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        {c.user_name}
                                    </div>
                                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded-md">
                                        {new Date(c.created_at).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-10">
                                    {c.comment}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
