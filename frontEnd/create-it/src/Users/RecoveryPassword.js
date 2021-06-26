import { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import './Login.css';

function RecoveryPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('http://localhost:8080/api/recoverPassword', {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (res.ok) {
            history.push('/Login');
        } else {
            setError(data.error);
        }
    };

    return (
        <div className="RecoveryPassword">
            <Helmet>
                <title>Create It</title>
            </Helmet>
            <main className="login dialog">
                <h1>Recupera tu contraseña</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        <span>Email con el que te registraste</span>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <button>Recupera tu contraseña</button>
                    {error && <div className="error">{error}</div>}
                    <p>
                        <span>¿Aún no tienes cuenta?</span>
                        <Link to="/signup">Regístrate</Link>
                    </p>
                </form>
            </main>
        </div>
    );
}

export default RecoveryPassword;
