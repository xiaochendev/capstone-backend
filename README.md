# Game platform
- allow users to play game without register
- registered users are able to update/delete their profile
- registered user able to access their personal dashboard
- both guest and registered users are able to view top10 leaderboard
- allow guest to upgrade their account

[Link to frontend](https://github.com/xiaochendev/capstone-frontend)
[Used Jira](./jira.png)

# Steps
1. Copy rerepository to your local file
```
git clone https://github.com/xiaochendev/capstone-backend.git
```

2. Change to the directory, ex. capstone-backend
```
cd capstone-backend
```

3. Create .env in the directory 
```
touch .env
```

4. Add variables in .env
```
MONGO_URI=<YOUR_MONGODB_COLLECTION_CONNECTION>
PORT=3000
JWT_SECRET=<YOU_RANDOM_JWT_SECRET>
```

5. Install all the required dependencies
```
npm install
```

6. Seed-data into your mongodb First 
```
npm run seed
```

7. Start the server
```
npm run dev
```

- notes: Your supposed to see 'Data seeded successfully' if Your set MONGO_URI corretly in .env

**KEEP SERVER(backend) RUNNING**


Notes: Install Extensions (Thunder Client or Postman) in Visual Studio allow you to test following APIs.

# API References - backend
Notes: Install Extensions (Thunder Client or Postman) in Visual Studio allow you to test following APIs.

| **Route**          | **Method** | **Description**                          | **Access**       |
| ------------------ | ---------- | ---------------------------------------- | ---------------- |
| 🔐 | | | |
| `/auth/register`   | POST       | User registration                        | Public           |
| `/auth/login`      | POST       | User login                               | Public           |
| `/auth/logout`     | POST       | Logout (clears cookie)                   | Public           |
| `/auth`            | GET        | Get current user info                    | Registered users |
| `/auth`            | PUT        | Update user info                         | Registered users |
| `/auth`            | DELETE     | Delete user account                      | Registered users |
| `/auth/guest`      | POST       | Generate a guest token                   | Public           |
| `/auth/guest/info` | GET        | Get guest user info                      | Guest only       |
| `/auth/upgrade`    | POST       | Upgrade guest account to registered user | Guest only       |
| 📊 | | | |
| `/dashboard`       | GET        | Get user's game statistics               | Registered users |
| 🎮 | | | |
| `/games/leaderboard`         | GET        | Global top 10 leaderboard          | Public              |
| `/games/:gameId/leaderboard` | GET        | Top 10 players for a specific game | Registered users    |
| `/games/:gameId`             | GET        | Get game info by ID                | Public              |
| `/games`                     | GET        | Get game info by name (via query)  | Public              |
| `/games`                     | POST       | Create a new game                  | Public              |
| `/games/:gameId/submit`      | POST       | Submit a game result               | Registered or Guest |


# Technologies
- React.js
- Node.js
- Express.js
- Mongoose

# Reflections
- Did you deliver a project that met all of the technical requirements?
    Yes
- Given what the class has covered, did you build something reasonably complex?
    Yes
- Did you add a personal touch or a creative element into your project submission?
    Yes
- Did you deliver something of value to the end-user (not just a login button and an index page)?
    Yes
- Did you follow the code style guidance and exercise best practices?
    Yes
- Did you provide an appropriate level of comments?
    Yes
- Did you try to deploy your application to a public URL as a personal stretch goal?
    NA