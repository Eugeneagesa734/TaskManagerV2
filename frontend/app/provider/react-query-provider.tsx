import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./auth-context";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
    // Create QueryClient inside component to avoid sharing state between requests
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
                <Toaster position="top-center" richColors />
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default ReactQueryProvider;