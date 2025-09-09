// Header component: Displays the application name and tagline
// Demonstrates a simple functional component returning JSX

export default function Header() {
  return (
    <header className="site-header">
      {/* h1 defines the primary title of the page */}
      <h1 className="brand-title">Price Predictor for Nigerian Marketers</h1>
      {/* p is used for the descriptive tagline under the title */}
      <p className="brand-tagline">Forecast commodity prices to plan ahead. Powered by AI and Sui blockchain</p>
    </header>
  );
}
