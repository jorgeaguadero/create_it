import './Profile.css';
import { useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';

function User() {
    const me = useSelector((s) => s.user);
    let id_user = '';
    const { id } = useParams();

    me ? (id_user = me.userId) : (id_user = id);

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
            <span>teléfono : {user.phone} </span>
            <br />
        <button>Moficiar usuario</button>
        </div>
    );
}

export default User;
