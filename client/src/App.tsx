import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { FloatingChatBot } from "./components/FloatingChatBot";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import WhyVertex from "./pages/WhyVertex";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Portfolio from './pages/Portfolio';
import AdminInquiries from './pages/AdminInquiries';

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/why-vertex" component={WhyVertex} />
      <Route path="/about-us" component={About} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/case-studies" component={Portfolio} />
      <Route path="/admin/inquiries" component={AdminInquiries} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <FloatingChatBot />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
