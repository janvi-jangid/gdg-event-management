import "./UpcomingEvent.css";

function UpcomingEvent({
  event,
  registrationStatus,
  registered,
  registering,
  onRegister,
  onCancelRegistration,
}) {
  const eventDate = event?.dateTime ? new Date(event.dateTime) : null;

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
        <h2>{event ? event.title : <>New<br />Event</>}</h2>

        <div className="new-event-divider" />

        <div className="new-event-date">
          <span>DATE &amp; TIME</span>
          <strong>
            {eventDate
              ? eventDate.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Oct 10, 2026"}
          </strong>
          <strong>
            {eventDate
              ? eventDate.toLocaleTimeString("en-IN", {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "11:59 PM"}
          </strong>
        </div>

        {registrationStatus?.message && (
          <p className="featured-registration-message" role="status">
            {registrationStatus.message}
          </p>
        )}
        {!event && (
          <p className="featured-registration-message" role="status">
            No matching event is available from the backend.
          </p>
        )}
        <button
          className="new-event-register"
          disabled={!event || registering || (!registered && registrationStatus?.closed)}
          onClick={() => registered
            ? onCancelRegistration(event.id)
            : onRegister(event.id)}
        >
          {registering
            ? "Please wait..."
            : registered
              ? "Cancel registration"
              : registrationStatus?.closed
                ? "Registration Closed"
                : event
                  ? "Register Now"
                  : "Registration unavailable"}
        </button>
      </article>
    </section>
  );
}

export default UpcomingEvent;

