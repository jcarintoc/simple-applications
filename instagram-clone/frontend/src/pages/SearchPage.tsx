import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UserSearchResult } from "@/components/users/UserSearchResult";
import { useSearchUsers } from "@/lib/query/users";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Search } from "lucide-react";

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { data: users, isLoading } = useSearchUsers(debouncedSearchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Search Users</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      {isLoading && debouncedSearchQuery.trim().length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Searching...</p>
        </div>
      )}

      {!isLoading && searchQuery.trim().length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>Enter a search query to find users</p>
          </CardContent>
        </Card>
      )}

      {!isLoading &&
        debouncedSearchQuery.trim().length > 0 &&
        users &&
        users.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>No users found</p>
            </CardContent>
          </Card>
        )}

      {!isLoading && debouncedSearchQuery.trim().length > 0 && users && users.length > 0 && (
        <div className="space-y-4">
          {users.map((user) => (
            <UserSearchResult key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
