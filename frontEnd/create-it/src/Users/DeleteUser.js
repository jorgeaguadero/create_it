import './UpdateUser.css';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function DeleteUser() {
    const [error, setError] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);

    const dispatch = useDispatch();

    const user = useSelector((s) => s.user);

    const handleDelete = async (e) => {
        e.preventDefault();

        const res = await fetch(`http://localhost:8080/api/users/${user.id_user}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user.token,
            },
        });
        if (res.ok) {
            dispatch({ type: 'LOGOUT' });
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="deleteUser">
            {<button onClick={() => setOpenDelete(!openDelete)}>Borrarme como usuario</button>}
            {openDelete && (
                <div>
                    <p>¿De verdad quieres borrar tu usuario?</p>
                    <button onClick={handleDelete}>Confirmar</button>
                </div>
            )}

            {error && <div className="error">{error}</div>}
        </div>
    );
}

export default DeleteUser;
