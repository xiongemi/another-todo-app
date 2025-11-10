# AnotherTodoApp – Jibun Techo–inspired Todo

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A simple daily todo app inspired by the Jibun Techo planner.

The primary user story is: users can add a todo item for today, see today’s list, and keep adding quickly via a bottom input bar (with optional voice input).

Design inspiration: Jibun Techo daily/weekly coloring

- Weekday: grey / blue‑ish grey
- Saturday: blue
- Sunday: pinkish orange

UI library: React + Material UI (MUI)

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/next?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Run tasks

To run the dev server for your app, use:

```sh
npx nx dev another-todo-app
```

To create a production bundle:

```sh
npx nx build another-todo-app
```

To see all available targets to run for a project, run:

```sh
npx nx show project another-todo-app
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## MCP Server

A minimal Model Context Protocol (MCP) server is included to let AI tools integrate with the todo data.

- Location: `apps/mcp-server`
- Tools exposed: `listTodos`, `addTodo`, `toggleTodo`
- Storage: JSON file at `apps/mcp-server/.data/todos.json`

### Codex/Cursor integration (mcp.json)

Codex-compatible clients can auto-load the local MCP server via stdio using `mcp.json` at the repo root:

```json
{
  "mcpServers": {
    "another-todo-app": {
      "command": "node",
      "args": ["apps/mcp-server/dist-mcp/mcp.mjs"],
      "cwd": ".",
      "env": {}
    }
  }
}
```

Workflow:
- Build the stdio bundle with Nx.
- Your client (Codex, Cursor, or the local script) launches the server over stdio and calls tools.

### Run (HTTP server)

Runs a simple Express HTTP server (useful for quick sanity checks):

```sh
npx nx serve @another-todo-app/mcp-server
# -> http://localhost:3000/  (responds with { message: 'Hello API' })
```

### Build bundles

- Node/HTTP bundle to `apps/mcp-server/dist`:

```sh
npx nx build @another-todo-app/mcp-server
```

- MCP stdio bundle (ESM) to `apps/mcp-server/dist-mcp/mcp.mjs`:

```sh
npx nx run @another-todo-app/mcp-server:build-mcp
```

### Run as MCP (stdio)

Run the MCP server over stdio (for MCP-compatible clients):

```sh
# Development with watch rebuilds
npx nx run @another-todo-app/mcp-server:serve-mcp

# Or after building
npx nx run @another-todo-app/mcp-server:build-mcp && node apps/mcp-server/dist-mcp/mcp.mjs
```

### Quick local test (client script)

There’s a tiny client script that launches the built stdio server, calls tools, and prints results:

```sh
npx nx run @another-todo-app/mcp-server:build-mcp
node scripts/mcp-client-stdio.mjs
```

The client script also supports adding a todo with arguments:

```sh
# Add for today (YYYY-MM-DD defaulted to today)
node scripts/mcp-client-stdio.mjs "package stuffs"

# Or specify a date
node scripts/mcp-client-stdio.mjs "package stuffs" 2025-11-09
```

Expected behavior:
- `addTodo` creates a todo with an `id`, `text`, optional `dayKey`, and `done=false`.
- `listTodos` returns all or by `dayKey`.
- `toggleTodo` flips `done` for a given `id`.

Tip: If you change tools or schemas in `apps/mcp-server/src/mcp.ts`, rebuild with `build-mcp` before re-running the client script.

## App usage

- Visit `/` to see today’s todos and add new ones.
- Bottom input bar is always visible; click the mic to use voice input (browser Web Speech API).
- Todos are stored locally in the browser per‑day.

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/next:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/react:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/next?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
