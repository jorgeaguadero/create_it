

function Pay({booking}) {
    

    

    return (
        <div className="pay">
            <span>id Reserva --- {booking.id_booking}</span>
            <br />
            <span>Espacio --- {booking.id_space}</span>
            <br />
            <span>Sala --- {booking.id_room}</span>
            <br />
        </div>
    );
}

export default Pay;
