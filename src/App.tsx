import { BrowserRouter } from "react-router-dom";
import Router from "@/routes/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton={false}
        duration={Infinity}
        style={{ zIndex: 9999 }}
      />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
