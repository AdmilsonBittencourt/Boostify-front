import { useEffect } from 'react';
import api from '../services/axiosConfig';

function useAxiosWithToken() {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.Authorization = `Bearer ${token}`;
        }
    }, []); // O array vazio garante que isso só execute uma vez após a montagem
}

export default useAxiosWithToken;
