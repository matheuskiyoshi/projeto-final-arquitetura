# MovieFlix - Plataforma de Avaliação de Filmes

### Projeto de Arquitetura de Software

- **PostgreSQL** – banco de dados relacional
- **ETL em Python** – coleta de dados da API OMDB e geração de usuários/avaliações falsas
- **API Node.js** – backend com rotas para filmes, avaliações e consulta à OMDB
- **Nginx** – proxy reverso para servir a aplicação

## 1. Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) (versão 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- Conta na [OMDB API](http://www.omdbapi.com/apikey.aspx) para obter uma chave de acesso (gratuita)

## Como executar o projeto

### Clone o repositório

```bash
git clone https://github.com/matheuskiyoshi/projeto-final-arquitetura.git
cd projeto-final-arquitetura
```

## 2. Crie o arquivo de ambiente .env

Na raiz do projeto (mesmo diretório do docker-compose.yml), crie um arquivo .env com o seguinte conteúdo:

OMDB_API_KEY=sua_chave_aqui

Importante: Substitua "sua_chave_aqui" pela chave real obtida no site da [OMDB API](https://omdbapi.com/apikey.aspx)

## 3. Inicie os containers

```bash
   docker-compose up
```

## 4. Acesse a aplicação

Frontend/Proxy: http://localhost

API diretamente: http://localhost:10000

## Fluxo e interação com o Usuário

- Usuário acessa http://localhost

- A página carrega para listar os filmes.

### O usuário pode:

- Buscar um filme na OMDB: digita o título, a página chama OMDB e exibe os dados.
- Adicionar avaliação: seleciona um filme, digita uma nota e seu nome. O frontend envia POST /api/avaliacoes. O backend localiza o filme pelo título (case-insensitive), cria o usuário se não existir e insere a avaliação.
- Cadastrar novo filme: permite inserir filmes manualmente.
- Todas as avaliações e novos filmes são persistidos no PostgreSQL.

### CI/CD com GitHub Actions e Docker Hub

- O projeto utiliza um pipeline automatizado para build e publicação das imagens Docker no [Docker Hub](https://hub.docker.com/repositories/matheusalimuracaixa), garantindo que qualquer commit na branch main gere imagens atualizadas prontas para uso.
