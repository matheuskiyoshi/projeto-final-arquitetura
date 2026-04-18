import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

# Carregar CSVs
movies_df = pd.read_csv('../data-lake/movies.csv')
users_df = pd.read_csv('../data-lake/users.csv')
ratings_df = pd.read_csv('../data-lake/ratings.csv')

# Limpar tabelas (reseta sequências)
with engine.begin() as conn:
    conn.execute(text("TRUNCATE TABLE ratings RESTART IDENTITY CASCADE"))
    conn.execute(text("TRUNCATE TABLE users RESTART IDENTITY CASCADE"))
    conn.execute(text("TRUNCATE TABLE movies RESTART IDENTITY CASCADE"))

# Inserir dados
movies_df.to_sql('movies', engine, if_exists='append', index=False)
users_df.to_sql('users', engine, if_exists='append', index=False)
ratings_df.to_sql('ratings', engine, if_exists='append', index=False)

# 🔁 Ajustar sequências para o próximo ID correto
with engine.begin() as conn:
    # Para a tabela users (coluna user_id)
    conn.execute(text("""
        SELECT setval('users_user_id_seq', COALESCE((SELECT MAX(user_id) FROM users), 1), true);
    """))
    # Para a tabela ratings (coluna id)
    conn.execute(text("""
        SELECT setval('ratings_id_seq', COALESCE((SELECT MAX(id) FROM ratings), 1), true);
    """))

print("✅ Dados carregados no PostgreSQL e sequências atualizadas!")