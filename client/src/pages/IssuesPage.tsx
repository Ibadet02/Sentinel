import { useQuery } from "@tanstack/react-query";
import { getAllIssues } from "../api/issues";

function IssuesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["issues"],
    queryFn: getAllIssues,
  });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError) return <div className="p-8 text-red-600">Error loading issues</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Issues</h1>
      <ul className="space-y-2">
        {data?.map((issue) => (
          <li key={issue.id} className="p-4 border rounded">
            <div className="font-semibold">{issue.title}</div>
            <div className="text-sm text-gray-500">{issue.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IssuesPage;
