import { useEffect, useState } from "react";
import "./UpcomingEvent.css";

const domains = [
  "Web Development",
  "Competitive Programming",
  "Design",
  "Machine Learning",
  "AI & Cloud",
  "Management",
  "Marketing",
  "Socials",
];

const initialForm = {
  fullName: "",
  department: "",
  section: "",
  year: "",
  domain: "",
  email: "",
};

function RecruitmentSection({
  event,
  loading,
  registrationStatus,
  registered,
  registering,
  onRegister,
  onCancelRegistration,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const registrationClosed = Boolean(registrationStatus?.closed);
  const unavailable = !loading && !event;

  function openForm() {
    setErrors({});
    setFormMessage("");
    setForm((current) => ({
      ...current,
      email: current.email || localStorage.getItem("userEmail") || "",
    }));
    setIsOpen(true);
  }

  function closeForm() {
    if (!registering) setIsOpen(false);
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setFormMessage("");
  }

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault();

    const nextErrors = {};
    for (const [field, value] of Object.entries(form)) {
      if (!value.trim()) nextErrors[field] = "This field is required.";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    setFormMessage("");
    if (Object.keys(nextErrors).length > 0) return;

    if (!localStorage.getItem("token")) {
      setFormMessage("Please sign in before registering. Your form details will remain here.");
      window.dispatchEvent(new Event("open-auth"));
      return;
    }

    if (!event || registrationClosed || registered || registering) return;

    await onRegister(event.id);
  }

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
            <strong>Oct 15, 2026</strong>
            <strong>2:00 PM</strong>
          </div>

          <button
            type="button"
            className="new-event-register"
            disabled={loading || registrationClosed || registering || registered}
            onClick={registered ? () => onCancelRegistration(event.id) : openForm}
          >
            {loading
              ? "Loading event..."
              : unavailable
                ? "Register Now"
                : registering
                  ? "Please wait..."
                  : registered
                    ? "Cancel registration"
                    : registrationClosed
                      ? "Registration Closed"
                      : "Register Now"}
          </button>
          {registrationStatus?.message && (
            <p className="featured-registration-message" role="status">
              {registrationStatus.message}
            </p>
          )}
        </aside>
      </div>

      {isOpen && (
        <div
          className="recruitment-registration-overlay"
          onClick={closeForm}
        >
          <section
            className="recruitment-registration-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recruitment-registration-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="recruitment-registration-close"
              aria-label="Close registration form"
              onClick={closeForm}
              disabled={registering}
            >
              ×
            </button>
            <h2 id="recruitment-registration-title">Recruitment Registration</h2>
            <p className="recruitment-registration-intro">
              Enter your details to register for the GDG RBU Recruitment event.
            </p>

            {registered ? (
              <p className="recruitment-registration-feedback" role="status">
                You are registered for this event.
              </p>
            ) : registrationClosed ? (
              <p className="recruitment-registration-feedback" role="alert">
                Registration is closed for this event.
              </p>
            ) : (
              <form className="recruitment-registration-form" onSubmit={handleSubmit} noValidate>
                <label>
                  Full Name
                  <input
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? "recruitment-full-name-error" : undefined}
                  />
                  {errors.fullName && <span id="recruitment-full-name-error" className="recruitment-field-error">{errors.fullName}</span>}
                </label>

                <label>
                  Department
                  <input
                    value={form.department}
                    onChange={(e) => updateField("department", e.target.value)}
                    aria-invalid={Boolean(errors.department)}
                    aria-describedby={errors.department ? "recruitment-department-error" : undefined}
                  />
                  {errors.department && <span id="recruitment-department-error" className="recruitment-field-error">{errors.department}</span>}
                </label>

                <label>
                  Section
                  <input
                    value={form.section}
                    onChange={(e) => updateField("section", e.target.value)}
                    aria-invalid={Boolean(errors.section)}
                    aria-describedby={errors.section ? "recruitment-section-error" : undefined}
                  />
                  {errors.section && <span id="recruitment-section-error" className="recruitment-field-error">{errors.section}</span>}
                </label>

                <label>
                  Year
                  <select
                    value={form.year}
                    onChange={(e) => updateField("year", e.target.value)}
                    aria-invalid={Boolean(errors.year)}
                    aria-describedby={errors.year ? "recruitment-year-error" : undefined}
                  >
                    <option value="">Select year</option>
                    {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.year && <span id="recruitment-year-error" className="recruitment-field-error">{errors.year}</span>}
                </label>

                <label>
                  Domain
                  <select
                    value={form.domain}
                    onChange={(e) => updateField("domain", e.target.value)}
                    aria-invalid={Boolean(errors.domain)}
                    aria-describedby={errors.domain ? "recruitment-domain-error" : undefined}
                  >
                    <option value="">Select domain</option>
                    {domains.map((domain) => <option key={domain} value={domain}>{domain}</option>)}
                  </select>
                  {errors.domain && <span id="recruitment-domain-error" className="recruitment-field-error">{errors.domain}</span>}
                </label>

                <label>
                  Email Address
                  <input
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "recruitment-email-error" : undefined}
                  />
                  {errors.email && <span id="recruitment-email-error" className="recruitment-field-error">{errors.email}</span>}
                </label>

                {formMessage && (
                  <p className="recruitment-registration-feedback" role="alert">
                    {formMessage}
                  </p>
                )}
                {registrationStatus?.message && (
                  <p className="recruitment-registration-feedback" role="alert">
                    {registrationStatus.message}
                  </p>
                )}

                <button
                  className="recruitment-registration-submit"
                  type="submit"
                  disabled={registering || !event}
                >
                  {registering ? "Submitting..." : "Submit Registration"}
                </button>
              </form>
            )}
          </section>
        </div>
      )}

      <style>
        {`

        .recruitment-registration-overlay {
          position: fixed;
          inset: 0;
          z-index: 950;
          display: grid;
          place-items: center;
          overflow-y: auto;
          padding: 20px;
          background: rgba(0, 0, 0, 0.68);
        }
        .recruitment-registration-modal {
          position: relative;
          width: min(100%, 620px);
          max-height: min(92vh, 860px);
          overflow-y: auto;
          padding: clamp(24px, 5vw, 42px);
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 24px;
          background: #fff;
          color: #080808;
          box-shadow:
  0 25px 60px rgba(0, 0, 0, 0.25),
  0 8px 20px rgba(0, 0, 0, 0.08);
        }
        .recruitment-registration-close {
          position: absolute;
          top: 14px;
          right: 18px;
          border: 0;
          background: transparent;
          color: inherit;
          font-size: 30px;
          line-height: 1;
          cursor: pointer;
        }
        .recruitment-registration-modal h2 {
          margin: 0 36px 8px 0;
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 900;
        }
        .recruitment-registration-intro {
          margin: 0 0 24px;
          color: #555;
          line-height: 1.5;
        }
        .recruitment-registration-form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .recruitment-registration-form label {
          display: grid;
          gap: 7px;
          font-size: 14px;
          font-weight: 700;
        }
        
.recruitment-registration-form input,
.recruitment-registration-form select {
  box-sizing: border-box;
  width: 100%;
  min-height: 46px;
  padding: 10px 12px;
  border: 1px solid #d5d5d5;
  border-radius: 12px;
  background: #fff;
  color: #111;
  font: inherit;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.recruitment-registration-form input:focus,
.recruitment-registration-form select:focus {
  outline: none;
  border-color: #777;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.07);
}

        .recruitment-registration-form input[aria-invalid="true"],
        .recruitment-registration-form select[aria-invalid="true"] {
          border-color: #c62828;
        }
        .recruitment-field-error,
        .recruitment-registration-feedback {
          color: #b3261e;
          font-size: 13px;
          line-height: 1.45;
        }
        .recruitment-registration-feedback {
          margin: 0;
        }
        
.recruitment-registration-submit {
  grid-column: 1 / -1;
  min-height: 50px;
  border: 2px solid #000;
  border-radius: 28px;
  background: #111;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.recruitment-registration-submit:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.24);
}

.recruitment-registration-submit:active {
  transform: translateY(0);
}

        .recruitment-registration-submit:disabled,
        .recruitment-registration-close:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media (max-width: 560px) {
          .recruitment-registration-form { grid-template-columns: 1fr; }
          .recruitment-registration-submit { grid-column: auto; }
        }
      `}</style>
    </section>
  );
}

export default RecruitmentSection;
