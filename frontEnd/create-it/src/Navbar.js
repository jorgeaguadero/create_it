import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import './Navbar.css';
import avatar from './images/avatar.png'
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
                <div className="noLogin">
                  {!user && <Link to="/login">Log in</Link>}
                {!user && <Link to="/Signup">Sign up</Link>}  
                </div>
            
                {user && (
                    <Link className="user-info" to="/profile">
                        <div
                            className="avatar"
                            style={{
                                backgroundImage: `url(${avatar})`,
                            }}
                        />
                        <span>{user.name}</span>
                        <span className="logout" onClick={handleLogout}>
                            logout
                        </span>
                    </Link>
                )}
            </div>
        </header>
    );
}

export default Navbar;
