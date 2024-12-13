import React, { useState } from 'react';

const ProfileEditor: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setProfilePicture(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        console.log({ username, password, profilePicture });
        alert('Profile updated!');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-full max-w-sm p-6 bg-white">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                            {profilePicture ? (
                                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400">No Image</span>
                            )}
                        </div>
                        <label
                            htmlFor="profilePicture"
                            className="absolute bottom-0 right-0 bg-blue-500 text-white text-sm px-2 py-1 rounded-md cursor-pointer hover:bg-blue-600"
                        >
                            Edit
                        </label>
                        <input
                            type="file"
                            id="profilePicture"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePictureChange}
                        />
                    </div>

                    <form className="w-full mt-6 space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border-b border-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border-b border-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            className="w-full px-4 py-2 bg-black text-white font-medium rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditor;
