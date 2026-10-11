import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import EventList from "./components/EventList";
import PastEvents from "./components/PastEvents";
import RecruitmentSection from "./components/RecruitmentSection";
import {
  cancelEventRegistration,
  getMyRegistrations,
  registerForEvent,
} from "./services/auth";

import "./App.css";
import UpcomingEvent from "./components/UpcomingEvent";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8080" : "")
)
  .replace(/\/+$/, "");
const API_URL = API_BASE_URL ? `${API_BASE_URL}/api/events` : "";

const eventImagesById = {
  3: "/Card1.jpg",
  4: "/Card2.avif",
  5: "/Card3.avif",
};

const fallbackEvents = [
  {
    id: "preview-workshop",
    title: "Web Development Workshop",
    category: "Web Development",
    description:
      "Learn web development concepts and build practical skills with GDG RBU.",
    dateTime: null,
    location: "RBU Campus",
    demo: true,
  },
  {
    id: "preview-competition",
    title: "Coding Competition",
    category: "Competitive Programming",
    description:
      "Challenge yourself with coding problems and compete with fellow developers.",
    dateTime: null,
    location: "RBU Campus",
    demo: true,
  },
  {
    id: "preview-career",
    title: "Career Guidance Session",
    category: "Career Development",
    description:
      "Explore career paths, placement preparation, and opportunities in technology.",
    dateTime: null,
    location: "RBU Campus",
    demo: true,
  },
];


function getEventTime(dateTime) {
  if (typeof dateTime !== "string") return Number.NaN;

  const includesTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(dateTime);
  const parsedDate = new Date(includesTimezone ? dateTime : `${dateTime}+05:30`);
  return parsedDate.getTime();
}

function App() {
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const [registrationStatuses, setRegistrationStatuses] = useState({});
  const [registeringEventIds, setRegisteringEventIds] = useState(new Set());

  const loadEvents = useCallback(async () => {
    try {
      if (!API_URL) {
        await Promise.resolve();
        throw new Error("API_NOT_CONFIGURED");
      }

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`EVENT_REQUEST_FAILED_${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("INVALID_EVENT_RESPONSE");
      }

      const upcomingEvents = data
        .filter((event) => getEventTime(event.dateTime) > Date.now())
        .map((event) => ({
          ...event,
          image: event.image || eventImagesById[event.id],
          
        }))
        .sort((left, right) => getEventTime(left.dateTime) - getEventTime(right.dateTime));

      setEvents(upcomingEvents);
      const recruitmentMatches = upcomingEvents.filter(
        (event) => event.title?.trim().toLowerCase() === "recruitment"
      );
      const recruitmentEvent = recruitmentMatches.length === 1
        ? recruitmentMatches[0]
        : null;
      setFeaturedEvent(recruitmentEvent);

      const availability = await Promise.all(upcomingEvents.map(async (event) => {
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

  // Keep the three event cards visible if the backend is unavailable.
  setEvents(fallbackEvents);
  setFeaturedEvent(null);
  setError("");
} finally {
  setLoading(false);
}
  }, []);

  const retryEvents = useCallback(() => {
    setLoading(true);
    setError("");
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    // The network request updates state only after it settles.
    // oxlint-disable-next-line react/set-state-in-effect
    loadEvents();
  }, [loadEvents]);

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
      if (registrationError.status === 401) {
        window.dispatchEvent(new Event("open-auth"));
      }
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

  <EventList
    events={events}
    featuredEvent={featuredEvent}
    loading={loading}
    error={error}
    onRetry={retryEvents}
    onRegister={handleRegister}
    onCancelRegistration={handleCancelRegistration}
    registeredEventIds={registeredEventIds}
    registrationStatuses={registrationStatuses}
    registeringEventIds={registeringEventIds}
  />

  <PastEvents />
  <RecruitmentSection
    event={featuredEvent}
    loading={loading}
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
