import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { AppRoutes } from '@/routes/AppRoutes';
import { shouldRetryQuery } from '@/services/api/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: shouldRetryQuery,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="bottom-right"
          theme="dark"
          richColors
          toastOptions={{
            style: {
              background: 'hsl(240 10% 7%)',
              border: '1px solid hsl(240 6% 16%)',
              color: 'hsl(0 0% 98%)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
