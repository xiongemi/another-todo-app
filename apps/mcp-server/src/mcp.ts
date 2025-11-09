/*
 Minimal MCP server for the todo app.
 Exposes tools: listTodos, addTodo, toggleTodo.
 Persists to JSON at src/assets/todos.json (workspace-relative).
*/
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

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

const server = new McpServer({
  name: '@another-todo-app/mcp-server',
  version: '0.1.0',
});

server.registerTool(
  'listTodos',
  {
    title: 'List Todos',
    description: 'List todos. Optional filter by dayKey.',
    inputSchema: { dayKey: z.string().optional() },
  },
  async ({ dayKey }) => {
    const items = dayKey ? todos.filter((t) => t.dayKey === dayKey) : todos;
    return {
      content: [{ type: 'text', text: JSON.stringify(items) }],
      structuredContent: { items },
    };
  }
);

server.registerTool(
  'addTodo',
  {
    title: 'Add Todo',
    description: 'Add a todo item with text and optional dayKey.',
    inputSchema: { text: z.string(), dayKey: z.string().optional() },
  },
  async ({ text, dayKey }) => {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const item: Todo = { id, text: String(text).trim(), done: false, dayKey };
    todos.push(item);
    saveTodos(todos);
    return { content: [{ type: 'text', text: JSON.stringify(item) }], structuredContent: item };
  }
);

server.registerTool(
  'toggleTodo',
  {
    title: 'Toggle Todo',
    description: 'Toggle the done flag of a todo by id.',
    inputSchema: { id: z.string() },
  },
  async ({ id }) => {
    const idx = todos.findIndex((t) => t.id === id);
    if (idx >= 0) {
      todos[idx] = { ...todos[idx], done: !todos[idx].done };
      saveTodos(todos);
      return { content: [{ type: 'text', text: JSON.stringify(todos[idx]) }], structuredContent: todos[idx] };
    }
    const err = { error: 'not_found' };
    return { content: [{ type: 'text', text: JSON.stringify(err) }], structuredContent: err, isError: true };
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
