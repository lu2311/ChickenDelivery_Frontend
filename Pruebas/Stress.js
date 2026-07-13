import http from 'k6/http';
import { check } from 'k6';

export const options = {    
    stages: [
        { duration: '30s', target: 20 },
        { duration: '30s', target: 100 },
        { duration: '30s', target: 200 },
        { duration: '30s', target: 300 },
        { duration: '30s', target: 0 }
    ]
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
        'http://localhost:8080/api/productos',
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    check(res,{
        'status 200':(r)=>r.status===200
    });
}



