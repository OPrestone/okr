import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { SidebarProvider } from "./hooks/use-sidebar";
import { DashboardLayout } from "./components/dashboard/layout";
import Home from "./pages/home";
import QuickStart from "./pages/quick-start";
import Dashboards from "./pages/dashboards";
import CompanyObjectives from "./pages/company-objectives";
import Teams from "./pages/teams";
import Users from "./pages/users";
import OneOnOne from "./pages/one-on-one";
import StrategyMap from "./pages/strategy-map";
import Reporting from "./pages/reporting";
import Resources from "./pages/resources";
import Configure from "./pages/configure";
import CreateObjective from "./pages/create-objective";

function Router() {
  return (
    <SidebarProvider>
      <DashboardLayout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/quick-start" component={QuickStart} />
          <Route path="/dashboards" component={Dashboards} />
          <Route path="/company-objectives" component={CompanyObjectives} />
          <Route path="/teams" component={Teams} />
          <Route path="/users" component={Users} />
          <Route path="/one-on-one" component={OneOnOne} />
          <Route path="/strategy-map" component={StrategyMap} />
          <Route path="/reporting" component={Reporting} />
          <Route path="/resources" component={Resources} />
          <Route path="/configure" component={Configure} />
          <Route path="/create-objective" component={CreateObjective} />
          <Route component={NotFound} />
        </Switch>
      </DashboardLayout>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
