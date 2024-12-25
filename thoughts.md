Why are we keep a genre table?

So we are keeping a genre table because we want to do recommendations based on the users watchlist right? and also the user's favorite movies and the genre of the movies they like. So we need to keep a genre table to do that.

So it will make sense to like the genre 

# Thinking about the watchlist and watchlist_movie table
So because the relationship between a movie and a watchlist table is many to many, i.e a movie can belong to several watchlist and a watchlist can have several movies. We need to create a watchlist_movie table to keep track of the relationship between the watchlist and the movie.

Now since we are only storing the id of the movies from tmdb and not the details, I could have just added it as a column in the watchlist tabe right?

But then when I am implementing recommendation system, I'd need the genre of the movies, so I have to have a watchlist_movie table which can store the date the movie was added to the watchlist. It will also have a column for the watchlist_id linked to the watchlist table. It will also have 

# Process of adding a movie to the watchlist.
1. When the user clicks on add this movie to a watchlist, we are recieving the watchlist id through the params and the tmdb_movie_id through the body.
2. We want to do two things, we want to add the movie to the watchlist and also add the genre of the movie so that we can do recommendations later.
3. We want to ensure that the watchlist exist in our watchlist table and also it is the user's watchlist.
4. After we confirmed that, we want to add the movie to the watchlist. How do we do this:
- The watchlist_movie table is where we store the record of a movie to a watchlist. So we want to add the movie to the watchlist_movie table.
- In the watchlist_movie table, we can check if the movie already exists for that watchlist, if it does return an error message saying movie already exist. i.e SELECT * FROM watchlist_movie WHERE watchlist_id = $1 AND tmdb_movie_id = $2, if it returns a row, then the movie already exists.
- If it doesnt return a row, then we can go ahead and add the movie to the watchlist_movie table. INSERT into watchlist_movie (watchlist_id, tmdb_movie_id, date_added) VALUES ($1, $2, $3) RETURNING *;
- Next we want to add the genre of the movie in the movie_genre table. We can get the genre of the movie from tmdb api.
- Then we want to ensure that the genre exist in our genre table. For each genre in the tmdb response, we want to check if it exist in the genre table. If it doesnt we add it to the genre table
- Then we want to add the genre to the movie_genre table. INSERT into movie_genre (tmdb_movie_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;
```ts
const response = {
  "id": 12345,
  "genres": [
    { "id": 28, "name": "Action" },
    { "id": 35, "name": "Comedy" }
  ]
}

for (let genre of response.genres) {
  const genre = await pool.query('SELECT * FROM genre WHERE id = $1', [genre.id]);
  if (genre.rows.length === 0) {
    // add the genre to the genre table
    INSERT into genre (id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING;
  }
}


```

# Process for deleting a movie from a watchlist
1. DELETE /watchlists/:watchlist_id/movies/:movie_id
2. So when the user clicks delete a movie, we receive the tmdb_movie_id and the watchlist_id through the params. 
3. We first check if the watchlist exist for the user. If it doesnt we return an error message.
4. Then we check if the movie exists in the watchlist_movie table for the watchlist_id. If it doesnt we return an error message that the movie does not exist in this watchlist.
5. If it does exist, we delete the movie from the watchlist_movie table. DELETE FROM watchlist_movie WHERE watchlist_id = $1 AND tmdb_movie_id = $2;
6. The return a success message.


# NOTE
1. I noticed that any time i leave sql for like a long time, I usually get confused on how many to many and join tables work. I need to keep practicing this so I don't forget it. But here is my thought process...

We select from the watchlist_movie table, and then we join the watchlist table. How does this work, thing is there could several watchlist in my table where I dont haev a movie in it yet right? So that means they dont exist in the watchlist_movie table. So when I am selecting and i am using join watchlist on watchlist.id = watchlist_movie.watchlist_id, what it means is that I am selecting al watchlist where the id actually exists in the watchlist_movie table. So pgAdmin prints out a table of all the watchlist that have movies in them