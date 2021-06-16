import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Helmet from 'react-helmet';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
     const [error, setError] = useState(false);
    const isLoggedIn = useSelector((s) => !!s.user);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
            const data = await res.json();
            dispatch({ type: 'LOGIN', user: data });
        }else{          
            setError(true)
        }
    };
    if (isLoggedIn) {
        return <Redirect to="/" />;
    }

    return (
        <div className="login">
            <Helmet>login-createIt</Helmet>
            <form onSubmit={handleSubmit}>
                <input name="email" placeholder="email..." value={email} onChange={(e) => setEmail(e.target.value)} />
                <input
                    name="password"
                    type="password"
                    placeholder="Password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button>Log in</button>
            </form>
            {error && <div>Usuario o contraseña incorrecto</div>}
        </div>
    );
}

export default Login;
