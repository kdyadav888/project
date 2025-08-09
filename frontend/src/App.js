
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LostDashboard from './pages/LostDashboard';
import FoundDashboard from './pages/FoundDashboard';
import Login from './pages/Login';
import PostLost from './pages/PostLost';
import PostFound from './pages/PostFound';
import ItemDetail from './pages/ItemDetail';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Navigation />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/lost" element={
            <ProtectedRoute>
              <LostDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/found" element={
            <ProtectedRoute>
              <FoundDashboard />
            </ProtectedRoute>
          } />
          <Route path="/post-lost" element={
            <ProtectedRoute>
              <PostLost />
            </ProtectedRoute>
          } />
          <Route path="/post-found" element={
            <ProtectedRoute>
              <PostFound />
            </ProtectedRoute>
          } />
          <Route path="/item/:id" element={
            <ProtectedRoute>
              <ItemDetail />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard/lost" />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
