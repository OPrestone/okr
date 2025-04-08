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
import CreateKeyResult from "./pages/create-key-result";
import CreateOkrAi from "./pages/create-okr-ai";
import SuggestedOKRs from "./pages/suggested-okrs";
import Mission from "./pages/mission";

function Router() {
  return (
    <SidebarProvider>
      <DashboardLayout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/quick-start" component={QuickStart} />
          <Route path="/mission" component={Mission} />
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
          <Route path="/create-key-result" component={CreateKeyResult} />
          <Route path="/create-okr-ai" component={CreateOkrAi} />
          <Route path="/suggested-okrs" component={SuggestedOKRs} />
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
