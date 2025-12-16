import { useSuggestedUsers } from "@/lib/query/profiles";
import { SuggestedUserCard } from "@/components/connections/SuggestedUserCard";

const AllConnectionPage = () => {
  const { data: suggestedUsers } = useSuggestedUsers();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            People you may know
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestedUsers?.map((user) => (
            <SuggestedUserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllConnectionPage;
