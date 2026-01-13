"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagic, faChevronDown, faChevronUp, faList, faPaperPlane, faLightbulb, faCopy, faCheck, faTimes, faLanguage, faGlobe } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/contexts/TranslationContext";

interface AIToolsProps {
    content: string;
    showBanner?: boolean;
    publishDate?: string;
    authorName?: string;
}

const SparklesSVG = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 1L13.5 8.5L21 10L13.5 11.5L12 19L10.5 11.5L3 10L10.5 8.5L12 1Z" />
        <path d="M6 14L6.75 17.25L10 18L6.75 18.75L6 22L5.25 18.75L2 18L5.25 17.25L6 14Z" />
        <path d="M18 14L18.75 17.25L22 18L18.75 18.75L18 22L17.25 18.75L14 18L17.25 17.25L18 14Z" />
    </svg>
);

export default function AITools({ content, showBanner = false, publishDate, authorName }: AIToolsProps) {
    const { t, locale } = useTranslation();
    const [result, setResult] = useState<string | null>(null);
    const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeType, setActiveType] = useState<"summary" | "explain" | "takeaways" | "ask" | "translate" | null>(null);
    const [question, setQuestion] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const lastMessageRef = useRef<HTMLDivElement>(null);

    const scrollToLatest = () => {
        if (chatHistory.length > 0) {
            const lastMsg = chatHistory[chatHistory.length - 1];
            if (lastMsg.role === "assistant") {
                // Scroll to the TOP of the new assistant message
                lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                // Scroll to the bottom for user messages
                lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Small delay to ensure the DOM has updated
            const timeout = setTimeout(scrollToLatest, 100);
            return () => clearTimeout(timeout);
        }
    }, [chatHistory, isLoading, isOpen]);

    const handleCopy = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        toast.success(t("Common.loading") === "Loading..." ? "Copied to clipboard!" : "Copié dans le presse-papier !");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleAIAction = async (type: "summary" | "explain" | "takeaways" | "ask" | "translate") => {
        if (!content) {
            toast.error("Post content is empty.");
            return;
        }

        let currentQuestion = "";
        if (type === "ask") {
            if (!question.trim()) {
                toast.error("Please enter a question.");
                return;
            }
            currentQuestion = question;
            setChatHistory(prev => [...prev, { role: "user", content: currentQuestion }]);
            setQuestion(""); // Clear input
        } else {
            setChatHistory([]); // Clear chat for static tools
            setResult(null);
        }

        setIsLoading(true);
        setActiveType(type);
        setIsOpen(true);

        try {
            const response = await fetch("/api/ai/article", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content,
                    type,
                    publishDate,
                    authorName,
                    targetLanguage: locale === 'fr' ? 'French' : 'English',
                    question: type === "ask" ? currentQuestion : undefined,
                    history: type === "ask" ? chatHistory : undefined
                }),
            });

            const data = await response.json();
            if (data.text) {
                const fullText = data.text;
                const words = fullText.split(" ");
                let currentIdx = 0;
                let currentText = "";

                setIsTyping(true);
                setIsLoading(false);

                if (type === "ask") {
                    // Add empty assistant message placeholder
                    setChatHistory(prev => [...prev, { role: "assistant", content: "" }]);

                    const timer = setInterval(() => {
                        if (currentIdx < words.length) {
                            currentText += (currentIdx === 0 ? "" : " ") + words[currentIdx];
                            setChatHistory(prev => {
                                const newHist = [...prev];
                                newHist[newHist.length - 1].content = currentText;
                                return newHist;
                            });
                            currentIdx++;
                        } else {
                            clearInterval(timer);
                            setIsTyping(false);
                        }
                    }, 30);
                } else {
                    setResult("");
                    const timer = setInterval(() => {
                        if (currentIdx < words.length) {
                            currentText += (currentIdx === 0 ? "" : " ") + words[currentIdx];
                            setResult(currentText);
                            currentIdx++;
                        } else {
                            clearInterval(timer);
                            setIsTyping(false);
                        }
                    }, 25);
                }
            } else {
                toast.error("AI service failure.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("AI Error:", error);
            toast.error("Failed to connect to AI service.");
            setIsLoading(false);
        }
    };

    return (
        <>
            {showBanner && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 p-0.5 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 border border-blue-100 dark:border-blue-900/30 overflow-hidden shadow-sm"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-[14px]">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30">
                                <SparklesSVG className="w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-gray-900 dark:text-white">{t("Navbar.askAria")}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Have questions? Ask the Engine Blog AI Assistant in real-time.</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => handleAIAction("translate")}
                                className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-900 px-6 py-3 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-95 shadow-sm"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                                    <FontAwesomeIcon icon={faGlobe} className="group-hover:rotate-12 transition-transform" />
                                    {t("Common.translate")}
                                </span>
                            </button>
                            <button
                                onClick={() => setIsOpen(true)}
                                className="group relative overflow-hidden rounded-xl bg-blue-600 px-6 py-3 transition-all hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-500/20"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                                    <FontAwesomeIcon icon={faMagic} className="group-hover:rotate-12 transition-transform" />
                                    Start AI Chat
                                </span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Floating Action Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/40 border border-white/20 backdrop-blur-sm cursor-pointer select-none"
                aria-label="Toggle AI Assistant"
            >
                <div className="relative flex items-center justify-center w-full h-full pointer-events-none">
                    {isOpen ? (
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    ) : (
                        <SparklesSVG className="w-6 h-6" />
                    )}
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border border-white dark:border-gray-900"></span>
                        </span>
                    )}
                </div>
            </motion.button>

            {/* AI Assistant Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, x: 20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95, x: 20 }}
                        className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] overflow-hidden rounded-3xl border border-blue-100 dark:border-blue-900/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl flex flex-col max-h-[70vh] transition-all duration-300 ring-1 ring-black/5"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-blue-50/50 dark:bg-blue-900/20">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20">
                                    <SparklesSVG className="w-4 h-4 animate-pulse" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Aria</h4>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-black">Engine Blog AI</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-400 transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        {/* Quick Actions Scroll */}
                        <div className="flex items-center gap-2 p-3 overflow-x-auto no-scrollbar border-b border-gray-100 dark:border-gray-800">
                            <button
                                onClick={() => handleAIAction("translate")}
                                disabled={isLoading || isTyping}
                                className="flex-none flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                            >
                                <FontAwesomeIcon icon={faGlobe} />
                                {t("Common.translate")}
                            </button>
                            <button
                                onClick={() => handleAIAction("summary")}
                                disabled={isLoading || isTyping}
                                className="flex-none flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-sm"
                            >
                                <FontAwesomeIcon icon={faMagic} />
                                Summarize
                            </button>
                            <button
                                onClick={() => handleAIAction("takeaways")}
                                disabled={isLoading || isTyping}
                                className="flex-none flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 shadow-sm"
                            >
                                <FontAwesomeIcon icon={faList} />
                                Takeaways
                            </button>
                            <button
                                onClick={() => handleAIAction("explain")}
                                disabled={isLoading || isTyping}
                                className="flex-none flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 shadow-sm"
                            >
                                <FontAwesomeIcon icon={faLightbulb} />
                                Explain
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30 dark:bg-black/10">
                            {!result && chatHistory.length === 0 && !isLoading && (
                                <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-4">
                                        <SparklesSVG className="w-8 h-8 text-blue-500/50" />
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-relaxed">
                                        Hi, I'm Aria. Ask me anything!
                                    </p>
                                </div>
                            )}

                            {(result || chatHistory.length > 0 || isLoading) && (
                                <div className="space-y-4">
                                    {activeType === "ask" ? (
                                        <div
                                            className="flex flex-col gap-4 pr-2"
                                        >
                                            {chatHistory.map((msg, i) => (
                                                <div
                                                    key={i}
                                                    ref={i === chatHistory.length - 1 ? lastMessageRef : null}
                                                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                                                >
                                                    <div className={`max-w-[100%] px-4 py-2.5 rounded-2xl text-sm ${msg.role === "user"
                                                        ? "bg-blue-600 text-white rounded-tr-none"
                                                        : "bg-transparent dark:bg-transparent text-gray-800 dark:text-gray-200"
                                                        }`}>
                                                        {msg.role === "assistant" ? (
                                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                            </div>
                                                        ) : msg.content}
                                                    </div>
                                                    {msg.role === "assistant" && i === chatHistory.length - 1 && !isLoading && (
                                                        <button
                                                            onClick={() => handleCopy(msg.content)}
                                                            className="mt-1 ml-1 text-[10px] uppercase font-bold text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1"
                                                        >
                                                            <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} />
                                                            {isCopied ? "Copied" : "Copy"}
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {isLoading && (
                                                <div
                                                    className="flex items-center gap-1.5 px-2 py-1"
                                                    ref={lastMessageRef}
                                                >
                                                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="animate-in fade-in duration-500">
                                            {isLoading ? (
                                                <div className="flex flex-col items-center justify-center py-20">
                                                    <div className="relative">
                                                        <div className="h-12 w-12 animate-spin rounded-full border-2 border-blue-600/20 border-t-blue-600 shadow-xl shadow-blue-500/10"></div>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <SparklesSVG className="w-5 h-5 text-blue-500 animate-pulse" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : result && (
                                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-50 dark:border-gray-700">
                                                        <strong className="block text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                                                            AI {activeType === "summary" ? "Summary" :
                                                                activeType === "takeaways" ? "Key Takeaways" : "Explanation"}
                                                        </strong>
                                                        <button
                                                            onClick={() => handleCopy(result)}
                                                            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 text-[10px] font-bold"
                                                        >
                                                            <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} className={isCopied ? "text-green-500" : ""} />
                                                            {isCopied ? "Copied" : "Copy"}
                                                        </button>
                                                    </div>
                                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                                                        <ReactMarkdown>{result}</ReactMarkdown>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAIAction("ask")}
                                    placeholder="Message Aria..."
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 focus:border-blue-500/50 focus:bg-white dark:focus:bg-gray-900 outline-none rounded-2xl px-4 py-3 text-sm transition-all shadow-inner pr-12 text-gray-900 dark:text-gray-200"
                                />
                                <button
                                    onClick={() => handleAIAction("ask")}
                                    disabled={isLoading || isTyping || !question.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-gray-400 shadow-md shadow-blue-500/20"
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence >
        </>
    );
}
