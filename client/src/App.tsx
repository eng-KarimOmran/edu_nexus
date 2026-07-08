import { ThemeProvider } from "./Provider/ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/queryClient";
import AuthInitializer from "./features/auth/components/AuthInitializer";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";
import CustomDialog from "./components/Dialog/CustomDialog";
import AppRoutes from "./components/AppRoutes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <AuthInitializer>
              <AppRoutes />
            </AuthInitializer>
            <CustomDialog />
            <Toaster richColors position="top-center" />
          </TooltipProvider>
        </ThemeProvider>
        <ReactQueryDevtools
          position="left"
          buttonPosition="bottom-left"
          initialIsOpen={false}
        />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
