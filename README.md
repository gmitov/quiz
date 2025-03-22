# Hair Loss Assessment Quiz

A responsive web application that guides users through an assessment questionnaire to determine eligibility for treatment. Built with Next.js and TypeScript, featuring modular CSS, comprehensive testing, and responsive design.

## Features

- **Interactive Quiz Flow**: Multi-step assessment with dynamic navigation
- **Conditional Logic**: Different paths based on user responses with rejection criteria
- **Persistent State**: Session storage to preserve quiz progress
- **Comprehensive Testing**: End-to-end tests with Playwright and unit tests with Jest

## Table of Contents

- [Hair Loss Assessment Quiz](#hair-loss-assessment-quiz)
    - [Features](#features)
    - [Table of Contents](#table-of-contents)
    - [Getting Started](#getting-started)
        - [Prerequisites](#prerequisites)
        - [Installation](#installation)
    - [Development](#development)
        - [Running the Application](#running-the-application)
        - [Project Structure](#project-structure)
    - [Testing](#testing)
        - [Running Unit Tests](#running-unit-tests)
        - [Running E2E Tests](#running-e2e-tests)
    - [Deployment](#deployment)
    - [Technical Details](#technical-details)
        - [Technology Stack](#technology-stack)
        - [Architecture](#architecture)

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/gmitov/quiz.git
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

## Development

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Project Structure

```
hair-loss-assessment/
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   └── quiz/          # Quiz API endpoint
│   │   ├── components/        # React components
│   │   │   └── Quiz/          # Quiz-specific components
│   │   ├── quiz/              # Quiz pages
│   │   │   ├── [questionId]/  # Dynamic question pages
│   │   │   └── results/       # Quiz results page
│   │   └── sections/          # Page sections
│   │       ├── ContentHeader/ # Header components
│   │       └── Footer/        # Footer components
│   └── styles/                # Global styles
├── public/                    # Static assets
├── tests/                     # E2E tests (Playwright)
├── playwright.config.ts       # Playwright configuration
├── jest.config.js             # Jest configuration
└── package.json               # Project dependencies
```

## Testing

### Running Unit Tests

Unit tests are implemented with Jest and React Testing Library:

```bash
# Run jest test
npm run test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Running E2E Tests

End-to-end tests are implemented with Playwright:

```bash
# Run all E2E tests
npx playwright test
npm run test:e2e

# Run E2E tests with UI
npx playwright test --ui

# Run E2E tests with browser visible
npx playwright test --headed

# Run E2E tests in debug mode
npx playwright test --debug
```

## Deployment

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Technical Details

### Technology Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules (SCSS)
- **State Management**: React Context API
- **Testing**: Jest, React Testing Library, Playwright
- **Storage**: Session Storage for persistence

### Architecture

The application follows these architectural principles:

1. **Component-based architecture**: Modular components with clear responsibilities
2. **Context-based state management**: Global quiz state managed through React Context
3. **CSS Modules**: Scoped styling to prevent conflicts
4. **Server Components**: Utilizing Next.js App Router for efficient rendering
5. **Progressive Enhancement**: Works with or without JavaScript
