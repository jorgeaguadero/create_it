import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import './Register.css';

{
    /*TODO https://www.youtube.com/watch?v=tli5n_NqQW8*/
}

function Registro() {
    const [user, setUser] = useState({});
    const [error, setError] = useState();
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        setUser('');
        if (!newUser) {
            setError(true);
        }
    };

    return (
        <div className="registro">
            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Nombre"
                    value={user.name || ''}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
                <input
                    name="last_name"
                    placeholder="Apellido"
                    value={user.last_name || ''}
                    onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                />
                <input
                    name="email"
                    required
                    placeholder="email..."
                    value={user.email || ''}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <br></br>
                <input
                    name="password"
                    type="password"
                    required
                    placeholder="Contraseña..."
                    value={user.password || ''}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                />

                <button>Registro</button>

                {error && <div>Ya existe este usuario</div>}
            </form>
        </div>
    );
}
export default Registro;
