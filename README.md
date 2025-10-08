# Sustainable Habit Tracking API (Gamified) 🌱📱

## Project Overview

This project delivers a robust and scalable API designed to incentivize and track sustainable habits through gamification. Built with a focus on performance, maintainability, and best practices, it serves as a strong portfolio piece demonstrating senior-level development capabilities.

## 1. Business Context

### Problem Statement (Macro)

Many individuals aspire to adopt more sustainable habits (e.g., recycling, using public transport, conserving water) but often struggle with consistency due to a lack of ongoing motivation and tangible feedback on their efforts.

### Proposed Solution

A gamified API that addresses this challenge by:
*   **Habit Registration**: Users can easily register their daily sustainable actions (e.g., "cycled to work," "recycled plastic").
*   **Points System**: Each recorded action earns users points, providing immediate positive reinforcement.
*   **Gamification & Engagement**: Weekly and monthly rankings foster a competitive yet supportive environment, significantly boosting user engagement and adherence to habits.
*   **Impact Reports**: Provides estimated reports on environmental impact, such as CO₂ saved and liters of water conserved, offering a clear visualization of individual contributions.
*   **Efficacy Demonstration**: The API is designed to generate aggregated reports and simulate user data, showcasing its potential for real-world impact.

## 2. Technical Stack

This application leverages a modern and performant stack, chosen for its scalability, developer experience, and alignment with industry best practices.

*   **Backend**: `Node.js` (TypeScript) with `Fastify`
    *   **Justification**: Fastify was chosen over more common alternatives like Express.js for its superior performance, lower overhead, and robust plugin architecture. This demonstrates a commitment to building highly efficient and scalable microservices. TypeScript ensures type safety and improves code quality and maintainability.
    *   **Benefits**: High performance, low overhead, strong plugin system, excellent developer experience with TypeScript.
    *   **Tradeoffs**: Smaller ecosystem compared to Express.js, potentially requiring more custom solutions or a steeper learning curve for developers unfamiliar with it.

*   **Database**: `PostgreSQL`
    *   **Justification**: A powerful, open-source relational database known for its reliability, data integrity, and advanced features. It's ideal for managing structured data like user profiles, habits, logs, and complex reporting requirements (e.g., rankings, aggregated impact data).
    *   **Benefits**: ACID compliance, robust feature set, strong community support, excellent for complex queries and relational data.
    *   **Tradeoffs**: Can be more resource-intensive than NoSQL alternatives for certain use cases, requires careful schema design.

*   **ORM**: `Prisma`
    *   **Justification**: A next-generation ORM that provides type-safe database access, auto-generated client, and powerful migration capabilities. It significantly reduces boilerplate code and enhances developer productivity while maintaining strong database schema control.
    *   **Benefits**: Type safety, intuitive API, powerful migrations, improved developer productivity.
    *   **Tradeoffs**: Introduces an additional layer of abstraction and a build step for client generation. While generally beneficial, it can add complexity for very simple database interactions or if fine-grained SQL control is frequently needed.

*   **Authentication**: `JWT` (JSON Web Tokens)
    *   **Justification**: A standard for securely transmitting information between parties as a JSON object. It's stateless, scalable, and widely adopted for API authentication, providing a secure and efficient way to manage user sessions.
    *   **Benefits**: Stateless, scalable, widely supported, flexible.
    *   **Tradeoffs**: Requires careful handling of token expiration and revocation (though less critical for short-lived tokens), sensitive data should not be stored in the token payload.

*   **Validation**: `Zod`
    *   **Justification**: A TypeScript-first schema declaration and validation library. Zod provides robust runtime validation with static type inference, ensuring data integrity from the API boundary to the application core. This significantly reduces bugs related to incorrect data types and structures.
    *   **Benefits**: Superior type safety, excellent developer experience, clear and composable schemas, runtime validation.
    *   **Tradeoffs**: Integrating Zod with Fastify's native JSON Schema validation requires a conversion step (`zod-to-json-schema`), adding a slight layer of complexity compared to using raw JSON Schema directly. However, the benefits of type safety and developer experience significantly outweigh this.

*   **Testing**: `Jest`
    *   **Justification**: A popular and comprehensive JavaScript testing framework. It's used for unit testing services and repositories, ensuring the correctness and reliability of the core business logic. Jest's mocking capabilities are crucial for isolating units of code during testing.
    *   **Benefits**: Fast, feature-rich (assertions, mocking, coverage), widely adopted, good for unit and integration tests.

*   **Scheduler**: `node-cron`
    *   **Justification**: A lightweight library for scheduling tasks directly within the Node.js application. It's used for automating weekly report generation, demonstrating asynchronous task management within the API.
    *   **Benefits**: Simple to use for in-process scheduling, no external dependencies for basic cron jobs.
    *   **Tradeoffs**: Not suitable for distributed systems or high-availability scenarios where a dedicated job scheduler (e.g., Kue, BullMQ, AWS Lambda with EventBridge) would be more appropriate. For this project's scope, it's a pragmatic choice.

## 3. Architectural Decisions: Hexagonal Architecture (Ports & Adapters)

