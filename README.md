# GDG Event Management System

A backend application built with Java and Spring Boot to manage events and user registrations.

## Tech Stack

* Java 21
* Spring Boot
* Spring Data JPA / Hibernate
* PostgreSQL
* Spring Security
* JWT Authentication
* Maven

## Features

* User registration and login
* Password hashing with BCrypt
* JWT-based authentication
* Create, view, update, and delete events
* Event details including title, description, date/time, venue, capacity, and category
* Register for events
* View your registrations
* Prevent duplicate registrations
* Cancel event registrations
* Validate event capacity
* Role-based access configuration for administrators

## API Endpoints

### Authentication

| Method | Endpoint             | Purpose                  |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/auth/register` | Register a user          |
| POST   | `/api/auth/login`    | Log in and receive a JWT |

### Events

| Method | Endpoint           | Purpose         |
| ------ | ------------------ | --------------- |
| GET    | `/api/events`      | List events     |
| GET    | `/api/events/{id}` | View an event   |
| POST   | `/api/events`      | Create an event |
| PUT    | `/api/events/{id}` | Update an event |
| DELETE | `/api/events/{id}` | Delete an event |

### Registrations

| Method | Endpoint                       | Purpose                 |
| ------ | ------------------------------ | ----------------------- |
| POST   | `/api/registrations/{eventId}` | Register for an event   |
| GET    | `/api/registrations/me`        | View your registrations |
| DELETE | `/api/registrations/{eventId}` | Cancel a registration   |

## Setup

1. Install Java 21, Maven, and PostgreSQL.

2. Create a PostgreSQL database named `gdg_event_management`.

3. Configure the database URL, username, and password in `src/main/resources/application.properties`.

4. Configure a secure JWT secret using a local environment variable or other private configuration.

5. Run the application using:

   ```bash
   mvn spring-boot:run
   ```

6. The backend runs at `http://localhost:8080` by default.

## Testing with Postman
1. Register a user using /api/auth/register.
2. Log in using /api/auth/login.
3. Copy the returned JWT token.
4. For protected requests, select Authorization → Bearer Token in Postman.
5. Use the endpoints above to test events and registrations.

