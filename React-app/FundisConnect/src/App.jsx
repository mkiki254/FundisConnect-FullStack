import Home from './Components/Home'
import About from './Components/About'
import Artisan from './Components/Artisan'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Signup from './Components/Signup'
import ArtisanHome from './Components/Pages/ArtisanHome'
import CustomerHome from './Components/Pages/CustomerHome'
import AdminHome from './Components/Pages/AdminHome'
import ViewProfile from './Components/Pages/Customers/JobRequests/ViewProfile'
import MakeRequest from './Components/Pages/Customers/JobRequests/MakeRequest'
import JobRequestDetails from './Components/Pages/Artisans/JobRequests/JobRequestDetails'
import AcceptedJobDetails from './Components/Pages/Artisans/AcceptedJobs/AcceptedJobDetails'
import PasswordResetRequest from './Components/PasswordResetRequest'
import PasswordResetConfirm from './Components/PasswordResetConfirm'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './Styles/App.css'
import './Styles/ArtisanHome.css'
import './Styles/Map.css'
import './Styles/UpdateProfile.css'
import './Styles/JobRequests.css'
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
              <Route path="/about" element={<About /> } />
              <Route path="/artisan" element={<Artisan />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/password-reset-request" element={<PasswordResetRequest />} />
              <Route path="/password-reset-confirm" element={<PasswordResetConfirm />} />
              <Route path="/artisan-home" element={<Protected component={ArtisanHome} />} />
              <Route path="/artisan-home/job-detail" element={<Protected component={JobRequestDetails} />} />
              <Route path="/artisan-home/accepted-job" element={<Protected component={AcceptedJobDetails} />} />
              <Route path="/customer-home" element={<Protected component={CustomerHome} />} />
              <Route path="/customer-home/view-profile" element={<Protected component={ViewProfile} />} />
              <Route path="/customer-home/select-artisan" element={<Protected component={MakeRequest} />} />
              <Route path="/admin-home" element={<Protected component={AdminHome} />} />
            </Routes>
            <Footer />
          </AuthProvider>
        </Router>
      </div>
    </>
  )
}


