import './Profile.css';
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
            <span>id : {user.id_user} </span>
            <br />
            <span>email: {user.email} </span>
            <br />
            <span>nombre : {user.first_name} </span>
            <br />
            <span>apellido : {user.last_name} </span>
            <br />
            <span>bio : {user.bio} </span>
            <br />
            <span>teléfono : {user.phone} </span>
            <br />
            {user.avatar ? <img src={user.avatar} alt="Avatar" /> : <img src={defaultAvatar} alt="Avatar" />}

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
    );
}

export default User;
