# Adopt Center
- Allow admin to CRUD on reptiles, fishes, avians, mammals
- Find animals that are available to adopt

# Steps
1. Copy rerepository to your local file
```
git clone https://github.com/xiaochendev/secRepo.git
```

2. Change to lab direcotry, ex. secRepo
```
cd secRepo
```

3. Create .env in secRepo dir
```
touch .env
```
4. Add variables in .env
```
MONGO_URI=<YOUR_MONGODB_COLLECTION_CONNECTION>
PORT=3000
```

5. Install all the required dependencies
```
npm install
```

6. Start the server
```
npm start
```

7. Add Seed-data into your mongodb FIRST by visiting broswer
```
localhost:3000/seed
```
- notes: Your supposed to see 'All animal data seeded successfully' if Your set MONGO_URI corretly in .env

8. Then, Its viewable in your browser by entering
```
localhost:3000
```

Notes: Install Extensions (Thunder Client or Postman) in Visual Studio allow you to test following APIs.

|  VERB |   PATH | QUERY PARAMS | DESCRIPTION |
|----------|----------|--------|------------------------------|
|  GET	|  / | - | Get all animals in the adopt center |
|  GET	|  /available | - | Get all available for adoption animals |
|  GET | /seed | - |  Seed database with initial data |
|  GET	|  /api/mammals | - | Get all mammals |
| POST | /api/mammals | - | Create a new mammal |
| GET | /api/mammals/:id | id | Get a mammal by ID |
| PUT | /api/mammals/:id | id | Update a mammal by ID |
| DELETE | /api/mammals/:id | id | Delete a mammal by ID |
|  GET	|  /api/reptiles | - | Get all reptiles |
| POST | /api/reptiles | - | Create a new reptile |
| GET | /api/reptiles/:id | id | Get a reptile by ID |
| PUT | /api/reptiles/:id | id | Update a reptile by ID |
| DELETE | /api/reptiles/:id | id | Delete a reptile by ID |
|  GET	|  /api/fishes | - | Get all fishes |
| POST | /api/fishes | - | Create a new fish |
| GET | /api/fishes/:id | id | Get a fish by ID |
| PUT | /api/fishes/:id | id | Update a fish by ID |
| DELETE | /api/fisheh/:id | id | Delete a fish by ID |
|  GET	|  /api/avians | - | Get all avians |
| POST | /api/avians | - | Create a new avian |
| GET | /api/avians/:id | id | Get a avian by ID |
| PUT | /api/avians/:id | id | Update a avian by ID |
| DELETE | /api/avians/:id | id | Delete a avian by ID |

# Technologies
- Node.js
- Express.js
- mongoose


# Reflection
- What could you have done differently during the planning stages of your project to make the execution easier?
  During schema brainstorming, Better to remove certain required fields that were not essential — for example, 'habitat'. In real-world scenarios, having just a name field provides more flexibility and simplifies data input. The schema was adjusted to better reflect practical use cases.
- Were there any requirements that were difficult to implement? What do you think would make them easier to implement in future projects?
  The project scope should be narrowed, ensure the schema design aligns more closely with actual requirements and avoids unnecessary complexity.
- What would you add to or change about your application if given more time?
  While additional features can always be added, expanding the project scope significantly impacts the overall design. As core functionalities evolve, the architecture must adapt accordingly.
- Use this space to make notes for your future self about anything that you think is important to remember about this process, or that may aid you when attempting something similar again:
    NA