**MERN-BLOG-APP**

Description

The MERN Blog App is a full-stack web application built using the MERN (MongoDB, Express, React, Node.js) stack. This application allows users to create and manage blog posts, offering a platform for sharing ideas and stories. Posts are categorized, enabling users to filter and view content by specific categories easily. Users can click on a category to see all related posts and authors, as well as the number of posts by each author. The app features user authentication for secure access, allowing users to register, log in, and manage their profiles, including changing their avatar or profile photo. With a responsive design and real-time data interaction, this app provides a seamless experience across devices, making it an excellent choice for developers and anyone interested in blogging.


Features

1.User Authentication: Secure registration and login with JWT-based authentication.

2.Create, Edit, and Delete Posts: Logged-in users can manage their blog posts.

3.Categories: Posts are divided into categories, allowing users to filter and view content easily.

4.Profile Management: Users can update their personal details and change their avatar or profile photo.

5.Author Insights: View authors and the number of posts by each author.

6.Responsive Design: Optimized for desktops, tablets, and mobile devices.

7.Image Upload: Users can upload profile images (avatars).

8.Post Pagination: Posts are displayed with pagination for better performance.

9.Real-time Data Interaction: Fetch, update, and delete posts interactively using a backend API.

10.User-friendly Interface: Clean and minimalistic design for ease of use.


Live Demo/ Deployed Link 

https://mern-blog-app-69d96f.netlify.app


Technologies Used

Frontend: React, Axios

Backend: Node.js, Express

Database: MongoDB, Mongoose

Authentication: JWT (JSON Web Tokens)

Styling: CSS/SCSS or any CSS framework (e.g., Material-UI, Bootstrap)


Getting Started

Prerequisites

Ensure that you have the following installed:

Node.js
MongoDB (locally or using a cloud service like MongoDB Atlas)


Installation

Clone the repository:

git clone https://github.com/your-username/mern-blog-app.git
cd mern-blog-app


Install dependencies for both the backend and frontend:

Backend
cd backend
npm install

Frontend
cd ../client
npm install


Set up environment variables:

Create a .env file in both the backend and client directories.

Backend (backend/.env):

Node.js
MongoDB (locally or using a cloud service like MongoDB Atlas

Installation

Clone the repository:

git clone https://github.com/your-username/mern-blog-app.git
cd mern-blog-app

Install dependencies for both the backend and frontend:

# Backend
cd backend
npm install

# Frontend
cd ../client
npm install


Set up environment variables:

Create a .env file in both the backend and client directories.

Backend (server/.env):

MONGO_URI=mongodb+srv://PrafulShinde:87GoXqdrSEd3Ya1X@praful-cluster.jqwtt.mongodb.net/MERN-BLOG-APP
PORT=5000
JWT_SECRET = aweffffwefe23324esfdsdf
CLIENT_URL=https://mern-blog-nine-teal.vercel.app

Frontend (client/.env):
REACT_APP_BASE_URL_1="http://localhost:5000/api"
REACT_APP_ASSETS_URL_1="http://localhost:5000"
REACT_APP_API_URL="https://mern-blog-app-tltf.onrender.com/api"
REACT_APP_ASSETS_URL="https://mern-blog-app-tltf.onrender.com"


Start the development servers:

In two separate terminal windows, run the following commands:

# Backend server
cd backend
npm start

# Frontend server
cd ../client
npm start


Visit the app in your browser:

The frontend will run at http://localhost:3000, and the backend at http://localhost:5000.


API Endpoints

User Routes

POST /api/users/register – Register a new user

POST /api/users/login – Login a user

PATCH /api/users/edit-user - Edit User

GET /api/users - Get User Profile

GET /api/users/author - Get Authors

PATCH /api/users/edit-user - Edit User Details

Post Routes

POST /api/posts – Create a new post

GET /api/posts – Get all posts

GET /api/posts/:id – Get a single post by ID

GET /api/posts/categories - Get Post by Category

GET /api/posts/users:id - Get user post by ID

PATCH /api/posts/:id - Edit Post by ID

DELETE /api/posts/:id – Delete a post by ID


Deployment

To deploy this app:

Push the code to a GitHub repository.

Deploy the frontend (React app) on a service like Vercel or Netlify.
Deploy the backend (Node.js server) on a platform like Heroku or Render.
Set up environment variables on the respective deployment platforms.


License

This project is licensed under the MIT License.
