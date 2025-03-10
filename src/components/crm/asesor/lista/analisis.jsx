import React, { useEffect, useState } from 'react';
import Llamadas from './llamadas';
import Visitas from './visitas';
import CotizacionesByUser from './cotizaciones';
import PendientesByUser from './pendientes';
import DesarrolloByUser from './desarrollo';
import dayjs from 'dayjs';
import axios from 'axios';

export default function AnalisisUser(props){
    const [options, setOptions] = useState(null);
    const usuario = props.usuario;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const day = dayjs().format('YYYY-MM-DD');
    const [time, setTime] = useState(day)

    const moveTime = async (type) => {
        if(type == 'less'){
            let nuevaFecha = dayjs(time).subtract(1, 'month').format('YYYY-MM-DD')
            setTime(nuevaFecha)
        }else{
            let nuevaFecha = dayjs(time).add(1, 'month').format('YYYY-MM-DD')
            setTime(nuevaFecha)
        }
    }

    const callDataByMonth = async () => {
        setLoading(true);
        const consult = await axios.get(`/api/users/getByMonth/${dayjs(time).format('YYYY')}/${dayjs(time).format('MM')}/${usuario.id}`)
        .then((res) => {
            setData(res.data)
            setLoading(false);

        })
        .catch(err => {
            console.log(err);
            setLoading(false);
            setData(404)
        })
    }

    useEffect(() => {
        callDataByMonth()
    }, [time])
    return (
        <div className="containerFilterByMonth">
            <div className="NavigationForMonth">
                <button onClick={() => moveTime('less')}>
                    <span>{dayjs(time).subtract(1, 'month').format('MMMM')}</span>
                </button>
                <div className="chooseMonth">
                    <select name="" id="">
                        <option value="">{dayjs(time).format('MMMM')}</option>
                    </select>
                </div>
                <button onClick={() => moveTime('plus')}>
                    <span>{dayjs(time).add(1, 'month').format('MMMM')}</span>
                </button>
            </div> 
            <div className="navData">
                <nav>
                    <ul>
                        <li onClick={() => setOptions(null)}
                            className={!options ? 'Active' : null}>
                            <div>
                                <span>Llamadas</span>
                            </div>
                        </li>
                        <li onClick={() => setOptions('visitas')}
                            className={options == 'visitas' ? 'Active' : null}>
                            <div>
                                <span>Visitas</span>
                            </div>
                        </li>
                        <li onClick={() => setOptions('cotizaciones')}
                            className={options == 'cotizaciones' ? 'Active' : null}>
                            <div>
                                <span>Cot. Aprobadas ({
                                    data && data.searchUser && data.searchUser.cotizacions && data.searchUser.cotizacions.length ? data.searchUser.cotizacions.length : 0 
                                })</span> 
                            </div>
                        </li>


                        <li onClick={() => setOptions('year')}
                            className={options == 'year' ? 'Active' : null}>
                            <div>
                                <span>Últimos 12 meses</span>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="ResultDataByMonth">
                {
                    loading  || !data ?
                    <div className="loading">
                        <h1>Cargando...</h1>
                        <span>Alistando información de las llamadas</span>
                    </div>
                : 
                data == 404 || data == 'notrequest' ?
                    <div className="loading">
                        <div>
                        <h1>No hay resultados para motrar</h1>
                        </div>
                    </div>
                :
                    <div className="containerResult">
                        {
                            !options ?
                                <Llamadas llamadas={data.searchUser.calls} /> 
                            : options == 'visitas'?
                                <Visitas visita={data.searchUser.visita}/>
                            : options == 'cotizaciones' ?
                                <CotizacionesByUser cotizaciones={data.searchUser.cotizacions} />   
                            : options == 'pendientes' ?
                                <PendientesByUser /> 
                            : options == 'desarrollo' ?
                                <DesarrolloByUser /> 
                            : null
                        }
                    </div>  
                }
                <div className="resultBigMoneyUser">
                    <div className="containerBigUser">
                        <div className="moneyThisMonth">
                            {
                                loading || !data ?
                                    <div className='loading'>
                                        <h1>Cargando...</h1>
                                    </div>
                                :
                                !data || data == 404 || data == 'notrequest' ? <h1>No cargo</h1>
                                :
                                    <div>
                                        <span>Total vendido</span>
                                        <h1>{new Intl.NumberFormat('es-CO', {currency: 'COP'}).format(data.total)} / <strong>{data.searchUser.meta && data.searchUser.meta.length ? new Intl.NumberFormat('es-CO', {currency: 'COP'}).format(data.searchUser.meta[0].valor) : 0 }</strong></h1>
                                    </div>
                            } 
                        </div>
                    </div>
                    <div className="metasBox">
                        {
                            loading ?
                            <div className="loading">
                                <h1>Cargando</h1>
                                <span>Cargando metas...</span>
                            </div>
                            : !data || data == 404 || data == 'notrequest' || !data.searchUser.meta.length? 
                            <div className='loading'>
                                <h1>Sin información</h1>
                            </div>
                            :
                            <div className="containerMetas">
                                <div className="itemMetas">
                                    <span>Llamadas</span> <br />
                                    <h3><strong>{data.searchUser.calls.length}</strong> / {data.searchUser.meta.length ? data.searchUser.meta[0].llamadas : 0}</h3>
                                </div>
                                <div className="itemMetas">
                                    <span>Visitas</span> <br />
                                    <h3><strong>{data.searchUser.visita.length}</strong> / {data.searchUser.meta.length ?  data.searchUser.meta[0].visitas : 0}</h3>
                                </div>
                                <div className="itemMetas">
                                    <span>Cotizaciones</span> <br />
                                    <h3><strong>{data.searchUser.cotizacions.length}</strong> / {data.searchUser.meta.length ? data.searchUser.meta[0].cotizaciones : 0}</h3>
                                </div>

                            </div>
                        }
                    </div>
                </div>
                
            </div>
        </div>
    )
}