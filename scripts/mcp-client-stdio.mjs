import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  // Launch the local MCP server via stdio
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['apps/mcp-server/dist-mcp/mcp.mjs'],
  });

  const client = new Client();
  await client.connect(transport);

  // Add a todo
  const add = await client.callTool('addTodo', {
    text: 'From client script',
    dayKey: new Date().toISOString().slice(0, 10),
  });
  console.log('addTodo result:\n', JSON.stringify(add, null, 2));

  // List todos for today
  const dayKey = new Date().toISOString().slice(0, 10);
  const list = await client.callTool('listTodos', { dayKey });
  console.log('listTodos result:\n', JSON.stringify(list, null, 2));

  await transport.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

