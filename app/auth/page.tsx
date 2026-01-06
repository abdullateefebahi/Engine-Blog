import { Suspense } from "react";
import AuthScreen from "@/components/AuthScreen";

export default function AuthPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthScreen />
        </Suspense>
    );
}
