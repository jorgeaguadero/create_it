import { NavLink, Route, Switch } from 'react-router-dom';
import './Profile.css';
import { Helmet } from 'react-helmet';

import User from './User';
import BookingsActive from '../Bookings/BookingsActive';
import BookingsHistory from '../Bookings/BookingsHistory';
import Booking from '../Bookings/Booking';
import OpenIncidents from '../Incidents/OpenIncidents';
import Incident from '../Incidents/Incident';
import Reviews from '../Reviews/UserReviews';
import UpdateUser from './UpdateUser';
import DeleteUser from './DeleteUser';

function ProfileUser() {
    return (
        <div className="profile">
            <h1>Perfil</h1>
            <Helmet>
                <title>CreateIt-Perfil</title>
            </Helmet>
            <div className="box">
                <div className="tabs">
                    <NavLink to="/profile" exact active ClassName="active">
                        Perfil
                    </NavLink>
                    <NavLink to="/profile/bookings" exact activeClassName="active">
                        Reservas activas
                    </NavLink>
                    <NavLink to="/profile/bookings/history" exact activeClassName="active">
                        Historial de reservas
                    </NavLink>
                    <NavLink to="/profile/incidents" exact activeClassName="active">
                        Mis incidencias
                    </NavLink>
                    <NavLink to="/profile/reviews" exact activeClassName="active">
                        Mis reviews
                    </NavLink>
                </div>
                <div className="content">
                    <Switch>
                        <Route path="/profile" exact>
                            <User />
                        </Route>
                        <Route path="/profile/bookings" exact>
                            <BookingsActive />
                        </Route>
                        <Route path="/profile/bookings/history" exact>
                            <BookingsHistory />
                        </Route>
                        <Route path="/profile/bookings/:id_booking" exact>
                            <Booking />
                        </Route>
                        <Route path="/profile/incidents" exact>
                            <OpenIncidents />
                        </Route>
                        <Route path="/profile/incidents/:id_incident" exact>
                            <Incident />
                        </Route>
                        <Route path="/profile/:id_user/update" exact>
                            <UpdateUser />
                        </Route>
                        <Route path="/profile/:id_user/delete" exact>
                            <DeleteUser />
                        </Route>
                        <Route path="/profile/reviews" exact>
                            <Reviews />
                        </Route>
                        <Route path="/profile/">no existe</Route>
                    </Switch>
                </div>
            </div>
        </div>
    );
}

export default ProfileUser;
