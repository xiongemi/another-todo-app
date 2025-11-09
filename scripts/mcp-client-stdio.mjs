import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  const [, , argText, argDayKey] = process.argv;
  const today = new Date().toISOString().slice(0, 10);
  const text = argText ?? 'From client script';
  const dayKey = argDayKey ?? today;

  // Launch the local MCP server via stdio
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['apps/mcp-server/dist-mcp/mcp.mjs'],
  });

  const client = new Client({ name: 'another-todo-app-cli', version: '0.1.0' });
  await client.connect(transport);

  // Add a todo (text and dayKey can be passed via CLI)
  const add = await client.callTool('addTodo', { text, dayKey });
  console.log('addTodo result:\n', JSON.stringify(add, null, 2));

  // List todos for today
  const list = await client.callTool('listTodos', { dayKey });
  console.log('listTodos result:\n', JSON.stringify(list, null, 2));

  await transport.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
