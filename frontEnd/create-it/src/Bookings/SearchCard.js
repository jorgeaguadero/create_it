import { React, useState } from 'react';
import './searchCard.css';

import CreateBooking from './CreateBooking';
import ExtraBooking from '../Extras/ExtraBooking';

export const SearchCard = ({ r, start_date, type }) => {
    const [show, setShow] = useState(false);
    const [extra, setExtra] = useState('');
    return (
        <div className="card">
            <div className="card-content">
                <h2>{r[0].id_room}</h2>
                <br />
                <span>{r[0].room_code}</span>
                <label>
                    <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
                    Quiero un extra para mi reserva
                </label>
                {show && (
                    <div className="error">
                        Actualmente no disponible online, por favor llame si desea algún extra. Disculpe las molestias
                    </div>
                )}
                <CreateBooking id_room={r[0].id_room} start_date={start_date} />
                <br />
            </div>
        </div>
    );
};

export default SearchCard;
