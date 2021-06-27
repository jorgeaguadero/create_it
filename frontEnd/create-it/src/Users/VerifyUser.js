import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import './Login.css';
function VerifyUser() {
    const { id_user, activationCode } = useParams();
    const [error, setError] = useState(null);
    const history = useHistory();

    const url = `http://localhost:8080/api/verify/${id_user}/${activationCode}`;
    console.log(url);

    const data = useFetch(url);

    if (!data) {
        return <div>Loading...</div>;
    }

    if (data.ok) {
        history.push('/Login');
    } else {
        setError(data.error);
    }

    return <div className="Verifyuser">{error && <div className="error">{error}</div>}</div>;
}

export default VerifyUser;
