import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './styles/index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Medicines from './pages/Medicines';
import MedicineDetail from './pages/MedicineDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Resgiter from './pages/Resgiter';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import UploadPrescription from './pages/UploadPrescription';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageInventory from './pages/admin/ManageInventory';
import VerifyPrescriptions from './pages/admin/VerifyPrescriptions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/Terms&Conditions';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (page, param) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'medicines':
        navigate('/medicines');
        break;
      case 'detail':
        navigate(`/detail/${param}`);
        break;
      case 'cart':
        navigate('/cart');
        break;
      case 'login':
        navigate('/login');
        break;
      case 'register':
        navigate('/register');
        break;
      case 'checkout':
        navigate('/checkout');
        break;
      case 'track-order':
        navigate('/track-order');
        break;
      case 'upload-prescription':
        navigate('/upload-prescription');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'admin-inventory':
        navigate('/admin/inventory');
        break;
      case 'admin-prescriptions':
        navigate('/admin/prescriptions');
        break;
      case 'privacy-policy':
        navigate('/privacy-policy');
        break;
      case 'terms-conditions':
        navigate('/terms-conditions');
        break;
      default:
        navigate('/');
    }
  };

  const isHome = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');
  const hideHeaderFooter = isAuthPage || isAdminPage;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between relative">
      <div>
        {/* Dynamic header styling based on active page route */}
        {!hideHeaderFooter && (
          isHome ? (
            <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 bg-transparent">
              <div className="max-w-[93%] mx-auto">
                <Navbar onNavigate={handleNavigate} />
              </div>
            </header>
          ) : (
            <header className="sticky top-0 z-50 w-full bg-[#004d38] p-4 md:p-6 shadow-md">
              <div className="max-w-7xl mx-auto">
                <Navbar onNavigate={handleNavigate} />
              </div>
            </header>
          )
        )}

        {/* Main Content Area */}
        <main className={`w-full ${!isHome && !hideHeaderFooter ? 'pt-6' : ''}`}>
          <Routes>
            <Route path="/" element={<Home onNavigate={handleNavigate} />} />
            <Route path="/medicines" element={<Medicines onNavigate={handleNavigate} />} />
            <Route path="/detail/:id" element={<MedicineDetail onNavigate={handleNavigate} />} />
            <Route path="/cart" element={<Cart onNavigate={handleNavigate} />} />
            <Route path="/login" element={<Login onNavigate={handleNavigate} />} />
            <Route path="/register" element={<Resgiter onNavigate={handleNavigate} />} />
            <Route path="/checkout" element={<Checkout onNavigate={handleNavigate} />} />
            <Route path="/track-order" element={<OrderTracking onNavigate={handleNavigate} />} />
            <Route path="/upload-prescription" element={<UploadPrescription onNavigate={handleNavigate} />} />
            <Route path="/admin" element={<AdminDashboard onNavigate={handleNavigate} />} />
            <Route path="/admin/inventory" element={<ManageInventory onNavigate={handleNavigate} />} />
            <Route path="/admin/prescriptions" element={<VerifyPrescriptions onNavigate={handleNavigate} />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy onNavigate={handleNavigate} />} />
            <Route path="/terms-conditions" element={<TermsConditions onNavigate={handleNavigate} />} />
            <Route path="*" element={<Home onNavigate={handleNavigate} />} />
          </Routes>
        </main>
      </div>

      {/* Premium Coordinated Footer */}
      {!hideHeaderFooter && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
}
