import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import './Navbar.css';
import logo from '../images/logo.png';
import defaultAvatar from '../images/defaultAvatar.png';

function Navbar() {
    const user = useSelector((s) => s.user);
    const dispatch = useDispatch();

    const handleLogout = (e) => {
        e.stopPropagation();
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <header className="navbar">
            <div>
                <HashLink to="/#principal">
                    <img className="logo" src={logo} alt="CreateIt" />
                </HashLink>
            </div>
            {/*TODO diseño basico, configurar segun figma*/}
            <div className="linksNavbar">
                <NavLink className="links" to="/Buscador">
                    <p>Buscador</p>
                </NavLink>
                <NavLink className="links" to="/Spaces">
                    <p>Localizaciones</p>
                </NavLink>
            </div>
            <div className="userSection">
                {!user && (
                    <Link className="links" to="/login">
                        Log in
                    </Link>
                )}
                {!user && (
                    <Link className="links" to="/Signup">
                        Sign up
                    </Link>
                )}

                {user && (
                    <div className="user-info">
                        <Link to="/profile">
                            <div
                                className="avatar"
                                style={
                                    user.avatar
                                        ? { backgroundImage: `url(${user.avatar})` }
                                        : { backgroundImage: `url(${defaultAvatar})` }
                                }
                            />
                        </Link>
                        <span className="logout" onClick={handleLogout}>
                            logout
                        </span>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;
