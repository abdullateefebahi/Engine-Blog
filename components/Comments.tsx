"use client";

import { useEffect, useState, useRef } from "react";
import { getComments, Comment } from "@/lib/comments";
import { useUser } from "@clerk/nextjs";
import { addCommentAction, deleteCommentAction, toggleReactionAction } from "@/app/actions/social";
import Link from "next/link";

function formatRelativeTime(dateString: string) {
    const now = new Date();
    const then = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return "now";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}dy`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 52) return `${diffInWeeks}wk`;

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}yr`;
}

export default function CommentsSection({ postSlug }: { postSlug: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const { user, isLoaded } = useUser();
    const [userName, setUserName] = useState("");
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [guestId, setGuestId] = useState<string | null>(null);

    useEffect(() => {
        let gid = localStorage.getItem('guestId');
        if (!gid) {
            gid = `guest_${Math.random().toString(36).substring(2, 11)}`;
            localStorage.setItem('guestId', gid);
        }
        setGuestId(gid);
    }, []);

    const getAvatarUrl = (user: any) => {
        return user?.imageUrl || user?.profileImageUrl;
    };

    useEffect(() => {
        if (user) {
            setUserName(user.username || user.firstName || user.emailAddresses[0].emailAddress.split('@')[0] || "");
        }
    }, [user]);

    useEffect(() => {
        fetchComments();
    }, [postSlug]);

    const fetchComments = async () => {
        const data = await getComments(postSlug);
        setComments(data);
    };

    const handleToggleReaction = async (commentId: number, emoji: string) => {
        const finalUserId = user?.id || guestId;
        if (!finalUserId) return;

        try {
            // Optimistic UI update
            setComments(prev => prev.map(c => {
                if (c.id === commentId) {
                    const reactions = c.reactions || [];
                    const existing = reactions.find(r => r.user_id === finalUserId && r.reaction === emoji);
                    if (existing) {
                        return { ...c, reactions: reactions.filter(r => r.id !== existing.id) };
                    } else {
                        return {
                            ...c,
                            reactions: [...reactions, {
                                id: Math.random(),
                                post_slug: postSlug,
                                comment_id: commentId,
                                user_id: finalUserId,
                                reaction: emoji,
                                created_at: new Date().toISOString()
                            }]
                        };
                    }
                }
                return c;
            }));

            await toggleReactionAction({ postSlug, reaction: emoji, commentId, guestId: user ? null : guestId });
        } catch (error) {
            console.error("Failed to toggle reaction:", error);
            fetchComments(); // Rollback
        }
    };

    const handleReply = (commentId: number) => {
        setReplyingTo(prev => prev === commentId ? null : commentId);
    };

    const renderComments = (parentId: number | null = null, depth = 0) => {
        const currentComments = comments.filter(c => c.parent_id === parentId);

        if (currentComments.length === 0) return null;

        return (
            <div className={`space-y-6 ${depth > 0 ? 'ml-6 md:ml-10 border-l-2 border-gray-100 dark:border-gray-800 pl-4 md:pl-6' : ''}`}>
                {currentComments.map((c) => (
                    <CommentThread
                        key={c.id}
                        comment={c}
                        allComments={comments}
                        user={user}
                        guestId={guestId}
                        depth={depth}
                        replyingTo={replyingTo}
                        handleReply={handleReply}
                        handleToggleReaction={handleToggleReaction}
                        fetchComments={fetchComments}
                        postSlug={postSlug}
                        onSuccess={() => {
                            setReplyingTo(null);
                            fetchComments();
                        }}
                    />
                ))}
            </div>
        );
    };

    if (!isLoaded) return null;

    return (
        <div id="comments" className="mt-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">💬</span>
                Comments
            </h2>

            {/* Comment Form */}
            {!replyingTo && (
                <div className="mb-12">
                    <CommentForm
                        postSlug={postSlug}
                        user={user}
                        userName={userName}
                        onSuccess={() => fetchComments()}
                    />
                </div>
            )}

            {/* Comment List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {renderComments()}
                    </div>
                )}
            </div>
        </div>
    );
}

function CommentThread({
    comment,
    allComments,
    user,
    guestId,
    depth,
    replyingTo,
    handleReply,
    handleToggleReaction,
    fetchComments,
    postSlug,
    onSuccess
}: {
    comment: Comment,
    allComments: Comment[],
    user: any,
    guestId: string | null,
    depth: number,
    replyingTo: number | null,
    handleReply: (commentId: number) => void,
    handleToggleReaction: (commentId: number, emoji: string) => Promise<void>,
    fetchComments: () => Promise<void>,
    postSlug: string,
    onSuccess: () => void
}) {
    const [showReplies, setShowReplies] = useState(false);
    const replies = allComments.filter(c => c.parent_id === comment.id);
    const parent = comment.parent_id ? allComments.find(pc => pc.id === comment.parent_id) : null;

    return (
        <div className="space-y-4">
            <CommentCard
                comment={comment}
                user={user}
                guestId={guestId}
                parentDisplayName={parent?.user_name}
                parentUsername={parent?.profiles?.username}
                onReply={() => handleReply(comment.id)}
                replyCount={replies.length}
                showReplies={showReplies}
                onToggleReplies={() => setShowReplies(!showReplies)}
                onToggleReaction={handleToggleReaction}
                onDelete={async () => {
                    if (confirm("Are you sure you want to delete this comment?")) {
                        try {
                            await deleteCommentAction(comment.id);
                            await fetchComments();
                        } catch (err) {
                            alert("Failed to delete comment");
                        }
                    }
                }}
            />

            {replyingTo === comment.id && (
                <div className="ml-10 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <CommentForm
                        postSlug={postSlug}
                        user={user}
                        userName={user?.username || user?.firstName || "User"}
                        parentId={comment.id}
                        onSuccess={onSuccess}
                        onCancel={() => handleReply(comment.id)}
                    />
                </div>
            )}

            {showReplies && replies.length > 0 && (
                <div className="ml-6 md:ml-10 border-l-2 border-gray-100 dark:border-gray-800 pl-4 md:pl-6 space-y-6">
                    {replies.map((reply) => (
                        <CommentThread
                            key={reply.id}
                            comment={reply}
                            allComments={allComments}
                            user={user}
                            guestId={guestId}
                            depth={depth + 1}
                            replyingTo={replyingTo}
                            handleReply={handleReply}
                            handleToggleReaction={handleToggleReaction}
                            fetchComments={fetchComments}
                            postSlug={postSlug}
                            onSuccess={onSuccess}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function CommentCard({
    comment,
    user,
    guestId,
    parentDisplayName,
    parentUsername,
    onReply,
    replyCount = 0,
    showReplies = false,
    onToggleReplies,
    onToggleReaction,
    onDelete,
}: {
    comment: Comment,
    user: any,
    guestId: string | null,
    parentDisplayName?: string,
    parentUsername?: string,
    onReply: () => void,
    replyCount?: number,
    showReplies?: boolean,
    onToggleReplies?: () => void,
    onToggleReaction: (commentId: number, emoji: string) => Promise<void>,
    onDelete: () => Promise<void>,
}) {
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [showTray, setShowTray] = useState(false);
    const trayRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (trayRef.current && !trayRef.current.contains(event.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                setShowTray(false);
            }
        };

        if (showTray) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showTray]);

    const emojis = ["❤️", "😂", "😢", "😠"];

    const reactionStats = (comment.reactions || []).reduce((acc, r) => {
        acc.total++;
        if (!acc.types.includes(r.reaction)) acc.types.push(r.reaction);
        return acc;
    }, { total: 0, types: [] as string[] });

    return (
        <div className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md group relative ${comment.parent_id ? 'scale-[0.98] origin-left' : ''}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {comment.profiles?.username ? (
                        <Link href={`/${comment.profiles.username}`} className="group/avatar flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm overflow-hidden ring-0 group-hover/avatar:ring-2 ring-blue-500 transition-all">
                                {comment.user_avatar ? (
                                    <img
                                        src={comment.user_avatar}
                                        alt={comment.user_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    comment.user_name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <span className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{comment.user_name}</span>
                                {parentDisplayName && (
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                            Replying to
                                        </span>
                                        {parentUsername ? (
                                            <Link href={`/${parentUsername}`} className="text-[10px] text-blue-500 font-bold uppercase tracking-wider hover:underline">
                                                {parentDisplayName}
                                            </Link>
                                        ) : (
                                            <span className="text-[10px] text-blue-500 font-medium uppercase tracking-wider">
                                                {parentDisplayName}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ) : (
                        <>
                            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm overflow-hidden">
                                {comment.user_avatar ? (
                                    <img
                                        src={comment.user_avatar}
                                        alt={comment.user_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    comment.user_name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <span className="block">{comment.user_name}</span>
                                {parentDisplayName && (
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                            Replying to
                                        </span>
                                        {parentUsername ? (
                                            <Link href={`/profile/${parentUsername}`} className="text-[10px] text-blue-500 font-bold uppercase tracking-wider hover:underline">
                                                {parentDisplayName}
                                            </Link>
                                        ) : (
                                            <span className="text-[10px] text-blue-500 font-medium uppercase tracking-wider">
                                                {parentDisplayName}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded-md">
                        {formatRelativeTime(comment.created_at)}
                    </span>
                    <div className="flex items-center gap-2">
                        {user && user.id === comment.user_id && (
                            <button
                                onClick={async () => {
                                    if (confirm("Are you sure you want to delete this comment?")) {
                                        await onDelete();
                                    }
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 transition-all"
                                title="Delete comment"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-10 mb-2">
                {comment.comment}
            </p>

            <div className="flex flex-col gap-3 pl-10 mt-4 pt-3 border-t border-gray-50 dark:border-gray-700/30">
                {/* Stats Row - Reactions & Replies summary (Top Row) */}
                {(reactionStats.total > 0 || replyCount > 0) && (
                    <div className="flex items-center justify-between px-1">
                        {reactionStats.total > 0 && (
                            <div className="flex items-center">
                                {!showBreakdown ? (
                                    <button
                                        onClick={() => setShowBreakdown(true)}
                                        className="flex items-center gap-1.5 group/sum transition-all"
                                    >
                                        <div className="flex -space-x-2">
                                            {reactionStats.types.map((type, i) => (
                                                <div
                                                    key={type}
                                                    className="w-5 h-5 rounded-full bg-white dark:bg-gray-800 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] shadow-sm"
                                                    style={{ zIndex: reactionStats.types.length - i }}
                                                >
                                                    {type}
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 group-hover/sum:text-blue-500 transition-colors">
                                            {reactionStats.total}
                                        </span>
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-1 flex-wrap animate-in fade-in slide-in-from-left-2 duration-300">
                                        {emojis.map(emoji => {
                                            const count = (comment.reactions || []).filter(r => r.reaction === emoji).length;
                                            const activeId = user?.id || guestId;
                                            const hasReacted = activeId && (comment.reactions || []).some(r => r.user_id === activeId && r.reaction === emoji);

                                            if (count === 0) return null;

                                            return (
                                                <button
                                                    key={`breakdown-${emoji}`}
                                                    onClick={() => onToggleReaction(comment.id, emoji)}
                                                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] transition-all border shadow-sm ${hasReacted
                                                        ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/30 dark:border-blue-800"
                                                        : "bg-white border-gray-100 text-gray-500 hover:border-gray-200 dark:bg-gray-900 dark:border-gray-700"
                                                        }`}
                                                >
                                                    <span>{emoji}</span>
                                                    <span className="font-bold">{count}</span>
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setShowBreakdown(false)}
                                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all"
                                            title="Collapse breakdown"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {replyCount > 0 && (
                            <button
                                onClick={onToggleReplies}
                                className="text-[11px] font-bold text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                            </button>
                        )}
                    </div>
                )}

                {/* Actions Row (Bottom Row) */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-sm">
                        <div className="relative group/reactions">
                            {/* Reaction Trigger */}
                            <button
                                ref={triggerRef}
                                onClick={() => setShowTray(!showTray)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400 transition-all active:scale-95 text-xs font-bold"
                                type="button"
                            >
                                <span className="text-base text-gray-400 group-hover/reactions:text-red-500 transition-colors">❤️</span>
                                <span>Like</span>
                            </button>

                            {/* Hover Tray */}
                            <div
                                ref={trayRef}
                                className={`absolute left-0 bottom-full mb-2 flex items-center gap-1 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-2xl border border-gray-100 dark:border-gray-700 transition-all z-20 ${showTray
                                    ? "opacity-100 visible translate-y-0"
                                    : "opacity-0 invisible translate-y-2 lg:group-hover/reactions:opacity-100 lg:group-hover/reactions:visible lg:group-hover/reactions:translate-y-0"
                                    }`}
                            >
                                {emojis.map(emoji => {
                                    const activeId = user?.id || guestId;
                                    const hasReacted = activeId && (comment.reactions || []).some(r => r.user_id === activeId && r.reaction === emoji);
                                    return (
                                        <button
                                            key={emoji}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleReaction(comment.id, emoji);
                                                setShowTray(false);
                                            }}
                                            className={`p-1.5 rounded-full text-lg transition-all hover:scale-125 active:scale-90 ${hasReacted ? "bg-blue-50 dark:bg-blue-900/40 scale-110" : "hover:bg-gray-50 dark:hover:bg-gray-900/50"
                                                }`}
                                        >
                                            {emoji}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reply Button */}
                        <button
                            onClick={onReply}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400 transition-all active:scale-95 text-xs font-bold"
                        >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            <span>Reply</span>
                        </button>
                    </div>

                    {replyCount > 0 && (
                        <button
                            onClick={onToggleReplies}
                            className={`flex items-center gap-1.5 transition-all text-xs font-bold ${showReplies ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-blue-500'}`}
                        >
                            <svg
                                className={`w-4 h-4 transition-transform duration-300 ${showReplies ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function CommentForm({
    postSlug,
    user,
    userName,
    parentId = null,
    onSuccess,
    onCancel
}: {
    postSlug: string;
    user: any;
    userName: string;
    parentId?: number | null;
    onSuccess: () => void;
    onCancel?: () => void;
}) {
    const [comment, setComment] = useState("");
    const [guestName, setGuestName] = useState(userName || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getAvatarUrl = (user: any) => {
        return user?.imageUrl || user?.profileImageUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const activeName = user ? userName : guestName;
        if (!comment.trim() || !activeName.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await addCommentAction({
                postSlug,
                userName: activeName,
                userAvatar: getAvatarUrl(user),
                comment: comment.trim(),
                parentId,
            });
            setComment("");
            onSuccess();
        } catch (error) {
            console.error("Failed to post comment:", error);
            alert("Failed to post comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {!user ? (
                    <input
                        type="text"
                        placeholder="Your name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                        required
                    />
                ) : (
                    <div className="flex items-center gap-3 px-4 py-2 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/30 rounded-xl">
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-[10px] font-bold overflow-hidden">
                            {getAvatarUrl(user) ? (
                                <img
                                    src={getAvatarUrl(user)}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                userName.charAt(0).toUpperCase()
                            )}
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            Replying as <span className="font-bold text-blue-600 dark:text-blue-400">{userName}</span>
                        </span>
                    </div>
                )}
                <textarea
                    placeholder={parentId ? "Write your reply..." : "What are your thoughts?"}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    rows={parentId ? 3 : 4}
                    required
                />
            </div>
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all shadow-md active:scale-95"
                >
                    {isSubmitting ? "Posting..." : parentId ? "Reply" : "Comment"}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-semibold rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
