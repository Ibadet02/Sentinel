import type { Comment } from "@sentinel/shared";
import { useState } from "react";

interface CommentProps {
  comment: Comment;
  isDeleting: boolean;
  isUpdating: boolean;
  onDelete: (id: number) => void;
  onUpdate: (id: number, content: string, onDone: () => void) => void;
}

function CommentItem({
  comment: { id, content, createdAt, updatedAt },
  onDelete,
  onUpdate,
  isDeleting,
  isUpdating,
}: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content);

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
                <button onClick={() => handleEditSave(id)}>
                  {isUpdating ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <p className="whitespace-pre-wrap">{content}</p>
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
      {!isEditing && (
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
