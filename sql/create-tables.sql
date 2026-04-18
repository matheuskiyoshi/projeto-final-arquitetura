CREATE TABLE movies (
    movie_id TEXT PRIMARY KEY,
    title TEXT,
    year TEXT,
    genre TEXT,
    director TEXT
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    movie_id TEXT REFERENCES movies(movie_id),
    rating INTEGER,
    timestamp TEXT
);