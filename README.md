# QuizGen

A web application for generating quizzes in QTI 2.2 format.

## Setup Instructions

Follow these steps to set up and run the project locally:

### Prerequisites

Ensure you have the following installed on your system:
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/)

### Installation

1. **Clone the repository**
   ```sh
   git clone <repository-url>
   ```

2. **Navigate into the project directory**
   ```sh
   cd quizgen/app/
   ```

3. **Build and start the application using Docker Compose**
   ```sh
   docker compose up --build -d client_dev backend_dev
   ```

4. **Access the application**
   Open your browser and visit:
   ```
   http://localhost:3000
   ```
