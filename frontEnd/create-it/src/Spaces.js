import { Helmet } from 'react-helmet';

import useFetch from './useFetch';

function Spaces() {
    const spaces = useFetch(`http://localhost:8080/api/spaces`);

    if (!spaces) {
        return <div>Loading...</div>;
    }

    return (
        <div className="spaces">
            <h1>Localizaciones</h1>
            <Helmet>
                <title>Localizaciones - CreateIt</title>
            </Helmet>
            {spaces &&
                spaces.spaces.map((s) => (
                    <div key={s.id_space}>
                        <span>Espacio: {s.space_name} </span>
                        <span>Descripción {s.description} </span>
                        <span>Rating {s.rating} </span>
                    </div>
                ))}
        </div>
    );
}

export default Spaces;
