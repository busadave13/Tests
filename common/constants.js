// Common constants for k6 tests
export const HTTP_TIMEOUT = '30s';
export const DEFAULT_VUS = 5;
export const DEFAULT_DURATION = '30s';

export const ENDPOINTS = {
  health: '/health/ready',
  liveness: '/health/live',
};

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
