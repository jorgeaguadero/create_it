import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import './Login.css';

function VerifyUser() {
    const { id_user, activationCode } = useParams();
    const [error, setError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/verify/${id_user}/${activationCode}`);

                const data = await res.json();

                if (!res.ok || data.error) {
                    throw new Error(data.error);
                } else {
                    history.push('/Login');
                }
            } catch (error) {
                setError(error.message);
            }
        };
        verifyUser();
    }, [id_user, activationCode, history]);

    return <div className="Verifyuser">{error && <div className="error">{error}</div>}</div>;
}

export default VerifyUser;
