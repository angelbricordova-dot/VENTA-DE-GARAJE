import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import DeliveryPage from './pages/DeliveryPage'
import Admin from './pages/Admin'

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Admin — no layout */}
      <Route path="/admin" element={<Admin />} />

      {/* Public — with layout */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/catalogo" element={<Layout><Catalog /></Layout>} />
      <Route path="/producto/:id" element={<Layout><ProductDetail /></Layout>} />
      <Route path="/envios" element={<Layout><DeliveryPage /></Layout>} />

      {/* 404 */}
      <Route path="*" element={
        <Layout>
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔦</div>
            <h1 className="text-2xl font-bold text-gray-800">Página no encontrada</h1>
            <a href="/" className="btn-primary mt-6 inline-flex">Ir al inicio</a>
          </div>
        </Layout>
      } />
    </Routes>
  )
}
