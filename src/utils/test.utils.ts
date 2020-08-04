export const mockRequest = <T extends {}>(options: T) => ({
  baseUrl: '',
  body: {},
  cookies: {},
  fresh: true,
  headers: {},
  hostname: '',
  ip: '127.0.0.1',
  ...options,
});
