import './UpdateUser.css';
import { useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

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
    const [phone, setPhone] = useState(user.phone || '');
    const [bio, setBio] = useState(user.bio || '');
    const [userUpdated, setUserUpdated] = useState(false);

    const id_user = user.id_user;

    const userToken = useSelector((s) => s.user);

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
        }
    };

    if (userUpdated) {
        return <Redirect to={`/profile`} />;
    }

    return (
        <div className="update-user">
            <h1>Edita tu perfil</h1>
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
    );
}

export default UpdateUserMain;
