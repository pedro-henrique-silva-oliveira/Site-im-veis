import { Helmet } from 'react-helmet-async';
import { useApp } from '../context/AppContext';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';

export default function AdminPage() {
  const { isAdminAuthenticated } = useApp();

  return (
    <>
      <Helmet>
        <title>Painel do Corretor - Pedro H. Corretor</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!isAdminAuthenticated ? <AdminLogin /> : <AdminDashboard />}
      </div>
    </>
  );
}
