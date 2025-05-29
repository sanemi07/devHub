# DevHub

DevHub is a full-stack web application that provides user authentication (including Google OAuth), profile management, posting, commenting, following/unfollowing users, and secure file uploads using Cloudinary. The backend is built with Node.js, Express, and MongoDB.

## Features

- User registration and login with JWT authentication
- Google OAuth 2.0 login
- Profile management (profile picture upload/change and bio update)
- Create, edit, delete, and fetch posts (with optional image)
- Follow and unfollow users, view followers/following lists
- Commenting system with replies and moderation
- Secure password hashing with bcrypt
- File uploads with Multer and Cloudinary integration
- Modular code structure with controllers, services, and middlewares

## Project Structure

```
backend/
  ├── .env
  ├── app.js
  ├── package.json
  ├── server.js
  ├── config/
  ├── controllers/
  ├── middlewares/
  ├── model/
  ├── public/
  ├── routes/
  ├── services/
  └── utils/
frontend/
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB database (Atlas or local)
- Cloudinary account

### Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
JWTACCESS=your_jwt_access_secret
JWTREFRESH=your_jwt_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Installation

1. **Install dependencies:**

   ```sh
   cd backend
   npm install
   ```

2. **Run the development server:**

   ```sh
   npm run dev
   ```

   The server will start on the port specified in your `.env` file (default: 3000).

## API Endpoints

### Auth (`/users`)

- `POST /users/register` — Register a new user  
  **Body:** `{ "userName": "string", "email": "string", "password": "string" }`
- `POST /users/login` — Login with email and password  
  **Body:** `{ "email": "string", "password": "string" }`
- `POST /users/logout` — Logout the current user (requires authentication)
- `POST /users/refresh` — Refresh access token using refresh token

### Google OAuth (`/auth`)

- `GET /auth/google` — Start Google OAuth
- `GET /auth/google/callback` — Google OAuth callback

### Profile (`/profile`)

- `POST /profile/upload` — Upload a profile image  
  **Headers:** `Authorization: Bearer <token>`  
  **Body:** `multipart/form-data` with `file` field
- `POST /profile/change-profilepic` — Change profile image  
  **Headers:** `Authorization: Bearer <token>`  
  **Body:** `multipart/form-data` with `file` field
- `POST /profile/add-bio` — Add or update user bio  
  **Headers:** `Authorization: Bearer <token>`  
  **Body:** `{ "bio": "Your bio here" }`
- `POST /profile/followUser/:id` — Follow a user  
  **Headers:** `Authorization: Bearer <token>`
- `POST /profile/unfollowUser/:id` — Unfollow a user  
  **Headers:** `Authorization: Bearer <token>`
- `GET /profile/getFollowers` — Get paginated list of followers  
  **Headers:** `Authorization: Bearer <token>`  
  **Query:** `page`, `limit`
- `GET /profile/getFollowing` — Get paginated list of following  
  **Headers:** `Authorization: Bearer <token>`  
  **Query:** `page`, `limit`
- `GET /profile/getUserProfile` — Get current user's profile (with followers/following count)  
  **Headers:** `Authorization: Bearer <token>`
- `GET /profile/getProfile/:id` — Get another user's profile by ID  
  **Headers:** `Authorization: Bearer <token>`

### Posts (`/profile`)

- `POST /profile/uploadPost` — Create a new post (with optional image)  
  **Headers:** `Authorization: Bearer <token>`  
  **Body:** `multipart/form-data` with optional `file` and `content` field
- `GET /profile/getPosts` — Get all posts (paginated, requires authentication)  
  **Headers:** `Authorization: Bearer <token>`  
  **Query:** `page`, `limit`
- `GET /profile/getpostFromUser` — Get posts from the authenticated user (paginated)  
  **Headers:** `Authorization: Bearer <token>`  
  **Query:** `page`, `limit`
- `DELETE /profile/:id` — Delete a post by ID (only owner can delete)  
  **Headers:** `Authorization: Bearer <token>`
- `PUT /profile/editPost/:id` — Edit a post's content by ID (only owner can edit)  
  **Headers:** `Authorization: Bearer <token>`  
  **Body:** `{ "content": "Updated content" }`
- `POST /profile/likePost/:id` — Like a post  
  **Headers:** `Authorization: Bearer <token>`

### Comments (`/comments`)

- `POST /comments/createComment/:postId` — Create a comment on a post  
  **Headers:** `Authorization: Bearer <token>`  
  **Body:** `{ "content": "Your comment" }`
- `GET /comments/getAllComment/:postId` — Get all comments for a post (paginated)  
  **Headers:** `Authorization: Bearer <token>`  
  **Query:** `page`, `limit`
- `GET /comments/getCommentById/:commentId` — Get a specific comment by ID  
  **Headers:** `Authorization: Bearer <token>`
- `PUT /comments/editComment/:commentId` — Edit a comment (only author)  
  **Headers:** `Authorization: Bearer <token>`  
  **Body:** `{ "content": "Updated comment" }`
- `DELETE /comments/deleteComment/:commentId` — Delete a comment (author or post owner)  
  **Headers:** `Authorization: Bearer <token>`
- `POST /comments/replyComment/:commentId` — Reply to a comment  
  **Headers:** `Authorization: Bearer <token>`  
  **Body:** `{ "content": "Reply content" }`
- `GET /comments/getReplies/:commentId` — Get replies to a comment (paginated)  
  **Headers:** `Authorization: Bearer <token>`  
  **Query:** `page`, `limit`
- `DELETE /comments/deleteReply/:replyId` — Delete a reply (only author)  
  **Headers:** `Authorization: Bearer <token>`

## Technologies Used

- Node.js, Express
- MongoDB, Mongoose
- Passport.js (Google OAuth)
- JWT (jsonwebtoken)
- Multer (file uploads)
- Cloudinary (image storage)
- bcrypt (password hashing)
- express-validator (input validation)

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[ISC](LICENSE)

---

**Developed by Arjun Kr Tripathi**