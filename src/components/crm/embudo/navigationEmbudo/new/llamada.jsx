import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as actions from '../../../../store/action/action';
import axios from 'axios';

export default function Llamada(props){
    const asesores = props.asesores;
    const user = props.user;
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    const sistema = useSelector(store => store.system);
    const { cliente, step } = sistema;
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombre: null,
        time: null,
        hora: null,
        contacto: null,
        asesorId: user.rango == 'lider' ? null : user.id
    })
    const [loading, setLoading] = useState(false);
    // Función para resetear
    const reset = () => {
        setForm({
            nombre: '',
            time: '',
            hora: '',
            contacto: ''
        })
    }
    // Función si es llamada.
    const createCall = async () => {
        if(loading) return null; 
        if(!form.nombre || !form.time || !form.hora) return dispatch(actions.HandleAlerta('No puedes dejar campos vacios', 'mistake'))
        if(!form.asesorId) return dispatch(actions.HandleAlerta('Selecciona un asesor', 'mistake'))
        
        // Caso contrario, avanzamos
        setLoading(true)
        let body = {
            title: form.nombre,
            caso: 'contacto 1',
            clientId: cliente.id,
            userId: form.asesorId,
            time: form.time,
            hour: form.hora,
            contactId: parseInt(form.contacto)   
        }
        console.log(body)
        const add = await axios.post('api/call/create', body)
        .then(res => {
            console.log(res)
            setLoading(false);
            dispatch(actions.AxiosGetAllEmbudo(user.id, false))
            dispatch(actions.HandleAlerta('Creado con éxito', 'positive'))
            navigate('/')
            reset()
        })
        .catch(err => {
            console.log(err)
            setLoading(false);
            dispatch(actions.HandleAlerta('Creado con éxito', 'positive'))

        })
        return add
    }

    // Función si es visita
    const createVisita = async () => {
        if(loading) return null
        if(!form.nombre || !form.time || !form.hora) return dispatch(actions.HandleAlerta('No puedes dejar campos vacios', 'mistake'))
        // Caso contrario, avanzamos
        setLoading(true)
        let body = {
            title: form.nombre,
            clientId: cliente.id,
            userId: form.asesorId,
            time: form.time,
            hour: form.hora,
            contactId: parseInt(form.contacto)   
        }
        console.log(body)
        const add = await axios.post('api/visitas/create', body)
        .then(res => {
            console.log(res)
            setLoading(false);
            dispatch(actions.AxiosGetAllEmbudo(user.id, false))
            dispatch(actions.HandleAlerta('Creado con éxito', 'positive'))
            navigate('/visitas')
            reset()
        })
        .catch(err => {
            console.log(err)
            setLoading(false);
            dispatch(actions.HandleAlerta('Creado con éxito', 'positive'))

        })
        return add
    }
    return (
        <div className="leftNavEmbudoNew">
            <div className="containerLeftNavEmbudoNew">
                <div className="titleNew">
                    <h3>Nueva {step == 'visita' ? 'visita' : step == 'call' ? 'llamada' : null} a <strong>{cliente.nombreEmpresa}</strong></h3>
                </div>
                <div className="formNewCoti">
                    <div className="containerFormNew">
                        <div className="inputDiv">
                            <label htmlFor=""> Nombre de la {step == 'visita' ? 'visita' : step == 'call' ? 'llamada' : null}</label><br />
                            <input type="text" placeholder='Escribe aquí'
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    nombre: e.target.value
                                })
                            }} value={form.nombre}/>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Selecciona la fecha </label><br />
                            <input type="date" placeholder='Escribe aquí' 
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    time: e.target.value
                                })
                            }} value={form.time}/>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Hora de la {step == 'visita' ? 'visita' : step == 'call' ? 'llamada' : null} {form.hora} </label><br />
                            <select name="" id="" 
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    hora: e.target.value
                                })
                            }} value={form.hora}>
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
                            <label htmlFor="">Selecciona contacto </label><br />
                            <select className='contacto' name="" id="" 
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    contacto: e.target.value
                                })
                            }} value={form.contacto}>
                                    <option value="">Selecciona un contacto</option>
                                    {
                                        cliente.contacts && cliente.contacts.length ?
                                            cliente.contacts.map((cont, i) => {
                                                return (
                                                    <option value={cont.id}>{cont.nombre}</option>
                                                )
                                            })
                                            : <span>No hay contactos</span>
                                    }

                            </select>
                            <button className='add' onClick={() => {
                                params.set('add', 'contacto')
                                setParams(params);
                            }}>
                                <AiOutlinePlus className="icon" />
                            </button>
                        </div>
                        {
                            user.rango == 'lider' || user.rango == 'comercial' ? 
                                <div className="inputDiv"> 
                                    <label htmlFor="">Selecciona un asesor</label><br />
                                    <select name="" id="" 
                                    onChange={(e) => {
                                        setForm({
                                            ...form,
                                            asesorId: e.target.value
                                        })
                                    }} value={form.asesorId}>
                                        {
                                            asesores && asesores.length ?
                                                asesores.map((asesor, i) => {
                                                    return (
                                                        asesor.id != user.id && asesor.rango == 'asesor' ?
                                                            <option value={asesor.id}>{asesor.name}</option>
                                                        :null
                                                    )
                                                })
                                            : <span>No hay</span>
                                        }
                                    
                                    </select>
                                </div>
                            : null  
                        } 
                        <div className="inputDiv">
                            <button className="create" onClick={() => {
                                step == 'call' ? createCall() 
                                : step == 'visita' ? createVisita()
                                :null
                            } }>
                                <span>{loading ? 'Asignando llamada' : step == 'visita' ? 'Agendar visita' : step == 'call' ? 'Agendar llamada' : null}</span> 
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}