import { check } from 'k6';

export function standardChecks(response, name) {
  return check(response, {
    [`${name}: status is 2xx`]: (r) => r.status >= 200 && r.status < 300,
    [`${name}: response time < 1s`]: (r) => r.timings.duration < 1000,
    [`${name}: no errors in body`]: (r) => !r.body.includes('error'),
  });
}

export function jsonChecks(response, name) {
  return check(response, {
    [`${name}: valid JSON`]: (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch {
        return false;
      }
    },
  });
}
