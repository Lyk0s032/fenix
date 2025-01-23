import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';import { Doughnut, Line } from "react-chartjs-2";
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { PiColumnsPlusLeftDuotone } from 'react-icons/pi';
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Year(props){
    const cliente = props.cliente;

        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(false); 

        const searchData = async () => {
            const search = await axios.get(`/api/clients/get/client/cotizaciones/${cliente.id}`)
            .then((res) => {
                console.log(res.data)
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                setData(404)
                setLoading(false)
            })

            return search
        }


        useEffect(() => {
            searchData();
        }, [])
    return (
        <div className="yearVisualizar">
            <div className="containerYear">
                <div className="divide">
                    <div className="leftGraph">
                        <h3>Últimos 12 meses</h3>
                        {
                            loading || !data ?
                                <h1>Cargando</h1>
                            :
                            <YearGraph data={data} />
                        }
                    </div>
                    {/* <div className="rightGraph">
                        <div className="containerRightYear">
                            <div className="divideFilterMoney">
                                <div className="left">
                                    <div className="priceBox">
                                        <div className="topBox">
                                            <span>Total vendido</span>
                                            <h3>130.000.000 <span>COP</span></h3>
                                        </div>
                                        <div className="monthAndGraph">
                                            <div className="itemMonth">
                                                <div className="topItem">
                                                    <div className="title">
                                                        <span>Enero</span>
                                                    </div>
                                                    <div className="priceMonth">
                                                        <h3>350.000 <span>COP</span></h3>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="progress">
                                                        <div className="activeProgress">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="itemMonth">
                                                <div className="topItem">
                                                    <div className="title">
                                                        <span>Enero</span>
                                                    </div>
                                                    <div className="priceMonth">
                                                        <h3>350.000 <span>COP</span></h3>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="progress">
                                                        <div className="activeProgress">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="itemMonth">
                                                <div className="topItem">
                                                    <div className="title">
                                                        <span>Enero</span>
                                                    </div>
                                                    <div className="priceMonth">
                                                        <h3>350.000 <span>COP</span></h3>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="progress">
                                                        <div className="activeProgress">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="itemMonth">
                                                <div className="topItem">
                                                    <div className="title">
                                                        <span>Enero</span>
                                                    </div>
                                                    <div className="priceMonth">
                                                        <h3>350.000 <span>COP</span></h3>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="progress">
                                                        <div className="activeProgress">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="itemMonth">
                                                <div className="topItem">
                                                    <div className="title">
                                                        <span>Enero</span>
                                                    </div>
                                                    <div className="priceMonth">
                                                        <h3>350.000 <span>COP</span></h3>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="progress">
                                                        <div className="activeProgress">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="itemMonth">
                                                <div className="topItem">
                                                    <div className="title">
                                                        <span>Enero</span>
                                                    </div>
                                                    <div className="priceMonth">
                                                        <h3>350.000 <span>COP</span></h3>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="progress">
                                                        <div className="activeProgress">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="itemMonth">
                                                <div className="topItem">
                                                    <div className="title">
                                                        <span>Enero</span>
                                                    </div>
                                                    <div className="priceMonth">
                                                        <h3>350.000 <span>COP</span></h3>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="progress">
                                                        <div className="activeProgress">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="itemMonth">
                                                <div className="topItem">
                                                    <div className="title">
                                                        <span>Enero</span>
                                                    </div>
                                                    <div className="priceMonth">
                                                        <h3>350.000 <span>COP</span></h3>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="progress">
                                                        <div className="activeProgress">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="itemMonth">
                                                <div className="topItem">
                                                    <div className="title">
                                                        <span>Enero</span>
                                                    </div>
                                                    <div className="priceMonth">
                                                        <h3>350.000 <span>COP</span></h3>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="progress">
                                                        <div className="activeProgress">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="itemMonth">
                                                <div className="topItem">
                                                    <div className="title">
                                                        <span>Enero</span>
                                                    </div>
                                                    <div className="priceMonth">
                                                        <h3>350.000 <span>COP</span></h3>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="progress">
                                                        <div className="activeProgress">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="itemMonth">
                                                <div className="topItem">
                                                    <div className="title">
                                                        <span>Enero</span>
                                                    </div>
                                                    <div className="priceMonth">
                                                        <h3>350.000 <span>COP</span></h3>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="progress">
                                                        <div className="activeProgress">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="itemMonth">
                                                <div className="topItem">
                                                    <div className="title">
                                                        <span>Enero</span>
                                                    </div>
                                                    <div className="priceMonth">
                                                        <h3>350.000 <span>COP</span></h3>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="progress">
                                                        <div className="activeProgress">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="left rightMoney">
                                    <div className="priceBox">
                                        <div className="topBox Danger">
                                            <span>Total cotizaciones perdidas</span>
                                            <h3>130.000.000 <span>COP</span></h3>
                                        </div>
                                        <div className="monthAndGraph">
                                            <div className="itemMonth Dangery">
                                                <div className="topItem">
                                                    <div className="title">
                                                        <span>Enero</span>
                                                    </div>
                                                    <div className="priceMonth">
                                                        <h3>350.000 <span>COP</span></h3>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="progress">
                                                        <div className="activeProgress">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="itemMonth Dangery">
                                                <div className="topItem">
                                                    <div className="title">
                                                        <span>Enero</span>
                                                    </div>
                                                    <div className="priceMonth">
                                                        <h3>350.000 <span>COP</span></h3>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="progress">
                                                        <div className="activeProgress">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="itemMonth Dangery">
                                                <div className="topItem">
                                                    <div className="title">
                                                        <span>Enero</span>
                                                    </div>
                                                    <div className="priceMonth">
                                                        <h3>350.000 <span>COP</span></h3>
                                                    </div>
                                                </div>
                                                <div className="line">
                                                    <div className="progress">
                                                        <div className="activeProgress">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>



                                    
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

function YearGraph(props){
    const resultado = props.data;
    const meses = resultado.meses.slice().reverse();

    const indicadores = resultado.resultados;
    const data = {
        labels: meses,
        datasets: 
            [
                {
                    label: 'Aprobadas',
                    data: 
                    indicadores && indicadores.length ?
        
                    meses.map((res, i) => {
                        if(indicadores.find(l => dayjs(l.month.split('T')[0]).format('MM') == res)){
                            let a = indicadores.find(l => dayjs(l.month.split('T')[0]).format('MM') == res)
                            const suma = a.cotizaciones_totales.reduce((acumulador, valorActual) => Number(acumulador) + Number(valorActual), 0);
                            return suma
                        }else{
                            return 0
                        }
                    }) : day.map((res) => {
                            return 0
                    }),
                        borderColor: 'rgba(37, 211, 102, 1)',
                        backgroundColor: 'rgba(37, 211, 102, 0.9)',
                        tension: 0.5,
                        backgroundColor: 'rgba(37, 211, 102, 0.9)',
                        pointRadius: 1, 
                    },
                ]
    }
    let miOptions = {}
    return (
        <div className="graph">
            <Line className="GraficaItem" data={data} options={miOptions} />
        </div>
    )
}