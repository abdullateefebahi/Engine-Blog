"use client";

import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import LightboxImage from "./LightboxImage";

export default function PortableTextRenderer({ value }: { value: any }) {
    return (
        <PortableText
            value={value}
            components={{
                block: {
                    h1: ({ children }) => (
                        <h1 className="text-3xl font-bold my-6 text-gray-900 dark:text-gray-100">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold my-5 text-gray-800 dark:text-gray-200">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xl font-semibold my-4 text-gray-800 dark:text-gray-200">{children}</h3>
                    ),
                    h4: ({ children }) => (
                        <h4 className="text-lg font-semibold my-3 text-gray-800 dark:text-gray-200">{children}</h4>
                    ),
                    h5: ({ children }) => (
                        <h5 className="text-md font-semibold my-2 text-gray-800 dark:text-gray-200">{children}</h5>
                    ),
                    h6: ({ children }) => (
                        <h6 className="text-sm font-semibold my-1 text-gray-800 dark:text-gray-200">{children}</h6>
                    ),
                    normal: ({ children }) => (
                        <p className="text-gray-700 dark:text-gray-300 leading-7 my-4">
                            {children}
                        </p>
                    ),
                },
                list: {
                    bullet: ({ children }) => (
                        <ul className="list-disc ml-6 my-4 space-y-2 text-gray-700 dark:text-gray-300">{children}</ul>
                    ),
                    number: ({ children }) => (
                        <ol className="list-decimal ml-6 my-4 space-y-2 text-gray-700 dark:text-gray-300">{children}</ol>
                    ),
                },
                listItem: {
                    bullet: ({ children }) => (
                        <li className="pl-1">{children}</li>
                    ),
                    number: ({ children }) => (
                        <li className="pl-1">{children}</li>
                    ),
                },
                marks: {
                    link: ({ value, children }) => (
                        <a
                            href={value?.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-lg"
                        >
                            {children}
                        </a>
                    ),
                },
                types: {
                    image: ({ value }: { value: any }) => {
                        return (
                            <div className="my-10">
                                <LightboxImage
                                    src={urlFor(value).url()}
                                    alt={value.alt || "Blog image"}
                                    width={800} // Increased for better detail
                                    height={500}
                                    className="rounded-xl shadow-lg border border-gray-100 dark:border-gray-800"
                                />
                                {value.caption && (
                                    <p className="text-center text-gray-500 mt-4 text-sm italic">
                                        {value.caption}
                                    </p>
                                )}
                            </div>
                        );
                    },
                },
            }}
        />
    );
}
