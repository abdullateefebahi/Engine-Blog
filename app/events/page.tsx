import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllEvents } from "@/lib/api";

export const metadata: Metadata = {
    title: "Events",
    description: "Discover upcoming academic and social events in the Faculty of Engineering, University of Benin.",
    openGraph: {
        title: "Events | Engine Blog",
        description: "Discover upcoming academic and social events in the Faculty of Engineering, University of Benin.",
    }
};

export default async function EventsPage() {
    const events = await getAllEvents();

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-12 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium">Events</span>
                </nav>

                <div className="mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter">
                        Academic & Social <span className="text-blue-600">Events</span>
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl font-medium leading-relaxed">
                        Don't miss out on what's happening in the engineering community. From workshops to celebrations.
                    </p>
                </div>

                {events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {events.map((event: any) => (
                            <Link
                                key={event._id}
                                href={`/posts/${event.slug}`}
                                className="group bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            >
                                {event.coverImage && (
                                    <div className="relative h-64 w-full overflow-hidden">
                                        <Image
                                            src={event.coverImage}
                                            alt={event.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                                        <div className="absolute bottom-6 left-6">
                                            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                                                {event.categories?.[0] || "Event"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                            <span className="text-lg font-black leading-none">
                                                {new Date(event.eventDate).getDate()}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase">
                                                {new Date(event.eventDate).toLocaleString('default', { month: 'short' })}
                                            </span>
                                        </div>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="flex items-center gap-1.5 line-clamp-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {event.location || "Faculty of Engineering"}
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-6">
                                        {event.excerpt || "Join us for this exciting event staged at the University of Benin."}
                                    </p>
                                    <div className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400">
                                        View Details
                                        <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 p-20 rounded-[3rem] text-center border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">📅</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No upcoming events</h3>
                    </div>
                )}
            </div>
        </main>
    );
}
