import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteIssue, getAllIssues, updateIssue } from "../api/issues";
import CreateIssueForm from "../components/CreateIssueForm";
import { ISSUE_STATUSES, type Issue } from "@sentinel/shared";
import { useEffect, useState } from "react";
import EditIssueModal from "../components/EditIssueModal";
import { Link } from "react-router-dom";

function IssuesPage() {
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["issues"],
    queryFn: getAllIssues,
  });
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateIssue(id, {
        status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  useEffect(() => {
    if (editingIssue) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [editingIssue]);

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError)
    return <div className="p-8 text-red-600">Error loading issues</div>;

  return (
    <div className="p-8">
      <CreateIssueForm />
      <h1 className="text-2xl font-bold mb-4">Issues</h1>
      <ul className="space-y-2">
        {data?.map((issue) => {
          const isDeletingThis =
            deleteMutation.variables === issue.id && deleteMutation.isPending;

          return (
            <li
              key={issue.id}
              className="p-4 border rounded flex justify-between"
            >
              <div>
                <div className="font-semibold">
                  <Link
                    to={`/issues/${issue.id}`}
                    className="font-semibold hover:underline"
                  >
                    {issue.title}
                  </Link>
                </div>
                <select
                  value={issue.status}
                  className="text-sm text-gray-500"
                  onChange={(e) =>
                    updateMutation.mutate({
                      id: issue.id,
                      status: e.target.value,
                    })
                  }
                >
                  {ISSUE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <button
                  disabled={isDeletingThis}
                  onClick={() => handleDelete(issue.id)}
                  className="px-4 py-2 text-white rounded cursor-pointer disabled:opacity-50 bg-red-700"
                >
                  {isDeletingThis ? "Deleting..." : "Delete"}
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 cursor-pointer ml-2"
                  onClick={() => setEditingIssue(issue)}
                >
                  Edit
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {editingIssue && (
        <EditIssueModal
          issue={editingIssue}
          onClose={() => setEditingIssue(null)}
        />
      )}
    </div>
  );
}

export default IssuesPage;
