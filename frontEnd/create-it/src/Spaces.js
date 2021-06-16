import { Helmet } from 'react-helmet';

import useFetch from './useFetch';

function Spaces() {
    const spaces = useFetch(`http://localhost:8080/api/spaces`);

    if (!spaces) {
        return <div>Loading...</div>;
    }

    return (
        <div className="character">
            <h1>Localizaciones</h1>
            <Helmet>
                <title>Localizaciones - CreateIt</title>
            </Helmet>
            {spaces &&
                spaces.map((s) => (
                    <li key={s.id_space}>
                        <span>{s.space_name}</span>
                        <span>{s.description}</span>
                        <span>{s.rating}</span>
                    </li>
                ))}
        </div>
    );
}

export default Spaces;
