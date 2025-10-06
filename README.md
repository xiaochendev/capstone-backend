# Search a movie in OMDB
- allow user to search a movie in OMDB by different methods, ex. movie title, or star war characters
- displayed popular movies in OMDB

- Used third party APIs key: 
    1. Get FREE OMDB_API_KEY: [link text](https://www.omdbapi.com/apikey.aspx)


# Steps
1. Copy rerepository to your local file
```
git clone https://github.com/xiaochendev/secRepo.git
```

2. Change to lab direcotry, ex. secRepo
```
cd secRepo
```

3. Create .env in the dir 
```
touch .env
```

4. Add variables in .env
```
VITE_OMDB_API_KEY=<YOUR_OMDB_API_KEY>
```

5. Install all the required dependencies
```
npm install
```

6. Start the server
```
npm run dev
```

7. Then, Its viewable in your browser by entering
```
localhost:5173
```

# Technologies
- React

