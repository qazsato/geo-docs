exports.handler = async (event, context) => {
  const { handler } = await import('./.output/server/index.mjs');
  const result = await handler (event);
  return {
    statusCode: result.statusCode,
    headers: result.headers,
    body: result.body
  };
}
