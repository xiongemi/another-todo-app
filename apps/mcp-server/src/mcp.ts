/*
 Minimal MCP server for the todo app.
 Exposes tools: listTodos, addTodo, toggleTodo.
 Persists to JSON at src/assets/todos.json (workspace-relative).
*/
import { Server } from '@modelcontextprotocol/sdk/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';

type Todo = { id: string; text: string; done?: boolean; dayKey?: string };

// Simple file-backed store
import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.join(process.cwd(), 'apps/mcp-server/src/assets/todos.json');

function loadTodos(): Todo[] {
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]) {
  try {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(todos, null, 2), 'utf8');
  } catch (e) {
    // Best-effort persistence
    console.error('Failed to save todos:', e);
  }
}

const todos = loadTodos();

const server = new Server(
  {
    name: '@another-todo-app/mcp-server',
    version: '0.1.0',
  },
  {
    // define tools
    tools: [
      {
        name: 'listTodos',
        description: 'List todos. Optional filter by dayKey.',
        inputSchema: {
          type: 'object',
          properties: {
            dayKey: { type: 'string' },
          },
        },
        handler: async (args: { input: unknown }) => {
          const { input } = args as { input: Record<string, unknown> };
          const dayKey = (input as any)?.dayKey as string | undefined;
          const items = dayKey ? todos.filter((t) => t.dayKey === dayKey) : todos;
          return { content: [{ type: 'text', text: JSON.stringify(items) }] };
        },
      },
      {
        name: 'addTodo',
        description: 'Add a todo item with text and optional dayKey.',
        inputSchema: {
          type: 'object',
          required: ['text'],
          properties: {
            text: { type: 'string' },
            dayKey: { type: 'string' },
          },
        },
        handler: async (args: { input: unknown }) => {
          const { input } = args as { input: Record<string, unknown> };
          const { text, dayKey } = input as { text: unknown; dayKey?: string };
          const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
          const item: Todo = { id, text: String(text).trim(), done: false, dayKey };
          todos.push(item);
          saveTodos(todos);
          return { content: [{ type: 'text', text: JSON.stringify(item) }] };
        },
      },
      {
        name: 'toggleTodo',
        description: 'Toggle the done flag of a todo by id.',
        inputSchema: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        handler: async (args: { input: unknown }) => {
          const { input } = args as { input: Record<string, unknown> };
          const { id } = input as { id: string };
          const idx = todos.findIndex((t) => t.id === id);
          if (idx >= 0) {
            todos[idx] = { ...todos[idx], done: !todos[idx].done };
            saveTodos(todos);
            return { content: [{ type: 'text', text: JSON.stringify(todos[idx]) }] };
          }
          return { content: [{ type: 'text', text: JSON.stringify({ error: 'not_found' }) }] };
        },
      },
    ],
  }
);

// Start over stdio so an MCP client can launch it as a tool
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('MCP server failed to start:', err);
  process.exit(1);
});
