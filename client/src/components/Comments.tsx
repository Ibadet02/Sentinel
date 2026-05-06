import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  createComment,
  deleteComment,
  getCommentsForIssue,
  updateComment,
} from "../api/comments";
import CommentItem from "./CommentItem";

interface CommentsProps {
  issueId: number;
}

function Comments({ issueId }: CommentsProps) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", issueId],
    queryFn: () => getCommentsForIssue(issueId),
  });
  const createMutation = useMutation({
    mutationFn: (content: string) => createComment(issueId, { content }),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({
        queryKey: ["comments", issueId],
      });
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      updateComment(id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", issueId],
      });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", issueId],
      });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleUpdate = (id: number, content: string, onDone: () => void) => {
    updateMutation.mutate({ id, content }, { onSuccess: onDone });
  };

  if (error) {
    return <div>eror</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Comments</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (content.trim()) createMutation.mutate(content);
        }}
        className="mb-4"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border rounded mb-2"
        />
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {createMutation.isPending ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {isLoading && <div>Loading comments...</div>}

      <ul className="space-y-2">
        {comments?.map((comment) => {
          const isDeletingThis =
            deleteMutation.variables === comment.id && deleteMutation.isPending;
          const isUpdatingThis =
            updateMutation.variables?.id === comment.id &&
            updateMutation.isPending;

          return (
            <CommentItem
              comment={comment}
              isDeleting={isDeletingThis}
              isUpdating={isUpdatingThis}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              key={comment.id}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default Comments;
