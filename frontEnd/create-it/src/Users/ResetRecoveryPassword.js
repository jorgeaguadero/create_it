import { useState } from 'react';

import { useHistory, Link, useParams } from 'react-router-dom';
import Helmet from 'react-helmet';
import './Login.css';

function ResetRecoveryPassword() {
    const { id_user, activationCode } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [repeatedNewPassword, setRepeatedNewPassword] = useState('');
    const history = useHistory();

    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`http://localhost:8080/api/recoverPassword/${id_user}/${activationCode}`, {
            method: 'PATCH',
            body: JSON.stringify({ newPassword, repeatedNewPassword }),
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
        <div className="ResetRecoveryPassword">
            <Helmet>
                <title>Create It</title>
            </Helmet>
            <main className="login dialog">
                <h1>Infroduce tu nueva contraseña</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            <span>Contraseña</span>
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="Contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                            placeholder="Repite tu contraseña"
                            value={repeatedNewPassword}
                            onChange={(e) => setRepeatedNewPassword(e.target.value)}
                        />
                    </div>
                    <button>Crear nueva contraseña</button>
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

export default ResetRecoveryPassword;
