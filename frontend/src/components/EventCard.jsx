import "./EventCard.css";


function EventCard({
  event,
  onRegister,
  onCancelRegistration,
  registrationStatus,
  registering,
}) {
  const eventDate = new Date(event.dateTime);
const eventImages = {
  Pixtopia: "/Pixtopia.png",
  "Tech Sprint": "/TechSprint.png",
  TechSprint: "/TechSprint.png",
  "Google Cloud Study Jam": "/GoogleJam.png",
  "Explore 2.0": "/Explore.png",
};


  return (
    <article className="event-card">
<div className="event-card-banner">
  {event.image && (
  <img
    src={event.image}
    alt={event.title}
    className="event-card-image"
  />
)}
</div>

      <div className="event-card-content">
        <p className="event-card-date">
          {eventDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          {" · "}
          {eventDate.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>

        <h3>{event.title}</h3>

        <p className="event-description">{event.description}</p>

        <div className="event-details">
          <span>📍 {event.location}</span>
          <span>Capacity: {event.capacity}</span>
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
          disabled={registering || (!registrationStatus?.registered && registrationStatus?.closed)}
          onClick={() => registrationStatus?.registered
            ? onCancelRegistration(event.id)
            : onRegister(event.id)}
        >
          {registering
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
