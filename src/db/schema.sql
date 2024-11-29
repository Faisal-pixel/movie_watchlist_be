create table users (
 id serial primary key,
 username varchar(50) unique,
 firstname varchar(50),
 lastname varchar(50),
 profile_picture varchar(255) unique,
 password_hash varchar(255) unique,
 email varchar(100) unique,
 created_at timestamp,
 last_login timestamp,
 bio text,
 notification_enabled boolean
)

create table movies (
id serial primary key,
title varchar(255),
description TEXT,
release_date DATE,
rating DECIMAL(2,1),
duration INTEGER,
lang VARCHAR(50),
director VARCHAR(50),
movie_cast JSONB,
poster_url VARCHAR(255),
trailer_url VARCHAR(255),
streaming_url VARCHAR(255),
age_rating VARCHAR(10),
country VARCHAR(50)
)

create table watchlist(
id serial primary key,
user_id integer references users(id),
created_at timestamp
)

create table watchlist_movie (
	watchlist_id integer references watchlist(id),
	movie_id integer references movies(id),
	primary key (watchlist_id, movie_id),
	added_at timestamp
)

create table genre (
id serial primary key,
name varchar(50)
)

create table genre_movies (
genre_id integer references genre(id),
movie_id integer references movies(id),
primary key (genre_id, movie_id)
)

create table streaks (
id serial primary key,
user_id integer references users(id),
streak_count integer unique,
start_streak_date timestamp,
last_streak_update timestamp
)