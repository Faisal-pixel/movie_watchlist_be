--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: genre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genre (
    id integer NOT NULL,
    name character varying(50)
);


ALTER TABLE public.genre OWNER TO postgres;

--
-- Name: genre_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.genre_id_seq OWNER TO postgres;

--
-- Name: genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genre_id_seq OWNED BY public.genre.id;


--
-- Name: movie_genre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie_genre (
    id integer NOT NULL,
    tmdb_movie_id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.movie_genre OWNER TO postgres;

--
-- Name: movie_genre_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movie_genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movie_genre_id_seq OWNER TO postgres;

--
-- Name: movie_genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movie_genre_id_seq OWNED BY public.movie_genre.id;


--
-- Name: streaks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.streaks (
    id integer NOT NULL,
    user_id integer,
    streak_count integer,
    start_streak_date timestamp without time zone,
    last_streak_update timestamp without time zone
);


ALTER TABLE public.streaks OWNER TO postgres;

--
-- Name: streaks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.streaks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.streaks_id_seq OWNER TO postgres;

--
-- Name: streaks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.streaks_id_seq OWNED BY public.streaks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50),
    firstname character varying(50),
    lastname character varying(50),
    profile_picture character varying(255),
    password_hash character varying(255),
    email character varying(100),
    created_at timestamp without time zone,
    last_login timestamp without time zone,
    bio text,
    notification_enabled boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: watchlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.watchlist (
    id integer NOT NULL,
    user_id integer,
    created_at timestamp without time zone,
    watchlist_name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.watchlist OWNER TO postgres;

--
-- Name: watchlist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.watchlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.watchlist_id_seq OWNER TO postgres;

--
-- Name: watchlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.watchlist_id_seq OWNED BY public.watchlist.id;


--
-- Name: watchlist_movie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.watchlist_movie (
    id integer NOT NULL,
    watchlist_id integer NOT NULL,
    tmdb_movie_id integer NOT NULL,
    added_at timestamp without time zone NOT NULL
);


ALTER TABLE public.watchlist_movie OWNER TO postgres;

--
-- Name: watchlist_movie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.watchlist_movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.watchlist_movie_id_seq OWNER TO postgres;

--
-- Name: watchlist_movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.watchlist_movie_id_seq OWNED BY public.watchlist_movie.id;


--
-- Name: genre id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre ALTER COLUMN id SET DEFAULT nextval('public.genre_id_seq'::regclass);


--
-- Name: movie_genre id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genre ALTER COLUMN id SET DEFAULT nextval('public.movie_genre_id_seq'::regclass);


--
-- Name: streaks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.streaks ALTER COLUMN id SET DEFAULT nextval('public.streaks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: watchlist id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlist ALTER COLUMN id SET DEFAULT nextval('public.watchlist_id_seq'::regclass);


--
-- Name: watchlist_movie id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlist_movie ALTER COLUMN id SET DEFAULT nextval('public.watchlist_movie_id_seq'::regclass);


--
-- Data for Name: genre; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genre (id, name) FROM stdin;
28	Action
14	Fantasy
35	Comedy
12	Adventure
18	Drama
10749	Romance
878	Science Fiction
10751	Family
16	Animation
\.


--
-- Data for Name: movie_genre; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movie_genre (id, tmdb_movie_id, genre_id) FROM stdin;
1	845781	28
2	845781	14
3	845781	35
7	558449	28
8	558449	12
9	558449	18
10	1156593	10749
11	1156593	18
12	939243	28
13	939243	878
14	939243	35
15	939243	10751
28	402431	18
29	402431	10749
30	402431	14
31	839033	16
32	839033	14
33	839033	28
34	839033	12
\.


--
-- Data for Name: streaks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.streaks (id, user_id, streak_count, start_streak_date, last_streak_update) FROM stdin;
2	1	1	2025-01-08 00:00:00	2025-01-08 00:00:00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, firstname, lastname, profile_picture, password_hash, email, created_at, last_login, bio, notification_enabled) FROM stdin;
1	code_crushed	Faisal	Adams	http://res.cloudinary.com/dpuzj4j34/image/upload/v1734023826/mw_profile_pictures/user_1_05bffe90-425c-4da5-85d2-a782483a3a95.jpg	$2b$10$h8X7zlZ8Nog2yAoG7NRJPePn/NbgJgoC1DIAx4Bm2sNdeE.WzPoza	adamsfaisal001@gmail.com	2024-11-28 17:38:45.255	2025-01-08 14:57:17.766	\N	f
4	left_boy	Faisal	Adams	\N	$2b$10$F1nuNQjc4oSek06M4AgmDOeYyZSybzFoyWfrmrCpcWfE7/JIVkHPK	adamsfaisal2003@gmail.com	2024-12-07 00:14:33.342	2024-12-07 00:14:33.471	\N	f
\.


--
-- Data for Name: watchlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.watchlist (id, user_id, created_at, watchlist_name, description) FROM stdin;
13	1	2024-12-12 23:27:32.94	Dummy 5	Just 5
1	1	2024-11-30 16:53:03.818	Batman movies	List of batman movies
9	1	2024-12-12 23:13:44.391	Dummy	jsnd sj i sd cijsak
14	1	2024-12-13 00:31:32.313	Dummy 7	Bad boy checking something
12	1	2024-12-12 23:26:54.814	Dummy 4	just 4 adding m
\.


--
-- Data for Name: watchlist_movie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.watchlist_movie (id, watchlist_id, tmdb_movie_id, added_at) FROM stdin;
5	1	845781	2024-12-25 13:34:06.129
7	1	558449	2025-01-05 14:24:23.858
8	1	1156593	2025-01-05 14:28:35.756
9	1	939243	2025-01-05 14:32:07.926
10	13	939243	2025-01-05 15:16:31.577
11	13	558449	2025-01-05 15:18:48.043
12	13	1156593	2025-01-05 15:19:15.38
13	13	845781	2025-01-05 15:19:23.99
14	13	402431	2025-01-05 15:20:13.885
15	13	839033	2025-01-05 15:20:19.525
16	9	558449	2025-01-05 15:21:00.652
17	12	558449	2025-01-05 15:21:00.721
18	14	558449	2025-01-05 15:26:56.137
19	9	1156593	2025-01-05 15:30:23.54
20	14	1156593	2025-01-08 14:58:28.127
21	12	1156593	2025-01-08 14:58:28.198
\.


--
-- Name: genre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genre_id_seq', 1, false);


--
-- Name: movie_genre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movie_genre_id_seq', 49, true);


--
-- Name: streaks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.streaks_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: watchlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.watchlist_id_seq', 14, true);


--
-- Name: watchlist_movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.watchlist_movie_id_seq', 21, true);


--
-- Name: genre genre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre
    ADD CONSTRAINT genre_pkey PRIMARY KEY (id);


--
-- Name: movie_genre movie_genre_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genre
    ADD CONSTRAINT movie_genre_id_key UNIQUE (id);


--
-- Name: movie_genre movie_genre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genre
    ADD CONSTRAINT movie_genre_pkey PRIMARY KEY (tmdb_movie_id, genre_id);


--
-- Name: streaks streaks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.streaks
    ADD CONSTRAINT streaks_pkey PRIMARY KEY (id);


--
-- Name: streaks streaks_streak_count_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.streaks
    ADD CONSTRAINT streaks_streak_count_key UNIQUE (streak_count);


--
-- Name: watchlist unique_watchlist_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT unique_watchlist_name UNIQUE (watchlist_name);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_password_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_password_hash_key UNIQUE (password_hash);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_profile_picture_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_profile_picture_key UNIQUE (profile_picture);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: watchlist_movie watchlist_movie_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlist_movie
    ADD CONSTRAINT watchlist_movie_id_key UNIQUE (id);


--
-- Name: watchlist_movie watchlist_movie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlist_movie
    ADD CONSTRAINT watchlist_movie_pkey PRIMARY KEY (watchlist_id, tmdb_movie_id);


--
-- Name: watchlist watchlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_pkey PRIMARY KEY (id);


--
-- Name: movie_genre movie_genre_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genre
    ADD CONSTRAINT movie_genre_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genre(id) ON DELETE CASCADE;


--
-- Name: streaks streaks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.streaks
    ADD CONSTRAINT streaks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: watchlist_movie watchlist_movie_watchlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlist_movie
    ADD CONSTRAINT watchlist_movie_watchlist_id_fkey FOREIGN KEY (watchlist_id) REFERENCES public.watchlist(id);


--
-- Name: watchlist watchlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

