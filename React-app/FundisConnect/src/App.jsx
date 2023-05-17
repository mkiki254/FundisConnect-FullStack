import Home from './Components/Home'
import About from './Components/About'
import Artisan from './Components/Artisan'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Signup from './Components/Signup'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './Styles/App.css'


export default function App(){
  return (
    <>
    <div className="base">
      <Router>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Home /> } />
          <Route path="/about" element={<About /> } />
          <Route path="/artisan" element={<Artisan />} />
          <Route path="/signup" element={<Signup />}/>
        </Routes>
        <Footer />
      </Router>
    </div>
    </>
  )
}


