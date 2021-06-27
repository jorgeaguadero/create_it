import './Home.css';
import Principal from './Principal';
import About from './About';
import Location from './Location';

function Home() {
    return (
        <div className="home">
            <div id="principal" className="principal">
                <Principal />
            </div>
            <div id="about" className="about">
                <About />
            </div>
            <div id="location" className="location">
                <Location />
            </div>
        </div>
    );
}
export default Home;
