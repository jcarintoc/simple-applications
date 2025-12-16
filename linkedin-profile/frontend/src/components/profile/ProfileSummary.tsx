interface ProfileSummaryProps {
  summary: string | null;
}

export function ProfileSummary({ summary }: ProfileSummaryProps) {
  if (!summary) {
    return (
      <div className="p-6 bg-white rounded-lg border">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
        <p className="text-gray-500 italic">No summary provided yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg border">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
      <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
    </div>
  );
}
