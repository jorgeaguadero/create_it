import './Principal.css';
import principalCover from './images/principalCover.webp';

function Principal() {
    return (
        <div className="principal" style={{ backgroundImage: `url(${principalCover})`, filter: `grayscale(100%)` }}>
            <h1>
                BIEVENIDO A <strong>CREATE IT</strong>
            </h1>
        </div>
    );
}

export default Principal;
