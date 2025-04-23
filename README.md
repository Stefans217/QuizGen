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

2. **Set Up Environment Variables**

   Create a `.env` file in the `./backend` directory of your project. You will use this file to store sensitive credentials like API keys and database URLs. Here's how to set it up:

   #### 🔑 Create Your OpenAI API Key or contact administrator for key
   - Go to [https://platform.openai.com/](https://platform.openai.com/) and log in or sign up.
   - Click your profile icon (top-right) → **API Keys** → **+ Create new secret key**.
   - Name the key (e.g., "Quizgen") and copy it.
   - Note: GPT-o3-mini, the model used in the app, requires funds available in your OpenAI account.

   #### 🧪 Set Your JWT Secret
   - Generate a random secret string (you can use a password manager or an online tool).
   - This secret is used to sign and verify JWT tokens for user authentication.

   #### 🌐 Create a Neon Database
   - Go to [https://neon.tech/](https://neon.tech/) and log in or create an account.
   - Click **New Project**, choose a name, and create a PostgreSQL database.
   - In the **Project Dashboard**, click **Connect** and copy the **PostgreSQL connection string**.
   - add the string to DATABASE_URL in the .env file.

   #### ✍️ Create the `.env` file
   Inside the `./backend` directory, create a file named `.env` and paste the following, replacing the placeholder values:

   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL=your_neon_connection_string_here
   JWT_SECRET=your_random_jwt_secret_here
     
5. **Navigate into the project directory**
   ```sh
   cd quizgen/app/
   ```

6. **Build and start the application using Docker Compose**
   ```sh
   docker compose up --build -d client_dev backend_dev
   ```

7. **Access the application**
   Open your browser and visit:
   ```
   http://localhost:3000
   ```
