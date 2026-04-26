import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteIssue, getAllIssues, updateIssue } from "../api/issues";
import CreateIssueForm from "../components/CreateIssueForm";
import { ISSUE_STASUSES } from "@sentinel/shared";

function IssuesPage() {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

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
        {data?.map((issue) => (
          <li
            key={issue.id}
            className="p-4 border rounded flex justify-between"
          >
            <div>
              <div className="font-semibold">{issue.title}</div>
              <select value={issue.status} className="text-sm text-gray-500">
                {ISSUE_STASUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <button
              disabled={deleteMutation.isPending}
              onClick={() => handleDelete(issue.id)}
              className="px-4 py-2 text-white rounded cursor-pointer disabled:opacity-50 bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IssuesPage;
