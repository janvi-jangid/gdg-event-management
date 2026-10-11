import "./UpcomingEvent.css";

function RecruitmentSection() {
  return (
    <section className="recruitment-section" id="recruitment">
      <h1 className="recruitment-section-title">Upcoming Event</h1>

      <div className="upcoming-layout">
        <article className="featured-event">
          <div className="featured-event-image">
            <span className="featured-status">UPCOMING</span>

            <div className="featured-event-content">
              <h2>Recruitment</h2>
              <p>
                GDG is now recruiting across multiple domains: Web Development,
                Competitive Programming, Design, Machine Learning, AI & Cloud,
                Management, Marketing, and Socials. Choose the domain that
                interests you and be a part of the team, learn new skills, and
                work on real-world projects.
              </p>
            </div>

            <button
              type="button"
              className="featured-arrow"
              aria-label="Explore events"
              onClick={() =>
                document.getElementById("events")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              ↗
            </button>
          </div>
        </article>

        <aside className="new-event-panel">
          <h2>New<br />Event</h2>
          <div className="new-event-divider" />

          <div className="new-event-date">
            <span>DATE &amp; TIME</span>
            <strong>Oct 10, 2026</strong>
            <strong>11:59 PM</strong>
          </div>

          <button
            type="button"
            className="new-event-register"
            onClick={() =>
              document.getElementById("events")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Register Now
          </button>
        </aside>
      </div>
    </section>
  );
}

export default RecruitmentSection;
