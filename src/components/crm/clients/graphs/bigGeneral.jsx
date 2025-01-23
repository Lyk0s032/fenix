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

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  import * as actions from '../../../store/action/action';
import axios from 'axios';
import dayjs from 'dayjs';


  
  export default function BigGeneralGraph(){
    
    const embudo = useSelector(store => store.embudo);

    const { time } = embudo;

    const [dataGraph, setDataGraph] = useState(null);
    const [loading, setLoading] = useState(false);

    const traerData = async () => {
        setLoading(true);
        const go = await axios.get(`/api/clients/graphMonth/${dayjs(time).get('year')}/${dayjs(time).get('month')+1}/all`)
        .then((res) => {
            setLoading(false)
            setDataGraph(res.data)
        })
        .catch(err => {
            setLoading(false);
        })

        return go;
    }
    useEffect(() => {
        traerData(); 
    }, [time])

    const day = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30, 31]
    const data = {
        labels: day,
        datasets: 
            dataGraph ?
                [
                    {
                        label: 'Aprobadas',
                        data: 
                            dataGraph.aprobadas && dataGraph.aprobadas.length ?
                                day.map((res, i) => {
                                    if(dataGraph.aprobadas.find(l => dayjs(l.dia).date() == res)){
                                        let a = dataGraph.aprobadas.find(l => dayjs(l.dia).date() == res)
        
                                        return a.total_cotizaciones
                                    }else{
                                        return 0
                                    }
                                })
                            :day.map((res) => day.map((res) => {
                                return 0
                        }))
                        ,
                        borderColor: 'rgba(37, 211, 102, 1)',
                        backgroundColor: 'rgba(37, 211, 102, 0.9)',
                        tension: 0.5,
                        backgroundColor: 'rgba(37, 211, 102, 0.9)',
                        pointRadius: 1,
                    },
                    {
                        label: 'Perdidas',
                        data: 
                        dataGraph.perdidas && dataGraph.perdidas.length ?

                            day.map((res, i) => {
                                if(dataGraph.perdidas.find(l => dayjs(l.dia).date() == res)){
                                    let a = dataGraph.perdidas.find(l => dayjs(l.dia).date() == res)

                                    return a.total_cotizaciones
                                }else{
                                    return 0
                                }
                            }) : day.map((res) => {
                                    return 0
                            }),
                        borderColor: 'rgba(220, 53, 69, 1)',
                        backgroundColor: 'rgba(220, 53, 69, 0.9)',
                        tension: 0.5,
                        backgroundColor: 'rgba(220, 53, 69, 0.9)',
                        pointRadius: 1,
                    },
                    {
                        label: 'Creadas',
                        data: 
                        dataGraph.creadas && dataGraph.creadas.length ?

                            day.map((res, i) => {
                                if(dataGraph.creadas.find(l => dayjs(l.dia).date() == res)){
                                    let a = dataGraph.creadas.find(l => dayjs(l.dia).date() == res)

                                    return a.total_cotizaciones
                                }else{
                                    return 0
                                }
                            }) : day.map((res) => {
                                return 0
                            }),
                        borderColor: 'rgba(82, 84, 86)',
                        backgroundColor: 'rgba(82, 84, 86, 0.9)',
                        tension: 0.5,
                        backgroundColor: 'rgba(82, 84, 86, 0.9)',
                        pointRadius: 1,
                    },
                ]
                  
            : null
            
    }
    let miOptions = {}
    return ( 
        <div className="graph">
            <div className="containerGraph"> 
                <h3>Número de cotizaciones - {dayjs(time).format('YYYY MMMM-DD')}</h3>
                <div className="componenteGrafica">
                    {
                        loading || !dataGraph?
                        <div className="loading">
                            <div className="containerLoading">
                                <h3>Cargando gráfica...</h3>
                                <span>Estamos recogiendo la información</span>
                            </div>
                        </div>
                        :
                        <Line className="GraficaItem"
                        data={data} options={miOptions}
                     />
                    }
                </div>
            </div>
        </div>
    )
}