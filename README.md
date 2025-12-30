# Video Recommendation App (React)

A simple React app for saving and viewing video recommendations.  
You can add videos, see them listed as cards, and update ratings (thumbs up / down style).

This project was built as a practice full-stack-style app: the UI is React, and the data comes from a backend API.

---

## Features

- Fetches a list of videos from an API on page load
- Displays videos using reusable `Videocard` components
- Add a new video using the `Addvideo` component
- Increase a video's rating (updates UI + sends a PUT request to the server)
- Delete a video (updates UI + sends a DELETE request to the server)
- Prevents ratings from going below 0 when decreasing

---

## Tech Stack

- **Frontend:** React (Hooks: `useState`, `useEffect`)
- **Styling:** CSS (`App.css`)
- **Backend:** REST API (external service + local endpoints used for updates)

---

## How it Works (High Level)

### 1) Fetch videos when the app loads
The app loads video data from:

- `https://fullstackbackend-92zs.onrender.com/`

The response is expected to be JSON like:

```json
[
  {
    "id": 1,
    "title": "Example Video",
    "url": "https://youtube.com/...",
    "rating": 3
  }
]
