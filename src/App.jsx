import React from 'react';
import Hero from './components/Hero';
import SystemDescription from './components/SystemDescription';
import MainFeatures from './components/MainFeatures';
import ContactSection from './components/ContactSection';

const App = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <SystemDescription />
      <MainFeatures />
      <ContactSection />
    </div>
  );
};

export default App;