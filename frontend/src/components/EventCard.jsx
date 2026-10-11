import "./EventCard.css";


function EventCard({
  event,
  onRegister,
  onCancelRegistration,
  registrationStatus,
  registering,
  previewMode = false,
}) {
  const includesTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(event.dateTime || "");
  const eventDate = event.dateTime
    ? new Date(includesTimezone ? event.dateTime : `${event.dateTime}+05:30`)
    : null;
  const dateIsValid = eventDate && !Number.isNaN(eventDate.getTime());

  return (
    <article className="event-card">
      <div className="event-card-banner">
        <div className="event-card-placeholder" aria-hidden="true">
          <span className="event-card-placeholder-mark">
            {event.category?.slice(0, 1).toUpperCase() || "✦"}
          </span>
          <span className="event-card-placeholder-label">
            {event.category || "GDG RBU EVENT"}
          </span>
        </div>
        <img
  src={event.image || "/Card1.jpg"}
  alt={event.title || "Event"}
  className="event-card-image"
  onError={(e) => {
    e.currentTarget.style.display = "none";
  }}
/>
        <span className="event-card-status">UPCOMING</span>
      </div>

      <div className="event-card-content">
        <p className="event-card-date">
          {dateIsValid
            ? `${eventDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                timeZone: "Asia/Kolkata",
              })} · ${eventDate.toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit",
                timeZone: "Asia/Kolkata",
              })}`
            : "Date to be announced"}
        </p>

        <h3>{event.title || "Untitled event"}</h3>

        <p className="event-description">
          {event.description || "More event details will be shared soon."}
        </p>

        <div className="event-details">
          {event.location && <span>📍 {event.location}</span>}
          {event.capacity != null && <span>Capacity · {event.capacity}</span>}
        </div>

        {registrationStatus?.registered && (
          <p className="event-registration-status" role="status">
            Registered
          </p>
        )}
        {registrationStatus?.message && (
          <p
            className={`event-registration-message ${
              /successful|cancelled/i.test(registrationStatus.message) ? "success" : ""
            }`}
            role="alert"
          >
            {registrationStatus.message}
          </p>
        )}
        <button
  className="event-register-button"
  disabled={
    previewMode ||
    registering ||
    (!registrationStatus?.registered && registrationStatus?.closed)
  }
  onClick={() =>
    registrationStatus?.registered
      ? onCancelRegistration?.(event.id)
      : onRegister?.(event.id)
  }
>
  {previewMode
    ? "Registration unavailable"
    : registering
      ? "Please wait..."
      : registrationStatus?.registered
        ? "Cancel registration"
        : registrationStatus?.closed
          ? "Registration Closed"
          : "Register Now"}

  <span>→</span>
</button>
      </div>
    </article>
  );
}

export default EventCard;
