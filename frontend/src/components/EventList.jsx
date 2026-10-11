import { useState } from "react";
import EventCard from "./EventCard";
import UpcomingEvent from "./UpcomingEvent";
import "./EventList.css";
import { image } from "framer-motion/client";

const fallbackEvents = [
  {
    id: "preview-workshop",
    title: "Web Development Workshop",
    category: "Web Development",
    image: "/Card1.jpg",
    description:
      "Learn HTML, CSS, JavaScript, and modern web development through practical activities.",
    dateTime: null,
    location: "RBU Campus",
    capacity: 100,
    demo: true,
  },
  {
    id: "preview-competition",
    title: "Coding Competition",
    category: "Competitive Programming",
    image:"/Card2.avif",
    description:
      "Test your problem-solving skills and challenge yourself with coding problems.",
    dateTime: null,
    location: "RBU Campus",
    capacity: 100,
    demo: true,
  },
  {
    id: "preview-career",
    title: "Career Guidance Session",
    category: "Career Development",
    image: "/Card3.avif",
    description:
      "Explore career paths, placement preparation, and opportunities in technology.",
    dateTime: null,
    location: "RBU Campus",
    capacity: 100,
    demo: true,
  },
];

function EventList({
  events,
  featuredEvent,
  loading,
  error,
  onRetry,
  onRegister,
  onCancelRegistration,
  registeredEventIds = new Set(),
  registrationStatuses = {},
  registeringEventIds = new Set(),
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All events");

  const actualEvents = Array.isArray(events) ? events : [];
  const usingFallback = actualEvents.length === 0 && !loading;

  const availableEvents = usingFallback ? fallbackEvents : actualEvents;
  const displayedFeaturedEvent =
  featuredEvent ||
  (usingFallback
    ? {
        id: "preview-recruitment",
        title: "Recruitment",
        category: "Recruitment",
        description:
          "Join GDG RBU and become part of our developer community.",
        dateTime: null,
        location: "RBU Campus",
        capacity: 100,
        demo: true,
      }
    : null);

  const categories = [
    "All events",
    ...new Set(
      availableEvents.map((event) => event.category).filter(Boolean)
    ),
  ];

  const filteredEvents = availableEvents.filter((event) => {
    const text = `${event.title || ""} ${event.description || ""} ${
      event.location || ""
    }`;

    const matchesSearch = text.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === "All events" || event.category === category;

    return matchesSearch && matchesCategory;
  });
  

  return (
    <section id="events" className="events-section">
      <div className="events-heading">
        <div>
          <h2>Upcoming Events</h2>
          <p className="events-intro">
            Discover workshops, coding competitions, and learning opportunities.
          </p>
        </div>
      </div>

      {loading && (
        <p className="events-feedback" role="status">
          Loading upcoming events…
        </p>
      )}

      {!loading && error && (
        <div className="events-feedback events-error" role="alert">
          <p>{error}</p>
          <button type="button" className="events-retry" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}

      {!loading && (
        <>
          {usingFallback && (
            <p className="events-feedback">
              Showing sample events. Live event data is currently unavailable.
            </p>
          )}

          <div className="events-toolbar">
            <div className="events-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search events"
              />
            </div>

            <div className="category-filters" aria-label="Filter by category">
              {categories.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`category-filter ${
                    category === item ? "selected" : ""
                  }`}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="event-grid">
              {filteredEvents.map((event) => {
                const isFeatured =
                 String(event.id) === String(displayedFeaturedEvent?.id);
                const Card = isFeatured ? UpcomingEvent : EventCard;
                const isDemo = Boolean(event.demo);

                return (
                  <Card
                    key={event.id}
                    event={event}
                    onRegister={isDemo ? undefined : onRegister}
                    onCancelRegistration={
                      isDemo ? undefined : onCancelRegistration
                    }
                    registrationStatus={{
                      ...(registrationStatuses[event.id] || {}),
                      registered: registeredEventIds.has(event.id),
                    }}
                    registering={registeringEventIds.has(event.id)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="no-events">
              <h3>No matching events</h3>
              <p>Try a different search or category.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default EventList;