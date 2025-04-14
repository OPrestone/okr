import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { API_CONFIG } from "./lib/config";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { SidebarProvider } from "./hooks/use-sidebar";
import { SearchProvider } from "./hooks/use-search";
import { ThemeProvider } from "./hooks/use-theme";
import { useEffect } from "react";
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
import CreateDraftOkr from "./pages/create-draft-okr";
import Drafts from "./pages/drafts";
import SuggestedOKRs from "./pages/suggested-okrs";
import MyOKRs from "./pages/my-okrs";
import Mission from "./pages/mission";
import CreateTeam from "./pages/create-team";
import CreateUser from "./pages/create-user";
import SuggestedKeyResults from "./pages/suggested-key-results";
import ImportFinancial from "./pages/import-financial";
import CheckIns from "./pages/check-ins";
import Search from "./pages/search";
import TestLogo from "./pages/test-logo";
import ApprovedOKRs from "./pages/approved-okrs";
import StatusSettings from "./pages/status-settings";
import StatusTrackingDemo from "./pages/status-tracking-demo";
import Integrations from "./pages/integrations";

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
          <Route path="/check-ins" component={CheckIns} />
          <Route path="/strategy-map" component={StrategyMap} />
          <Route path="/reporting" component={Reporting} />
          <Route path="/resources" component={Resources} />
          <Route path="/configure" component={Configure} />
          <Route path="/create-objective" component={CreateObjective} />
          <Route path="/create-key-result" component={CreateKeyResult} />
          <Route path="/create-okr-ai" component={CreateOkrAi} />
          <Route path="/create-draft-okr" component={CreateDraftOkr} />
          <Route path="/drafts" component={Drafts} />
          <Route path="/my-okrs" component={MyOKRs} />
          <Route path="/approved-okrs" component={ApprovedOKRs} />
          <Route path="/suggested-okrs" component={SuggestedOKRs} />
          <Route path="/create-team" component={CreateTeam} />
          <Route path="/create-user" component={CreateUser} />
          <Route path="/suggested-key-results" component={SuggestedKeyResults} />
          <Route path="/import-financial" component={ImportFinancial} />
          <Route path="/status-settings" component={StatusSettings} />
          <Route path="/status-tracking-demo" component={StatusTrackingDemo} />
          <Route path="/integrations" component={Integrations} />
          <Route path="/search" component={Search} />
          <Route path="/test-logo" component={TestLogo} />
          <Route component={NotFound} />
        </Switch>
      </DashboardLayout>
    </SidebarProvider>
  );
}

function App() {
  // Log a message when using mock data
  useEffect(() => {
    if (API_CONFIG.USE_MOCK_DATA) {
      console.info(
        '%c🔄 USING MOCK DATA MODE 🔄\n' + 
        'The application is running with mock data instead of connecting to a real API.\n' +
        'You can change this behavior by updating USE_MOCK_DATA in config.ts',
        'background: #f0ad4e; color: #000; padding: 4px; border-radius: 3px; font-weight: bold;'
      );
    } else {
      console.info(
        '%c🌐 EXTERNAL API MODE 🌐\n' +
        `Connected to API at: ${API_CONFIG.BASE_URL}`,
        'background: #5bc0de; color: #000; padding: 4px; border-radius: 3px; font-weight: bold;'
      );
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SearchProvider>
          {/* Display a development mode banner when using mock data */}
          {API_CONFIG.USE_MOCK_DATA && (
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: '#f0ad4e',
                color: '#000',
                textAlign: 'center',
                padding: '4px',
                zIndex: 9999,
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              DEVELOPMENT MODE - Using Mock Data (Client-Side Only)
            </div>
          )}
          <Router />
          <Toaster />
        </SearchProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
