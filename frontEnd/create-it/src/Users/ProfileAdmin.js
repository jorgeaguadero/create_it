import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import './Profile.css';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import User from './User';
import Booking from '../Bookings/Booking';

import IncidentsHistory from '../Incidents/IncidentsHistory';
import Incident from '../Incidents/Incident';
import BookingsActive from '../Bookings/BookingsActive';
import BookingsHistory from '../Bookings/BookingsHistory';
import OpenIncidents from '../Incidents/OpenIncidents';

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
                        Perfil
                    </NavLink>
                    <NavLink to="/profile/bookingsActive" exact activeClassName="active">
                        Reservas activas
                    </NavLink>
                    <NavLink to="/profile/bookings" exact activeClassName="active">
                        historial de reservas
                    </NavLink>
                    <NavLink to="/profile/incidents/open" exact activeClassName="active">
                        Incidencias abiertas
                    </NavLink>
                    <NavLink to="/profile/incidents/all" exact activeClassName="active">
                        historial de incidencias
                    </NavLink>
                </div>
                <div className="content">
                    <Switch>
                        <Route path="/profile" exact>
                            <User />
                        </Route>
                        <Route path="/profile/bookingsActive" exact>
                            <BookingsActive />
                        </Route>
                        <Route path="/profile/bookings/:id_booking" exact>
                            <Booking />
                        </Route>
                        <Route path="/profile/bookings" exact>
                            <BookingsHistory />
                        </Route>
                        <Route path="/profile/incidents/open" exact>
                            <OpenIncidents />
                        </Route>
                        <Route path="/profile/incidents/all" exact>
                            <IncidentsHistory />
                        </Route>
                        <Route path="/profile/incidents/:id_incident" exact>
                            <Incident />
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
