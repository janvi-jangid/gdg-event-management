import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import EventList from "./components/EventList";
import PastEvents from "./components/PastEvents";
import UpcomingEvent from "./components/UpcomingEvent";
import "./App.css";

function App() {
  const events = [
    {
      id: 1,
      title: "Web Development Workshop",
      category: "Technology",
      dateTime: "2026-10-15T10:00",
      location: "College Auditorium",
      capacity: 100,
      description: "Learn the basics of modern web development.",
      image: "/Card1.jpg",
    },
    {
      id: 2,
      title: "Coding Competition",
      category: "Competition",
      dateTime: "2026-10-18T14:00",
      location: "Computer Lab",
      capacity: 50,
      description: "Test your programming and problem-solving skills.",
      image: "/Card2.avif",
    },
    {
      id: 3,
      title: "Career Guidance Session",
      category: "Career",
      dateTime: "2026-10-20T11:00",
      location: "Seminar Hall",
      capacity: 80,
      description: "Get guidance on internships and technical careers.",
      image: "/Card3.avif",
    },
  ];

  function handleRegister(eventId) {
    alert(
      `Event ID: ${eventId}\nLogin is required to register. API integration comes next.`
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PastEvents />
        <UpcomingEvent />
        <EventList events={events} onRegister={handleRegister} />
      </main>

      <footer id="about" className="footer">
        
      </footer>
    </>
  );
}

export default App;
