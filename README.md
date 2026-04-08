# 🏫 School Management API

A simple REST API built with **Node.js**, **Express**, and **MySQL** to manage schools and list them sorted by distance from a given location.

---

## 📦 Tech Stack

- Node.js (ES Modules)
- Express.js
- MySQL2
- dotenv
- CORS

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Asvin-07/School-Management-API.git
cd School-Management-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your MySQL credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=school_db
DB_PORT=3306
PORT=5000
```

### 4. Set up the database

Run the provided SQL schema to create the database and table:

```bash
mysql -u root -p < schema.sql
```

### 5. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start at `http://localhost:5000`

---

## 📡 API Endpoints

### GET `/`
Health check — confirms the API is running.

**Response:**
```
✅ School Management API is running!
```

---

### POST `/addSchool`
Adds a new school to the database.

**Request Body (JSON):**
```json
{
  "name": "Springfield Elementary",
  "address": "123 Main St, Springfield",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

**Success Response `201`:**
```json
{
  "message": "School added successfully",
  "schoolId": 1
}
```

**Error Response `400`:**
```json
{
  "error": "All fields are required"
}
```

---

### GET `/listSchools?latitude=&longitude=`
Returns all schools sorted by distance (nearest first) from the provided coordinates.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `latitude` | float | ✅ | User's current latitude |
| `longitude` | float | ✅ | User's current longitude |

**Example Request:**
```
GET /listSchools?latitude=28.6139&longitude=77.2090
```

**Success Response `200`:**
```json
[
  {
    "id": 1,
    "name": "Springfield Elementary",
    "address": "123 Main St, Springfield",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "distance": 0.0
  }
]
```

**Error Response `400`:**
```json
{
  "error": "Latitude and Longitude are required"
}
```

---

## 📁 Project Structure

```
School-Management-API/
├── server.js          # Main application entry point
├── db.js              # MySQL connection pool
├── package.json       # Project metadata and scripts
├── .env.example       # Environment variable template
├── schema.sql         # Database schema
├── .gitignore         # Git ignored files
└── README.md          # Project documentation
```

---

## 🛡️ Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_HOST` | MySQL host (e.g. `localhost`) |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name (e.g. `school_db`) |
| `DB_PORT` | MySQL port (default: `3306`) |
| `PORT` | Server port (default: `5000`) |

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
