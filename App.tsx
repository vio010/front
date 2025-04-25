import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/Tasks";
import Schedule from "@/pages/Schedule";
import Roommates from "@/pages/roommates";
import Statistics from "@/pages/Statistics";
import Settings from "@/pages/Settings";
import AuthPage from "@/pages/auth-page";
import WelcomePage from "@/pages/welcome-page";
import AppLayout from "@/components/layout/AppLayout";
import { TaskProvider } from "@/contexts/TaskContext";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "./lib/protected-route";

function ProtectedRoutes() {
  return (
    <TaskProvider>
      <AppLayout>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/tasks" component={Tasks} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/roommates" component={Roommates} />
          <Route path="/statistics" component={Statistics} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </AppLayout>
    </TaskProvider>
  );
}

function MainRouter() {
  return (
    <Switch>
      <Route path="/" component={WelcomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={ProtectedRoutes} />
      <ProtectedRoute path="/tasks" component={ProtectedRoutes} />
      <ProtectedRoute path="/schedule" component={ProtectedRoutes} />
      <ProtectedRoute path="/roommates" component={ProtectedRoutes} />
      <ProtectedRoute path="/statistics" component={ProtectedRoutes} />
      <ProtectedRoute path="/settings" component={ProtectedRoutes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <MainRouter />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
