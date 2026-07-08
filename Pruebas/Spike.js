import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 10 },    // Carga normal
        { duration: '5s', target: 300 },    // Spike repentino
        { duration: '20s', target: 300 },   // Mantener el pico
        { duration: '5s', target: 10 },     // Volver a la normalidad
        { duration: '10s', target: 0 }      // Finalizar
    ],

    thresholds: {
        http_req_failed: ['rate<0.05'],      // Menos del 5% de errores
        http_req_duration: ['p(95)<25000']    // 95% de peticiones < 25 s
    }
};

export default function () {

    // Login
    const loginRes = http.post(
        'http://localhost:8080/api/auth/login',
        JSON.stringify({
            usuario: 'admin',
            contrasenia: 'admin'
        }),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    check(loginRes, {
        'Login correcto': (r) => r.status === 200
    });

    const token = loginRes.json('token');

    // Consulta de productos
    const productosRes = http.get(
        'http://localhost:8080/api/productos',
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    check(productosRes, {
        'Productos OK': (r) => r.status === 200
    });

    sleep(1);
}