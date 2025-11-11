import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import SystemDescription from './components/SystemDescription';
import MainFeatures from './components/MainFeatures';
import ContactSection from './components/ContactSection';
import TeamSection from './components/TeamSection';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RecuperarSenha from './pages/RecuperarSenha';
import Dashboard from './pages/Dashboard';
import TestApiConnection from './pages/TestApiConnection';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <SystemDescription />
      <MainFeatures />
      <TeamSection />
      <ContactSection />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/test-api" element={<TestApiConnection />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;