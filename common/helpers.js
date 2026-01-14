export function getBaseUrl(environment) {
  const urls = {
    dev: 'http://localhost:8080',
    staging: 'http://staging.example.com',
    prod: 'http://api.example.com',
  };
  return urls[environment] || urls.dev;
}

export function getHeaders(environment) {
  return {
    'Content-Type': 'application/json',
    'X-Environment': environment,
    'X-Request-ID': `k6-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
