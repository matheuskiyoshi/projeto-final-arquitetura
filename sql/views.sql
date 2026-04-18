CREATE VIEW top_filmes AS
SELECT m.title, AVG(r.rating) as media
FROM ratings r
JOIN movies m ON r.movie_id = m.movie_id
GROUP BY m.title
ORDER BY media DESC
LIMIT 10;
