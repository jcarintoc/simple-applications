import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useProducts, useCategories } from "@/lib/query/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;

  const { data: products, isLoading } = useProducts({ category, search });
  const { data: categories } = useCategories();

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", newCategory);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        {categories && categories.length > 0 && (
          <div className="flex items-center gap-2">
            <span>Filter:</span>
            <Select
              value={category || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : (
        <ProductGrid products={products || []} />
      )}
    </div>
  );
}