The application is structured using a Hexagonal Architecture, also known as Ports and Adapters. This pattern emphasizes a strong separation between the core business logic and external concerns.

### Core Principles

*   **Ports**: Define the interfaces through which the application interacts with the outside world. These are technology-agnostic.
*   **Adapters**: Implement the ports, translating technology-specific calls into calls to the application's core.

### Implementation Details

*   **Domain Layer (`src/core/domain`)**:
    *   Contains the core business entities (e.g., `User`, `Habit`, `Report`, `HabitLog`).
    *   These are plain TypeScript interfaces, free from any framework or database specifics, representing the pure business concepts.
    *   **Benefit**: High cohesion, low coupling, business logic remains untainted by infrastructure details.

*   **Application Layer (`src/core/application`)**:
    *   Defines the application's use cases and business rules.
    *   Includes **Service Interfaces** (primary ports) that define what the application can do (e.g., `UserService`, `HabitService`).
    *   Includes **Repository Interfaces** (secondary ports) that define how the application interacts with data storage (e.g., `UserRepository`, `HabitRepository`).
    *   **Benefit**: Business logic is encapsulated and testable in isolation. Changes to external systems (database, web framework) do not impact this layer.

*   **Infrastructure Layer (`src/infrastructure`)**:
    *   Implements the "adapters" that connect the core to external technologies.
    *   **`persistence/prisma`**: Contains concrete implementations of repository interfaces (e.g., `PrismaUserRepository`) using `Prisma ORM` to interact with `PostgreSQL`. This is a secondary adapter.
    *   **`http`**: Contains `Fastify`-specific implementations for controllers and routes, acting as the primary adapter for external clients.
    *   **Benefit**: External concerns are isolated. Swapping out a database or web framework would only require changing the adapters in this layer, not the core logic.

*   **Dependency Injection (`src/container.ts`)**:
    *   A centralized container (`src/container.ts`) manages the instantiation and wiring of all dependencies (PrismaClient, repositories, services, and even routes).
    *   **Benefit**: Promotes loose coupling, simplifies the application's bootstrap process, and makes it easy to swap implementations (e.g., for testing with mock repositories).

*   **Fastify Plugins (`src/plugins`)**:
    *   Fastify's plugin system is used to register core functionalities (validation, authentication) and domain-specific modules (e.g., `user.plugin.ts`, `habit.plugin.ts`).
    *   **Benefit**: Enhances modularity, allows for clear separation of concerns within the Fastify application, and promotes reusability.

### Architectural Diagram (Textual Representation)

```
+-------------------------------------------------------------------+
|                           External World                          |
|                                                                   |
|  +-----------------+    +-----------------+    +-----------------+
|  |   Web Clients   |    |   CLI Tools     |    |   Other APIs    |
|  +-----------------+    +-----------------+    +-----------------+
|           |                      |                      |
|           |                      |                      |
|           v                      v                      v
|  +-----------------------------------------------------------------+
|  |                       Primary Adapters (HTTP)                   |
|  |                                                                 |
|  |  +-----------------+  +-----------------+  +-----------------+ |
|  |  |  User Routes    |  |  Habit Routes   |  |  Report Routes  | |
|  |  |  (Fastify)      |  |  (Fastify)      |  |  (Fastify)      | |
|  |  +-----------------+  +-----------------+  +-----------------+ |
|  |           |                      |                      |      |
|  |           v                      v                      v      |
|  |  +-----------------------------------------------------------------+
|  |  |                     Application Layer (Services)                |
|  |  |                                                                 |
|  |  |  +-----------------+  +-----------------+  +-----------------+ |
|  |  |  |  UserService    |  |  HabitService   |  |  ReportService  | |
|  |  |  |  (Use Cases)    |  |  (Use Cases)    |  |  (Use Cases)    | |
|  |  |  +-----------------+  +-----------------+  +-----------------+ |
|  |  |           |                      |                      |      |
|  |  |           v                      v                      v      |
|  |  |  +-----------------------------------------------------------------+
|  |  |                     Domain Layer (Entities & Interfaces)          |
|  |  |                                                                 |
|  |  |  +-----------------+  +-----------------+  +-----------------+ |
|  |  |  |  User Entity    |  |  Habit Entity   |  |  Report Entity  | |
|  |  |  |  UserRepository |  |  HabitRepository|  |  ReportRepository| |
|  |  |  +-----------------+  +-----------------+  +-----------------+ |
|  |  |                                                                 |
|  |  +-----------------------------------------------------------------+
|  |           |                      |                      |      |
|  |           v                      v                      v      |
|  |  +-----------------------------------------------------------------+
|  |                       Secondary Adapters (Persistence)            |
|  |                                                                 |
|  |  +-----------------+  +-----------------+  +-----------------+ |
|  |  |  PrismaUserRepo |  |  PrismaHabitRepo|  |  PrismaReportRepo| |
|  |  |  (Prisma ORM)   |  |  (Prisma ORM)   |  |  (Prisma ORM)   | |
|  |  +-----------------+  +-----------------+  +-----------------+ |
|  |           |                                                     |
|  |           v                                                     |
|  |  +-----------------------------------------------------------------+
|  |  |                       Database (PostgreSQL)                     |
|  |  +-----------------------------------------------------------------+
|                                                                   |
+-------------------------------------------------------------------+
```

