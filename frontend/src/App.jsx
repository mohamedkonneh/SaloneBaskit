import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryLayout from '../layouts/CategoryLayout'; // Import the new layout
import Header from './components/Header'; // 1. Import Header
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import CategoriesPage from './pages/CategoriesPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage.jsx'; // Import the correct ProfilePage
import BottomNav from './components/BottomNav'; // 2. Import BottomNav
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductListPage from './pages/AdminProductListPage';
import AdminUserListPage from './pages/AdminUserListPage';
import AdminOrderListPage from './pages/AdminOrderListPage';
import AdminSuppliersPage from './pages/AdminSuppliersPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage.jsx';
import CategoryProductPage from './pages/CategoryProductPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import FAQPage from './pages/FAQPage.jsx';
import ReturnPolicyPage from './pages/ReturnPolicyPage.jsx';
import MyOrderDetailsPage from './pages/MyOrderDetailsPage.jsx';
import AdminContentPage from './pages/AdminContentPage.jsx';
import AdminContactMessagesPage from './pages/AdminContactMessagesPage.jsx';
import SupplierPage from './pages/SupplierPage.jsx';
import SuppliersListPage from './pages/SuppliersListPage.jsx';
import MailboxPage from './pages/MailboxPage.jsx';  
 import NotFoundPage from './pages/NotFoundPage'; // 1. Import the new component

function App() {
  const location = useLocation();
  // Hide Header and BottomNav on admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div style={styles.pageContainer}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <main style={styles.mainContent(isAdminRoute)}>
        <Routes>
          <Route path="/" element={<><Header /><HomePage /></>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/categories" element={<CategoryProductPage />} />
          <Route path="/categories/:categoryName" element={<CategoryProductPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          
          {/* Static & Info Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/return-policy" element={<ReturnPolicyPage />} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/mailbox" element={<ProtectedRoute><MailboxPage /></ProtectedRoute>} />

          {/* Protected Routes */}
          <Route path="/suppliers" element={<ProtectedRoute><SuppliersListPage /></ProtectedRoute>} />
          <Route path="/suppliers/:supplierId" element={<ProtectedRoute><SupplierPage /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} /> 
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
          <Route path="/my-orders/:orderId" element={<ProtectedRoute><MyOrderDetailsPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />


          {/* Admin Routes with Nested Layout */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductListPage />} />
            <Route path="users" element={<AdminUserListPage />} />
            <Route path="orders" element={<AdminOrderListPage />} />
            <Route path="suppliers" element={<AdminSuppliersPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="messages" element={<AdminContactMessagesPage />} />
        
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <BottomNav />} {/* 4. Add BottomNav */}
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  mainContent: (isAdmin) => ({
    flex: 1, // Make the main content area fill the available space
    // Add padding to the bottom to prevent content from being hidden by the BottomNav
    // No padding needed if the nav is hidden on admin routes
    paddingBottom: isAdmin ? '0' : '70px', 
  }),
};

export default App;