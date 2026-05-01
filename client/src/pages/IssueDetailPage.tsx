import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteIssue, getIssueById } from "../api/issues";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import EditIssueModal from "../components/EditIssueModal";

function IssueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const issueId = Number(id);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const {
    data: issue,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["issues", issueId],
    queryFn: () => getIssueById(issueId),
  });
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      navigate("/");
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError || !issue)
    return <div className="p-8 text-red-600">Issue not found</div>;

  return (
    <div className="p-8">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to issues
      </Link>
      <h1 className="text-3xl font-bold mb-2">{issue.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        Status: {issue.status} • Created:{" "}
        {new Date(issue.createdAt).toLocaleString()}
      </div>
      <p className="whitespace-pre-wrap">
        {issue.description ?? "No description"}
      </p>
      <div>
        <button
          className="px-4 py-2 text-white rounded cursor-pointer disabled:opacity-50 bg-red-700"
          disabled={deleteMutation.isPending}
          onClick={() => handleDelete(issueId)}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 cursor-pointer ml-2"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      </div>
      {isEditing && (
        <EditIssueModal issue={issue} onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
}

export default IssueDetailPage;
