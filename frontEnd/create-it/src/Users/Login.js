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
        <div className="login">
            <Helmet>
                <title>CreateIt-Login</title>
            </Helmet>
            <main className="login-dialog">
                <form onSubmit={handleSubmit}>
                    <div>
                        <h1>¡loguéate!</h1>
                        <label>
                            <span>Usuario:</span>
                            <input
                                type="email"
                                value={email}
                                placeholder="email..."
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <span>Contraseña:</span>
                            <input
                                type="password"
                                placeholder="Contraseña..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <button>Iniciar sesión</button>
                    {error && <div className="error">{error}</div>}
                    <div className="text-login">
                        <span>¿Aún no tienes cuenta?</span>
                        <Link to="/signup">Regístrate</Link>
                        <span>¿Has olvidado tu contraseña?</span>
                        <Link to="/user/recoveryPassword">Reecupera tu contraseña</Link>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default Login;
