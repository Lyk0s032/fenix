import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../store/action/action';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import axios from 'axios';

export default function MetaAdd(props){
    const [params, setParams] = useSearchParams();
    const usuario = props.usuario
    // Fecha actual
    const today = dayjs()

    const dispatch = useDispatch();
    const [data, setData] = useState({
        llamadas: 0,
        visitas: 0,
        cotizaciones: 0,
        valor: 0,
        userId: usuario.id
    })
    const [loading, setLoading] = useState(false);
    const addMeta = async () => {
        if(!data.llamadas && !data.visitas && !data.cotizaciones && !data.valor) {
            return dispatch(actions.HandleAlerta('Debes llenar al menos un campo', 'mistake'));
        }
        if(loading) return null;
        setLoading(true)
        // Caso contrario, avanzamos...

        let body = {
            userId: usuario.id,
            visitas: data.visitas,
            llamadas: data.llamadas,
            cotizaciones: data.cotizaciones,
            valor: data.valor,
            fecha: today,
        }
        const add = await axios.post('/api/users/addMeta', body)
        .then((res) => {
            setLoading(false)
            console.log(res)
            if(res.status == 200){
                return dispatch(actions.HandleAlerta('Ya hay una meta asignada', 'mistake'))
            }else{
                return dispatch(actions.HandleAlerta('Fecha añadida con éxito.', 'positive'))

            }

        })
        .catch(err => {
            setLoading(false);
            dispatch(actions.HandleAlerta('No hemos logrado crear esto.', 'mistake'))
        })
        setLoading(false)
        return add
    }
    return (
        <div className="metaModal">
            <div className="containerMetaModal">
                <div className="header">
                    <h3>Definir meta a {usuario.name}</h3>
                    <button onClick={() => {
                        params.delete('meta');
                        setParams(params);
                    }}>
                        <MdClose className="icon" />
                    </button>
                </div>
                <div className="formMeta">
                    <div className="containerForm">
                        <div className="inputDiv">
                            <label htmlFor="">Numero de llamadas</label><br />
                            <input type="number" placeholder='Escribe aquí'
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    llamadas: e.target.value
                                })
                            }} value={data.llamadas}/>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Numero de visitas</label><br />
                            <input type="number" placeholder='Escribe aquí'
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    visitas: e.target.value
                                })
                            }} value={data.visitas}/>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Numero de cotizaciones</label><br />
                            <input type="number" placeholder='Escribe aquí'
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    cotizaciones: e.target.value
                                })
                            }} value={data.cotizaciones}/>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Valor a vender ({new Intl.NumberFormat('es-CO', {currency: 'COP'}).format(data.valor)} COP)</label><br />
                            <input type="text" placeholder='Escribe aquí'
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    valor: e.target.value
                                })
                            }} value={data.valor}/>
                        </div>
                        <div className="inputDiv">
                            <button onClick={() => {
                                addMeta()
                            }}>
                                <span>{loading ? 'Asignando...' : 'Asignar meta'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}