import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <a href="/" className="navbar-brand">
        <span className="brand-mark">
          <span className="brand-blue">G</span>
          <span className="brand-red">D</span>
          <span className="brand-yellow">G</span>
        </span>
        <span>RBU</span>
      </a>

      <nav className="navbar-links">
        <a href="#home" className="nav-home">Home</a>
        <a href="#team" className="nav-team">Team</a>
        <a href="#events" className="nav-events">Events</a>
        <a href="#gallery" className="nav-gallery">Gallery</a>
        <a href="#portfolio" className="nav-portfolio">Portfolio</a>
        <a href="#more" className="nav-more">More</a>
      </nav>

      <a href="#join" className="join-button">
        JOIN US <span>↗</span>
      </a>
    </header>
  );
}

export default Navbar;

