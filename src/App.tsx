import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import Layout from './components/layout/Layout';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Predictions from './pages/Predictions';
import NewPrediction from './pages/NewPrediction';
import Jobs from './pages/Jobs';
import Analytics from './pages/Analytics';
import Models from './pages/Models';
import CrossLeague from './pages/CrossLeague';
import Monitoring from './pages/Monitoring';
import Phase9 from './pages/Phase9';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryProvider>
        <Router>
          <Routes>
            {/* Auth routes without layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Main routes with layout */}
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/predictions" element={<Predictions />} />
                    <Route path="/predictions/new" element={<NewPrediction />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/models" element={<Models />} />
                    <Route path="/crossleague" element={<CrossLeague />} />
                    <Route path="/monitoring" element={<Monitoring />} />
                    <Route path="/phase9" element={<Phase9 />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </Router>
        <Toaster />
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
