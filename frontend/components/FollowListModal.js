import React from "react";
import Link from "next/link";

const FollowListModal = ({ isOpen, onClose, users, title }) => {
  const defaultProfileImage = "/default_avatar.png";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2 md:px-0">
      <div className="bg-gray-900 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-grow">
          {users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li
                  key={user.id}
                  className="p-4 border-b border-gray-800 hover:bg-gray-800 transition"
                >
                  <Link
                    href={`/${user.username}`}
                    className="flex items-center space-x-3"
                    onClick={onClose}
                  >
                    <img
                      src={
                        user.profileImage
                          ? `${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}`
                          : defaultProfileImage
                      }
                      alt={user.studentId}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-white">{user.studentId}</p>
                      <p className="text-gray-500 text-sm">@{user.username}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-center text-gray-500">
              Henüz {title.toLowerCase()} yok.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;