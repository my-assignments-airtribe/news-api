# News API

This is a RESTful API for fetching news articles from multiple sources based on user preferences.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Introduction
### News Aggregator and User Management System

Welcome to the News Aggregator and User Management System! This Node.js project, built with Express.js, offers a comprehensive solution for aggregating and managing news articles while providing user registration and authentication features.

In today's digital age, staying updated with the latest news is crucial. This project not only allows users to customize their news preferences but also helps them keep track of articles they've read and mark their favorites. With a built-in caching mechanism to minimize external API calls and background updates to simulate real-time news aggregation, this system provides a robust and efficient news discovery experience.

Explore the README below to get started with installation, usage, and configuration instructions. Whether you're building a news aggregator app or enhancing your Node.js development skills, this project is a valuable resource for your journey.

## Features

- **User Registration**: Users can easily register and create accounts to personalize their news reading experience.

- **User Authentication**: Robust authentication using JWT (JSON Web Tokens) ensures secure access to user-specific data and actions.

- **News Preferences**: Users can customize their news preferences, ensuring they receive articles that align with their interests.

- **Caching Mechanism**: Implemented in-memory caching significantly reduces external API calls, resulting in faster response times and lower resource consumption.

- **Mark as "Read" or "Favorite"**: Users can mark news articles as "read" or "favorite" for later reference or to keep track of what they've already read.

- **Search Functionality**: Search for news articles based on keywords to quickly find relevant information.

- **Background Updates**: Periodic updates simulate a real-time news aggregator, ensuring that users always have access to fresh and current news content.

## Getting Started

Instructions for setting up your project locally.

### Prerequisites
Before you begin, ensure you have met the following requirements:

- **Node.js**: You should have Node.js installed on your machine.

- **Package Manager**: yarn or npm

<!-- - **MongoDB**: This project uses MongoDB as the database. You should have a running MongoDB instance or connection URI. You can download and install MongoDB from [mongodb.com](https://www.mongodb.com/).

```bash
# Install MongoDB on Ubuntu
sudo apt install -y mongodb
# Install MongoDB on macOS
brew install mongodb-community
# Check if MongoDB is running
$ sudo systemctl status mongod

``` -->
- **MongoDB Atlas**: This project uses MongoDB Atlas to host the database. You can create a free account on [mongodb.com](https://www.mongodb.com/) and create a cluster to host the database.

- **MongoDB Compass**: This project uses MongoDB Compass to visualize the database. You can download and install MongoDB Compass from [mongodb.com](https://www.mongodb.com/).

- **Docker** (Optional): This project uses docker to run the server. You should have docker installed on your machine. You can download and install docker from [docker.com](https://www.docker.com/).


- **News API Key**: To fetch news articles from external sources, you'll need an API key from a news API provider, such as [News API](https://newsapi.org/). Sign up and obtain an API key to use in the project.

- **Environment Variables**: Create a `.env` file in the root directory of the project and add the following environment variables:

  - `JWT_SECRET` - Secret key for JWT authentication
  - `NEWS_API_URL` - News API URL
  - `NEWS_API_SECRET` - News API key
  - `MONGODB_USERNAME` - MongoDB username
  - `MONGODB_PASSWORD` - MongoDB password
  - `MONGODB_CLUSTER_NAME` - MongoDB cluster name
  - `MONGODB_URL`- MongoDB connection URI

### Installation
1. Clone the repository or download the source code:

   ```bash
   `git clone https://github.com/my-assignments-airtribe/news-api.git`
   ```

2. Navigate to the project directory:

   ```bash
   `cd news-api`
   ```
<!-- 3. Install dependencies:

   ```bash
   `yarn install`
   ```
    or
    ```bash
    `npm install`
    ```
4. Start the server:

   ```bash
   `yarn start`
   ```
    or
    ```bash
    `npm start`
    ``` -->
5. Using docker:
    To start the server using docker, run the following commands:
    ```bash
      `docker build -t <image-name> .`
      `docker run -p 3000:3000 <image-name>`
    ```
    The server will be running on port `http://localhost:3000`.
## Usage

1. Use an API client (e.g., Postman or `curl`) to send HTTP requests to the API endpoints.

2. Register a new user using the /register endpoint.

3. Log in using the /login endpoint to obtain an authentication token.

4. Customize your news preferences using the /preferences endpoint.

5. Mark news articles as "read" or "favorite" using the respective endpoints.

6. Search for news articles based on keywords using the /news/search/:keyword endpoint.

7. Retrieve news articles, read articles, or favorite articles using the appropriate endpoints.

## API Endpoints

### Registration
- **Endpoint**: `/user/register`
- **Method**: `POST`
- **Description**: Register a new user
- **Request Body**:
  - `name`: User's name
  - `email`: User's email address
  - `password`: User's password

### Login
- **Endpoint**: `/user/login`
- **Method**: `POST`
- **Description**: Log in to an existing user account
- **Request Body**:
  - `email`: User's email address
  - `password`: User's password

### Preferences
- **Endpoint**: `/user/preferences`
- **Method**: `POST`
- **Description**: Set user's news preferences
- **Request Body**:
  - `categories`: Array of news categories
  - `sources`: Array of news sources

### Preferences
- **Endpoint**: `/user/preferences`
- **Method**: `GET`
- **Description**: Get user's news preferences

### Preferences
- **Endpoint**: `/user/preferences`
- **Method**: `DELETE`
- **Description**: Delete user's news preferences
- **Request Body**:
  - `categories`: Array of news categories
  - `sources`: Array of news sources
  - pass nothing in the body to delete all preferences

### News Articles
- **Endpoint**: `/news/articles`
- **Method**: `GET`
- **Description**: Get news articles based on user's preferences

### Read Articles
- **Endpoint**: `/news/read`
- **Method**: `GET`
- **Description**: Get news articles marked as "read" by the user

### Favorite Articles
- **Endpoint**: `/news/favorites`
- **Method**: `GET`
- **Description**: Get news articles marked as "favorite" by the user

### Mark as Read
- **Endpoint**: `/news/read`
- **Method**: `POST`
- **Description**: Mark a news article as "read"
- **Request Parameters**:
  - `articleUrl`: Url of the news article

### Mark as Favorite
- **Endpoint**: `/news/favorite`
- **Method**: `POST`
- **Description**: Mark a news article as "favorite"
- **Request Parameters**:
  - `articleUrl`: Url of the news article

### Search News
- **Endpoint**: `/news/search/:keyword`
- **Method**: `GET`
- **Description**: Search for news articles based on keywords
- **Request Parameters**:
  - `keyword`: Keyword to search for

## License

This project is licensed under the [MIT](LICENSE) - see the [LICENSE](LICENSE) file for details.
