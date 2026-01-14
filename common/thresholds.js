export const canaryThresholds = {
  http_req_failed: ['rate<0.01'],      // < 1% errors
  http_req_duration: ['p(95)<500'],    // 95th percentile < 500ms
};

export const smokeThresholds = {
  http_req_failed: ['rate<0.05'],      // < 5% errors (more lenient)
  http_req_duration: ['p(95)<1000'],   // 95th percentile < 1s
};

export const loadThresholds = {
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['p(95)<500', 'p(99)<1000'],
  http_reqs: ['rate>100'],              // Minimum throughput
};
