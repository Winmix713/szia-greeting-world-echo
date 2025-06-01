import React from 'react';
import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';
import CardEditorPage from '@/pages/card-editor';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import '@/App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Switch>
            <Route path="/" component={Index} />
            <Route path="/editor" component={CardEditorPage} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;