import './About.css';

import arcaneMain from './images/arcaneMain.webp';
import cottonMain from './images/cottonMain.webp';
import bunkerMain from './images/bunkerMain.webp';

function About() {
    return (
        <div className="about">
            <div className="text-content">
                <p>
                    ¿Tienes ganas de ensayar con tu grupo <span>y no tienes local</span>?
                </p>
                <p>
                    ¿Tienes ganas de hacer una sesión de fotos o video <span>y no tienes estudio</span>?
                </p>
                <p>
                    ¿Quieres grabar tus canciones en un <strong>estudio profesional</strong>?
                </p>
                <p>
                    ¡Con <strong>CREATE IT</strong> seguro que encuentras lo que necesitas!
                </p>
            </div>
            <div className="images">
                <img src={arcaneMain} alt="foto de Arcane Planet" />
                <img src={bunkerMain} alt="foto de El Bunker" />
                <img src={cottonMain} alt="foto de Cotton Club" />
            </div>
        </div>
    );
}

export default About;
