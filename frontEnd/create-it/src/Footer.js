import './Footer.css';
import { HashLink } from 'react-router-hash-link';
//npm install --save react-router-hash-link

import ButtonMailto from './ButtonMailto';
import facebook from './images/facebook.png';
import instagram from './images/instagram.png';
import linkedin from './images/linkedin.png';

function Footer() {
    return (
        <footer className="Footer">
            <div className="container">
                <HashLink className="info" to="/#about">
                    About us
                </HashLink>
                <HashLink className="info" to="/#location">
                    ¿Dónde estamos?
                </HashLink>
                <ButtonMailto className="info" label="Contacto" mailto="mailto:contact@createit.com" />
            </div>
            <div className="rrss">
                <a href="https://www.facebook.com/jorgeAguaderoMusic" target="_blank" rel="noreferrer">
                    <img className="icon" src={facebook} alt="facebook" />
                </a>
                <a href="https://www.instagram.com/jorgeaguaderomusic/" target="_blank" rel="noreferrer">
                    <img className="icon" src={instagram} alt="instagram" />
                </a>
                <a href="https://www.linkedin.com/in/jorgeaguadero/" target="_blank" rel="noreferrer">
                    <img className="icon" src={linkedin} alt="linkedin" />
                </a>
            </div>
        </footer>
    );
}

export default Footer;
