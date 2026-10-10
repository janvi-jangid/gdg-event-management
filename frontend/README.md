# GDG RBU Event Management — Frontend

A responsive web application for the **Google Developer Groups (GDG), Ramdeobaba University (RBU)** community. It provides an organized interface for exploring community events, viewing upcoming activities, and discovering past events.

## 🌐 Live Demo

- **Live Website:** [https://gdg-event-management-mu.vercel.app](https://gdg-event-management-mu.vercel.app)
- **GitHub Repository:** [https://github.com/janvi-jangid/gdg-event-management](https://github.com/janvi-jangid/gdg-event-management)

## ✨ Features

- **Responsive UI:** A clean interface for navigating event information.
- **Event Discovery:** A dedicated section for displaying events.
- **Upcoming Events:** Highlights upcoming community activities.
- **Past Events:** Showcases previous community events.
- **API Integration:** Connects to the backend to retrieve event data.
- **Reusable Components:** Organizes the interface into React components.
- **Production Deployment:** Deployed using Vercel.

> Features such as user authentication and event registration should be listed as available only after their implementation has been verified.

## 🛠️ Technology Stack

| Technology       | Purpose                                 |
| ---------------- | --------------------------------------- |
| React            | Component-based user interface          |
| Vite             | Development server and production build |
| JavaScript (JSX) | UI logic and component rendering        |
| CSS              | Layout, styling, and responsive design  |
| Fetch API        | HTTP communication with the backend     |
| Git and GitHub   | Version control and collaboration       |
| Vercel           | Frontend hosting and deployment         |

## 📁 Project Structure

```text
frontend/
├── public/
│   └── images and static assets
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── EventList.jsx
│   │   ├── PastEvents.jsx
│   │   └── UpcomingEvent.jsx
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

*This structure is illustrative; keep it consistent with the actual files in your project.*

## ⚙️ Prerequisites

Install the following:

- Node.js (LTS recommended)
- npm (included with Node.js)
- Git
- Visual Studio Code or another code editor

Check your installation:

```bash
node -v
npm -v
git --version
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/janvi-jangid/gdg-event-management.git
cd gdg-event-management/frontend
```

### 2. Install dependencies

```bash
npm install
```

This installs the packages defined in `package.json`.

### 3. Start the development server

```bash
npm run dev
```

Vite will display a local URL, usually:

```text
http://localhost:5173
```

Open the URL in your browser to view the frontend.

### 4. Create a production build

```bash
npm run build
```

The optimized production files are generated in the `dist/` directory.

### 5. Preview the production build

```bash
npm run preview
```

Use the URL printed in the terminal to preview the built application locally.

## 🔗 Backend Integration

The frontend communicates with the Spring Boot backend through HTTP requests to retrieve event data.

For local development, start the backend separately and ensure that its configured API URL and port match the frontend configuration.

For production deployment, configure the frontend to use the publicly accessible backend URL. **Do not use `localhost` as the production API URL**, because it refers to the individual visitor's device.

If the backend is unavailable, event data may fail to load. Verify the API connection before considering the deployed application fully functional.

## ☁️ Deployment with Vercel

The frontend is hosted on Vercel.

**Live URL:** [https://gdg-event-management-mu.vercel.app](https://gdg-event-management-mu.vercel.app)

To deploy updates:

1. Commit and push your changes to GitHub.
2. Ensure your Vercel project is connected to the correct repository.
3. Set the project root directory to `frontend`.
4. Use the appropriate build command: `npm run build`.
5. Confirm the deployment succeeds.
6. Open the deployed website and test its features.

If the frontend uses environment variables for the backend URL, configure the production values in Vercel and redeploy.

## 🧪 Testing Checklist

Before submitting the project, verify:

- [ ] `npm install` completes successfully.
- [ ] `npm run dev` starts the application.
- [ ] The homepage and navigation render correctly.
- [ ] Upcoming and past event sections display correctly.
- [ ] The frontend can communicate with the deployed backend.
- [ ] `npm run build` completes successfully.

* GitHub: [https://github.com/janvi-jangid](https://github.com/janvi-jangid)
* LinkedIn: [https://www.linkedin.com/in/janvi-jangid-54a5043b7/](https://www.linkedin.com/in/janvi-jangid-54a5043b7/)
