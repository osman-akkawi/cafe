import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Footer from './components/Footer';
import { useAuthStore } from './store/authStore';
import { useMenuStore } from './store/menuStore';
import { Link } from 'react-router-dom';

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { fetchMenu } = useMenuStore();

  useEffect(() => {
    checkAuth();
    fetchMenu();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Link
          to={isAuthenticated ? '/admin' : '/login'}
          className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-900 transition-colors z-50"
          title="Admin Portal"
        >
          <Lock className="h-5 w-5" />
        </Link>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;