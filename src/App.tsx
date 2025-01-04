import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ItemsProvider } from './context/ItemsContext';
import { InvoicesProvider } from './context/InvoicesContext';
import { LabelsProvider } from './context/LabelsContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import Labels from './pages/Labels';
import Invoices from './pages/Invoices';

function App() {
  return (
    <AuthProvider>
      <ItemsProvider>
        <InvoicesProvider>
          <LabelsProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<PrivateRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/items" element={<Items />} />
                    <Route path="/labels" element={<Labels />} />
                    <Route path="/invoices" element={<Invoices />} />
                  </Route>
                </Route>
              </Routes>
            </Router>
          </LabelsProvider>
        </InvoicesProvider>
      </ItemsProvider>
    </AuthProvider>
  );
}

export default App; 