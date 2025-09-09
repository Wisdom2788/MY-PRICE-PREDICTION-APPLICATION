// App: Main application shell that composes all core UI pieces
// Uses React hooks to manage simple application state (auth + commodity selection)

import { useState } from 'react';
import './App.css';
import Header from './components/Header.jsx';
import AuthForms from './components/AuthForms.jsx';
import CommoditySelector from './components/CommoditySelector.jsx';
import PriceChart from './components/PriceChart.jsx';
import PriceSubmitForm from './components/PriceSubmitForm.jsx';

export default function App() {
  // Store the current authenticated user object (null when not signed in)
  const [user, setUser] = useState(null);
  // Currently selected commodity for charting
  const [commodity, setCommodity] = useState('Rice');

  function handleSignOut() {
    // Clear user state on sign-out
    setUser(null);
  }

  return (
    <div className="app-shell">
      {/* Header with product name and tagline. Pass user and sign-out handler */}
      <Header user={user} onSignOut={handleSignOut} />

      {/* Auth section – show until the user signs in. Register is also available here. */}
      {!user && (
        <AuthForms onAuthSuccess={(u) => setUser(u || { firstName: 'User' })} />
      )}

      {/* Main content – visible after sign-in for this MVP */}
      {user && (
        <>
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Select Commodity</h2>
              <p className="panel-subtitle">Choose a commodity to view its price forecast</p>
            </div>
            <CommoditySelector value={commodity} onChange={setCommodity} />
          </section>

          <PriceChart commodity={commodity} />

          <PriceSubmitForm />
        </>
      )}

      {/* Footer note about API placeholders to guide integrators */}
      <footer className="site-footer">
        <p className="footer-note">Note: This MVP uses placeholder API endpoints. Configure your backend URLs in src/config.js.</p>
      </footer>
    </div>
  );
}
