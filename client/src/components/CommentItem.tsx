import type { Comment } from "@sentinel/shared";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface CommentProps {
  comment: Comment;
  isDeleting: boolean;
  isUpdating: boolean;
  onDelete: (id: number) => void;
  onUpdate: (id: number, content: string, onDone: () => void) => void;
}

function CommentItem({
  comment: { id, content, userId, author, createdAt, updatedAt },
  onDelete,
  onUpdate,
  isDeleting,
  isUpdating,
}: CommentProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content);

  const isOwner = user?.id === userId;
  const commentBy = isOwner ? "You" : author.name;

  const handleEditClick = () => {
    setIsEditing(true);
    setEditText(content);
  };

  const handleEditSave = (id: number) => {
    onUpdate(id, editText, () => setIsEditing(false));
  };

  return (
    <li key={id} className="p-3 border rounded flex justify-between">
      <div>
        <div>
          {isEditing ? (
            <>
              <textarea
                onChange={(e) => setEditText(e.target.value)}
                value={editText}
                className="w-full p-2 border rounded"
              />
              <div>
                <button
                  onClick={() => handleEditSave(id)}
                  disabled={isUpdating}
                  className="px-3 py-1 mr-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">
                by {commentBy}
              </p>
              <p className="whitespace-pre-wrap">{content}</p>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Created At:
          {new Date(createdAt).toLocaleString()}
        </p>
        {updatedAt !== createdAt && (
          <p className="text-xs text-gray-500 mt-1">
            Updated At:
            {new Date(updatedAt).toLocaleString()}
          </p>
        )}
      </div>
      {!isEditing && isOwner && (
        <div className="flex gap-3">
          <button
            onClick={() => onDelete(id)}
            disabled={isDeleting}
            className="text-red-600 hover:underline text-sm disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={handleEditClick}
            className="text-blue-600 hover:underline text-sm disabled:opacity-50 cursor-pointer"
          >
            Edit
          </button>
        </div>
      )}
    </li>
  );
}

export default CommentItem;
