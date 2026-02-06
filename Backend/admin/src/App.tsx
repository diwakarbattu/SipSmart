import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { ProductsPage } from './pages/ProductsPage';
import { OrdersPage } from './pages/OrdersPage';
import { NotificationsPage } from './pages/NotificationsPage';
import OffersPage from './pages/OffersPage';
import { SettingsPage } from './pages/SettingsPage';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/offers" element={<ProtectedRoute><OffersPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
          <Toaster position="top-right" richColors closeButton />
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
