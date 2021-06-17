import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const isLoggedIn = useSelector((s) => !!s.user);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
            dispatch({ type: 'LOGIN', user: data });
        } else {
            setError(data.error);
        }
    };
    if (isLoggedIn) {
        return <Redirect to="/Profile" />;
    }

    return (
        <div className="page page-login">
            <Helmet>
                <title>CreateIt-Login</title>
            </Helmet>
            <main className="login dialog">
                <h1>Iniciar sesión</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        <span>Usuario:</span>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <label>
                        <span>Contraseña:</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button>Iniciar sesión</button>
                    {error && <div className="error">{error}</div>}
                </form>
                <p>
                    <span>Aún no tienes cuenta?</span>
                    <Link to="/signup">Regístrate</Link>
                </p>
            </main>
        </div>
    );
}

export default Login;
