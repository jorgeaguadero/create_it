import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import './Signup.css';
import Helmet from 'react-helmet';

{
    /*TODO https://www.youtube.com/watch?v=tli5n_NqQW8*/
}

function Signup() {
    const [newUser, setnewUser] = useState({});
    const [error, setError] = useState(null);
    const user = useSelector((s) => s.user);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newUser.password !== newUser.repeatedPassword) {
            setError('Las contraseñas no coinciden');
        } else {
            const ret = await fetch('http://localhost:8080/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            const data = await ret.json();
            if (ret.ok) {
                dispatch({ type: 'LOGIN', user: data });
            } else {
                setError(data.error);
            }
        }
    };

    if (user) return <Redirect to="/" />;

    return (
        <div className="registro">
            <Helmet>
                <title>CreateIt-Registro</title>
            </Helmet>
            <main>
                <h1>Registrate!</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            <span>Nombre</span>
                            <input
                                name="name"
                                required
                                placeholder="Nombre"
                                value={newUser.name || ''}
                                onChange={(e) => setnewUser({ ...newUser, name: e.target.value })}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            <span>Apellido</span>
                            <input
                                name="last_name"
                                required
                                placeholder="Apellido"
                                value={newUser.last_name || ''}
                                onChange={(e) => setnewUser({ ...newUser, last_name: e.target.value })}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            <span>Email</span>
                            <input
                                name="email"
                                required
                                type="email"
                                placeholder="email..."
                                value={newUser.email || ''}
                                onChange={(e) => setnewUser({ ...newUser, email: e.target.value })}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            <span>Contraseña</span>
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="Contraseña..."
                            value={newUser.password || ''}
                            onChange={(e) => setnewUser({ ...newUser, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>
                            <span>Repite Contraseña</span>
                        </label>
                        <input
                            name="repeatedPassword"
                            type="password"
                            required
                            placeholder="Contraseña..."
                            value={newUser.repeatedPassword || ''}
                            onChange={(e) => setnewUser({ ...newUser, repeatedPassword: e.target.value })}
                        />
                    </div>

                    <button>Registro</button>

                    {error && <div className="error">{error}</div>}
                    <p>
                        <span>Ya tienes cuenta?</span>
                        <Link to="/login">Inicia sesión</Link>
                    </p>
                </form>
            </main>
        </div>
    );
}
export default Signup;
