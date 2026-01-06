"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk, useReverification } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import imageCompression from "browser-image-compression";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { supabase } from "@/lib/supabase";
import ProfileSocial from "@/components/ProfileSocial";
import { getFollowersCount, getFollowingCount, getFollowers, getFollowing } from "@/lib/follows";

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    //const router = useRouter(); // Added router hook
    const { signOut, session: currentSession } = useClerk();
    const executePasswordUpdate = useReverification(async () => {
        if (user?.passwordEnabled) {
            await user.updatePassword({
                currentPassword,
                newPassword,
            });
        } else {
            await user?.updatePassword({
                newPassword,
            });
        }
    });

    const executeDeleteAccount = useReverification(async () => {
        // 1. Clean up Supabase data
        await supabase.from("profiles").delete().eq("id", user?.id);

        // 2. Delete from Clerk
        await user?.delete();

        router.push("/");
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Form states
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [department, setDepartment] = useState("");
    const [yearOfStudy, setYearOfStudy] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    // Social states
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [followersList, setFollowersList] = useState<any[]>([]);
    const [followingList, setFollowingList] = useState<any[]>([]);

    useEffect(() => {
        if (isLoaded && user) {
            fetchSocialStats();
        }
    }, [isLoaded, user]);

    const fetchSocialStats = async () => {
        if (!user) return;
        try {
            const [fCount, flCount, fList, flList] = await Promise.all([
                getFollowersCount(user.id),
                getFollowingCount(user.id),
                getFollowers(user.id),
                getFollowing(user.id)
            ]);
            setFollowerCount(fCount);
            setFollowingCount(flCount);
            setFollowersList(fList);
            setFollowingList(flList);
        } catch (error) {
            console.error("Error fetching social stats:", error);
        }
    };

    // Security states
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [sessions, setSessions] = useState<any[]>([]);

    const router = useRouter();

    const tabs = [
        {
            id: "profile", label: "Public Profile", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            )
        },
        {
            id: "security", label: "Password & Security", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            )
        },
        {
            id: "sessions", label: "Active Sessions", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            )
        },
        {
            id: "danger", label: "Danger Zone", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            )
        },
    ];

    useEffect(() => {
        if (isLoaded) {
            if (!user) {
                router.push("/sign-in");
                return;
            }
            setUsername(user.username || "");
            setFullName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
            setDepartment((user.publicMetadata?.department as string) || "");
            setYearOfStudy((user.publicMetadata?.yearOfStudy as string) || "");
            setAvatarUrl(user.imageUrl || "");

            // Fetch sessions
            user.getSessions().then((sessions) => {
                setSessions(sessions);
            });

            setLoading(false);
        }
    }, [isLoaded, user, router]);

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUpdating(true);

            if (!user) throw new Error("User not authenticated");
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image");
            }

            const file = event.target.files[0];

            // 1. Clerk handles image uploads easily through user.setProfileImage
            await user.setProfileImage({ file });

            // 2. Wait a moment for Clerk to process and provide the new image URL
            await user.reload();
            setAvatarUrl(user.imageUrl);

            // 3. Sync with Supabase immediately to capture new avatar_url
            const res = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    fullName,
                    department,
                    yearOfStudy,
                }),
            });

            if (!res.ok) {
                console.error("Supabase sync failed after avatar upload");
            }

            toast.success("Profile picture updated!");
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const res = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    fullName,
                    department,
                    yearOfStudy,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update profile");
            }

            toast.success("Profile updated successfully!");
            await user?.reload();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleRevokeSession = async (sessionId: string) => {
        try {
            setUpdating(true);
            await router.push("/profile"); // Refresh to ensure we have latest state if needed, mostly placeholder for logical flow
            // Clerk doesn't expose direct revoke on client easily for *other* sessions via simple method on user, 
            // but we can try session.revoke() if we have the session object.

            const sessionToRevoke = sessions.find(s => s.id === sessionId);
            if (sessionToRevoke) {
                await sessionToRevoke.revoke();
                setSessions(prev => prev.filter(s => s.id !== sessionId));
                toast.success("Session revoked successfully");
            }
        } catch (error: any) {
            console.error("Revoke error:", error);
            toast.error("Failed to revoke session");
        } finally {
            setUpdating(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        setUpdating(true);
        try {
            await executePasswordUpdate();
            toast.success(user?.passwordEnabled ? "Password updated successfully!" : "Password created successfully!");
            setShowPasswordForm(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            console.error("Password update error:", error);
            toast.error(error.message || "Failed to update password. You might need to refresh or check your current password.");
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.");
        if (!confirmed) return;

        setUpdating(true);
        try {
            await executeDeleteAccount();
        } catch (error: any) {
            console.error("Delete account error:", error);
            toast.error("Failed to delete account: " + error.message);
            setUpdating(false);
        }
    };

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F0F2F5] dark:bg-gray-900 pt-20 pb-12 px-4 selection:bg-blue-100 dark:selection:bg-blue-900">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
                {/* Sidebar Drawer (Mobile) & Static Sidebar (Desktop) */}
                <>
                    {/* Mobile Toggle Button */}
                    <div className="lg:hidden mb-6">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm font-semibold text-gray-700 dark:text-gray-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            Settings
                        </button>
                    </div>

                    {/* Mobile Drawer Overlay */}
                    {mobileMenuOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                    )}

                    <aside className={`
                        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none lg:w-80 lg:bg-transparent lg:dark:bg-transparent
                        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        <div className="h-full flex flex-col p-4 lg:p-0 lg:sticky lg:top-24">
                            {/* Mobile Header */}
                            <div className="lg:hidden flex items-center justify-between mb-6 px-2">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {/* Navigation */}
                            <nav className="bg-white dark:bg-gray-800 rounded-xl lg:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] p-2">
                                <div className="hidden lg:block px-4 py-3 mb-2 border-b border-gray-100 dark:border-gray-700">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
                                </div>
                                <ul className="space-y-1">
                                    {tabs.map(tab => (
                                        <li key={tab.id}>
                                            <button
                                                onClick={() => {
                                                    setActiveTab(tab.id);
                                                    setMobileMenuOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium ${activeTab === tab.id
                                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                    }`}
                                            >
                                                {tab.icon}
                                                {tab.label}
                                            </button>
                                        </li>
                                    ))}
                                    <li>
                                        <Link
                                            href="/bookmarks"
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                            Saved Posts
                                        </Link>
                                    </li>
                                </ul>
                            </nav>

                            <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl lg:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] p-2">
                                <button
                                    onClick={() => signOut(() => router.push("/"))}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </aside>
                </>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    {activeTab === "profile" && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700">
                            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Public Profile</h2>
                                <p className="text-sm text-gray-500 mt-1">Manage who you are on the platform.</p>
                            </div>

                            {/* Profile Header in Content Area */}
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 ring-4 ring-white dark:ring-gray-700 shadow-lg">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-3xl">
                                                {(user?.username || user?.firstName || "U").charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                                    </div>
                                    <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={uploadAvatar} disabled={updating} />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {user?.firstName || user?.lastName ? `${user.firstName || ""} ${user.lastName || ""}` : user?.username}
                                    </h3>
                                    <p className="text-gray-500 text-sm">@{user?.username}</p>

                                    <div className="mt-2">
                                        <ProfileSocial
                                            profileId={user?.id || ""}
                                            username={user?.username || ""}
                                            followerCount={followerCount}
                                            followingCount={followingCount}
                                            followers={followersList}
                                            following={followingList}
                                            initialIsFollowing={false} // You can't follow yourself
                                        />
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">
                                            {(user?.publicMetadata?.department as string) || "No Department"}
                                        </p>
                                        <span className="text-gray-300 dark:text-gray-600 text-xs">•</span>
                                        <Link
                                            href={`/${user?.username}`}
                                            className="text-xs text-gray-400 hover:text-blue-500 transition-colors font-bold underline decoration-dotted"
                                        >
                                            View Public Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Username</label>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Department</label>
                                            <input
                                                type="text"
                                                list="departments"
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                                            />
                                            <datalist id="departments">
                                                <option value="Accounting">Accounting</option>
                                                <option value="Agricultural Economics">Agricultural Economics</option>
                                                <option value="Agricultural Engineering">Agricultural Engineering</option>
                                                <option value="Anatomy">Anatomy</option>
                                                <option value="Animal Science">Animal Science</option>
                                                <option value="Architecture">Architecture</option>
                                                <option value="Agricultural Science Education and Fine and Applied Arts Education">Agricultural Science Education and Fine and Applied Arts Education</option>
                                                <option value="Aquaculture and Fisheries Management">Aquaculture and Fisheries Management</option>
                                                <option value="Banking and Finance">Banking and Finance</option>
                                                <option value="Biochemistry">Biochemistry</option>
                                                <option value="Building">Building</option>
                                                <option value="Business Administration">Business Administration</option>
                                                <option value="Business Education">Business Education</option>
                                                <option value="Chemical Engineering">Chemical Engineering</option>
                                                <option value="Chemistry">Chemistry</option>
                                                <option value="Civil Engineering">Civil Engineering</option>
                                                <option value="Computer Engineering">Computer Engineering</option>
                                                <option value="Computer Science">Computer Science</option>
                                                <option value="Crop Science">Crop Science</option>
                                                <option value="Curriculum and Instructional Technology">Curriculum and Instructional Technology</option>
                                                <option value="Cybersecurity">Cybersecurity</option>
                                                <option value="Data Science">Data Science</option>
                                                <option value="Dentistry">Dentistry</option>
                                                <option value="Economics">Economics</option>
                                                <option value="Educational Management">Educational Management</option>
                                                <option value="Educational Psychology">Educational Psychology</option>
                                                <option value="Electrical/Electronic Engineering">Electrical/Electronic Engineering</option>
                                                <option value="English and Literature">English and Literature</option>
                                                <option value="Entrepreneurship">Entrepreneurship</option>
                                                <option value="Estate Management">Estate Management</option>
                                                <option value="Finance">Finance</option>
                                                <option value="Fine and Applied Arts">Fine and Applied Arts</option>
                                                <option value="Fisheries">Fisheries</option>
                                                <option value="Food Science and Nutrition">Food Science and Nutrition</option>
                                                <option value="Foriegn Languages">Foriegn Languages</option>
                                                <option value="Forestry and Wildlife">Forestry and Wildlife</option>
                                                <option value="Forest Resources and Wildlife Management">Forest Resources and Wildlife Management</option>
                                                <option value="Geography and Regional Planning">Geography and Regional Planning</option>
                                                <option value="Geography and Disaster Risk Management">Geography and Disaster Risk Management</option>
                                                <option value="Geology">Geology</option>
                                                <option value="Geomatics">Geomatics</option>
                                                <option value="Health Safety and Environmental Education">Health Safety and Environmental Education</option>
                                                <option value="History and International Studies">History and International Studies</option>
                                                <option value="Home Economics, Hospitality and Tourism Education">Home Economics, Hospitality and Tourism Education</option>
                                                <option value="Human Kinetics and Sports Science">Human Kinetics and Sports Science</option>
                                                <option value="Human Resource Management">Human Resource Management</option>
                                                <option value="Industrial Engineering">Industrial Engineering</option>
                                                <option value="Industrial and Technical Education">Industrial and Technical Education</option>
                                                <option value="Information and Communication Technology">Information and Communication Technology</option>
                                                <option value="Information Technology">Information Technology</option>
                                                <option value="Insurance">Insurance</option>
                                                <option value="Law">Law</option>
                                                <option value="Library and Information Science">Library and Information Science</option>
                                                <option value="Linguistics">Linguistics</option>
                                                <option value="Mass Communication">Mass Communication</option>
                                                <option value="Mathematics">Mathematics</option>
                                                <option value="Marine Engineering">Marine Engineering</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Materials & Metallurgical Engineering">Materials & Metallurgical Engineering</option>
                                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                                                <option value="Mechatronics Engineering">Mechatronics Engineering</option>
                                                <option value="Medical Biochemistry">Medical Biochemistry</option>
                                                <option value="Medical Laboratory Science">Medical Laboratory Science</option>
                                                <option value="Medicine and Surgery">Medicine and Surgery</option>
                                                <option value="Microbiology">Microbiology</option>
                                                <option value="Nursing Science">Nursing Science</option>
                                                <option value="Optometry">Optometry</option>
                                                <option value="Peace Studies and Conflict Resolution">Peace Studies and Conflict Resolution</option>
                                                <option value="Petroleum Engineering">Petroleum Engineering</option>
                                                <option value="Pharmacy">Pharmacy</option>
                                                <option value="Philosophy">Philosophy</option>
                                                <option value="Physics">Physics</option>
                                                <option value="Physiology">Physiology</option>
                                                <option value="Physiotherapy">Physiotherapy</option>
                                                <option value="Plant Biology and Biotechnology">Plant Biology and Biotechnology</option>
                                                <option value="Political Science">Political Science</option>
                                                <option value="Production Engineering">Production Engineering</option>
                                                <option value="Psychology">Psychology</option>
                                                <option value="Public Administration">Public Administration</option>
                                                <option value="Quantity Surveying">Quantity Surveying</option>
                                                <option value="Radiography">Radiography</option>
                                                <option value="Religions">Religions</option>
                                                <option value="Social Work">Social Work</option>
                                                <option value="Sociology and Anthropology">Sociology and Anthropology</option>
                                                <option value="Soil Science">Soil Science</option>
                                                <option value="Software Engineering">Software Engineering</option>
                                                <option value="Statistics">Statistics</option>
                                                <option value="Structural Engineering">Structural Engineering</option>
                                                <option value="Surveying & Geoinformatics">Surveying & Geoinformatics</option>
                                                <option value="Theatre Arts">Theatre Arts</option>
                                                <option value="Veterinary Medicine">Veterinary Medicine</option>
                                                <option value="Zoology">Zoology</option>
                                            </datalist>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Year of Study</label>
                                            <select
                                                value={yearOfStudy}
                                                onChange={(e) => setYearOfStudy(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                                            >
                                                <option value="">Select Level</option>
                                                <option value="100L">100 Level</option>
                                                <option value="200L">200 Level</option>
                                                <option value="300L">300 Level</option>
                                                <option value="400L">400 Level</option>
                                                <option value="500L">500 Level</option>
                                                <option value="600L">600 Level</option>
                                                <option value="Graduate">Graduate</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={updating}
                                            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-70"
                                        >
                                            {updating ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700">
                            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Password & Security</h2>
                                    <p className="text-sm text-gray-500 mt-1">Manage your login details.</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">Password</p>
                                            <p className="text-sm text-gray-500">Last changed recently</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    >
                                        {showPasswordForm ? "Cancel" : "Edit"}
                                    </button>
                                </div>

                                {showPasswordForm && (
                                    <form onSubmit={handleChangePassword} className="mt-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-4 max-w-md">
                                            {user?.passwordEnabled && (
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
                                                        <Link href="/auth?mode=forgot" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700">
                                                            Forgot password?
                                                        </Link>
                                                    </div>
                                                    <div className="relative group">
                                                        <input
                                                            type={showCurrentPassword ? "text" : "password"}
                                                            placeholder="Current Password"
                                                            value={currentPassword}
                                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none pr-12"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                        >
                                                            <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="relative group">
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    placeholder="New Password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none pr-12"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="relative group">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Confirm New Password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none pr-12"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={updating}
                                                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
                                            >
                                                Update Password
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "sessions" && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700">
                            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Sessions</h2>
                                <p className="text-sm text-gray-500 mt-1">Manage devices where you're logged in.</p>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {sessions.map((session) => (
                                    <div key={session.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 text-2xl">
                                                {session.latestActivity?.isMobile ? "📱" : "💻"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {session.latestActivity?.browserName || "Unknown Browser"} on {session.latestActivity?.deviceType || "Unknown Device"}
                                                </p>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-500 mt-1">
                                                    <span>{session.latestActivity?.ipAddress}</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span>{new Date(session.lastActiveAt).toLocaleDateString()}</span>
                                                    {session.id === currentSession?.id && (
                                                        <span className="text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded text-xs">Active Now</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {session.id !== currentSession?.id && (
                                            <button
                                                onClick={() => handleRevokeSession(session.id)}
                                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                                            >
                                                Log Out
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "danger" && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] border border-red-100 dark:border-red-900/30 overflow-hidden">
                            <div className="px-6 py-5 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/30">
                                <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
                                <p className="text-sm text-red-500/80 mt-1">Irreversible account actions.</p>
                            </div>
                            <div className="p-8">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Delete Account</h3>
                                <p className="text-gray-500 text-sm mb-6 max-w-xl">
                                    Once you delete your account, there is no going back. Please be certain. All your data including comments, bookmarks, and reactions will be permanently removed.
                                </p>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={updating}
                                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition-all"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
