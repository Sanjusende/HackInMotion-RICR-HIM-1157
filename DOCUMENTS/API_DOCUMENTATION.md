# API Documentation

Base URL

http://localhost:5000/api

---

## Authentication APIs

POST /auth/register

POST /auth/login

POST /auth/refresh-token

POST /auth/logout

GET /auth/me

---

## Profile APIs

POST /profile

GET /profile

GET /profile/:id

PUT /profile/:id

DELETE /profile/:id

---

## Farm APIs

POST /farms

GET /farms

GET /farms/:id

PUT /farms/:id

DELETE /farms/:id

---

## Weather APIs

GET /weather/current

GET /weather/forecast

---

## Crop Health APIs

POST /crop-health/analyze

GET /crop-health/history

---

## Market APIs

GET /market/prices

GET /market/trends

---

## Voice APIs

POST /voice/chat

POST /voice/speech-to-text

POST /voice/text-to-speech

---

## Admin APIs

GET /admin/users

GET /admin/farms

GET /admin/analytics