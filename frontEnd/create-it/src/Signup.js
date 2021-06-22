import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
//import './Signup.css';
import Helmet from 'react-helmet';
import {Formulario , Label,GrupoInput,
	Input,LeyendaError,
	IconoValidacion,ContenedorTerminos,
	ContenedorBotonCentrado,
	Boton,MensajeExito,
	MensajeError} from './Formularios/elementos/Formularios'
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCheckCircle, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons'

{
    /*TODO https://www.youtube.com/watch?v=tli5n_NqQW8*/
}

function Signup() {
    const [newUser, setnewUser] = useState({});
    const [error, setError] = useState();
    const user = useSelector((s) => s.user);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(newUser.password !== newUser.repeatedPassword){
          setError(`las contraseñas no coinciden`);  
        } else{
            const ret = await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        });
        const data = await ret.json();
        if (ret.ok) {
            dispatch({ type: 'LOGIN', user: data });
        } else {
            setError(data.error);
        }
        } 
        
    };

    if (user) return <Redirect to="/" />;

    return (
        <div className="registro">
            <Helmet>
                <title>CreateIt-Registro</title>
            </Helmet>
            <main>
                <h1>Registrate!</h1>
                <Formulario onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="name">Nombre</Label>
                        <GrupoInput>
                          <Input
                            name="name"
                            required
                            placeholder="Nombre" id="name"
                            value={newUser.name || ''}
                            onChange={(e) => setnewUser({ ...newUser, name: e.target.value })}
                        />  
                        <IconoValidacion icon={faCheckCircle}/>
                        </GrupoInput>
                        <LeyendaError>{error}</LeyendaError>

                    </div>
                        <div>
                        <Label htmlFor="last_name">Nombre</Label>
                        <GrupoInput>
                          <Input
                            name="last_name"
                            required
                            placeholder="Apellido..." id="last_name"
                            value={newUser.last_name || ''}
                            onChange={(e) => setnewUser({ ...newUser, last_name: e.target.value })}
                        />  
                        <IconoValidacion icon={faCheckCircle}/>
                        </GrupoInput>
                        <LeyendaError>{error}</LeyendaError>
                    </div>
                    
                   
                   <div>
                        <Label htmlFor="email">Email</Label>
                        <GrupoInput>
                          <Input
                            name="email"
                            required
                            placeholder="Email..." id="email"
                            value={newUser.email || ''}
                            onChange={(e) => setnewUser({ ...newUser, email: e.target.value })}
                        />  
                        <IconoValidacion icon={faCheckCircle}/>
                        </GrupoInput>
                        <LeyendaError>{error}</LeyendaError>
                    </div>
                    
                    <div>
                        <Label htmlFor="password">Contraseña</Label>
                        <GrupoInput>
                          <Input
                            name="password"
                            required
                            placeholder="Password..." id="password"
                            value={newUser.password || ''}
                            onChange={(e) => setnewUser({ ...newUser, password: e.target.value })}
                        />  
                        <IconoValidacion icon={faCheckCircle}/>
                        </GrupoInput>
                        <LeyendaError>{error}</LeyendaError>
                    </div>
                  
                   
                   <div>
                        <Label htmlFor="repeatedPassword">Repita la contraseña</Label>
                        <GrupoInput>
                          <Input
                            name="repeatedPassword"
                            required
                            placeholder="Repeat password..." id="repeatedPassword"
                            value={newUser.repeatedPassword || ''}
                            onChange={(e) => setnewUser({ ...newUser, repeatedPassword: e.target.value })}
                        />  
                        <IconoValidacion icon={faCheckCircle}/>
                        </GrupoInput>
                        <LeyendaError>{error}</LeyendaError>
                    </div>
                    <ContenedorTerminos>
                       <Label>
                        <input type="checkbox" name="terminos" id="terminos" />
                        Acepto los términos y condiciones
                    </Label> 
                    </ContenedorTerminos>
                
                        {error && <MensajeError>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                            <b>Error:</b> Por favor rellena el formulario correctamente
                        </MensajeError>}
                    
                    <ContenedorBotonCentrado>
                      <Boton>Registro</Boton>  
                      <MensajeExito>Registro completado con éxito</MensajeExito>
                    </ContenedorBotonCentrado>
                    
                    
                   

                    

                    {error && <div>{error}</div>}
                </Formulario>
                <p>
                    <Label>Ya tienes cuenta?</Label>
                    <Link to="/login">Inicia sesión</Link>
                </p>
            </main>
        </div>
    );
}




export default Signup;
