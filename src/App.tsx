import { useState } from 'react';
import { ThemeProvider } from './components/theme-provider';
import { DataTable } from './components/data-table';
import { Sidebar } from './components/sidebar';
import { Button } from './components/ui/button';
import { AIIcon } from './components/ai-icon';
import { Toaster } from './components/ui/toaster';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">AI-Powered Contact Insights</h1>
            <DataTable />
          </div>
        </main>
        <Button
          className="fixed bottom-4 right-4 z-50"
          onClick={() => setSidebarOpen(true)}
        >
          <AIIcon className="mr-2 h-4 w-4" />
          AI Actions
        </Button>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;