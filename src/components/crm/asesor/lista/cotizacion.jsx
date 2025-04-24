import React, { useState } from 'react';
import { MdArrowBack, MdOutlineMessage } from 'react-icons/md';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import axios from 'axios';

export default function CotizacionSeeUser(){

    const embudo = useSelector(store => store.embudo);
    const usuario = useSelector(store => store.usuario);
    const user = usuario.user.user;
    const { cotizacion, loadingCotizacion, notesCoti, loadingNotesCoti} = embudo;

    const [note, setNote] = useState(null);

    const [option, setOption] = useState();
    const dispatch = useDispatch();
    const closeCotizacion = () => {

        const coti = document.querySelector("#cotizacion").classList.toggle('cotizacionActive');
        return coti;
    }

    const addNote = async () => {
        if(!note || note == '') return dispatch(actions.HandleAlerta('Ingresa una nota', 'mistake'))
        let body = {
            type: '',
            clientId: cotizacion.client.id,
            userId: user.id,
            manual: 'manual',
            note: note, 
            cotizacionId: cotizacion.id
        }
        const sendNote = await axios.post('api/notes/addManual', body)
        .then((res) => {
            setNote('');
            dispatch(actions.axiosGetNotesCoti(cotizacion.id, false));
            dispatch(actions.HandleAlerta('Agregado con éxito', 'positive'));
            return true
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado ingresar esto.', 'mistake'));
            return null
        })
        return sendNote;
    }
    return (
        <div className="cotizacion" id="cotizacion">
            { 
                loadingCotizacion || !cotizacion ?
                <div className="containerCotizacion">
                    <div className="loading">
                        <h1>Cargando</h1>
                    </div>
                </div> 
            :
            <div className="containerCotizacion">
                <div className="topCotizacion">
                    <div className="containerTop">
                        <div className="LeftBtnAndTitle">
                            <button onClick={() => closeCotizacion()}>
                                <MdArrowBack className="icon" />
                            </button>
                            <h3>Cotización</h3>
                        </div>
                        {
                            !option ?
                            <div className="actionsAndOptions">
                                <div className="dinamiActions">
                                </div>
                                <div className="edit">
                                    <button onClick={() => setOption('message')}>
                                        <MdOutlineMessage className="icon"  />
                                    </button>
                                </div>
                            </div>
                            :
                            <div className="actionsAndOptions">
                                <div className="dinamiActions">
                                    <button className='Wait' onClick={() => setOption(null)}>
                                        <AiOutlineArrowLeft className='icon' /><br />
                                        <span>Regresar</span>
                                    </button>
                                </div>
                                <div className="edit">
                                    <button>
                                        <MdOutlineMessage className="icon"  />
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="bodyCotizacion">
                    <div className="containerBody">
                        <div className="topAlert">
                            <div className="containerAlert">
                                <span>{cotizacion.state}</span>
                            </div>
                        </div>
                        {
                            option == 'message' ?
                            <div className="CotizacionDetails">
                                <div className="history">
                                    <div className="getHistory">
                                        <div className="scrollHistory">
                                            {console.log(notesCoti)}
                                            <div className="notes">
                                                    {
                                                        !notesCoti || loadingNotesCoti ?
                                                            <h1>Cargando...</h1>
                                                        : notesCoti == 404 ?
                                                            <h1>No hay notas</h1>
                                                        : notesCoti && notesCoti.length ?
                                                            notesCoti.map((c, i) => {
                                                                return (
                                                                    <div className="note" key={i+1}>
                                                                        <span>{c.note}</span>
                                                                        <div className="time">
                                                                            <strong>14 de Abril del 2025</strong>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        : null
                                                    }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="getData">
                                        <div className="containerGetData">
                                            <input type="text" placeholder='Anexa información de la cotización aquí...' 
                                            onChange={((e) => {
                                                setNote(e.target.value)
                                            })} onKeyDown={(e) => {
                                                if(e.key == 'Enter'){
                                                    addNote()
                                                }
                                            }} value={note}/>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="CotizacionDetails">
                                <div className="containerDetails">
                                    <div className="business">
                                        <img src="https://www.metalicascosta.com.co/assets/img/logo_metalicas_costa.png" alt="" />
                                    </div>
                                    <div className="dataClientAndAsesor">
                                        <div className="containerThat">
                                            <div className="asesor">
                                                <h3>{cotizacion.user ? cotizacion.user.name ? cotizacion.user.name : 'No definido' : 'no definido'}</h3>
                                                <span className="nro">Nro. {cotizacion.nro}</span><br />
                                                <span className="time">{dayjs(cotizacion.fecha.split('T')[0]).format('DD [de] MMMM [del] YYYY')}</span>
                                            </div>
                                            <div className="asesor Cl">
                                                <h3>{cotizacion.client.nombreEmpresa}</h3>
                                                <span className="nro">Nit. {cotizacion.client.nit}</span><br /> 
                                                <span className="time">{cotizacion.state}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="informationCoti">
                                        <div className="containerInformation">
                                            <div className="itemCoti">
                                                <span>
                                                    Nombre de cotización
                                                </span>
                                                <h3>{cotizacion.name}</h3>
                                            </div>
                                            <div className="itemCoti">
                                                <span>
                                                    Valor bruto
                                                </span>
                                                <h3 className='bruto'>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(cotizacion.bruto)} <span>COP</span></h3>
                                            </div>
                                            <div className="itemCoti">
                                                <span>
                                                    Descuento
                                                </span>
                                                <h3 className='descuento'>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(cotizacion.descuento)}  <span>COP</span></h3>
                                            </div>
                                            <div className="itemCoti">
                                                <span>
                                                    Iva incluido
                                                </span>
                                                <span className="iva">{cotizacion.iva ? 'Aplica' : 'No aplica'}</span>
                                            </div>

                                            <div className="itemCoti Neto">
                                                <span>
                                                    Neto
                                                </span>
                                                <h3>
                                                {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(cotizacion.neto)} <span>COP</span>
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            }
        </div>
    )
}