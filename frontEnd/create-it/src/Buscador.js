import { useState } from 'react';


const [space, setSpace] = useState('');
const [type, setType] = useState('');
const [capacity, setCapacity] = useState('');
const [start_date, setStart_date] = useState('');

const [results, setResults] = useState('');

const handleSubmit = async (e) => {
    e.preventDefault();

    const url =
        `http:/localhost:8080/api/rooms/query'` +
        `
    const res = await fetch(url);

    const data = await res.json();
    console.log(data);
    setResults(data);
};

