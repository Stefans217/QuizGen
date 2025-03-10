import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './styles/app.css'

import Navbar from './components/Navbar/navbar';
import Interface from './pages/Interface/interface';
import Content from './pages/Content/content';
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
            <Route path="/" element={<Interface />} />
            <Route path="/content" element={<Content />}/>
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
