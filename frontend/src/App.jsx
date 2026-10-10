import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import EventList from "./components/EventList";
import PastEvents from "./components/PastEvents";
import UpcomingEvent from "./components/UpcomingEvent";
import {
  cancelEventRegistration,
  getMyRegistrations,
  registerForEvent,
} from "./services/auth";

import "./App.css";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080")
  .replace(/\/+$/, "");
const API_URL = `${API_BASE_URL}/api/events`;

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
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const [registrationStatuses, setRegistrationStatuses] = useState({});
  const [registeringEventIds, setRegisteringEventIds] = useState(new Set());

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

        const recruitmentMatches = data.filter(
          (event) => event.title?.trim().toLowerCase() === "recruitment"
        );
        const recruitmentEvent = recruitmentMatches.length === 1
          ? recruitmentMatches[0]
          : null;
        setFeaturedEvent(recruitmentEvent);
        const eventsToCheck = recruitmentEvent
          && !eventsWithImages.some((event) => event.id === recruitmentEvent.id)
          ? [...eventsWithImages, recruitmentEvent]
          : eventsWithImages;

        const availability = await Promise.all(eventsToCheck.map(async (event) => {
          try {
            const statusResponse = await fetch(
              `${API_BASE_URL}/api/events/${event.id}/availability`
            );
            if (!statusResponse.ok) return [event.id, null];
            return [event.id, await statusResponse.json()];
          } catch {
            return [event.id, null];
          }
        }));
        setRegistrationStatuses((current) => ({
          ...current,
          ...Object.fromEntries(availability.map(([id, status]) => [
            id,
            { ...current[id], closed: status?.closed ?? false },
          ])),
        }));
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Could not load events. Please check the backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  async function refreshEventAvailability(eventId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/events/${eventId}/availability`
      );
      if (!response.ok) return;
      const availability = await response.json();
      setRegistrationStatuses((current) => ({
        ...current,
        [eventId]: { ...current[eventId], closed: availability.closed },
      }));
    } catch {
      // Registration requests still return the authoritative availability error.
    }
  }

  useEffect(() => {
    async function syncMyRegistrations() {
      if (!localStorage.getItem("token")) {
        setRegisteredEventIds(new Set());
        return;
      }

      try {
        const registrations = await getMyRegistrations();
        setRegisteredEventIds(new Set(registrations.map((item) => item.eventId)));
      } catch {
        setRegisteredEventIds(new Set());
      }
    }

    window.addEventListener("authchange", syncMyRegistrations);
    syncMyRegistrations();
    return () => window.removeEventListener("authchange", syncMyRegistrations);
  }, []);

  async function handleRegister(eventId) {
    if (!localStorage.getItem("token")) {
      setRegistrationStatuses((current) => ({
        ...current,
        [eventId]: { ...current[eventId], message: "Log in to register for this event." },
      }));
      window.dispatchEvent(new Event("open-auth"));
      return;
    }

    setRegisteringEventIds((current) => new Set(current).add(eventId));
    setRegistrationStatuses((current) => ({
      ...current,
      [eventId]: { ...current[eventId], message: "" },
    }));

    try {
      await registerForEvent(eventId);
      setRegisteredEventIds((current) => new Set(current).add(eventId));
      setRegistrationStatuses((current) => ({
        ...current,
        [eventId]: { ...current[eventId], message: "Registration successful." },
      }));
      await refreshEventAvailability(eventId);
    } catch (registrationError) {
      setRegistrationStatuses((current) => ({
        ...current,
        [eventId]: { ...current[eventId], message: registrationError.message },
      }));
      if (/capacity|full|closed|past|cancel/i.test(registrationError.message)) {
        setRegistrationStatuses((current) => ({
          ...current,
          [eventId]: { ...current[eventId], closed: true },
        }));
      }
    } finally {
      setRegisteringEventIds((current) => {
        const next = new Set(current);
        next.delete(eventId);
        return next;
      });
    }
  }

  async function handleCancelRegistration(eventId) {
    setRegisteringEventIds((current) => new Set(current).add(eventId));
    setRegistrationStatuses((current) => ({
      ...current,
      [eventId]: { ...current[eventId], message: "" },
    }));

    try {
      await cancelEventRegistration(eventId);
      setRegisteredEventIds((current) => {
        const next = new Set(current);
        next.delete(eventId);
        return next;
      });
      setRegistrationStatuses((current) => ({
        ...current,
        [eventId]: { ...current[eventId], message: "Registration cancelled." },
      }));
      await refreshEventAvailability(eventId);
    } catch (registrationError) {
      setRegistrationStatuses((current) => ({
        ...current,
        [eventId]: { ...current[eventId], message: registrationError.message },
      }));
    } finally {
      setRegisteringEventIds((current) => {
        const next = new Set(current);
        next.delete(eventId);
        return next;
      });
    }
  }

  return (
    <>
      <Navbar />
      <Hero />

      
{loading && <p>Loading events...</p>}
{error && <p>{error}</p>}
{!loading && (
  <EventList
    events={events}
    onRegister={handleRegister}
    onCancelRegistration={handleCancelRegistration}
    registeredEventIds={registeredEventIds}
    registrationStatuses={registrationStatuses}
    registeringEventIds={registeringEventIds}
  />
)}
<PastEvents />
<UpcomingEvent
  event={featuredEvent}
  registrationStatus={featuredEvent ? registrationStatuses[featuredEvent.id] : null}
  registered={featuredEvent ? registeredEventIds.has(featuredEvent.id) : false}
  registering={featuredEvent ? registeringEventIds.has(featuredEvent.id) : false}
  onRegister={handleRegister}
  onCancelRegistration={handleCancelRegistration}
/>

    </>
  );
}

export default App;
