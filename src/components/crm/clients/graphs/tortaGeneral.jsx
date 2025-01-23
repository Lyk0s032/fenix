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
    ArcElement,
  } from 'chart.js';import { Doughnut, Line, Pie } from "react-chartjs-2";
import { useSelector } from 'react-redux';

  ChartJS.register(
    CategoryScale, 
    ArcElement,
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


  
  export default function BigTortalGeneral(){
    
    const embudo = useSelector(store => store.embudo);

    const { time } = embudo;

    const [dataGraph, setDataGraph] = useState(null);
    const [loading, setLoading] = useState(false);

    const traerData = async () => {
        setLoading(true);
        const go = await axios.get('/api/clients/graphMonth/2025/01/all')
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
    }, [time])

    console.log(dataGraph)
    const tipos = []
    const data = {
        labels: ['Distribuidores', 'Empresas', 'Naturales'],
        datasets: [
            {
                label: 'Aprobadas',
                data:[10, 20, 5],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                tension: 0.5, 
                pointRadius: 1,
            },
            ]
    }
    const options = {
        plugins: {
            responsive: true,       // Hace que el gráfico sea responsive
            maintainAspectRatio: false,
          legend: {
            position: 'right', // Coloca las leyendas a la derecha
            labels: {
              usePointStyle: true,  // Hacer que las leyendas tengan un estilo de punto (opcional)
            },
          },
        },
      };
    return ( 
        <div className="graph">
            <div className="containerGraph">
                <h3>Número de cotizaciones</h3> 
                <div className="componenteGrafica">
                        <Pie className="pie"
                        data={data} options={options}
                     />
                </div>
            </div>
        </div>
    )
}