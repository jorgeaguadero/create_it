import './Home.css';
import Principal from './Principal';
import About from './About';

function Home() {
    return (
        <div className="home">
            <div id="principal" className="principal">
                <Principal />
            </div>
            <div id="about" className="about">
                <About />
            </div>
        </div>
    );
}
export default Home;
