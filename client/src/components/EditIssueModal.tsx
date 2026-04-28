import type { Issue } from "@sentinel/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { updateIssue } from "../api/issues";

interface EditIssueModalProps {
  issue: Issue;
  onClose: () => void;
}

function EditIssueModal({ issue, onClose }: EditIssueModalProps) {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description ?? "");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      id,
      title,
      description,
    }: {
      id: number;
      title: string;
      description?: string;
    }) => {
      return updateIssue(id, {
        title,
        description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      onClose();
    },
  });
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Edit Issue</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={() =>
              mutation.mutate({
                id: issue.id,
                title,
                description,
              })
            }
            disabled={mutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 cursor-pointer"
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditIssueModal;
