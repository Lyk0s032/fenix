import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CotizacionNew(props){
    const user = props.user;
    const sistema = useSelector(store => store.system);
    const dispatch = useDispatch();
    const { cliente, step } = sistema;
    const navigate = useNavigate();
    const [form, setForm] = useState({
        calendaryId: null,
        title: null, 
        nit: cliente.nit, 
        nro: 0, 
        fecha: null, 
        bruto: null, 
        descuento: null, 
        neto: 0, 
    });
    const [iva, setIva] = useState(19);
    const [loading, setLoading] = useState(false);  

       // FUNCION PARA CREAR COTIZACIÓN
       const sendCotizacion = async () => {
        if(!form.title) return dispatch(actions.HandleAlerta('Debes incluir al menos un nombre a la cotización', 'mistake'));
        if(!form.fecha) return dispatch(actions.HandleAlerta('Debes incluir al menos un nombre a la cotización', 'mistake'));
        
        if(form.bruto && !form.fecha) return dispatch(actions.HandleAlerta('Si haz puesto un valor bruto, debes llenar los otros campos', 'mistake'));
         
        setLoading(true);

        let brt = form.bruto; 
        let descuento = form.descuento;
    
        let valorConDescuento = Number(brt) - Number(descuento); 
        let valorConIva = valorConDescuento * (19 / 100);

        let valorFinal =  iva == 19 ? valorConDescuento + valorConIva : valorConDescuento;

        let body = {
            clientId: cliente.id, 
            userId:user.id, 
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
        const sendCoti = await axios.post(`api/cotizacion/add`, body)
        .then((res) => {
            console.log(res)
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
        <div className="leftNavEmbudoNew">
            <div className="containerLeftNavEmbudoNew">
                <div className="titleNew">
                    <h3>Nueva cotización a <strong>{cliente.nombreEmpresa}</strong></h3>
                </div>
                <div className="formNewCoti">
                    <div className="containerFormNew">
                        <div className="inputDiv">
                            <label htmlFor="">Nombre de cotización</label><br />
                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                setForm({
                                    ...form,
                                    title: e.target.value
                                })
                            }} value={form.title} />
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Numero cotización</label><br />
                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                setForm({
                                    ...form,
                                    nro: e.target.value
                                })
                            }} value={form.nro} maxLength={5}/>
                        </div>
                        
                        
                        <div className="inputDiv">
                            <label htmlFor="">NIT</label><br />
                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                setForm({
                                    ...form,
                                    nit: e.target.value
                                })
                            }} value={form.nit}/>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Fecha cotización</label><br />
                            <input type="date" onChange={(e) => {
                                setForm({
                                    ...form,
                                    fecha: e.target.value
                                })
                            }} value={form.fecha} />
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Valor bruto: {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(form.bruto)}</label><br />
                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                setForm({
                                    ...form,
                                    bruto: e.target.value
                                })
                            }} value={form.bruto}/>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Descuento: {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(form.descuento)}</label><br />
                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                setForm({
                                    ...form,
                                    descuento: e.target.value
                                })
                            }} value={form.descuento}/>
                        </div>
                        <div className="inputDiv"> {iva}
                            <select name="" id="" onChange={(e) => {
                                setIva(e.target.value)
                            }}>
                                <option value={19}>Aplica</option>
                                <option value={0}>No aplica</option>

                            </select>
                        </div>

                        <div className="inputDiv">
                            <button onClick={() => sendCotizacion()}>
                                <span>{loading ? 'Creando...' : 'Crear cotización'}</span>
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}