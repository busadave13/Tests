import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

import { getHeaders } from '../../common/helpers.js';

// Custom metrics
const errorRate = new Rate('errors');
const apiLatency = new Trend('api_latency');

// Configuration from environment
const TARGET_URL = __ENV.TARGET_URL || 'http://podinfo-canary.podinfo:9898';
const ENVIRONMENT = __ENV.ENVIRONMENT || 'dev';
const VUS = parseInt(__ENV.VUS) || 5;
const DURATION = __ENV.DURATION || '30s';

// k6 options
export const options = {
  vus: VUS,
  duration: DURATION,

  thresholds: {
    'http_req_failed': ['rate<0.01'],
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],
    'errors': ['rate<0.01'],
  },

  tags: {
    environment: ENVIRONMENT,
    test_type: 'canary',
    workload: 'podinfo',
  },
};

export function setup() {
  console.log(`Starting canary test against ${TARGET_URL}`);
  console.log(`Environment: ${ENVIRONMENT}, VUs: ${VUS}, Duration: ${DURATION}`);

  const res = http.get(`${TARGET_URL}/healthz`);
  if (res.status !== 200) {
    throw new Error(`Target not ready: ${res.status}`);
  }

  return { startTime: new Date().toISOString() };
}

export default function (data) {
  // Health check endpoint
  const healthRes = http.get(`${TARGET_URL}/healthz`, {
    tags: { endpoint: 'health' },
  });

  check(healthRes, {
    'health check returns 200': (r) => r.status === 200,
    'health check response time < 100ms': (r) => r.timings.duration < 100,
  });

  // Main API endpoint
  const apiRes = http.get(`${TARGET_URL}/`, {
    tags: { endpoint: 'root' },
    headers: getHeaders(ENVIRONMENT),
  });

  const apiSuccess = check(apiRes, {
    'API returns 200': (r) => r.status === 200,
    'API response time < 500ms': (r) => r.timings.duration < 500,
    'API returns valid JSON': (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch {
        return false;
      }
    },
  });

  // Record custom metrics
  errorRate.add(!apiSuccess);
  apiLatency.add(apiRes.timings.duration);

  sleep(1);
}

export function teardown(data) {
  console.log(`Canary test completed. Started at: ${data.startTime}`);
}