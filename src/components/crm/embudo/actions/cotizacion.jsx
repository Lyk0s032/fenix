import axios from 'axios';
import React, { useState } from 'react';
import { MdArrowRight, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import * as actions from '../../../store/action/action';
import { useDispatch } from 'react-redux';
import { useNavigate, useNavigation } from 'react-router-dom';

export default function CotizacionAgendar(props){
    const user = props.user;
    const dispatch = useDispatch();
    const item = props.item;
    const navigate = useNavigate();
    const fechaItem = item.calendaries ? item.calendaries.find(dl => dl.state == 'active') : null
    
    const [form, setForm] = useState({
        calendaryId: null,
        title: null, 
        nit: item.client.nit, 
        nro: 0, 
        fecha: null, 
        bruto: 0, 
        descuento: 0, 
        neto: 0, 
    });
    const [iva, setIva] = useState(true);
    const [loading, setLoading] = useState(false);  
 
    // FUNCION PARA CREAR COTIZACIÓN
    const sendCotizacion = async () => {
        if(!form.title) return dispatch(actions.HandleAlerta('Debes incluir al menos un nombre a la cotización', 'mistake'));
        if(form.bruto && !form.fecha) return dispatch(actions.HandleAlerta('Si haz puesto un valor bruto, debes llenar los otros campos', 'mistake'));
         
        setLoading(true);

        let brt = form.bruto; 
        let descuento = form.descuento;
    
        let valorConDescuento = Number(brt) - Number(descuento); 
        let valorConIva = valorConDescuento * (19 / 100);

        let valorFinal =  iva ? valorConDescuento + valorConIva : valorConDescuento;

        let body = {
            callId: item.case ? item.id : null, 
            visitaId: !item.case ? item.id : null,  
            clientId: item.client.id, 
            userId:user.id, 
            calendaryId: fechaItem ? fechaItem.id : null,
            name:form.title, 
            nit: form.nit, 
            nro: form.nro, 
            fecha: form.fecha, 
            bruto: form.bruto, 
            iva: iva ? 19 : 0, 
            descuento: form.descuento,  
            neto: valorFinal,
            state: !valorFinal ? 'desarrollo' : 'pendiente'
        }

        console.log(body)
        const sendCoti = await axios.post(item.case ? `api/call/agendaCotizacion` : `api/visitas/agendaCotizacion`, body)
        .then((res) => {
            setLoading(false);
            dispatch(actions.HandleAlerta('Cotización creada con éxito', 'positive'));
            dispatch(actions.AxiosGetAllEmbudo(user.id, false))
            navigate('/cotizaciones')

        })
        .catch(err => {
            console.log(err)
            setLoading(false);
            dispatch(actions.HandleAlerta('No hemos logrado crear esta cotización', 'mistake'))
        })
        return sendCoti
    }
    return (
    
        <div className="formAction">
            <div className="formAction">
                <div className="headerAction">
                    <h3>Perfecto, ¡Hagamos la cotización!</h3>
                </div>
                <div className="containerActionForm">
                    <div className="form">
                        <div className="horizontalDiv">
                            <div className="inputDiv">
                                <label htmlFor="">
                                    Nombre de la cotización 
                                </label><br />
                                <input type="text" onChange={((e) => {
                                    setForm({
                                        ...form,
                                        title: e.target.value
                                    })
                                })} value={form.title}/>
                            </div>

                            <div className="inputDiv">
                                <label htmlFor="">
                                    Nro de cotización 
                                </label><br />
                                <input type="text" onChange={((e) => {
                                    setForm({
                                        ...form,
                                        nro: e.target.value
                                    })
                                })} value={form.nro} maxLength={5}/>
                                
                            </div>
                        </div>

                        <div className="horizontalDiv">
                            <div className="inputDiv">
                                <label htmlFor="">
                                    Valor bruto: <strong>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(form.bruto)}</strong>
                                </label><br />
                                <input type="text" onChange={((e) => {
                                    setForm({
                                        ...form,
                                        bruto: e.target.value
                                    })
                                })} value={form.bruto} />
                            </div>

                            <div className="inputDiv">
                                <label htmlFor="">
                                    Descuento: <strong>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(form.descuento)}</strong>
                                </label><br />
                                <input type="text" onChange={((e) => {
                                    setForm({
                                        ...form,
                                        descuento: e.target.value
                                    })
                                })} value={form.descuento}/>
                                
                            </div>
                        </div>

                        <div className="horizontalDiv">
                            
                            <div className="inputDiv">
                                <label htmlFor="">
                                    NIT 
                                </label><br />
                                <input type="text" onChange={((e) => {
                                    setForm({
                                        ...form,
                                        nit: e.target.value
                                    })
                                })} value={form.nit}/>
                            </div>

                            <div className="inputDiv">
                                <label htmlFor="">
                                    Fecha de cotización 
                                </label><br />
                                <input type="date" onChange={((e) => {
                                    setForm({
                                        ...form,
                                        fecha: e.target.value
                                    })
                                })} value={form.fecha}/>
                                
                            </div>
                        </div>
                        <div className="horizontalDiv">
                            <div className="inputDiv">
                                <div className="iva">
                                    <input className='iiva' type="checkbox" onClick={((e) => {
                                        setIva(!iva);
                                    })} value={form.iva} checked={iva}></input>
                                    <label htmlFor="" >{iva ? 'Iva incluido' : !iva ? 'Sin iva' : null}</label>
                                </div>
                            </div>
                            <div className="inputDiv">
                            </div>
                            
                        </div>

                        <div className="inputDiv">
                            <button className='send' onClick={() => sendCotizacion()}>
                                <span>
                                    {loading ? 'Creando cotización' : 'Crear cotización'}
                                </span>
                                <MdOutlineKeyboardArrowRight className="icon" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}