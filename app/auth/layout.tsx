import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Authentication",
    description: "Sign in or create an account on Engine Blog to join the community.",
    openGraph: {
        title: "Authentication | Engine Blog",
        description: "Sign in or create an account on Engine Blog to join the community.",
    }
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
