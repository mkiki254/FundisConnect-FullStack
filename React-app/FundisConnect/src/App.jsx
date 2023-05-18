import Home from './Components/Home'
import About from './Components/About'
import Artisan from './Components/Artisan'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Signup from './Components/Signup'
import ArtisanHome from './Components/Pages/ArtisanHome'
import CustomerHome from './Components/Pages/CustomerHome'
import AdminHome from './Components/Pages/AdminHome'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './Styles/App.css'
import { AuthProvider } from './Components/AuthContext'
import Protected from './Components/Protected'


export default function App() {
  return (
    <>
      <div className="base">
        <Router>
          <AuthProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<Protected component={About} />} />
              <Route path="/artisan-home" element={<Protected component={ArtisanHome} />} />
              <Route path="/artisan" element={<Artisan />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/customer-home" element={<Protected component={CustomerHome} />} />
              <Route path="/admin-home" element={<Protected component={AdminHome} />} />
            </Routes>
            <Footer />
          </AuthProvider>
        </Router>
      </div>
    </>
  )
}


