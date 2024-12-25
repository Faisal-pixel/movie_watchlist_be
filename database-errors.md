# ERROR:
CREATE Table movie_genre (
	id serial not null unique,
	tmdb_movie_id integer unique not null,
	genre_id integer not null,
	primary key (tmdb_movie_id, genre_id),
	foreign key (tmdb_movie_id) references watchlist_movie (tmdb_movie_id) on delete cascade,
	foreign key (genre_id) references genre (id) on delete cascade
)

Trying to run the above and I am getting the below error:

<strong>ERROR:<strong>  there is no unique constraint matching given keys for referenced table "watchlist_movie" 

SQL state: 42830

Below is the schema for the watchlist_movie table:

create table watchlist_movie (
	id SERIAL UNIQUE not null,
	watchlist_id integer references watchlist(id),
	tmdb_movie_id integer unique not null,
	primary key (watchlist_id, tmdb_movie_id), -- This ensures uniqueness of the tmdb_movie_id in the watchlist_movie table for a given watchlist_id --
	added_at timestamp not null
)

# SOLUTION:
The error arises because the FOREIGN KEY (tmdb_movie_id) reference in your movie_genre table requires the referenced column in watchlist_movie (tmdb_movie_id) to have a unique or primary key constraint. However, in your watchlist_movie table, the uniqueness of tmdb_movie_id is defined only in combination with watchlist_id (as part of the composite primary key), not as a standalone unique column.

I basically realised i set the tmdb_movie_id as unique in the watchlist_movie table. This shouldnt be the case because a movie can belong to several watchlist. So I removed the unique constraint on the tmdb_movie_id in the watchlist_movie table and then I was able to create the movie_genre table successfully.

