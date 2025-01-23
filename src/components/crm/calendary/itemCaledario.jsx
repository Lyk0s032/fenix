import React, { useEffect, useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/action/action';
import dayjs from 'dayjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ItemCalendario(props){
    const calendary = useSelector(store => store.calendar);
    const user = props.user; 

    
    const { itemCalendar } = calendary;
    console.log(itemCalendar)
    return (
        <>
            {
                itemCalendar ?
                    <ItemCalendar user={user}/>
                : null
            }
        </>
    ) 
}
function ItemCalendar(props){
    const user = props.user;
    const navigate = useNavigate();
    const [data, setData] = useState(null)
    const ref = useRef(null)
    const dispatch = useDispatch();
    
    const calendary = useSelector(store => store.calendar);

    const { itemCalendar } = calendary;
    console.log(itemCalendar)

    // ENVIO DE EMAIL
    const [email, setEmail] = useState({
        cliente: itemCalendar.client.nombreEmpresa,
        direccion: itemCalendar.direccion,
        transporte: 'propio',
        de: itemCalendar.hour, 
        a: null
    })
    // EDITAR FECHA
    const [form, setForm] = useState(itemCalendar ?{
        note: itemCalendar.note,
        fecha: itemCalendar.time.split('T')[0],
        hour: itemCalendar.hour
    } : null);

    const [loading, setLoading] = useState(false);

    const handleEmail = async () => {
        if(!email.direccion) return dispatch(actions.HandleAlerta('Indicanos por favor el lugar de la visita.', 'mistake'));
        if(!email.cliente || !email.transporte || !email.de || !email.a) return dispatch(actions.HandleAlerta('No puedes dejar campos vacios.', 'mistake'));
        setLoading(true);
        let body = {
            cliente: email.cliente,
            direccion: email.direccion,
            asesor: itemCalendar.user.name,
            emailAsesor: itemCalendar.user.email,
            transporte: email.transporte,
            fecha: itemCalendar.time.split('T')[0],
            de: email.de,
            a: email.a
        }
 
        const sendEmail = await axios.post('api/calendario/sendEmail', body)
        .then((res) => {
            setLoading(false)
            dispatch(actions.HandleAlerta('Perfecto, correo enviado a talento humano.', 'positive'))
        })
        .catch(err => {
            setLoading(false)
            dispatch(actions.HandleAlerta('Perfecto, correo enviado a talento humano.', 'positive'));
        })
        return sendEmail
    }
    const handleEdit = async () => {
        if(loading) return null
        if(!form.note || !form.fecha || !form.hour) return dispatch(actions.HandleAlerta('No puedes dejar campos vacios.', 'mistake'))
        setLoading(true);
        let body ={
            calendaryId: itemCalendar.id,
            time: form.fecha,
            note: form.note,
            hour: form.hour
        }
        const sendPeticion = await axios.put('api/calendario/new', body)
        .then((res) => {
            setLoading(false);
            dispatch(actions.HandleAlerta('Fecha actualizada con éxito', 'positive'))
            dispatch(actions.axiosToGetCalendar(user.id,false))
            dispatch(actions.getItemCalendar(res.data))
        })
        .catch(err => {
            setLoading(false);
            dispatch(actions.HandleAlerta('No hemos logrado actualizar esto, intentalo más tarde', 'mistake'))

        })
        return sendPeticion;
    }

    const handleVisualizar = async () => {
        if(itemCalendar.type == 'contacto'){ 
            dispatch(actions.axiosToGetCall(itemCalendar.call.id, true))
            navigate('/contactos?w=action')
        }else if(itemCalendar.type == 'visita'){
            dispatch(actions.axiosToGetVisita(itemCalendar.visitum.id, true))
            navigate('/visitas?w=action')
        }else if(itemCalendar.type == 'cotizacion'){
            dispatch(actions.axiosToGetCotizacion(itemCalendar.cotizacion.id, true))
            navigate('/cotizaciones?cotizacion=action')

        }
    }

    return (
        <div className="nubeItemCalendario" id="nubeAcciones" >
            {
                !itemCalendar ?
                <div className="containerNubeCalendario">
                    <div className="notFound">
                        <h1>Selecciona una fecha</h1>
                    </div>
                </div>
                :
            <div className="containerNubeCalendario">
                <div className="topNavigationNube">
                    <div className="containerTopNavi">
                        <nav>
                            {
                                itemCalendar.state == 'active' ?
                                <ul>
                                    <li className={!data ? 'Active' : null}
                                    onClick={() => setData(null)}>
                                        <span>Detalles</span>
                                    </li>
                                    <li className={data == 'editar' ? 'Active' : null}
                                    onClick={() => setData('editar')}>
                                        <span>Editar</span>
                                    </li>
                                    {
                                        itemCalendar.type == 'visita' ?
                                            <li className={data == 'email' ? 'Active' : null}
                                            onClick={() => setData('email')}>
                                                <span>Talento humano</span>
                                            </li>
                                        : null
                                    }
                                </ul>
                                : 
                                <ul>
                                    <li className={!data ? 'Active' : null}
                                    onClick={() => setData(null)}>
                                        <span>Detalles</span>
                                    </li>
                                </ul>
                            }
                        </nav>
                        <button className="close" onClick={() => {
                            document.querySelector("#nubeAcciones").classList.toggle('nubeItemCalendarioActive')
                        }}>
                            <MdClose className="icon" />
                        </button>
                    </div>
                </div>
                <div className="dataEvent">
                    <div className="containerDataEvent">
                        <div className={itemCalendar.state == 'active' ? 
                            "topAlert" : itemCalendar.state == 'cancelado' ? 
                        "topAlert Danger" : itemCalendar.state == 'cumplido' ?
                    "topAlert Great" : itemCalendar.state == 'aplazado' ? 
                "topAlert Wait" : null}>
                            <span>{itemCalendar.state}</span>
                        </div>
                        {
                            data == 'email' ? null :
                        <div className="about">
                            <div className="asesor">
                                <label htmlFor="">Encargado</label>
                                <div className="user">
                                    <div className="photo">
                                        <img src={itemCalendar.user.photo} alt="" />
                                    </div>
                                    <div className="data">
                                        <h3>{itemCalendar.user.name} </h3>
                                        <span>{itemCalendar.user.rango}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="asesor Client">
                                <label htmlFor="">Cliente</label>
                                <div className="user">
                                    <div className="photo">
                                        <img src={itemCalendar.client.photo} alt="" />
                                    </div>
                                    <div className="data">
                                        <h3>{itemCalendar.client.nombreEmpresa} </h3>
                                        <span>{itemCalendar.client.type}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }

                        {
                        !data ?
                            <div className="calendarData">
                                <div className="containerCalendarData">
                                    <div className="type">
                                        <label htmlFor="">Tipo</label><br />
                                        <span>{itemCalendar.type}</span>
                                    </div> 
                                    <div className="title">
                                        <h3>{itemCalendar.note}</h3>
                                    </div>
                                    <div className="dataTime">
                                        <span>{ dayjs(itemCalendar.time.split('T')[0]).format('dddd, MMMM D, YYYY')}</span><br />
                                        <strong>{itemCalendar.hour}</strong>
                                    </div>
                                    <div className="buttonActions">
                                        {
                                            itemCalendar.state == 'active' ? 
                                            <button onClick={() => handleVisualizar()}>
                                                <span>Visualizar</span>
                                            </button>
                                            :null 
                                        }
                                    </div>
                                </div>
                            </div>
                        : data == 'editar' ?
                            <div className="calendarData Edit">
                                <div className="containerCalendarData">

                                    <div className="title">
                                        <label htmlFor="">Nombre de la nota</label><br />
                                        <input type="text"  
                                        onChange={(e) => {
                                            setForm({
                                                ...form,
                                                note: e.target.value
                                            })
                                        }} value={form.note} /> <br /><br />
                                    </div>
                                    <div className="dataTime">
                                        <label htmlFor="">Fecha </label><br />
                                        <input type="date" value={form.fecha} 
                                        onChange={(e) => {
                                            setForm({
                                                ...form,
                                                fecha: e.target.value
                                            })
                                        }} /><br /><br />

                                        <label htmlFor="">Hora</label><br />
                                        <select name="" id="" onChange={(e) => {
                                            setForm({
                                                ...form,
                                                hour: e.target.value
                                            })
                                        }} value={form.hour}>
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
                                    <div className="buttonActions">
                                        <button onClick={() => handleEdit()}>
                                            <span>{loading ? 'Actualizando' : 'Actualizar'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        : data == 'email' ?
                            <div className="calendarData Email">
                                <div className="containerEmail">
                                    <div className="top">
                                        <div className="smallLogo">
                                            <img src="https://www.zarla.com/images/zarla-talento-h-1x1-2400x2400-20220203-m7mv6fbc7cb8mb9crv48.png?crop=1:1,smart&width=250&dpr=2" alt="" />
                                        </div>
                                    </div>
                                    <div className="formEmailToTalento">
                                        <div className="containerForm">
                                            <div className="horizontal">
                                                <div className="inputDiv">
                                                    <label htmlFor="">Nombre del cliente</label><br />
                                                    <input type="text" 
                                                    onChange={(e) => {
                                                        setEmail({
                                                            ...email,
                                                            cliente: e.target.value
                                                        })
                                                    }} value={email.cliente} />
                                                </div>

                                                <div className="inputDiv">
                                                    <label htmlFor="">Dirección</label><br />
                                                    <input type="text" onChange={(e) => {
                                                        setEmail({
                                                            ...email,
                                                            direccion: e.target.value
                                                        })
                                                    }} value={email.direccion} />
                                                </div>
                                            </div>

                                            <div className="inputDiv">
                                                <label htmlFor="">Medio de transporte</label><br />
                                                <select name="" id="" onChange={(e) => {
                                                    setEmail({
                                                        ...email,
                                                        transporte: e.target.value
                                                    })
                                                }} value={email.transporte}>
                                                    <option value="propio">Vehiculo propio</option>
                                                    <option value="publico">Transporte publico</option>
                                                </select>
                                            </div>
                                            <div className="horizontalDiv">
                                                <label htmlFor="">Horario de visita</label>
                                                <div className="containerHorizontal">
                                                    <div className="inputDiv">
                                                        <label htmlFor="">De</label><br />
                                                        <select name="" id="" onChange={(e) => {
                                                            setEmail({
                                                                ...email,
                                                                de: e.target.value
                                                            })
                                                        }} value={email.de}>
                                                            <option value="7:00 AM">7:00</option>
                                                            <option value="8:00 AM">8:00</option>
                                                            <option value="9:00 AM">9:00</option>
                                                            <option value="10:00 AM">10:00</option>

                                                        </select>
                                                    </div>

                                                    <div className="inputDiv">
                                                        <label htmlFor="">a</label><br />
                                                        <select name="" id="" onChange={(e) => {
                                                            setEmail({
                                                                ...email,
                                                                a: e.target.value
                                                            })
                                                        }} value={email.a}>
                                                            <option value="7:00 AM">7:00</option>
                                                            <option value="8:00 AM">8:00</option>
                                                            <option value="9:00 AM">9:00</option>
                                                            <option value="10:00 AM">10:00</option>

                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="inputDiv">
                                                <button onClick={() => handleEmail()}>
                                                    <span>{loading ? 'Enviando correo' : 'Informar a talento humano'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        : null
                        }
                    </div>
                </div>
            </div>
            }
        </div>
    )
}