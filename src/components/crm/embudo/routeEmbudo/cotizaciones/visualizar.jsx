import React, { useState } from 'react';
import { AiOutlineArrowLeft, AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdAccessTime, MdArrowBack } from 'react-icons/md';
import { useParams, useSearchParams } from 'react-router-dom';
import * as actions from '../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

export default function CotizacionesPanel(props){
    const user = props.user;
    const [params, setParams] = useSearchParams();
    const [options, setOptions] = useState(null);
    const [state, setState] = useState('espera'); 
    const dispatch = useDispatch();

    const embudo = useSelector(store => store.embudo);
    const { cotizacion, loadingCotizacion } = embudo;

    const calendary = cotizacion.calendaries && cotizacion.calendaries.length ? cotizacion.calendaries.find((it) => it.state == 'active') : null;

    const [form, setForm] = useState({
        calendaryId: null,
        title: cotizacion.name, 
        nit: cotizacion.nit, 
        nro: cotizacion.nro, 
        fecha: cotizacion.fecha, 
        bruto: cotizacion.bruto, 
        descuento: cotizacion.descuento, 
        neto: cotizacion.neto, 
    });
    const [iva, setIva] = useState(cotizacion.iva == 19 ? true : false);
    const [loading, setLoading] = useState(false);

    const [aplazar, setAplazar] = useState({
        time: null,
        hour: null
    })
    // ACTUALIZAR COTIZACIÓN
    const updateCotizacion = async () => {
        if(!form.bruto) return dispatch(actions.HandleAlerta('Ingresa un valor bruto'));
        if(!form.title) return dispatch(actions.HandleAlerta('Debes asignar un nombre a esta cotización'));
        if(!form.fecha) return dispatch(actions.HandleAlerta('La fecha no puede estar vacia.'));
        setLoading(true);
        let brt = form.bruto; 
        let descuento = form.descuento;
    
        let valorConDescuento = Number(brt) - Number(descuento); 
        let valorConIva = valorConDescuento * (19 / 100);

        let valorFinal =  iva ? valorConDescuento + valorConIva : valorConDescuento;

        let body = {
            clientId: cotizacion.client.id,
            cotizacionId: cotizacion.id, 
            userId:user.id, 
            name:form.title, 
            nit: form.nit, 
            nro: form.nro, 
            fecha: form.fecha, 
            bruto: form.bruto, 
            iva: iva ? 19 : 0, 
            descuento: form.descuento,  
            neto: valorFinal,
            state: cotizacion.state == 'aplazado' ? 'aplazado' : !valorFinal ? 'desarrollo' : 'pendiente'
        }
        const updateCoti = await axios.put('/api/cotizacion/add', body)
        .then((res) => {
            setLoading(false);
            dispatch(actions.HandleAlerta('Actualizado con éxito', 'positive'));
            dispatch(actions.AxiosGetAllEmbudo(user.id, false));
            params.delete('cotizacion');
            setParams(params);
        })
        .catch((err) => {
            setLoading(false);
            dispatch(actions.HandleAlerta('Error', 'mistake'));
        })
        return updateCoti;

    }
    // CAMBIAR DE ESTADO LA COTIZACIÓN
    const changeState = async (state) => {
        let body = {
            cotizacionId: cotizacion.id,
            state,

        }
        const sendChangeState = await axios.put('api/cotizacion/state', body)
        .then((res) => {
            dispatch(actions.HandleAlerta("Éxito", "positive"))
            dispatch(actions.AxiosGetAllEmbudo(user.id, false))
            params.delete('cotizacion')
            setParams(params);
            return res;

        })
        .catch(err => {
            dispatch(actions.HandleAlerta("No hemos logrado cambiar este estado", "mistake"))
            return err;

        })
        return sendChangeState;
    }    
    // APLAZAR COTIZACIÓN
    const handleAplazarCotización = async () => {
        if(loading) return null 
        if(!aplazar.time || !aplazar.hour) return dispatch(actions.HandleAlerta('Llena los campos', 'mistake'))
        setLoading(true);
        const fechaItem = cotizacion.calendaries && cotizacion.calendaries.length ? cotizacion.calendaries.find((it) => it.state == 'active') : null;
        let body = {
            title: `Aplazada - ${cotizacion.name}`,
            userId: user.id,
            clientId: cotizacion.client.id,
            calendaryId: fechaItem ? fechaItem.id : null,
            cotizacionId: cotizacion.id,
            time: aplazar.time,
            hour: aplazar.hour
        }

        const sendAplazar = await axios.put('api/cotizacion/aplazar', body)
        .then((res) => {
            setLoading(false)
            dispatch(actions.HandleAlerta(`Aplazado para ${aplazar.time}`, 'positive'))
            dispatch(actions.AxiosGetAllEmbudo(user.id, false));
            params.delete('cotizacion')
            setParams(params);
        })
        .catch((err) => {
            setLoading(false)
            dispatch(actions.HandleAlerta(`No hemos logrado aplazar esta cotización`, 'mistake'))
        })
        return sendAplazar;
    }
    return (
        <div className="cotizacion">
            {
            !cotizacion || loadingCotizacion ?
                <div className="containerCotizacion">
                    <h1>Cargando</h1>
                </div>
                :
                <div className="containerCotizacion">
                    <div className="top">
                        <div className="containerTop">
                            <div className="titleAndBack">
                                <button onClick={() => {
                                    params.delete('cotizacion');
                                    setParams(params);
                                }}>
                                    <MdArrowBack className='icon' />
                                </button>
                                <h1>Cotización</h1>
                                
                            </div>
                            {
                                cotizacion.state == 'pendiente' || cotizacion.state == 'aplazado' ?  
                                    // SI ES DESARROLLO HABILITAMOS
                                    options == 'edit' ?
                                    <div className="actionsAndOptions">
                                        <div className="dinamiActions">
                                            <button className='Wait' onClick={() => setOptions(null)}>
                                                <AiOutlineArrowLeft className='icon' /><br />
                                                <span>Regresar</span>
                                            </button>
                                        </div>
                                        <div className="edit">
                                            <button >
                                                <BsThreeDotsVertical className="icon"  />
                                            </button>
                                        </div>
                                    </div>
                                    : options == 'aplazar' ?
                                    <div className="actionsAndOptions">
                                        <div className="dinamiActions">
                                            <button className='Wait' onClick={() => setOptions(null)}>
                                                <AiOutlineArrowLeft className='icon' /><br />
                                                <span>Regresar</span>
                                            </button>
                                            <button className='Wait'>
                                                <MdAccessTime className="icon Wait" /><br />
                                                <span className='Wait'>Aplazar</span>
                                            </button>
                                        </div>
                                        <div className="edit">
                                            <button onClick={() => setOptions('edit')}>
                                                <BsThreeDotsVertical className="icon"  />
                                            </button>
                                        </div>
                                    </div>
                                    :
                                    <div className="actionsAndOptions">
                                        <div className="dinamiActions">
                                            <button onClick={() => changeState('aprobada')}>
                                            <AiOutlineCheckCircle className="icon Positive" /><br />
                                                <span className='Positive'>Aprobar</span>
                                            </button> 
                                            <button onClick={() => changeState('perdido')}>
                                                <AiOutlineCloseCircle className="icon Cancel" /> <br />
                                                <span className='Cancel'>Perder</span>
                                            </button >
                                            <button className='Wait' onClick={() => {
                                                setOptions('aplazar')
                                            }}>
                                                <MdAccessTime className="icon Wait" /><br />
                                                <span className='Wait'>Aplazar</span>
                                            </button>
                                        </div>
                                        <div className="edit">
                                            <button onClick={() => setOptions('edit')}>
                                                <BsThreeDotsVertical className="icon"  />
                                            </button>
                                        </div>
                                    </div>
                                : cotizacion.state == 'desarrollo' ?
                                        // SI ES DESARROLLO HABILITAMOS
                                    options == 'edit' ?
                                    <div className="actionsAndOptions">
                                        <div className="dinamiActions">
                                            <button className='Wait' onClick={() => setOptions(null)}>
                                                <AiOutlineArrowLeft className='icon' /><br />
                                                <span>Regresar</span>
                                            </button>
                                        </div>
                                        <div className="edit">
                                            <button >
                                                <BsThreeDotsVertical className="icon"  />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    :
                                    <div className="actionsAndOptions">
                                        <div className="dinamiActions">
                                            <button onClick={() => changeState('perdido')}>
                                                <AiOutlineCloseCircle className="icon Cancel" /> <br />
                                                <span className='Cancel'>Perder</span>
                                            </button >
                                        </div>
                                        <div className="edit">
                                            <button onClick={() => setOptions('edit')}>
                                                <BsThreeDotsVertical className="icon"  />
                                            </button>
                                        </div>
                                    </div>
                                : cotizacion.state == 'aprobada' ?
                                    options == 'edit' ?
                                        <div className="actionsAndOptions">
                                            <div className="dinamiActions">
                                                <button className='Wait' onClick={() => setOptions(null)}>
                                                    <AiOutlineArrowLeft className='icon' /><br />
                                                    <span>Regresar</span>
                                                </button>
                                            </div>
                                            <div className="edit">
                                                <button >
                                                    <BsThreeDotsVertical className="icon"  />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        :
                                        <div className="actionsAndOptions">
                                            
                                            <div className="edit">
                                                <button onClick={() => setOptions('edit')}>
                                                    <BsThreeDotsVertical className="icon"  />
                                                </button>
                                            </div>
                                        </div>
                                : null
                            }
                            
                        </div>
                        <div className="state">
                            {
                                cotizacion.state == 'pendiente' ?
                                <div className="slide">
                                    <span>Pendiente</span>
                                </div>
                                : cotizacion.state == 'desarrollo' ?
                                <div className="slide">
                                    <span>En desarrollo</span>
                                </div> 
                                : cotizacion.state == 'aplazado' ?
                                <div className="slide">
                                    <span>Aplazada para: {calendary ? calendary.time.split('T')[0] : null}</span>
                                </div>
                                : cotizacion.state == 'aprobada' ?
                                <div className="slide">
                                    <span>Aprobada</span>
                                </div>
                                : null
                            }
                            
                        </div>
                    </div>
                    {
                        options == 'aplazar' ? 
                        <div className="dataCotizacion">
                            <div className="containerDataCotizacion">
                                <div className="titleForm">
                                    <h1>Perfecto, ¿Qué fecha tienes en mente?</h1>
                                </div>
                                <div className="form">
                                    <div className="containerForm">
                                        <div className="inputDiv">
                                            <label htmlFor="">Selecciona fecha en el calendario</label><br />
                                            <input type="date" onChange={(e) => {
                                                setAplazar({
                                                    ...aplazar,
                                                    time: e.target.value
                                                })
                                            }} value={aplazar.time}/>
                                        </div>
                                        <div className="inputDiv">
                                            <label htmlFor="">Hora</label><br />
                                            <select name="" id="" onChange={(e) => {
                                                setAplazar({
                                                    ...aplazar,
                                                    hour: e.target.value
                                                })
                                            }} value={aplazar.hour}>
                                                <option value="7:00">7:00 AM</option>
                                                <option value="8:00">8:00 AM</option>
                                                <option value="9:00">9:00 AM</option>
                                                <option value="10:00">10:00 AM</option>
                                                <option value="11:00">11:00 AM</option>
                                                <option value="12:00">12:00 PM</option>
                                                <option value="13:00">1:00 PM</option>
                                                <option value="14:00">2:00 PM</option>
                                                <option value="15:00">3:00 PM</option>
                                                <option value="16:00">4:00 PM</option>
                                                <option value="17:00">5:00 PM</option>
                                                <option value="18:00">6:00 PM</option>
                                                <option value="19:00">7:00 PM</option>
                                                <option value="20:00">8:00 PM</option>
                                                <option value="21:00">9:00 PM</option>
                                                <option value="22:00">10:00 PM</option>
                                            
                                            </select>
                                        </div>
                                        <div className="inputDiv">
                                            <button onClick={() => handleAplazarCotización()}>
                                                <span>Aplazar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="dataCotizacion">
                            <div className="containerDataCotizacion">
                                <div className="logoCotizacion">
                                    <img src="https://www.metalicascosta.com.co/assets/img/logo_metalicas_costa.png" alt="" />
                                </div>
                                {
                                options == 'edit' ?
                                    <div className="dataCoti">
                                        
                                        <div className="valorCotizacion">
                                            <div className="containerValor">
                                                <div className="table">
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Nombre cotización</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <div className="inputDiv">
                                                                <input type="text" value={form.title} onChange={(e) => {
                                                                    setForm({
                                                                        ...form,
                                                                        title: e.target.value
                                                                    })
                                                                }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>NIT</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <div className="inputDiv">
                                                                <input type="text" value={form.nit} onChange={(e) => {
                                                                    setForm({
                                                                        ...form,
                                                                        nit: e.target.value
                                                                    })
                                                                }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Valor bruto</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <div className="inputDiv">
                                                                <input type="text" value={form.bruto} onChange={(e) => {
                                                                    setForm({
                                                                        ...form,
                                                                        bruto: e.target.value
                                                                    })
                                                                }}  />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Descuento</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <div className="inputDiv">
                                                                <input type="text" value={form.descuento} onChange={(e) => {
                                                                    setForm({
                                                                        ...form,
                                                                        descuento: e.target.value
                                                                    })
                                                                }}  />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Iva incluido {iva ? 'aplica' : 'no aplica'}</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <div className="inputDiv">
                                                                <input className='check' onClick={() => {
                                                                    setIva(!iva)
                                                                }} type="checkbox" checked={iva} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Fecha </h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <div className="inputDiv">
                                                                <input type="date" value={form.fecha.split('T')[0]} onChange={(e) => {
                                                                    setForm({
                                                                        ...form,
                                                                        fecha: e.target.value
                                                                    })
                                                                }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    

                                                    <div className="titleAndResponse Bruto">
                                                        <div className="titleTable">
                                                            <span>Neto</span>
                                                        
                                                            {
                                                                iva ? 
                                                                <h3>
                                                                    {
                                                                        new Intl.NumberFormat('es-CO', {currency:'COP'}).format((form.bruto - form.descuento) +((form.bruto - form.descuento) * (19/100)))
                                                                    }
                                                                    <span> COP</span>
                                                                </h3>
                                                                
                                                                :
                                                                <h3>
                                                                    {
                                                                        new Intl.NumberFormat('es-CO', {currency:'COP'}).format((form.bruto - form.descuento))
                                                                    }
                                                                    <span> COP</span>
                                                                </h3>
                                                            } 
                                                        </div>
                                                        <div className="responseTable">
                                                            <div className="inputDiv">
                                                                <button onClick={() => updateCotizacion()}>
                                                                    <span>{loading ? 'Actualizando..' : 'Actualizar' }</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                :
                                    <div className="dataCoti">
                                        <div className="topAbout">
                                            <div className="containerAbout">
                                                <div className="asesor">
                                                    <h3>{cotizacion.user.name}</h3>
                                                    <span>Nro. {cotizacion.nro}</span><br />
                                                    <span className='time'>{cotizacion.fecha.split('T')[0]}</span>
                                                </div>
                                                <div className="asesor Reverse">
                                                    <h3>{cotizacion.client.nombreEmpresa}</h3>
                                                    <span>Nit. {cotizacion.nit}</span><br />
                                                    <span className='time'>Pendiente</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="valorCotizacion">
                                            <div className="containerValor">
                                                <div className="table">
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Nombre cotización</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <h3 className='title'>
                                                                {cotizacion.name}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Valor bruto</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            {
                                                            cotizacion.bruto ?
                                                                <h3 className='bruto'>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(cotizacion.bruto)}<span> COP</span></h3>
                                                            :
                                                                <h3 className='bruto'><span>Sin definir</span></h3>
                                                                
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Descuento</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            {
                                                            cotizacion.descuento ?
                                                                <h3 className='descuento'>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(cotizacion.descuento)} <span>COP</span></h3>
                                                            :
                                                                <h3 className='descuento'><span>Sin definir</span></h3>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="titleAndResponse">
                                                        <div className="titleTable">
                                                            <h3>Iva incluido</h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <span className='iva'>{cotizacion.iva == 19 ? 'Aplica' : 'No aplica'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="titleAndResponse Bruto">
                                                        <div className="titleTable">
                                                            <h3>Neto </h3>
                                                        </div>
                                                        <div className="responseTable">
                                                            <h3>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(cotizacion.neto)} <span>COP</span></h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }

                </div>
            }
        </div>
    )
}