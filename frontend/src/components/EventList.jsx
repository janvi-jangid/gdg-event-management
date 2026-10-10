import { useState } from "react";
import EventCard from "./EventCard";
import "./EventList.css";

function EventList({ events, onRegister }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All events");

  const categories = [
    "All events",
    ...new Set(events.map((event) => event.category)),
  ];

  const filteredEvents = events.filter((event) => {
    const text = `${event.title} ${event.description} ${event.location}`;

    const matchesSearch = text
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All events" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <section id="events" className="events-section">
      <div className="events-heading">
        <div>
          <p className="events-eyebrow">EXPLORE OUR COMMUNITY</p>
          <h2>Upcoming Events</h2>
          <p className="events-intro">
            Find your next opportunity to learn, create, and connect.
          </p>
        </div>
      </div>

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

      <div className="event-grid">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRegister={onRegister}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="no-events">
          <h3>No events found</h3>
          <p>Try a different search or category.</p>
        </div>
      )}
    </section>
  );
}

export default EventList;
