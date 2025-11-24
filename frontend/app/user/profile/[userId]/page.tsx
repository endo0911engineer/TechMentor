import { fetchProfile } from "@/lib/profile";

export default async function ProfilePage({ params }) {
  const user = await fetchProfile(params.userId);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <p className="mt-2">{user.bio}</p>
      <p className="text-gray-600 mt-2">スキル: {user.skills}</p>
    </div>
  );
}
