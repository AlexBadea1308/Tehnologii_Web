import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';
import EditProfilePage from './pages/EditProfile';
import ForgotPasswordPage from './pages/ForgotPassword';
import AboutPage from './pages/AboutPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import TicketPage from './pages/TicketPage';
import FixturesPage from './pages/FixturesPage';
import ContactPage from './pages/ContactPage';
import OrdersHistoryPage from './pages/OrderHistory';
import ManagerHomePage from './pages/ManagerHomePage';
import AdminHomePage from './pages/AdminHomePage';
import PlayerHomePage from './pages/PlayerHomePage';
import ManagerPlayerStats from './pages/ManagerPlayerStats';
import ProtectedRoute from './components_custom/ProtectedRoute';
import ManagerPrepareSquad  from './pages/ManagerPrepareSquad';
import ManagerTrainingPlan from './pages/ManagerTrainingPlan';
import ManagerContract from './pages/ManagerContractPage';
import PlayerViewContract from './pages/PlayerViewContract';
import PlayerViewTrainingPlan from './pages/PlayerViewTrainingPlan';
import PlayerFixturesView from './pages/PlayerFixturesView';
import AdminTicketsPage from './pages/AdminTicketPage';
import AdminProductsPage from './pages/AdminProductPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminMatchesPage from './pages/AdminMatchesPage';
import AdminPlayerStatsPage from './pages/AdminPlayerStats';
import AdminStatsPage from './pages/AdminStatisticsPage';
import AdminOrdersPage from './pages/AdminOrderPage';


function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/tickets" element={<TicketPage />} />
        <Route path="/fixture" element={<FixturesPage />} />
        <Route path="/contact" element={<ContactPage />} />
       
        
        {/* Rute protejate */}

        <Route
          path="/"
          element={<ProtectedRoute element={<HomePage />} allowedRoles={['fan']} allowUnauthenticated={true} />}
        />

        <Route
          path="/account"
          element={<ProtectedRoute element={<AccountPage />} allowedRoles={['fan', 'player', 'manager', 'admin']} />}
        />
        <Route
          path="/edit-profile"
          element={<ProtectedRoute element={<EditProfilePage />} allowedRoles={['fan', 'player', 'manager', 'admin']} />}
        />

        <Route
          path="/forgot-password"
          element={<ProtectedRoute element={<ForgotPasswordPage />} allowedRoles={['fan', 'player', 'manager', 'admin']} />}
        />

        <Route
          path="/orders-history"
          element={<ProtectedRoute element={<OrdersHistoryPage />} allowedRoles={['fan']} />}
        />
        <Route
          path="/payment"
          element={<ProtectedRoute element={<PaymentPage />} allowedRoles={['fan']} />}
        />
        <Route
          path="/player-home"
          element={<ProtectedRoute element={<PlayerHomePage />} allowedRoles={['player']} />}
        />
        <Route
          path="/view-contract"
          element={<ProtectedRoute element={<PlayerViewContract />} allowedRoles={['player']} />}
        />

        <Route
          path="/schedule"
          element={<ProtectedRoute element={<PlayerViewTrainingPlan />} allowedRoles={['player']} />}
        />

        <Route
          path="/position-fixxtures"
          element={<ProtectedRoute element={<PlayerFixturesView />} allowedRoles={['player']} />}
        />
        <Route
          path="/manager-home"
          element={<ProtectedRoute element={<ManagerHomePage />} allowedRoles={['manager']} />}
        />

        <Route
          path="/player-stats"
          element={<ProtectedRoute element={<ManagerPlayerStats />} allowedRoles={['manager']} />}
        />

        <Route
          path="/prepare-squads"
          element={<ProtectedRoute element={<ManagerPrepareSquad />} allowedRoles={['manager']} />}
        />

        <Route
          path="/training-plans"
          element={<ProtectedRoute element={<ManagerTrainingPlan />} allowedRoles={['manager']} />}
        />

        <Route 
        path="/contracts" 
        element={<ManagerContract />}allowedRoles={['manager']} 
        />

        <Route
          path="/admin-home"
          element={<ProtectedRoute element={<AdminHomePage />} allowedRoles={['admin']} />}
        />

        <Route
          path="/admin/tickets"
          element={<ProtectedRoute element={<AdminTicketsPage />} allowedRoles={['admin']} />}
        />

        <Route
          path="/admin/products"
          element={<ProtectedRoute element={<AdminProductsPage />} allowedRoles={['admin']} />}
        />

        <Route
          path="/admin/users"
          element={<ProtectedRoute element={<AdminUsersPage/>} allowedRoles={['admin']} />}
        />

        <Route
          path="/admin/matches"
          element={<ProtectedRoute element={<AdminMatchesPage/>} allowedRoles={['admin']} />}
        />

        <Route
          path="/admin/players-stats"
          element={<ProtectedRoute element={<AdminPlayerStatsPage/>} allowedRoles={['admin']} />}
        />

        <Route
          path="/admin/order-statistics"
          element={<ProtectedRoute element={<AdminStatsPage/>} allowedRoles={['admin']} />}
        />
        
        <Route
          path="/admin/manage-orders"
          element={<ProtectedRoute element={<AdminOrdersPage/>} allowedRoles={['admin']} />}
        />
        
      </Routes>

      
    </>
  );
}

export default App;