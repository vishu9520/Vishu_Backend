# 🚀 Production-Ready Video Platform Backend (Node.js, Express, MongoDB)

> A robust, scalable, and secure RESTful backend application built with **Node.js**, **Express.js (v5)**, and **MongoDB / Mongoose**. Designed with enterprise-grade architecture patterns: dual-token JWT authentication, modular error handling, streaming cloud media uploads via Multer & Cloudinary, and advanced MongoDB aggregation pipelines for social graph metrics.

---

## 📑 Table of Contents
1. [Project Overview & Elevator Pitch](#-project-overview--elevator-pitch)
2. [Tech Stack & Architecture](#-tech-stack--architecture)
3. [Database Models & Schema Relationships](#-database-models--schema-relationships)
4. [Utility Layer & Core Design Patterns](#-utility-layer--core-design-patterns)
5. [Complete API Endpoints & Function Reference](#-complete-api-endpoints--function-reference)
6. [Advanced MongoDB Aggregation Pipelines Explained](#-advanced-mongodb-aggregation-pipelines-explained)
7. [Environment Variables & Setup Guide](#-environment-variables--setup-guide)
8. [Backend Interview Q&A Cheatsheet](#-backend-interview-qa-cheatsheet)
9. [Code Review & Optimization Points](#-code-review--optimization-points-senior-dev-talking-points)

---

## 🎯 Project Overview & Elevator Pitch

### ⏱️ How to explain this project in an interview (60-second pitch):
> *"I built a production-ready video platform backend inspired by YouTube. It is architected using **Node.js, Express 5, and MongoDB with Mongoose**. Key technical highlights include a **dual-token authentication system** utilizing short-lived Access Tokens and long-lived Refresh Tokens stored in secure HTTP-only cookies; an **asynchronous media upload pipeline** using Multer for disk buffering and Cloudinary for cloud asset delivery with automatic local cleanup; and **complex MongoDB Aggregation Pipelines** to compute channel subscriber metrics and deeply nested user watch history efficiently in single database roundtrips. The codebase strictly adheres to clean architecture with standardized API response structures, custom error classes, and wrapper utilities."*

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology / Tool | Purpose |
| :--- | :--- | :--- |
| **Runtime Environment** | Node.js (ES Modules `import/export`) | Asynchronous non-blocking event-driven I/O |
| **Framework** | Express.js 5.x | Web server, routing, and middleware chain |
| **Database & ODM** | MongoDB Atlas, Mongoose 9.x | NoSQL document store, schema validation, indexing |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcrypt` | Stateless auth, password salting & hashing |
| **File Handling** | Multer (`diskStorage`) & Cloudinary API | Multi-part form-data buffer & CDN media hosting |
| **Security & Utilities**| `cookie-parser`, `cors`, `dotenv` | Cookie extraction, CORS policy, config management |
| **Pagination** | `mongoose-aggregate-paginate-v2` | High-performance pipeline-based pagination |

### 📂 Folder Structure
```plaintext
src/
├── app.js                 # Express application initialization & global middlewares
├── constants.js           # Global constants (e.g., DB_NAME)
├── index.js               # Entry point: DB connection & HTTP server boot
├── controllers/           # Request controllers containing business logic
│   └── user.controller.js # All user authentication & profile operations
├── db/                    # Database connection logic
│   └── index.js           # Mongoose connection with error handling & process exit
├── middlewares/           # Custom Express middlewares
│   ├── auth.middleware.js   # JWT authentication verification (`verifyJWT`)
│   └── multer.middleware.js # Multi-part file upload configuration
├── models/                # Mongoose data schemas & instance methods
│   ├── comment.model.js   # Comments with video & user references
│   ├── likes.model.js     # Polymorphic likes (Video, Comment, Tweet)
│   ├── playlist.model.js  # Playlists holding video arrays
│   ├── subscription.model.js # Subscriber-to-Channel relationship model
│   ├── tweet.model.js     # Micro-posts created by users
│   ├── user.model.js      # User credentials, tokens, avatars, watch history
│   └── video.model.js     # Video metadata, duration, owner, aggregation paginate
└── utils/                 # Modular helper classes and wrappers
    ├── ApiError.js        # Standardized Error subclass
    ├── ApiResponse.js      # Standardized JSON response constructor
    ├── asyncHandler.js    # Promise-based wrapper eliminating try/catch blocks
    └── cloudinary.js      # Media upload helper with local cleanup
```

---

## 🗄️ Database Models & Schema Relationships

### 1. User Model (`User`)
- **Fields**: `username` (indexed, unique), `email` (unique), `fullName` (indexed), `avatar` (Cloudinary URL), `coverImage` (Cloudinary URL), `watchHistory` (Array of ObjectIds referencing `Video`), `password` (hashed), `refreshToken`.
- **Mongoose Hooks & Methods**:
  - `userSchema.pre("save")`: Automatically hashes password with `bcrypt` (10 rounds) before persisting if modified.
  - `isPasswordCorrect(password)`: Compares plain password with bcrypt hash.
  - `generateAccessToken()`: Generates short-lived JWT containing `_id`, `email`, `username`, `fullName`.
  - `generateRefreshToken()`: Generates long-lived JWT containing `_id` only.

### 2. Video Model (`Video`)
- **Fields**: `videoFile` (URL), `thumbnail` (URL), `title`, `description`, `duration`, `views`, `isPublished` (boolean), `owner` (Ref to `User`).
- **Plugins**: `mongoose-aggregate-paginate-v2` for paginated aggregate queries.

### 3. Subscription Model (`Subscription`)
- **Fields**:
  - `subscriber`: Reference to `User` (the one who subscribes).
  - `channel`: Reference to `User` (the creator/channel being subscribed to).
- **Relational Logic**: Self-referencing many-to-many relationship using a junction collection.

### 4. Like Model (`Like`)
- **Polymorphic design**: Can like a `video`, a `comment`, or a `tweet`.
- **Fields**: `video` (Ref `Video`), `comment` (Ref `Comment`), `tweet` (Ref `Tweet`), `likedBy` (Ref `User`).

### 5. Comment Model (`Comment`)
- **Fields**: `content` (String), `video` (Ref `Video`), `owner` (Ref `User`), with pagination plugin.

### 6. Tweet Model (`Tweet`)
- **Fields**: `content` (String), `owner` (Ref `User`).

### 7. Playlist Model (`Playlist`)
- **Fields**: `name`, `description`, `videos` (Array of ObjectIds referencing `Video`), `owner` (Ref `User`).

---

## ⚙️ Utility Layer & Core Design Patterns

### 1. `asyncHandler` (Clean Code / DRY)
Eliminates repetitive `try/catch` boilerplate across all controller functions:
```javascript
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
```
*Why explain this*: It centralizes error propagation directly into Express's global error handler.

### 2. Standardized `ApiError` Class
Subclasses JavaScript's native `Error` to enforce consistent error properties:
- `statusCode`: HTTP status code (400, 401, 403, 404, 500).
- `message`: Clear error description.
- `errors`: Detailed array of validation errors.
- `stack`: Captures execution stack trace via `Error.captureStackTrace`.

### 3. Standardized `ApiResponse` Class
Guarantees uniform JSON structure for every client response:
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "User logged In Successfully",
  "success": true
}
```

### 4. Cloudinary Multi-step File Pipeline
1. Client sends `multipart/form-data`.
2. **Multer** saves the binary stream to a local folder (`public/temp/`) with unique timestamps.
3. **Cloudinary Utility** (`uploadOnCloudinary`) uploads the file from local disk to Cloudinary CDN.
4. **Local Cleanup**: Uses `fs.unlinkSync(localFilePath)` to delete the temporary file whether the upload succeeded or failed, preventing server disk space exhaustion.

---

## 📡 Complete API Endpoints & Function Reference

All user routes are mounted at `/api/v1/users`:

| Method | Endpoint | Protection | Multer Upload | Function Name | Purpose |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `POST` | `/resgister` | Public | `avatar` (1), `coverImage` (1) | `registerUser` | Registers new user with images & validates unique fields |
| `POST` | `/login` | Public | None | `loginUser` | Authenticates user, issues JWT access + refresh tokens |
| `POST` | `/logout` | `verifyJWT` | None | `logoutUser` | Unsets refreshToken in DB & clears HTTP cookies |
| `POST` | `/refresh-token`| Public | None | `refreshAccessToken` | Rotates access and refresh tokens using incoming refresh token |
| `POST` | `/change-password` | `verifyJWT` | None | `changeCurrentPassword` | Validates old password and updates to new password |
| `GET` | `/current-user` | `verifyJWT` | None | `getCurrentUser` | Returns currently authenticated user details from `req.user` |
| `PATCH`| `/update-account`| `verifyJWT` | None | `updateAccountDetails` | Updates fullName and email fields |
| `PATCH`| `/avatar` | `verifyJWT` | `avatar` (1) | `updateUserAvatar` | Uploads new avatar to Cloudinary & updates user document |
| `PATCH`| `/cover-image` | `verifyJWT` | `coverImage` (1) | `updateUserCoverImage` | Uploads new cover image to Cloudinary & updates user document |
| `GET` | `/c/:username` | `verifyJWT` | None | `getUserChannelProfile` | Aggregates subscriber counts, subscriptions, & isSubscribed status |
| `GET` | `/history` | `verifyJWT` | None | `getWatchHistory` | Aggregates watch history with embedded video & owner profile |

---

### In-Depth Breakdown of Every Controller Function

#### 1. `registerUser`
- **Validation**: Ensures `fullName`, `email`, `username`, and `password` are non-empty strings.
- **Duplicate Check**: Executes `User.findOne({ $or: [{ username }, { email }] })`. Returns `409 Conflict` if existing.
- **File Upload**: Ensures avatar file exists in `req.files`. Uploads `avatar` and optional `coverImage` to Cloudinary.
- **Persistence**: Creates new User document with lowercase username and securely hashed password via Mongoose pre-save hook.
- **Sanitization**: Selects document excluding `-password -refreshToken` before returning `201 Created`.

#### 2. `loginUser`
- **Validation**: Accepts either `username` or `email` along with `password`.
- **User Lookup**: Finds user with `$or: [{ username }, { email }]`.
- **Password Verification**: Calls `user.isPasswordCorrect(password)` which uses `bcrypt.compare`.
- **Token Generation**: Calls internal helper `generateAccessAndRefereshTokens(userId)`:
  - Generates `accessToken` (contains user identity) and `refreshToken`.
  - Saves `refreshToken` in the database.
- **Cookie Dispatch**: Sets secure, `httpOnly: true` cookies for both tokens and returns sanitized user object.

#### 3. `logoutUser`
- **Security Action**: Finds user by `req.user._id` and unsets the `refreshToken` field using MongoDB `$unset`.
- **Cookie Clearance**: Invokes `res.clearCookie` with `httpOnly: true` and `secure: true` for both `accessToken` and `refreshToken`.

#### 4. `refreshAccessToken`
- **Dual Retrieval**: Extracts refresh token from either `req.cookies.refreshToken` or `req.body.refreshToken`.
- **Verification**: Decodes and verifies token signature with `jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)`.
- **Token Reuse Prevention**: Checks if the incoming token matches the `refreshToken` stored in the user's DB record.
- **Rotation**: Generates a brand new access token and refresh token pair, updates the DB, and resets cookies.

#### 5. `changeCurrentPassword`
- **Verification**: Checks if `oldPassword` matches stored hash with `user.isPasswordCorrect(oldPassword)`.
- **Update**: Sets `user.password = newPassword` and executes `user.save({ validateBeforeSave: false })` to trigger the bcrypt pre-save hashing hook.

#### 6. `getCurrentUser`
- Returns sanitized `req.user` directly attached by `verifyJWT` middleware.

#### 7. `updateAccountDetails`
- Validates `fullName` and `email` presence.
- Uses `User.findByIdAndUpdate` with `$set: { fullName, email }` and `{ new: true }` to return updated data.

#### 8. `updateUserAvatar` & `updateUserCoverImage`
- Extracts single file from `req.file.path`.
- Uploads to Cloudinary, extracts secure URL, and performs `$set` update on user record.

---

## 🧠 Advanced MongoDB Aggregation Pipelines Explained

One of the strongest talking points in your interview is how you utilized **MongoDB Aggregation Framework** to handle complex relational data in a NoSQL database.

### 1. User Channel Profile Aggregation (`getUserChannelProfile`)
**Goal**: Calculate total subscribers, channels subscribed to, and check whether the *current authenticated user* is subscribed to this channel.

```javascript
const channel = await User.aggregate([
  // 1. Find the target channel user by username
  {
    $match: {
      username: username?.toLowerCase()
    }
  },
  // 2. Lookup subscribers (Users who subscribed to this channel)
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "channel",
      as: "subscribers"
    }
  },
  // 3. Lookup channels subscribed to (Channels this user subscribed to)
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "subscriber",
      as: "subscribedTo"
    }
  },
  // 4. Compute computed metric fields dynamically
  {
    $addFields: {
      subscribersCount: { $size: "$subscribers" },
      channelsSubscribedToCount: { $size: "$subscribedTo" },
      isSubscribed: {
        $cond: {
          if: { $in: [req.user?._id, "$subscribers.subscriber"] },
          then: true,
          else: false
        }
      }
    }
  },
  // 5. Project only clean, required fields
  {
    $project: {
      fullName: 1,
      username: 1,
      subscribersCount: 1,
      channelsSubscribedToCount: 1,
      isSubscribed: 1,
      avatar: 1,
      coverImage: 1,
      email: 1
    }
  }
]);
```

### 2. Nested Watch History Aggregation (`getWatchHistory`)
**Goal**: Retrieve user's watch history videos, and inside each video, populate the video creator's profile (`fullName`, `username`, `avatar`).

```javascript
const user = await User.aggregate([
  // 1. Match currently logged-in user
  {
    $match: {
      _id: new mongoose.Types.ObjectId(req.user._id)
    }
  },
  // 2. Lookup videos stored in the watchHistory array
  {
    $lookup: {
      from: "videos",
      localField: "watchHistory",
      foreignField: "_id",
      as: "watchHistory",
      // Nested sub-pipeline to populate each video's owner
      pipeline: [
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
              {
                $project: {
                  fullName: 1,
                  username: 1,
                  avatar: 1
                }
              }
            ]
          }
        },
        {
          $addFields: {
            owner: { $first: "$owner" } // Converts owner array of 1 item into single object
          }
        }
      ]
    }
  }
]);
```

---

## 🔐 Middlewares Deep Dive

### 1. `verifyJWT` (Authentication Guard)
- **Token Extraction**: Reads JWT from `req.cookies?.accessToken` OR HTTP header `Authorization: Bearer <token>`.
- **Verification**: Validates token authenticity and expiration against `process.env.ACCESS_TOKEN_SECRET`.
- **Context Injection**: Queries database for user `_id` and attaches user document (minus password and refreshToken) to `req.user`. Subsequent route handlers access authenticated user context from `req.user`.

### 2. `upload` (Multer Configuration)
- Utilizes `multer.diskStorage` to write files to `./public/temp`.
- Generates collision-resistant unique file names using `Date.now()` and random numbers:
  `${file.fieldname}-${uniqueSuffix}`.

---

## ⚡ Environment Variables & Setup Guide

### 1. Create `.env` file
Create a `.env` file in the root directory:
```env
PORT=8080
CORS_ORIGIN=*
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run in Development Mode
```bash
npm run dev
```

---

## 💼 Backend Interview Q&A Cheatsheet

Prepare these exact answers to impress your interviewer:

### Q1: Why use both Access Tokens and Refresh Tokens instead of just one token?
> **Answer**: *"An Access Token is short-lived (e.g., 15m to 1d) and contains user claims. Because it's stored client-side and used on every request, if it gets intercepted, the attacker only has a very limited time window. The Refresh Token is long-lived (e.g., 10d) and stored securely in an `httpOnly` cookie and in the database. When the access token expires, the client uses the refresh token to request a new one without forcing the user to log in again. Furthermore, storing the refresh token in the database allows us to revoke sessions immediately (e.g., on logout or suspicious activity) by invalidating the refresh token."*

### Q2: Why store JWTs in `httpOnly` cookies?
> **Answer**: *"`httpOnly` cookies cannot be accessed or read by client-side JavaScript (`document.cookie`). This provides strong defense against Cross-Site Scripting (XSS) attacks, preventing malicious scripts from stealing the authentication tokens."*

### Q3: How do you prevent server storage memory leaks when uploading files?
> **Answer**: *"When handling multipart uploads via Multer, files are temporarily stored on disk in `public/temp`. Once Cloudinary finishes uploading (or if the upload fails), we immediately run `fs.unlinkSync(localFilePath)` to remove the temporary file. This ensures our server never runs out of disk space from orphaned temp files."*

### Q4: How does `asyncHandler` work and why is it beneficial?
> **Answer**: *"`asyncHandler` is a higher-order function that accepts an async controller function `(req, res, next)` and wraps it in `Promise.resolve().catch(next)`. This eliminates writing repetitive `try/catch` blocks in every single controller. If an error is thrown, it is automatically forwarded to Express's central error handling middleware."*

### Q5: How do MongoDB Aggregation Pipelines compare to standard Mongoose `.populate()`?
> **Answer**: *"`populate()` executes multiple separate queries under the hood in Node.js (querying the parent collection, then performing an `$in` query on the child collection). In contrast, an Aggregation Pipeline executes directly inside the MongoDB database engine using stages like `$lookup`, `$match`, and `$addFields`. It reduces network roundtrips, enables filtering and projections before returning data, and allows mathematical calculations (such as `$size` for subscriber counts) in a single high-performance query."*

### Q6: How does the password hashing workflow work with Mongoose?
> **Answer**: *"We use a Mongoose `pre('save')` hook on the user schema. Before saving, it checks `this.isModified('password')`. If true, it runs `bcrypt.hash(this.password, 10)`. If false (e.g., when updating username or avatar), it calls `next()` to avoid re-hashing an already hashed password."*

---

## 🔍 Code Review & Optimization Points (Senior Dev Talking Points)

If an interviewer asks *"If you had to review or improve this codebase today, what would you optimize or fix?"*, mention these points:

1. **Scoping in `updateUserAvatar` & `updateUserCoverImage`**:
   - In `updateUserAvatar`, `const avatar = await uploadOnCloudinary(...)` is currently placed within the `if(!avatarLocalPath)` validation block. It should be outside the check so `avatar.url` is accessible in the `$set` update.
2. **Channel Profile Condition (`getUserChannelProfile`)**:
   - The validation currently checks `if (channel?.length)` instead of `if (!channel?.length)`. If the channel exists, it currently throws a 404 error. Inverting this to `!channel?.length` correctly checks for a non-existent channel.
3. **Route Path Consistency**:
   - `user.routes.js` defines `/resgister` (spelling) and `cover-image` (missing leading slash `/cover-image`). Fixing these to `/register` and `/cover-image` ensures REST consistency.
4. **Token Variable Name**:
   - In `refreshAccessToken`, ensure `User.findById(...)` uses the capital `User` model rather than lowercase `user`, and `newAccessToken` is passed to the response.
5. **Database Indexing Strategy**:
   - The User schema already indexes `username` and `fullName`. Adding a compound index or unique index on `Subscription` `{ subscriber: 1, channel: 1 }` prevents duplicate subscriptions at the database level.

---

### 👨‍💻 Author
**Vishu Vatsay**  
Backend Developer | Node.js & MongoDB Specialist

