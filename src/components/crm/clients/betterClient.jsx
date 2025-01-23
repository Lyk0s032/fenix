import React, { useEffect, useState } from 'react';
import * as actions from '../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import dayjs from 'dayjs';

export default function BetterClient(){
    const dispatch = useDispatch();

    const embudo = useSelector(store => store.embudo);

    const { time } = embudo;
 
    const [better, setBetter] = useState(null);
    const [loading, setLoading] = useState(true);
  
    const traerData = async () => {
        setLoading(true);
        const go = await axios.get(`api/clients/getByMonthGeneral/${dayjs(time).get('year')}/${dayjs(time).get('month')+1}`)
        .then((res) => {
            setLoading(false)
            setBetter(res.data[0])
        })
        .catch(err => {
            setLoading(false);
            setBetter(404)
        })

        return go;
    }
    useEffect(() => {
        traerData(); 
    }, [time])


    return (
        <div className="clientNumberOne">
            {
                loading || !better ?
                <div className="loading">
                    <h3>Cargando...</h3>
                </div>
                :better == 404 ?
                <div className="notFound">
                    <h1>No hay cliente #1</h1>
                </div>
            :
                <div className="containerClientNumberOne">
                    <div className="titleBox">
                        <span>Cliente #1 de {dayjs(time).format('MMMM')}</span>
                    </div>
                    <div className="photoAndDataClient">
                        <div className="photo">
                            <img src={better.photo} alt="" />
                        </div>
                        <div className="dataClient">
                            <h3>{better.nombreEmpresa}</h3>
                            <span>{better.type}</span>
                        </div>
                    </div>
                    <div className="dataAboutClientOnSystem">
                        <div className="containerDataOnSystem">
                            <div className="divTable">
                                <span>Vendido:</span>
                                <Vendido better={better} type='aprobada' />
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            <span>Aprobadas</span>
                                        </th>
                                        <th>
                                            <span>
                                                Perdidas
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><span className='positive'>
                                            </span>{<Aprobada better={better} type='aprobada' />}</td>
                                        <td><span className='mistake'>{<Aprobada better={better} type='perdido' />}</span></td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

const Aprobada = (props) => {
    const data = props.better;
    let filtrar = data.cotizacions.filter(tr => tr.state == props.type);

    return (
        <span>{filtrar.length}</span>
    )
}
const Vendido = (props) => {
    const data = props.better;
    let filtrar = data.cotizacions && data.cotizacions.length ? data.cotizacions.filter(tr => tr.state == props.type) : 0

    const totalCantidad = filtrar && filtrar.length ? filtrar.reduce((acumulado, cotizacion) => {
        return Number(acumulado) + Number(cotizacion.bruto) - Number(cotizacion.descuento);
    }, 0) : 0
    return (
        <h3 className='price'>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(totalCantidad)} <span>COP</span></h3>
    )
}