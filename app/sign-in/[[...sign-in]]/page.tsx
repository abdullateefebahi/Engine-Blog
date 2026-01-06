import { Suspense } from "react";
import AuthScreen from "@/components/AuthScreen";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthScreen initialMode="login" />
        </Suspense>
    );
}
