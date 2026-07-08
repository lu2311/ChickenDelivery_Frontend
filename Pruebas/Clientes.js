import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 20,
    duration: '1m'
};

export default function () {

    const login = http.post(
        'http://localhost:8080/api/auth/login',
        JSON.stringify({
            usuario:'admin',
            contrasenia:'admin'
        }),
        {
            headers:{
                'Content-Type':'application/json'
            }
        }
    );

    const token = login.json('token');

    const res = http.get(
        'http://localhost:8080/api/clientes',
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    check(res,{
        'clientes ok':(r)=>r.status===200
    });

}