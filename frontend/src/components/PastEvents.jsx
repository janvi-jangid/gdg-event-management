import "./PastEvents.css";

const pastEvents = [
  {
    id: 1,
    title: "Pixtopia",

    description: "PIXTOPIA is a pixar-themed tech adventure organized by the Google Developer Groups.",
    image: "/Pixtopia.png",
  },
  {
    id: 2,
    title: "Tech Sprint",

    description: "TechSprint is a Hybrid (Online + Offline) 7 days hackathon organized by Google Developers Group.",
    image: "/TechSprint.png",
  },
  {
    id: 3,
    title: "Google Cloud Study Jam",

    description: "Google Cloud Study Jam with GDG successfully concluded, offering participants hands-on practice.",
    image: "/GoogleJam.png",
  },
  {
    id: 4,
    title: "Explore 2.0",

    description: "Explore 2.0 was a fun and engaging event that brought together curious minds to dive. ",
    image: "/Explore.png",
  },
];

function PastEvents() {
  return (
    <section className="past-events-section" id="past-events">
      <div className="past-events-heading">
        <div>
          <p className="past-events-eyebrow">OUR COMMUNITY ARCHIVE</p>
          <h2>Past Events</h2>
        </div>
      </div>

      <div className="past-events-grid">
        {pastEvents.map((event) => (
          <article className="past-event-card" key={event.id}>
            <div className="past-event-image-wrap">
              <img
                src={event.image}
                alt={event.title}
                className="past-event-image"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <span className="past-event-status">COMPLETED</span>

              <span className="past-event-category">
                {event.category}
              </span>
            </div>

            <div className="past-event-content">
              <p className="past-event-date">{event.date}</p>
              <h3>{event.title}</h3>
              <p className="past-event-description">
                {event.description}
              </p>

              <button
                className="past-event-arrow"
                aria-label={`View ${event.title}`}
                onClick={() =>
                  alert(`${event.title} details will be added next.`)
                }
              >
                ↗
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PastEvents;

