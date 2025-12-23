"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import imageCompression from "browser-image-compression";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Form states
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [department, setDepartment] = useState("");
    const [yearOfStudy, setYearOfStudy] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth");
                return;
            }
            setUser(user);
            setUsername(user.user_metadata?.username || "");
            setFullName(user.user_metadata?.full_name || "");
            setDepartment(user.user_metadata?.department || "");
            setYearOfStudy(user.user_metadata?.year_of_study || "");
            setAvatarUrl(user.user_metadata?.engine_avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || "");
            setLoading(false);
        };

        getUser();
    }, [router]);

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUpdating(true);
            setMessage(null);

            if (!user) throw new Error("User not authenticated");

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image");
            }

            let file = event.target.files[0];

            // 1. Initial Size Check (Max 450KB for raw file)
            if (file.size > 450 * 1024) {
                // We'll try to compress it below 95KB anyway, but this captures extreme cases
            }

            // 2. Compress to ~95KB while maintaining quality
            const options = {
                maxSizeMB: 0.095, // 95KB
                maxWidthOrHeight: 1024,
                useWebWorker: true,
                initialQuality: 0.8,
            };

            try {
                const compressedFile = await imageCompression(file, options);
                file = compressedFile as File;
                console.log(`Compressed size: ${(file.size / 1024).toFixed(2)} KB`);
            } catch (compressionError) {
                console.error("Compression failed:", compressionError);
                // Continue with original file if compression fails but it's under 450kb
                if (file.size > 450 * 1024) throw new Error("File is too large and compression failed.");
            }

            const fileExt = file.name.split(".").pop();
            const filePath = `${user.id}/avatar.${fileExt}`;

            // 3. Clean up old files in this user's folder
            const { data: existingFiles } = await supabase.storage
                .from("avatars")
                .list(user.id);

            if (existingFiles && existingFiles.length > 0) {
                const pathsToDelete = existingFiles.map(f => `${user.id}/${f.name}`);
                await supabase.storage.from("avatars").remove(pathsToDelete);
            }

            // 2. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // 3. Get Public URL with cache buster
            const { data } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            const publicUrl = `${data.publicUrl}?t=${Date.now()}`;
            setAvatarUrl(publicUrl);

            // 4. Update Auth Metadata - Using a unique key to prevent provider overwrite
            const { data: { user: updatedUser }, error: updateError } = await supabase.auth.updateUser({
                data: { engine_avatar_url: publicUrl },
            });

            if (updateError) throw updateError;

            // 5. Force session refresh so all components see the change
            await supabase.auth.refreshSession();
            if (updatedUser) setUser(updatedUser);

            setMessage({ type: "success", text: "Profile picture updated!" });
        } catch (error: any) {
            console.error("Upload error:", error);
            setMessage({ type: "error", text: error.message });
        } finally {
            setUpdating(false);
        }
    };


    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setMessage(null);

        const { error } = await supabase.auth.updateUser({
            data: {
                username,
                full_name: fullName,
                department,
                year_of_study: yearOfStudy,
                engine_avatar_url: avatarUrl,
            },
        });

        if (error) {
            setMessage({ type: "error", text: error.message });
        } else {
            setMessage({ type: "success", text: "Profile updated successfully!" });
            const { data: { user: updatedUser } } = await supabase.auth.getUser();
            setUser(updatedUser);
        }
        setUpdating(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium">Profile Settings</span>
                </nav>

                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                        <div className="absolute -bottom-12 left-8">
                            <label className="relative block group cursor-pointer" title="Change profile picture">
                                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-gray-800 p-1 shadow-xl group-hover:scale-105 transition-transform duration-300">
                                    <div className="w-full h-full rounded-[1.25rem] bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-3xl font-black text-blue-600 dark:text-blue-400 overflow-hidden relative">
                                        {avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    setAvatarUrl(""); // Fallback to initials
                                                }}
                                            />
                                        ) : (
                                            username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()
                                        )}
                                        {/* Upload Overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={uploadAvatar}
                                    disabled={updating}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="pt-16 pb-12 px-8">
                        <div className="mb-10">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your public profile and preferences.</p>
                        </div>

                        {message && (
                            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${message.type === "success"
                                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800"
                                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800"
                                }`}>
                                <span className="text-xl">{message.type === "success" ? "✅" : "❌"}</span>
                                <p className="font-medium">{message.text}</p>
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Username */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="johndoe"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                </div>

                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                </div>

                                {/* Department */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Department</label>
                                    <input
                                        type="text"
                                        list="departments"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        placeholder="e.g. Computer Engineering"
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                    <datalist id="departments">
                                        <option value="Accounting">Accounting</option>
                                        <option value="Agricultural Economics">Agricultural Economics</option>
                                        <option value="Agricultural Engineering">Agricultural Engineering</option>
                                        <option value="Anatomy">Anatomy</option>
                                        <option value="Animal Science">Animal Science</option>
                                        <option value="Architecture">Architecture</option>
                                        <option value="Banking and Finance">Banking and Finance</option>
                                        <option value="Biochemistry">Biochemistry</option>
                                        <option value="Building">Building</option>
                                        <option value="Business Administration">Business Administration</option>
                                        <option value="Chemical Engineering">Chemical Engineering</option>
                                        <option value="Chemistry">Chemistry</option>
                                        <option value="Civil Engineering">Civil Engineering</option>
                                        <option value="Computer Engineering">Computer Engineering</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Crop Science">Crop Science</option>
                                        <option value="Curriculum and Instructional Technology">Curriculum and Instructional Technology</option>
                                        <option value="Dentistry">Dentistry</option>
                                        <option value="Economics">Economics</option>
                                        <option value="Educational Management">Educational Management</option>
                                        <option value="Educational Psychology">Educational Psychology</option>
                                        <option value="Electrical/Electronic Engineering">Electrical/Electronic Engineering</option>
                                        <option value="English and Literature">English and Literature</option>
                                        <option value="Entrepreneurship">Entrepreneurship</option>
                                        <option value="Estate Management">Estate Management</option>
                                        <option value="Fine and Applied Arts">Fine and Applied Arts</option>
                                        <option value="Fisheries">Fisheries</option>
                                        <option value="Forestry and Wildlife">Forestry and Wildlife</option>
                                        <option value="Geography and Regional Planning">Geography and Regional Planning</option>
                                        <option value="Geology">Geology</option>
                                        <option value="Health Safety and Environmental Education">Health Safety and Environmental Education</option>
                                        <option value="History and International Studies">History and International Studies</option>
                                        <option value="Human Kinetics and Sports Science">Human Kinetics and Sports Science</option>
                                        <option value="Law">Law</option>
                                        <option value="Library and Information Science">Library and Information Science</option>
                                        <option value="Linguistics">Linguistics</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Marine Engineering">Marine Engineering</option>
                                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                                        <option value="Mechatronics Engineering">Mechatronics Engineering</option>
                                        <option value="Medical Laboratory Science">Medical Laboratory Science</option>
                                        <option value="Medicine and Surgery">Medicine and Surgery</option>
                                        <option value="Microbiology">Microbiology</option>
                                        <option value="Nursing Science">Nursing Science</option>
                                        <option value="Optometry">Optometry</option>
                                        <option value="Petroleum Engineering">Petroleum Engineering</option>
                                        <option value="Pharmacy">Pharmacy</option>
                                        <option value="Philosophy">Philosophy</option>
                                        <option value="Physics">Physics</option>
                                        <option value="Physiology">Physiology</option>
                                        <option value="Plant Biology and Biotechnology">Plant Biology and Biotechnology</option>
                                        <option value="Political Science">Political Science</option>
                                        <option value="Production Engineering">Production Engineering</option>
                                        <option value="Psychology">Psychology</option>
                                        <option value="Public Administration">Public Administration</option>
                                        <option value="Quantity Surveying">Quantity Surveying</option>
                                        <option value="Radiography and Radiation Science">Radiography and Radiation Science</option>
                                        <option value="Religious Management and Cultural Studies">Religious Management and Cultural Studies</option>
                                        <option value="Social Work">Social Work</option>
                                        <option value="Sociology and Anthropology">Sociology and Anthropology</option>
                                        <option value="Soil Science">Soil Science</option>
                                        <option value="Statistics">Statistics</option>
                                        <option value="Structural Engineering">Structural Engineering</option>
                                        <option value="Theatre Arts">Theatre Arts</option>
                                        <option value="Zoology">Zoology</option>

                                    </datalist>
                                </div>

                                {/* Year of Study */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Year of Study</label>
                                    <select
                                        value={yearOfStudy}
                                        onChange={(e) => setYearOfStudy(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none"
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

                            {/* Email (Readonly) */}
                            <div className="space-y-2 pt-4">
                                <label className="text-sm font-bold text-gray-500 dark:text-gray-500 ml-1 flex items-center gap-2">
                                    Email Address <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded uppercase font-bold">Account Root</span>
                                </label>
                                <input
                                    type="email"
                                    value={user?.email}
                                    disabled
                                    className="w-full px-5 py-3.5 bg-gray-100 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-500 cursor-not-allowed outline-none"
                                />
                                <p className="text-[11px] text-gray-400 ml-2">Email changes must be requested via administrative support for security.</p>
                            </div>

                            <div className="pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Your information is used for public attribution on comments and posts.
                                </p>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className={`w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 ${updating ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {updating ? (
                                        <>
                                            <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                                            Saving Changes...
                                        </>
                                    ) : (
                                        "Save Profile"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Account Security Card */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Account Security</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Want to change your password or secure your account further?</p>
                    </div>
                    <button className="px-6 py-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl border border-gray-200 dark:border-gray-700 transition-all">
                        Security Settings
                    </button>
                </div>
            </div>
        </main>
    );
}
