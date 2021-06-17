import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import './Profile.css';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import User from './User';

import IncidentsHistory from '../Incidents/IncidentsHistory';

function ProfileAdmin() {
    const isLoggedIn = useSelector((s) => !!s.user);

    if (!isLoggedIn) return <Redirect to="/login" />;

    return (
        <div className="profile">
            <h1>Perfil</h1>
            <Helmet>
                <title>CreateIt-Perfil</title>
            </Helmet>
            <div className="box">
                <div className="tabs">
                    <NavLink to="/profile" exact activeClassName="active">
                        info del usuario -- modificar perfil
                    </NavLink>
                    <NavLink to="/profile/bookingsActive" exact activeClassName="active">
                        Reservas activas
                    </NavLink>
                    <NavLink to="/profile/bookings" exact activeClassName="active">
                        historial de reservas
                    </NavLink>
                    <NavLink to="/profile/incidents" exact activeClassName="active">
                        historial de incidencias
                    </NavLink>
                </div>
                <div className="content">
                    <Switch>
                        <Route path="/profile" exact>
                            <User />
                        </Route>
                        <Route path="/profile/bookingsActive" exact>
                            Reservas ...
                        </Route>
                        <Route path="/profile/bookings" exact>
                            historial...
                        </Route>
                        <Route path="/profile/incidents" exact>
                            <IncidentsHistory />
                        </Route>
                        <Route path="/profile/">
                            <User />
                        </Route>
                    </Switch>
                </div>
            </div>
        </div>
    );
}

export default ProfileAdmin;
