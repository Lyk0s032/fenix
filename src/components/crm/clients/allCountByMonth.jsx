import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as actions from '../../store/action/action';
import axios from 'axios';
import dayjs from 'dayjs';

export default function CountByMonth(){
    const embudo = useSelector(store => store.embudo);
 
    const { time } = embudo;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const traerData = async () => {
        setLoading(true);
        const sistemaFecha = dayjs();
        const dia = sistemaFecha.format('DD');
        const month = dia >= 6 ? dayjs(time).get('month')+1 : dayjs(time).get('month');
        const go = await axios.get(`api/clients/dataAndFinance/${dayjs(time).get('year')}/${month}`)
        .then((res) => {
            setLoading(false) 
            setData(res.data)
        })
        .catch(err => {
            setLoading(false);
        })

        return go;
    }

    useEffect(() => {
        traerData()
    }, [time])
    return (
        <div className="businessDataForSelected">
            <div className="containerDataForBusiness">
                <div className="titleBusiness">
                    <span>
                        Total vendido
                    </span>
                    {
                        loading || !data ?
                        <h1>---</h1>
                        : 
                        !data.aprobadas || !data.aprobadas.length ?
                        <h1>0 <span>COP</span></h1>
                        :
                        <Valor valor={data.aprobadas} /> 
                    }
                    <span className='time'>
                        Del <strong>{dayjs(time).format('DD - MMMM')} </strong>
                        al <strong>{dayjs(time).add(1, 'month').subtract(1, 'day').format('DD MMMM')}</strong>
                    </span>
                </div>
                <div className="dataList"> 
                        {
                            loading || !data ?
                             <h1>Cargando...</h1>
                            :<DataTable data={data} />
                        }
                </div>
            </div>
        </div>
    )
}

function DataTable(props){
    let data = props.data;
    const { aprobadas, perdidas} = data;
    let perdido = perdidas.filter(coti => coti.state == 'perdido');
    let ok = aprobadas.filter(cotiza => cotiza.state == 'aprobada');
  

    return (
        <table>
            <thead>
                <tr>
                    <th>
                        <span>Aprobadas</span>
                    </th>
                    <th>
                        <span>Creadas</span>
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
                    <td>
                        <span className='positive'>
                            {ok.length}
                        </span>
                    </td>
                    <td>
                        <span>
                            {!data || !data.creadas ? 0 : data.creadas.length}
                        </span>

                        
                    </td>
                    <td>
                        <span className='mistake'>
                            {perdido && perdido.length ? perdido.length : 0}
                        </span>

                    </td>

                </tr>
            </tbody>
        </table>
    )
}

function Valor(props){
    let val = props.valor;

    const totalCantidad = val.reduce((acumulado, cotizacion) => {
        return acumulado + Number(cotizacion.bruto) - Number(cotizacion.descuento);
    }, 0);
    return (
        <h1>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(totalCantidad)}<span>COP</span></h1>
    )
}