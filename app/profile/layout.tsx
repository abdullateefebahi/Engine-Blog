import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile Settings",
    description: "Manage your Engine Blog profile and preferences.",
    openGraph: {
        title: "Profile Settings | Engine Blog",
        description: "Manage your Engine Blog profile and preferences.",
    }
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
