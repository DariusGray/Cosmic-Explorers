# 🌌 Cosmic Explorers
## Overview

**Cosmic Explorers** is a fitness and wellness gamification web application that encourages users to complete real-world challenges by rewarding them with points and virtual planet unlocks.

Instead of completing challenges for badges alone, users progress through a cosmic journey, where accumulated points determine which planets they can unlock and explore. Each unlocked planet changes the visual theme of the interface, creating a more immersive and personalised experience.

The application combines **authentication, challenge management, point tracking, planet unlocking**, and **leaderboards** into a single full-stack web system.

---

## 👤 User Experience (How the App Works)
### 1. User Registration & Login
- Users register and log in using a username and password.
- Authentication is handled securely using JWT (JSON Web Tokens).
- Once logged in, users can access protected features such as challenges, planets, and rankings.
### 2. Fitness & Wellness Challenges
- Users can view a list of available fitness and wellness challenges.
- Users can also create new missions (challenges) from the Challenges page.
- Challenge creators can manage their own missions:
  - Edit their mission description and points
  - Delete their missions
  - (Only the creator can edit/delete; other users cannot)
- Users can view attempts for each mission (“View Attempts”) to see completion notes submitted by users.

- Each challenge has a description and a fixed point reward.
- When a user completes a challenge:
  - The completion is recorded in the system.
  - Points are awarded immediately.
  - Duplicate completions are prevented.
### 3. Point-Based Progression System
- Users accumulate points by completing challenges.
- Points act as the core currency of progression in the app.
- The total point balance is always retrieved from the backend to ensure data integrity.
### 4. Planet Unlocking Mechanism 🌍
- Each planet has a minimum point requirement.
- When a user clicks “Unlock New Planets”:
  - All planets with required points less than or equal to the user’s current points are unlocked at once.
  - Unlocked planets are saved permanently for the user.
- This allows flexible progression without forcing users to unlock planets one-by-one.
### 5. Planet Exploration & Dynamic Themes ✨
- Users can view all unlocked planets.
- Clicking on an unlocked planet:
  - Changes the UI theme (background, colours, styling) to match that planet.
  - Creates a personalised and immersive visual experience.
- Locked planets remain visible but cannot be accessed until unlocked.
### 6. Ranking & Leaderboard System 🏆
- A leaderboard displays the Top 5 users based on total points.
- Special visual highlights are applied:
  - 🥇 Gold background for Rank 1
  - 🥈 Silver background for Rank 2
  - 🥉 Bronze background for Rank 3
- Hover effects reveal usernames and enhance visual feedback.
### 7. Profile & Activity Log 👤
- The Profile page shows:
  - The user’s current points
  - Unlocked planets (achievements)
  - A completed missions log (mission history)
- The completed missions log displays missions the user has completed, including the mission description, points earned, and completion note.

## ⚙️ Technical Features 
### Backend
- Built using **Node.js** and **Express**
- Follows a **Model–Controller–Route** structure
- Uses **MySQL** for persistent storage
- Database initialised via an `init_tables` script
- Environment variables used for database configuration
- Authentication:
  - Passwords hashed using bcrypt
  - JWT with expiration used for protected routes
- Middleware used to:
  - Validate JWT tokens
  - Authorise users
  - Prevent duplicate challenge completions
- Challenge ownership rules:
  - Only the creator of a challenge can edit or delete it (creator_id enforced on backend).
- Additional protected endpoint:
  - Users can retrieve their completed mission history via a protected route (JWT + ownership check).
 
---

### Frontend
- Built with **HTML, CSS, and JavaScript**
- Styled using **Bootstrap** with additional custom CSS
- Fully responsive across different screen sizes
- Dynamic features implemented using:
  - Fetch API
  - Promises and `async/await`
- Token-based authentication handled via `Authorization: Bearer` headers
- UI dynamically updates based on backend responses (points, planets, rankings)
- Challenges page includes owner-only UI actions (Edit/Delete) that appear only for the challenge creator.
- Profile page dynamically loads and renders the user’s completed missions log from the backend.

---

## 🔐 Security Considerations
- Sensitive credentials such as database configuration and JWT secrets are stored in environment variables and are not hardcoded into the source code.
- JSON Web Tokens (JWT) are required for all endpoints that access or modify protected resources, ensuring that only authenticated users can perform sensitive operations.
- User passwords are securely hashed using **bcrypt** before being stored in the database, preventing exposure of plain-text credentials.
- Ownership checks are implemented on protected endpoints to ensure that users can only create, update, or delete data that belongs to them.
- Server-side error handling is implemented to prevent sensitive error details from being exposed to clients.
- Internal errors are logged on the server for debugging purposes, while generic responses such as **“Internal Server Error”** are returned to the client to reduce the risk of information leakage.
- Ownership checks are enforced for challenge editing/deleting, ensuring only the challenge creator can modify or remove the mission.
  
---

## 🍪 Privacy & Cookies
Cosmic Explorers uses browser-based storage and privacy controls to enhance user experience while maintaining transparency and user control.

### Local Storage and Session Data

The application uses localStorage to persist:

- User authentication tokens (JWT session data)
- User preferences and settings
- Cookie consent status and timestamp

This ensures users remain logged in and their preferences are retained across sessions.

### Cookies and Similar Technologies
The platform may use cookies and browser storage mechanisms to:

- Maintain essential application functionality
- Remember user preferences and consent choices
- Improve user experience and performance

At present, cookie usage is primarily limited to essential functionality, with potential for future analytics or enhancement features.

### Cookie Consent Management

A client-side consent system is implemented via cookieConsent.js:

- Users are presented with a consent banner on first visit
- Users may Accept or Reject non-essential storage
- Consent decisions are stored in localStorage
- Users can reset their consent at any time using the exposed API:
   - `CE_COOKIE.accept()`
   - `CE_COOKIE.reject()`
   - `CE_COOKIE.reset()`
 
### Privacy Policy

A dedicated Privacy Policy page (`privacy.html`) is available, outlining:
- Data collection and usage
- Storage and retention policies
- User rights and control over their data
- Third-party service considerations (if added in future)

### User Rights and Control

Users may:
- Clear stored data via browser settings
- Withdraw consent by resetting cookie preferences
- Request account/data deletion (where applicable)

### Data Protection Approach

Cosmic Explorers follows privacy-focused design principles:
- Minimal data collection
- No sale of personal data
- Separation of authentication and UI storage logic
- Transparency through explicit consent mechanisms
---

## 🧪 Testing
- API endpoints tested using Postman
- Successful tests include:
  - Authentication flows
  - Challenge completion
  - Planet unlocking
  - Leaderboard retrieval
- Screenshots are included in the project report as evidence
## 🚀 How to Run the Application
### 1. Install Dependencies
`npm install`
### 2. Configure Environment Variables
Create a .env file with the following variables:
```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name
JWT_SECRET_KEY=your_secret_key
JWT_EXPIRES_IN=2h
```
### 3. Initialise the Database
`npm run init_tables`
### 4. Start the Server
`npm start`
### 5. Access the App
Open your browser and visit:
`http://localhost:3000`
