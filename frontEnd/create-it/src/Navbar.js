import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';

import './Navbar.css';
import logo from './images/logo.png';

function Navbar() {
    const user = useSelector((s) => s.user);
    const dispatch = useDispatch();
    const handleLogout = (e) => {
        e.stopPropagation();
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <header className="header">
            <div>
                <NavLink to="/">
                    <img className="logo" src={logo} alt="CreateIt" />
                </NavLink>
            </div>
            {/*TODO diseño basico, configurar segun figma*/}
            <div className="linksNavbar">
                <NavLink className="links" to="/#">
                    <p>Buscador</p>
                </NavLink>
                <NavLink className="links" to="/Spaces">
                    <p>Localizaciones</p>
                </NavLink>
            </div>
            <div className="userSection">
                {!user && <Link to="/login">Log in</Link>}
                {user && (
                    <Link className="user-info" to="/profile">
                        <div
                            className="avatar"
                            style={{
                                backgroundImage: `url(./images/avatar.png)`,
                            }}
                        />
                        <span>{user.name}</span>
                        <span className="logout" onClick={handleLogout}>
                            logout
                        </span>
                    </Link>
                )}
                {!user && <Link to="/Register">Registro</Link>}
            </div>
        </header>
    );
}

export default Navbar;
