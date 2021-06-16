import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import './Profile.css';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

function Profile() {
    const isLoggedIn = useSelector((s) => !!s.user);

    if (!isLoggedIn) return <Redirect to="/login" />;

    return (
        <div className="profile">
            <Helmet>
                <title>CreateIt-Perfil</title>
            </Helmet>
            <div className="box">
                <div className="tabs">
                    <NavLink to="/profile" exact>
                        Perfil
                    </NavLink>
                    <NavLink to="/profile/bookings" exact>
                        Reservas
                    </NavLink>
                </div>
                <div className="content">
                    <Switch>
                        <Route path="/profile" exact>
                            Perfil
                        </Route>
                        <Route path="/profile/bookings" exact>
                            Reservas
                        </Route>
                    </Switch>
                </div>
            </div>
        </div>
    );
}

export default Profile;
