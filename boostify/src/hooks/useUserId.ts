import { useEffect, useState } from 'react';

function useUserId() {
    const [userId, setUserId] = useState<number>(0); // Valor padrão como 1

    useEffect(() => {
        const userIdString = localStorage.getItem("userId");
        const parsedUserId = userIdString ? parseInt(userIdString) : 1;
        setUserId(parsedUserId);
    }, []); // O array vazio garante que isso só execute uma vez após a montagem

    return userId;
}

export default useUserId;
