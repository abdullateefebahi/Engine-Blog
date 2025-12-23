"use client";

import { useEffect } from 'react';

export default function LoaderRegistrar() {
    useEffect(() => {
        async function register() {
            const { lineSpinner } = await import('ldrs');
            lineSpinner.register();
        }
        register();
    }, []);

    return null;
}
