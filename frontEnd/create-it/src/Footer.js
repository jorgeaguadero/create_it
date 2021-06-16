import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="Footer">
            <div className="container">
                <Link className="info" to="/">
                    About us
                </Link>
                <Link className="info" to="/">
                    ¿Dónde estamos?
                </Link>
                <Link className="info" to="/">
                    contacto
                </Link>
            </div>
            <div className="rrss">rrss https://fontawesome.com/</div>
        </footer>
    );
}

export default Footer;
