import React, { useState } from 'react';
import { MdArrowRight } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from './../../../store/action/action';
import { laterFunction, nuevoClient } from '../actionsAxios';
import { useSearchParams } from 'react-router-dom';

export default function ToClient(props){
    const item = props.item;
    const dispatch = useDispatch();
    console.log(item)
    const [params, setParams] = useSearchParams();
    const embudo = useSelector(store => store.system);
    const { system } = embudo;

    const [data, setData] = useState({
        photo: null, 
        nombreEmpresa: item.nombreEmpresa,
        nit: null,
        phone: item.phone, 
        email: item.email,
        type: item.type,
        sector: 'Mobiliario',
        responsable: item.namePersona,
        url: item.url,
        direccion: item.direccion,
        fijo: item.fijo,
        ciudad: item.city
    });

    const [loading, setLoading] = useState(false)
    const handleToClient = async () => {
        setLoading(true);
        const tryCreate = await nuevoClient(data.photo, item.id, data.nombreEmpresa, data.nit, 
            data.phone, data.email, data.type, data.sector, 
            data.responsable, data.url, data.direccion, data.fijo, data.ciudad)
            .then((res) => {
                console.log(res);
                dispatch(actions.HandleAlerta('Cliente creado con éxito', 'positive'))
                setLoading(false);
            
            })
            .then((res) => {
                dispatch(actions.AxiosGetAllEmbudo(1, false))
                params.delete('w');
                params.delete('a');
                setParams(params);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                dispatch(actions.HandleAlerta('Ha ocurrido un error', 'mistake'))

            })
        
        return tryCreate;
    }
    return (
        <div className="formAction">
            <div className="formAction">
                <div className="headerAction">
                    <h3>Convertir a cliente  </h3>
                    
                </div>
                <div className="containerActionForm">
                    <div className="form" >
                        <div className="horizontalDiv">
                            <div className="inputDiv">
                                <label htmlFor="">Logo empresa</label>
                                <input type="text" placeholder='Ingresa una url aquí' 
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        photo: e.target.value
                                    })
                                }} value={data.photo} />
                            </div>
                            <div className="inputDiv">
                                <div className="visualizarPhoto">
                                    <img src={data.photo} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="horizontalDiv">
                            <div className="inputDiv">
                                <label htmlFor="">Nombre empresa</label>
                                <input type="text" placeholder='Escribe aquí' 
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        nombreEmpresa: e.target.value
                                    })
                                }} value={data.nombreEmpresa} />
                            </div>
                            <div className="inputDiv">
                                <label htmlFor="">NIT </label>
                                <input type="text" placeholder='Escribe aquí' 
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        nit: e.target.value
                                    })
                                }} value={data.nit}/>
                            </div>
                        </div>
                        <div className="horizontalDiv">
                            <div className="inputDiv">
                                <label htmlFor="">Teléfono</label>
                                <input type="text" placeholder='Escribe aquí' 
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        phone: e.target.value
                                    })
                                }} value={data.phone}/>
                            </div>
                            <div className="inputDiv">
                                <label htmlFor="">Correo eléctronico </label>
                                <input type="text" placeholder='Escribe aquí' 
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        email: e.target.value
                                    })
                                }} value={data.email}/>
                            </div>
                        </div>
                        <div className="horizontalDiv">
                            <div className="inputDiv">
                                <label htmlFor="">Nombre de persona a cargo </label>
                                <input type="text" placeholder='Escribe aquí' 
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        responsable: e.target.value
                                    })
                                }} value={data.responsable} />
                            </div>
                           
                        </div>
                        <div className="horizontalDiv">
                            <div className="inputDiv">
                                <label htmlFor="">Sitio web - URL </label>
                                <input type="text" placeholder='Escribe aquí' 
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        url: e.target.value
                                    })
                                }} value={data.url}/>
                            </div>
                            <div className="inputDiv">
                                <label htmlFor="">Dirección </label>
                                <input type="text" placeholder='Escribe aquí' 
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        direccion: e.target.value
                                    })
                                }} value={data.direccion}/>
                            </div>
                        </div>

                        <div className="horizontalDiv">
                            <div className="inputDiv">
                                <label htmlFor="">Teléfono fijo</label>
                                <input type="text" placeholder='Escribe aquí' 
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        fijo: e.target.value
                                    })
                                }} value={data.fijo}/>
                            </div>
                            <div className="inputDiv">
                                <label htmlFor="">Ciudad - País</label>
                                <input type="text" placeholder='Escribe aquí' 
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        ciudad: e.target.value
                                    })
                                }} value={data.ciudad} />
                            </div>
                        </div>

                        <div className="horizontalDiv">
                            <div className="inputDiv">
                                <label htmlFor="">Tipo </label>
                                <select name="" id="" 
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        type: e.target.value
                                    })
                                }} value={data.type}> 
                                    <option value={data.type}>{data.type}</option>
                                    <option value="empresa">Empresa</option>
                                    <option value="distribuidor">Distribuidor</option>
                                    <option value="persona">Persona</option>

                                </select>
                            </div>
                            <div className="inputDiv">
                                <label htmlFor="">Sector</label>
                                <select name="" id="" 
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        sector: e.target.value
                                    })
                                }} value={data.sector}>
                                    <option value="mobiliario">Mobiliario</option>
                                    <option value="industrial">Industrial</option>
                                    <option value="ferretero">Ferretero</option>

                                </select>
                            </div>
                        </div>
                        <div className="inputDiv">
                            <button className='send' onClick={(e) => {
                                e.preventDefault();
                                if(!loading){
                                    handleToClient()
                                }
                            }}>
                                <span>
                                    {loading ? 'Creando cliente...'  : 'Nuevo cliente'}
                                </span>
                                <MdArrowRight className="icon" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}