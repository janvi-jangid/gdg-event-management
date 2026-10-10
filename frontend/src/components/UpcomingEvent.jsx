import "./UpcomingEvent.css";

function UpcomingEvent() {
  return (
    <section className="upcoming-layout">
      <article className="featured-event">
        <div className="featured-event-image">
          <span className="featured-status">UPCOMING</span>

          <div className="featured-event-content">
            <h2>Recruitment</h2>
            <p>
              GDG is now recruiting across multiple domains: Web Development,
              Competitive Programming, Design, Machine Learning, AI & Cloud,
              Management, Marketing, and Socials. Choose the domain that
              interests you and be a part of the team, learn new skills,
              and work on real-world projects.
            </p>
          </div>

          <button
            className="featured-arrow"
            aria-label="View upcoming event"
            onClick={() => alert("Event details will be connected next.")}
          >
            ↗
          </button>
        </div>
      </article>

      <article className="new-event-panel">
        <h2>New<br />Event</h2>

        <div className="new-event-divider" />

        <div className="new-event-date">
          <span>DATE &amp; TIME</span>
          <strong>Oct 10, 2026</strong>
          <strong>11:59 PM</strong>
        </div>

        <button
          className="new-event-register"
          onClick={() => alert("Registration will be connected soon!")}
        >
          Register Now
        </button>
      </article>
    </section>
  );
}

export default UpcomingEvent;