### Flow Diagram: User Registration

```mermaid
graph TD
    A[Client Sends POST /api/users/register] --> B{Fastify Router};
    B --> C{Zod Validation Plugin};
    C -- Valid Data --> D{UserController.registerUser};
    D --> E{UserService.createUser};
    E --> F{Hash Password (bcrypt)};
    F --> G{UserRepository.create};
    G -- Persist User --> H[Database (PostgreSQL)];
    H --> I{UserRepository.create returns User};
    I --> J{UserService.createUser returns User};
    J --> K[UserController.registerUser returns User];
    K --> L[Client Receives 201 Created];
    C -- Invalid Data --> M[Client Receives 400 Bad Request];
```

## 4. Technical Debts & Future Improvements

As a senior developer, it's important to acknowledge areas for future enhancement and potential technical debt:

### Identified Technical Debts

*   **Scheduler Calculation Logic**: The `co2Saved` and `waterSaved` calculations in `src/utils/scheduler.ts` are currently placeholders.
    *   **Impact**: Reports provide estimated, not accurate, environmental impact.
    *   **Contour**: For a production system, this would require a detailed mapping of habit categories to specific environmental impact metrics and potentially external data sources for accurate calculations.
*   **Comprehensive Error Handling**: While Zod handles validation errors, a more granular and centralized error handling strategy could be implemented for other types of application errors (e.g., database errors, business logic errors) to provide more specific and actionable feedback to clients.
    *   **Impact**: Generic 500 errors might obscure the root cause of issues.
    *   **Contour**: Implement custom error classes and a global Fastify error handler that maps these classes to appropriate HTTP status codes and error messages.
*   **Advanced Gamification**: The current gamification is limited to points and rankings.
    *   **Impact**: Could be more engaging with additional features.
    *   **Contour**: Introduce badges, achievements, streaks, challenges, and social sharing features.
*   **Real-time Updates**: User points and rankings are updated on demand or weekly.
    *   **Impact**: Users might not see immediate feedback on their progress.
    *   **Contour**: Implement WebSockets or server-sent events (SSE) for real-time updates on user dashboards.
*   **Configuration Management**: Environment variables are loaded via `dotenv`. For complex deployments, a more sophisticated configuration management system (e.g., `nconf`, `config`) might be beneficial.
    *   **Impact**: Managing many environment variables can become cumbersome.
    *   **Contour**: Centralize and validate configuration using a dedicated library.

### Future Enhancements

*   **User Management**: Implement features like password reset, email verification, and user roles.
*   **Admin Dashboard**: A separate interface for administrators to manage users, habits, and review reports.
*   **Notifications**: Implement push notifications or email alerts for ranking changes, new challenges, or report availability.
*   **Integration with External APIs**: Connect to external services for more accurate environmental data or social sharing.
*   **GraphQL API**: Offer a GraphQL endpoint alongside the REST API for more flexible data fetching.

## 5. Getting Started

Follow these steps to set up and run the application locally:

1.  **Prerequisites**:
    *   Node.js (v18 or higher)
    *   npm (or yarn)
    *   PostgreSQL database

2.  **Clone the Repository**:
    ```bash
    git clone [repository-url]
    cd node-fastfy-app
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the project root with your database connection string and JWT secret:
    ```
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/your_database_name?schema=fastify-app"
    JWT_SECRET="supersecretjwtkey" # Replace with a strong, unique secret in production
    JWT_EXPIRES_IN="1h"
    ```

4.  **Install Dependencies**:
    ```bash
    npm install
    ```

5.  **Run Database Migrations**:
    ```bash
    npm run migrate:dev
    ```

6.  **Start the Application (Development Mode)**:
    ```bash
    npm run dev
    ```
    The API will be listening on `http://localhost:3000`. `ts-node-dev` provides hot-reloading for a smooth development experience.

7.  **Build for Production**:
    ```bash
    npm run build
    ```

8.  **Start the Application (Production Mode)**:
    ```bash
    npm run start
    ```

## 6. API Endpoints Example

Here's an example of how to interact with the API. You can use tools like Insomnia or Postman.

### Register User

*   **URL**: `http://localhost:3000/api/users/register`
*   **Method**: `POST`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "email": "test@example.com",
      "password": "password123",
      "username": "testuser"
    }
    ```

### Login User

*   **URL**: `http://localhost:3000/api/users/login`
*   **Method**: `POST`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "email": "test@example.com",
      "password": "password123"
    }
    ```
    *   **Response**: Returns a `user` object and a `token`. Use this `token` for authenticated requests.

### Get User Profile (Authenticated)

*   **URL**: `http://localhost:3000/api/users/:id` (replace `:id` with the actual user ID)
*   **Method**: `GET`
*   **Headers**:
    *   `Authorization: Bearer YOUR_JWT_TOKEN` (replace `YOUR_JWT_TOKEN` with the token obtained from login)

## Running Tests

To run all unit tests and ensure the application's core logic is sound:
```bash
npm test
