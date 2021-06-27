import './User.css';
import defaultAvatar from '../images/defaultAvatar.png';
import { useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function User() {
    const me = useSelector((s) => s.user);
    let id_user = '';
    const { id } = useParams();

    me ? (id_user = me.id_user) : (id_user = id);

    const user = useFetch(`http://localhost:8080/api/users/${id_user}
    `);

    if (!user) {
        return <div>Loading...</div>;
    }
    return (
        <div className="user">
            <div className="user-box">
                {user.avatar ? (
                    <img className="avatar" src={user.avatar} alt="Avatar" />
                ) : (
                    <img className="avatar" src={defaultAvatar} alt="Avatar" />
                )}
                <ul className="user-content">
                    <li>
                        <strong>Id de usuario: </strong>
                        {user.id_user}
                    </li>
                    <li>
                        <strong>Estado de activación: </strong>
                        {user.activate === 1 ? '✅' : '❌'}
                    </li>

                    <li>
                        <strong>Email: </strong>
                        {user.email}
                    </li>

                    <li>
                        <strong>Nombre: </strong>
                        {user.first_name}
                    </li>

                    <li>
                        <strong>Apellido:</strong> {user.last_name}
                    </li>

                    {user.bio && (
                        <li>
                            <strong>Bio: </strong> {user.bio}
                        </li>
                    )}

                    {user.phone && (
                        <li>
                            <strong></strong>Teléfono: {user.phone}
                        </li>
                    )}
                </ul>
            </div>
            <div className="button">
                <button type="button">
                    <Link to={`/profile/${id_user}/update`} activeClassName="active" exact>
                        Editar
                    </Link>
                </button>
                <button type="button">
                    <Link to={`/profile/${id_user}/delete`} activeClassName="active" exact>
                        Borrar usuario
                    </Link>
                </button>
            </div>
        </div>
    );
}

export default User;
