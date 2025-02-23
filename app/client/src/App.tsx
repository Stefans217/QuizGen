import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './styles/App.css'

import Navbar from './components/Navbar/navbar';
import Home from './pages/Home/home';
import Landing from './pages/Landing/landing';
import RegistrationForm from './components/Registration/registration';
import LoginForm from './components/Login/login';

function App() {

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const openRegistrationModal = () => setShowRegistrationModal(true);
  const closeRegistrationModal = () => setShowRegistrationModal(false);

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  return (
    <>
      {showRegistrationModal && <RegistrationForm closeRegistrationModal={closeRegistrationModal}/>}
      {showRegistrationModal && <div className="backdrop" onClick={closeRegistrationModal}></div>}

      {showLoginModal && <LoginForm closeLoginModal={closeLoginModal}/>}
      {showLoginModal && <div className='backdrop' onClick={closeLoginModal}></div>}

      <Router>
        <div>
          <Navbar openRegistrationModal={openRegistrationModal} openLoginModal={openLoginModal}/>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/landing" element={<Landing />}/>
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
