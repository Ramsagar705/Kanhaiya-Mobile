# Kanhaiya Mobile — E-commerce Website

A full-stack e-commerce website developed for a real mobile retail business as a paid client project.

## 🌐 Live Website
https://kanhaiyamobile.online

## 🛠️ Tech Stack
- React.js
- Node.js
- Express.js
- MongoDB Atlas
- Cloudinary
- Razorpay (testing phase)

## ✨ Key Features
- New and second-hand smartphone listings
- Product search and filtering
- Admin product management
- Product image uploads
- Phone booking
- Delivery status tracking

## Password reset email setup

The backend sends password reset emails through the Resend HTTP API. Configure
these environment variables for the backend locally and in Render:

- Use Node.js 20 or newer for the Resend SDK.
- `RESEND_API_KEY`: Resend API key. Keep it secret; do not commit it.
- `EMAIL_FROM`: Sender address on a domain verified with Resend, for example
  `Kanhaiya Mobile <no-reply@your-verified-domain.com>`.
- `CLIENT_URL`: Base URL of the frontend; the reset link is built from this
  value.

For local testing, add the variables to `server/.env` (see
[`server/.env.example`](./server/.env.example)), start the backend with
`npm run dev` from `server/`, then submit a known account email to
`POST http://localhost:5000/api/auth/forgot-password` with JSON
`{"email":"your-address@example.com"}`. Confirm the message arrives and that
the link opens the frontend reset-password page. If delivery fails, the API
returns HTTP 500 and the backend logs a sanitized error.

For production testing, set the same variables in the Render backend service,
deploy, and POST the same JSON body to
`https://<your-backend-host>/api/auth/forgot-password`. Check the recipient
inbox and Render logs; do not include reset links or API keys in shared logs
or support messages.

## 🎥 Project Demo

[▶️ Watch Kanhaiya Mobile Demo](https://github.com/Ramsagar705/Kanhaiya-Mobile/blob/main/Technology%20Corporate%20-%20Trim.mp4)


## 👨‍💻 Developer
Ramsagar Chandravanshi

GitHub: https://github.com/Ramsagar705
