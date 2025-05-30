#✍️ Blog Editor Platform
A full-stack blog editing platform that allows users to create, edit, draft, publish, and automatically save blog content. It features a user-friendly editor interface and backend API for managing blog posts with ease.

🚀 Features
📝 Rich Blog Editor: Create and format blog content with a WYSIWYG (What You See Is What You Get) editor.

💾 Auto-Save: Automatically saves your work every 5 seconds to prevent data loss.

🗂️ Draft & Publish System: Save your work as a draft or publish it when you're ready.

🔄 Real-Time Feedback: Seamless writing and editing experience with instant updates.

📦 RESTful API: Fully functional Node.js backend with MongoDB for blog management.

🧑‍💻 User Management: Backend support for multiple users and blog ownership.

🚀 Tech Stack
Frontend:

React – For building the user interface

Vite – Fast bundler and development server

Axios – HTTP client for API requests

Backend:
Node.js – JavaScript runtime
Express.js – Web framework for Node.js
MongoDB – NoSQL database for storing blogs and user info
Mongoose – ODM for MongoDB
dotenv – Manage environment variables
CORS – Cross-Origin Resource Sharing middleware
bcrypt.js – For password hashing
jsonwebtoken (JWT) – For secure user authentication

--------------------------------------------------
⚙️ Project Setup
Step 1: Clone the repository
Clone the repository and navigate to the root directory.

Step 2: Backend Setup
Navigate to the backend folder.
Install dependencies using npm.

Create a .env file and configure your variables:
MongoDB connection URI
JWT secret key

Start the backend server using:
" node server.js " (or nodemon if installed)

Step 3: Frontend Setup
Navigate to the frontend folder.
Install dependencies using npm.

Make sure the backend server URL is correctly set in Axios calls.

Start the development server using:
"  npm run dev "

---------------------------------------------------------------

🔄 Key Features
Live Editor with Auto-Save
Automatically saves blog content every 5 seconds while typing.

Draft Management
Save blog posts in draft mode and edit them later.

Publishing System
One-click publishing with a toggle between draft/published views.

User Authentication (Login/Register)
Secure sign-up and login using token-based auth.

Toast Notifications
Visual feedback on actions like save, publish, or error.
