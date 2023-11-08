import { Server } from 'proxy-chain';

export function createProxyServer() {
  const { PROXY_USERNAME, PROXY_PASSWORD, PROXY_LINK, PROXY_PORT } = process.env;
  const auth = PROXY_USERNAME && PROXY_PASSWORD ? `${PROXY_USERNAME}:${PROXY_PASSWORD}@` : '';

  const proxyServer = new Server({
    port: Number(PROXY_PORT),
    verbose: true,
    prepareRequestFunction: () => {
      return {
        upstreamProxyUrl: `http://${auth}${PROXY_LINK}`,
        failMsg: 'Bad username or password, please try again.',
        onResponse: async (response: any) => {
          try {
            response.writeHead(response.statusCode, response.headers);
            response.end(response.data, 'binary');
          } catch (error) {
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
          }
        },
      };
    },
  });

  proxyServer.listen(() => {
    console.log(`Proxy server is listening on port ${proxyServer.port}`);
  });
  return proxyServer;
}
