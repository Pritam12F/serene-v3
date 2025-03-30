# Serene

Serene is a Notion-like application that features a powerful **rich text editor** and **real-time collaboration**. Designed for teams and individuals, Serene allows users to create, organize, and share notes, documents, and projects seamlessly.

This repository is a **Turborepo** monorepo that includes:

- A **Next.js app** for the frontend.
- An **Express WebSocket server** for real-time collaboration.
- Shared packages for enhanced modularity and reusability.

## Features

- 📝 **Rich Text Editing** – Powered by BlockNote for seamless writing and formatting.
- 🤝 **Live Collaboration** – Work with your team in real time.
- 📂 **Organized Workspaces** – Manage notes and projects effortlessly.
- 📡 **WebSocket-based Syncing** – Instant updates across devices.
- 🌐 **Multi-Device Support** – Access your workspace anywhere.

## Installation

Clone the repository:

```
  git clone https://github.com/Pritam12F/serene-v3.git
  cd serene-v3
```

Install dependencies:

```
  pnpm install
```

## Setup Environment Variables

Copy the example environment file:

```
  cp .env.example .env
```

Fill in the required fields inside `.env` with your credentials.

## Running the Application

### Development Mode

To start the application in development mode, run:

```
  pnpm run dev
```

### Production Mode

To build and start the production server, run:

```
  pnpm run build
  pnpm start
```

## Contributing

We welcome contributions! Feel free to fork the repo, create a branch, and submit a pull request.

---

💡 _Serene – Your collaborative workspace, reimagined._
