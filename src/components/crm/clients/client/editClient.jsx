import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as actions from '../../../store/action/action';
import { useDispatch } from 'react-redux';
import axios from 'axios';

export default function EditClient(props){
    const client = props.client;
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
 
    const [data, setData] = useState({
            photo: client.photo,
            nombreEmpresa: client.nombreEmpresa,
            nit: client.nit,
            phone: client.phone, 
            email: client.email,
            type: client.type,
            sector: 'Mobiliario',
            responsable: client.namePersona,
            url: client.url,
            direccion: client.direccion,
            fijo: client.fijo,
            ciudad: client.ciudad
    });
    const [loading, setLoading] = useState(false);
    const updateClient = async () => {
        if(!data.photo || !data.nombreEmpresa || !data.nit || !data.phone || !data.email || !data.type || !data.url || !data.direccion || !data.fijo || !data.ciudad){
            return dispatch(actions.HandleAlerta('No puedes dejar campos vacios', 'mistake'))
        }
        if(loading) return null
        setLoading(true);
        let body = {
            photo: data.photo,
            clientId: client.id,
            nombreEmpresa: data.nombreEmpresa,
            nit: data.nit,
            phone: data.phone,
            email: data.email,
            type: data.type,
            url: data.url,
            direccion: data.direccion,
            fijo: data.fijo,
            ciudad: data.ciudad
        }
        const updateCliente = await axios.put('api/clients/get', body)
        .then((res) => {
            setLoading(false);
            dispatch(actions.HandleAlerta('Cliente actualizado con éxito', 'positive'))
            navigate(`/clients/client/${client.id}`)
        }).catch((err) => {
            setLoading(false);
            dispatch(actions.HandleAlerta('No hemos logrado actualizar este cliente', 'mistake'))
        })
    }
        
    return (
        <div className="editClient">
            <div className="containerEditClient">
                <div className="topEdit">
                    <h3>Modo edición</h3>
                </div>
                <div className="containerEditionProfile">
                    <div className="containerDivide">
                        <div className="imgProfile">
                            <div className="boxProfile">
                                <div className="boxImg">
                                    <img src={data.photo} alt="" />
                                </div>
                                
                                <div className="inputDiv">
                                    <input type="text" placeholder='Ingresa una URL' onChange={(e) => {
                                        setData({
                                            ...data,
                                            photo: e.target.value
                                        })
                                    }} value={data.photo} />
                                </div>
                            </div>
                            <div className="buttonSave">
                                <button onClick={() => updateClient()}>
                                    <span>{loading ? 'Actualizando usuario...' : 'Guardar cambios'}</span>
                                </button>
                            </div>
                        </div>
                        <div className="otherInformation">
                            <div className="containerOtherInformation">
                                <div className="topClose">
                                    <h3>
                                        {client.nombreEmpresa}
                                    </h3>
                                    <button onClick={() => {
                                        params.delete('d')
                                        setParams(params);
                                    }}>
                                        <MdClose className="icon" />
                                    </button>
                                </div>
                                <div className="scrollToEdit">
                                    <div className="containerScroll">
                                        <div className="inputDiv">
                                            <label htmlFor="">Nombre de empresa</label><br />
                                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                                setData({
                                                    ...data,
                                                    nombreEmpresa: e.target.value
                                                })
                                            }} value={data.nombreEmpresa} />
                                        </div>

                                        <div className="inputDiv">
                                            <label htmlFor="">NIT</label><br />
                                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                                setData({
                                                    ...data,
                                                    nit: e.target.value
                                                })
                                            }} value={data.nit}/>
                                        </div>

                                        <div className="inputDiv">
                                            <label htmlFor="">Teléfono</label><br />
                                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                                setData({
                                                    ...data,
                                                    phone: e.target.value
                                                })
                                            }} value={data.phone}/>
                                        </div>

                                        <div className="inputDiv">
                                            <label htmlFor="">Correo eléctronico</label><br />
                                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                        setData({
                                            ...data,
                                            email: e.target.value
                                        })
                                    }} value={data.email}/>
                                        </div>

                                        <div className="inputDiv">
                                            <label htmlFor="">Sitio web</label><br />
                                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                                setData({
                                                    ...data,
                                                    url: e.target.value
                                                })
                                            }} value={data.url}/>
                                        </div>

                                        <div className="inputDiv">
                                            <label htmlFor="">Direccion</label><br />
                                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                            setData({
                                                ...data,
                                                direccion: e.target.value
                                            })
                                        }} value={data.direccion}/>
                                        </div>

                                        <div className="inputDiv">
                                            <label htmlFor="">Teléfono fijo</label><br />
                                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                                setData({
                                                    ...data,
                                                    fijo: e.target.value
                                                })
                                            }} value={data.fijo} />
                                        </div>

                                        <div className="inputDiv">
                                            <label htmlFor="">Ciudad - País</label><br />
                                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                            setData({
                                                ...data,
                                                ciudad: e.target.value
                                            })
                                        }} value={data.ciudad}/>
                                        </div>

                                        <div className="inputDiv">
                                            <label htmlFor="">Tipo de cliente</label><br />
                                            <select name="" id="" onChange={(e) => {
                                                setData({
                                                    ...data,
                                                    type: e.target.value
                                                })
                                            }} value={data.type}>
                                                <option value="empresa">Empresa</option>
                                                <option value="distribuidor">Distribuidor</option>
                                                <option value="persona">Persona Natural</option>

                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}