# B

[Link to frontend](https://github.com/xiaochendev/capstone-frontend)

# Steps
1. Copy rerepository to your local file
```
git clone https://github.com/xiaochendev/capstone-backend.git
```

2. Change to lab direcotry, ex. secRepo
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

6. Start the server
```
npm run dev
```

7. Add Seed-data into your mongodb First by visiting broswer
```
localhost:3000/seed
```

- notes: Your supposed to see 'All animal data seeded successfully' if Your set MONGO_URI corretly in .env

8. Then, Its viewable in your browser by entering
```
localhost:3000
```

Notes: Install Extensions (Thunder Client or Postman) in Visual Studio allow you to test following APIs.

# API References
|  VERB |   PATH | QUERY PARAMS | DESCRIPTION |
|----------|----------|--------|------------------------------|
| Pages |   |   |   |
|  GET  | / |  - |  Render home page|


# Technologies
- React.js
- Node.js
- Express.js
- Mongoose

# Reflections
- Did you deliver a project that met all of the technical requirements?
    NA
- Given what the class has covered, did you build something reasonably complex?
    NA
- Did you add a personal touch or a creative element into your project submission?
    NA
- Did you deliver something of value to the end-user (not just a login button and an index page)?
    NA
- Did you follow the code style guidance and exercise best practices?
    NA
- Did you provide an appropriate level of comments?
    NA
- Did you try to deploy your application to a public URL as a personal stretch goal?
    NA