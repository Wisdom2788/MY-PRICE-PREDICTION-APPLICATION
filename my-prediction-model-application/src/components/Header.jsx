// Header component: Displays the application name, tagline, optional user greeting and sign-out
// Props:
// - user: optional object with { firstName } used to personalize the greeting
// - onSignOut: optional function called when the user clicks sign-out

export default function Header({ user, onSignOut }) {
  return (
    <header className="site-header">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          {/* h1 defines the primary title of the page */}
          <h1 className="brand-title">Price Predictor for Nigerian Marketers</h1>
          {/* p is used for the descriptive tagline under the title */}
          <p className="brand-tagline">Forecast commodity prices to plan ahead. Powered by AI and Sui blockchain</p>
        </div>

        {/* If a user is signed in, show a welcome message and sign-out button */}
        {user && (
          <div className="header-actions">
            <span className="welcome-text">Welcome back {user.firstName}</span>
            <button className="tab-button" onClick={() => onSignOut?.()}>Sign Out</button>
          </div>
        )}
      </div>
    </header>
  );
}
