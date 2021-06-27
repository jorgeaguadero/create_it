import './UpdateUser.css';
import { useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

function UpdateUserMain() {
    const me = useSelector((s) => s.user);
    let idUser = '';
    const { id } = useParams();

    me ? (idUser = me.id_user) : (idUser = id);
    const user = useFetch(`http://localhost:8080/api/users/${idUser}`);

    if (!user) {
        return <i>Loading...</i>;
    }

    return <UpdateUser user={user} />;
}

function UpdateUser({ user }) {
    const [error, setError] = useState(null);
    const [phone, setPhone] = useState(user.phone || '');
    const [bio, setBio] = useState(user.bio || '');
    const [userUpdated, setUserUpdated] = useState(false);
    const [image, setImage] = useState();
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatedNewPassword, setRepeatedNewPassword] = useState('');

    const id_user = user.id_user;

    const userToken = useSelector((s) => s.user);

    if (userUpdated) {
        return <Redirect to={`/profile`} />;
    }

    const handleSubmitPassword = async (e) => {
        e.preventDefault();

        const res = await fetch(`http://localhost:8080/api/users/${id_user}/updatePassword`, {
            method: 'PATCH',
            body: JSON.stringify({
                password,
                newPassword,
                repeatedNewPassword,
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + userToken.token,
            },
        });
        if (res.ok) {
            Swal.fire({
                title: 'perfil',
                text: 'Tus datos se han actualizado correctamente',
                icon: 'success',
                timer: 1500,
            });
            setUserUpdated(true);
        } else {
            setError(res.error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`http://localhost:8080/api/users/${id_user}`, {
            method: 'PATCH',
            body: JSON.stringify({
                phone,
                bio,
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + userToken.token,
            },
        });
        if (res.ok) {
            setUserUpdated(true);
        } else {
            setError(res.error);
        }
    };

    const handleSubmitUserImage = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('foto', image);
        const res = await fetch(`http://localhost:8080/api/users/${id_user}/avatar`, {
            method: 'POST',
            body: fd,
            headers: {
                Authorization: 'Bearer ' + userToken.token,
            },
        });

        if (res.ok) {
            setUserUpdated(true);
        } else {
            setError(res.error);
        }
    };

    const handleUserImage = (e) => {
        const f = e.target.files[0];
        setImage(f);
    };

    return (
        <div className="updateUser">
            <div className="updateInfo">
                <h2>Edita tu perfil</h2>
                <form className="formUser" onSubmit={handleSubmit}>
                    <h2>Bio</h2>
                    <input
                        name="bio"
                        placeholder={bio}
                        type="text"
                        required
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    <h2>Teléfono</h2>
                    <input
                        name="phone"
                        placeholder={phone}
                        type="phone"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <button className="button-update">Actualizar</button>
                </form>
            </div>
            <div>
                <p>Subir imagen</p>
                <form className="formUpdate" onSubmit={handleSubmitUserImage}>
                    <input name="image" placeholder="image" type="file" onChange={handleUserImage} />
                    <button className="button-update">Editar Avatar</button>
                </form>
            </div>

            <div>
                <h1>Cambia tu contraseña</h1>
                <form onSubmit={handleSubmitPassword}>
                    <div>
                        <label>
                            <span>Contraseña actual</span>
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>
                            <span>Introduce tu nueva contraseña</span>
                        </label>
                        <input
                            name="repeatedPassword"
                            type="password"
                            required
                            placeholder="Repite tu contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>
                            <span>Repite tu nueva contraseña</span>
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
                    <button>Cambia tu contraseña</button>
                    {error && <div className="error">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default UpdateUserMain;
