import { useState } from 'react';
import { useDispatch } from 'react-redux';
import './search.css';
import SearchCard from './SearchCard';

function Search() {
    const [id_space, setId_Space] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');
    const [start_date, setStart_date] = useState('');
    const [capacity, setCapacity] = useState('');

    const [results, setResults] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id_space || !type || !price || !start_date || !capacity) {
            throw new Error('Faltan campos por completar');
        }

        const url =
            `http://localhost:8080/api/search?` +
            `id_space=${id_space}` +
            `&type=${type}` +
            `&price=${price}` +
            `&start_date=${start_date}` +
            `&capacity=${capacity}`;

        const res = await fetch(url);

        const data = await res.json();

        if (res.ok) {
            setResults(data);
        } else {
            throw new Error(data.message);
        }
    };

    return (
        <div className="search">
            <h1>¿Encuentra tu espacio perfecto!</h1>
            <div className="form-wrap">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>¿A que espacio quieres ir?</label>
                        <select id="space" value={id_space} required onChange={(e) => setId_Space(e.target.value)}>
                            <option value="" hidden>
                                Espacio...
                            </option>
                            <option value="1">Arcane Planet '(Salamanca)'</option>
                            <option value="2">Arcane Cotton Club '(Salamanca)'</option>
                            <option value="3">El Búnker 'León'</option>
                        </select>
                    </div>

                    <div>
                        <label>Tipo de espacio</label>
                        <select name="" value={type} required onChange={(e) => setType(e.target.value)}>
                            <option value="" hidden>
                                tipo...
                            </option>
                            <option value={1}>Sala para ensayar</option>
                            <option value={2}>Sala de audiovisuales</option>
                            <option value={3}>Estudio/Sala de Conciertos</option>
                        </select>
                    </div>
                    <div>
                        <label>Precio máximo que quieres gastar</label>
                        <select name="" value={price} required onChange={(e) => setPrice(e.target.value)}>
                            <option value="" hidden>
                                max..
                            </option>
                            <option value={10}>10</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={200}>200</option>
                        </select>
                    </div>

                    <div>
                        <label>Fecha que necesitas</label>
                        <input
                            type="date"
                            name="start_date"
                            required
                            value={start_date}
                            onChange={(e) => setStart_date(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>¿Qué capacidad necesitas?</label>
                        <select value={capacity} required onChange={(e) => setCapacity(e.target.value)}>
                            <option value="" hidden>
                                Cantidad
                            </option>
                            <option value={1}>1</option>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={300}>300Max*</option>
                        </select>
                    </div>

                    <button className="searchButton">Buscar espacio</button>
                </form>

                {results && (
                    <div className="results-search">
                        {results.map((r) => (
                            <div key={r.id_room}>
                                <SearchCard r={r} start_date={start_date} />
                            </div>
                        ))}

                        {results.length === 0 && (
                            <div>
                                <i>Sin resultados</i>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;
