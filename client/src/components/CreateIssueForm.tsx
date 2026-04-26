import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createIssue } from "../api/issues";
import React from "react";

const CreateIssueForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      setTitle("");
      setDescription("");
    },
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ title, description });
  };
  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {mutation.isPending ? "Creating..." : "Create Issue"}
      </button>
    </form>
  );
};

export default CreateIssueForm;
