import { fetchInterviews} from "@/lib/interview";

export default async function InterviewPage({ params }) {
  const interview = await fetchInterviews(params.id);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">面接詳細</h1>

      <div className="border p-4 mt-4 rounded">
        <p>面接官：{interview.interviewer.name}</p>
        <p>日時：{interview.datetime}</p>
        <p>ステータス：{interview.status}</p>
      </div>
    </div>
  );
}
