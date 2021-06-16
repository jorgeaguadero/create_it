import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function useFetch(url) {
    const [data, setData] = useState(null);
    const token = useSelector((s) => s.user?.token);

    useEffect(() => {
        const opts = {};
        if (token) {
            opts.headers = { Authorization: 'Bearer ' + token };
        }
        fetch(url, opts)
            .then((res) => res.json())
            .then((data) => setData(data));
    }, [url, token]);

    return data;
}

export default useFetch;
