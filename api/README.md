# Scorekeepr v4 API

## Requirements

- nodejs v16.14.0+
- npm v8.7.0+
- docker or a mongodb readily available

## Environment Variables

The API needs a `.env` file present in the API's root directory (`/api/.env`)

### Variables to set

| Variable  | Value  | Description  |
|---|---|---|
| `DATABASE_URL`  | `http://localhost:27017/your-database`  | Used to connect to a MongoDB instance |
| `SESSION_SECRET`  | `my-secret`  | Used to encrypt session cookie ID  |
| `ENABLE_PRISMA_QUERY_LOGS`  | `true|false`  | Will output prisma database queries on the console.

## Running the API locally

Starting the database
```
docker-compose up -d
```

Stopping the database
```
docker-compose stop
```

Running the API
```
npm start
```

## Debugging the API

Run a VSCode task using default compile keybinding `CTRL+SHIFT+B` (see `.vscode/tasks.json`)

**OR**

Run a task manually using npm:
```
npm run watch
```

Start the API in debug mode:
```
npm run debug
```

Attach a VSCode debugger with `F5` key. (See `.vscode/launch.json`)

# Deploying

Coming soon