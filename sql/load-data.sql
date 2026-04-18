COPY movies FROM '/data/movies.csv' DELIMITER ',' CSV HEADER;
COPY users FROM '/data/users.csv' DELIMITER ',' CSV HEADER;
SELECT setval('users_user_id_seq',COALESCE((SELECT MAX(user_id) FROM users), 1),true);
COPY ratings(user_id, movie_id, rating, timestamp) FROM '/data/ratings.csv' DELIMITER ',' CSV HEADER;