# URL SHORTENING

A simple URL shortening service system using Nodejs and Mysql as the database.

> This project is related to [https://roadmap.sh/projects/url-shortening-service](https://roadmap.sh/projects/url-shortening-service), For the database here it is **recommended to use Mysql database version 8** or above!

## API Endpoint

### 1. Create a shortened URL

**Request**

- Method: POST
- URL: /shorten
- Data:
  ```json
  {
    "url": "https://example.com"
  }
  ```

**Response**

- Status: 201
- Data:
  ```json
  {
    "id": "1",
    "url": "https://www.example.com/posts/blablabla/that-long",
    "shortCode": "abc123",
    "createdAt": "2024-10-21T12:00:00Z",
    "updatedAt": "2024-10-21T12:00:00Z"
  }
  ```

### 2. Retrieve the original URL from a short URL

**Request**

- Method: GET
- URL: /shorten/:code

**Response**

- Status: 200 / 404
- Data:
  ```json
  {
    "id": "1",
    "url": "https://www.example.com/posts/blablabla/that-long",
    "shortCode": "abc123",
    "createdAt": "2024-10-21T12:00:00Z",
    "updatedAt": "2024-10-21T12:00:00Z"
  }
  ```

### 3. Update an existing short URL

**Request**

- Method: PUT
- URL: /shorten/:code
- Data:
  ```json
  {
    "url": "https://www.example.com/posts/blablabla/yap"
  }
  ```

**Response**

- Status: 200 / 400 / 404
- Data:
  ```json
  {
    "id": "1",
    "url": "https://www.example.com/posts/blablabla/yap",
    "shortCode": "abc123",
    "createdAt": "2024-10-21T12:00:00Z",
    "updatedAt": "2024-10-21T12:00:00Z"
  }
  ```

### 4. Delete an existing short URL

**Request**

- Method: DELETE
- URL: /shorten/:code

**Response**

- Status: 200 / 404
- Data:
  ```json
  {
    "success": true
  }
  ```

### 5. Get statistics for a short URL 

**Request**

- Method: GET
- URL: /shorten/:code/stats

**Response**

- Status: 200 / 404
- Data:
  ```json
  {
    "id": "1",
    "url": "https://www.example.com/posts/blablabla/yap",
    "shortCode": "abc123",
    "createdAt": "2024-10-21T12:00:00Z",
    "updatedAt": "2024-10-21T12:00:00Z",
    "accessCount": 9420
  }
  ```
