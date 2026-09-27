import http from 'k6/http';
import { check } from 'k6';

export const options = {
    stages: [
        { duration: '20s', target: 20 },
        { duration: '20s', target: 50 },
        { duration: '20s', target: 100 },
        { duration: '20s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<3000'],
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {
    const res = http.get(
        'https://portovero.onrender.com/products/featured',
        { timeout: '10s' }
    );

    check(res, {
        'status 200': (r) => r.status === 200,
        'response not empty': (r) => r.status === 200 && r.body.length > 0,
    });
}