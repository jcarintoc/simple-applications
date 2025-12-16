import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchCsrfToken } from "./lib/api/csrf";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Fetch CSRF token on app load
    fetchCsrfToken().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
