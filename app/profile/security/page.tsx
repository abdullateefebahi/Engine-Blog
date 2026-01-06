import { UserProfile } from "@clerk/nextjs";

export default function SecurityPage() {
    return (
        <div className="flex items-center justify-center min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
            <UserProfile path="/profile/security" routing="path" />
        </div>
    );
}
