import React, { useEffect, useState } from 'react';
import * as actions from '../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import dayjs from 'dayjs';

export default function TableMonth(){
    const dispatch = useDispatch();

    const embudo = useSelector(store => store.embudo);
    const navigate = useNavigate();
    const { time } = embudo;

    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(false);

    const traerData = async () => {
        setLoading(true);
        const go = await axios.get(`api/clients/getByMonthGeneral/${dayjs(time).get('year')}/${dayjs(time).get('month')+1}`)
        .then((res) => {
            setLoading(false)
            setList(res.data)
        })
        .catch(err => {
            setLoading(false);
            setList(404)
        })

        return go;
    }
    useEffect(() => {
        traerData(); 
    }, [time])

    return (
        <table>
            <thead>
                    <tr>
                        <th><span>Cliente</span></th>
                        <th><span>Aprobadas</span></th>
                        <th><span>Valor</span></th>
                    </tr>
            </thead>
            {
               loading || !list ? 
                <div className="notFound">
                    <h3>Cargando...</h3>
                    <span>Recogiendo información...</span>
                </div>
                :
                list == 404?
                    <div className="notFound">
                        <h1>No hay registros</h1>´
                        <span>No encontramos cotizaciones para mostrar de este mes</span>
                    </div>
                :
                <tbody>
                    
                        {
                            list && list.length ?
                                list.map((cliente, i) => {
                                    let filtrado = cliente.cotizacions.filter(filt => filt.state == 'aprobada');
                                    const totalCantidad = !cliente.cotizacions || !cliente.cotizacions.length ? 0 :
                                        filtrado.reduce((acumulado, cotizacion) => {
                                            return Number(acumulado) + Number(cotizacion.bruto) - Number(cotizacion.descuento);
                                        }, 0)
                                    return (
                                        <tr onClick={() => navigate(`/clients/client/${cliente.id}`)}>
                                            <td>
                                                <div className='clientTable'>
                                                    <div className="photo">
                                                        <img src={cliente.photo} alt="" />
                                                    </div>
                                                    <div className="dataClient">
                                                        <h3>{cliente.nombreEmpresa}</h3>
                                                        <span>{cliente.type}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="number">
                                                    <span>
                                                        {
                                                            cliente.cotizacions && cliente.cotizacions.length ?
                                                                filtrado.length
                                                            : 0
                                                        }
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                            <div className="price">
                                                {
                                                    

                                                }
                                                    <h3>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(totalCantidad)} <span>COP</span></h3>
                                            </div>
                                            </td>

                                        </tr>
                                    )
                                })
                            : 
                            <div className="notResults">
                                <span>No hay resultados</span>
                            </div>
                        }
                        
                        


                </tbody>
            }

        </table>
    )
}