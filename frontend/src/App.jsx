import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import EventList from "./components/EventList";
import PastEvents from "./components/PastEvents";
import UpcomingEvent from "./components/UpcomingEvent";

import "./App.css";

const API_URL = "http://localhost:8080/api/events";

const originalCards = [
  {
    id: 3,
    title: "Web Development Workshop",
    description: "Learn the fundamentals of REST APIs and build backend applications using Spring Boot",
    location: "Digital Tower",
    image: "/Card1.jpg",
  },
  {
    id: 4,
    title: "Coding Competition",
    description: "Test your problem-solving skills, develop creative solutions, and learn to integrate React frontends with Spring Boot REST APIs",
    location: "Computer Lab",
    image: "/Card2.avif",
  },
  {
    id: 5,
    title: "Career Guidance Session",
    description: "Explore career opportunities in technology, gain placement preparation insights, and learn how to build a strong professional profile.",
    location: "RBU Auditorium",
    image: "/Card3.avif",
  },
];

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Unable to fetch events");
        }

        const data = await response.json();

        const eventsWithImages = originalCards
          .map((card) => {
            const databaseEvent = data.find(
              (event) => event.id === card.id
            );

            return databaseEvent
              ? { ...databaseEvent, ...card }
              : null;
          })
          .filter(Boolean);

        setEvents(eventsWithImages);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Could not load events. Please check the backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  function handleRegister(eventId) {
    alert(`Registration for event ${eventId} will be connected later.`);
  }

  return (
    <>
      <Navbar />
      <Hero />

      
{loading && <p>Loading events...</p>}
{error && <p>{error}</p>}
{!loading && !error && (
  <EventList events={events} onRegister={handleRegister} />
)}
<PastEvents />
<UpcomingEvent />

    </>
  );
}

export default App;