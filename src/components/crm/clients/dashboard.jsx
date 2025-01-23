import React, { useState } from 'react';
import { AiOutlineWindows } from 'react-icons/ai';
import BigGeneralGraph from './graphs/bigGeneral';
import BigTortalGeneral from './graphs/tortaGeneral';
import ProgressCotizacion from './graphs/progressCotizacion';
import * as actions from '../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import TableMonth from './tableMonth';
import CountByMonth from './allCountByMonth';
import BetterClient from './betterClient';
import Buscador from './buscador';

export default function Dashboard(){
    const dispatch = useDispatch();
    const embudo = useSelector(store => store.embudo);

    const { time } = embudo;

    const [dataGraph, setDataGraph] = useState(null);
    const [loading, setLoading] = useState(false);

    const currently = dayjs(time);
    const month = currently.format('MMMM');

    const moveMonth = (fecha) => {
        dispatch(actions.getTime(fecha));
    }
    return (
        <div className="dashboard">
            <div className="containerDashboard">
                <div className="leftDashboard">
                    <div className="topBoxDashboard">
                        <div className="containerBoxsDashboard">
                            <div className="filterByType">
                                <nav>
                                    <ul>
                                        <li className='Active'>
                                            <div>
                                                <span>Clientes</span>
                                            </div>
                                        </li>
                                       
                                    </ul>
                                </nav>
                            </div>
                            <div className="filterByTime">
                                <div className="containerFilterByTime">
                                    <strong>Filtrar por tiempo</strong>
                                    <div className="divideFilter">
                                        <nav>
                                            <ul>
                                                <li className='Active'>
                                                    <div>
                                                        <strong>Por mes</strong><br />
                                                        <span>Información relevante</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div>
                                                        <strong>Último año</strong><br />
                                                        <span>Balance general</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </nav>
                                        <Buscador />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dataClientsLists">
                        <div className="containerDataClientsLists">
                            <div className="moveTime">
                                <div className="containerMoveTime">
                                    <button onClick={() => {
                                        let less = currently.subtract(1, 'month');
                                        moveMonth(less)
                                    }}>
                                        <span>
                                            {
                                                currently.subtract(1, 'month').format('MMMM')
                                            }
                                        </span>
                                    </button>
                                    <div className="chooseMonth">
                                        <select name="" id="">
                                            <option value="">{month}</option>
                                            <option value="">Enero</option>
                                            <option value="">Febrero</option>
                                            <option value="">Marzo</option>

                                        </select>
                                    </div>
                                    <button onClick={() => {
                                        let less = currently.add(1, 'month');
                                        moveMonth(less)
                                    }}>
                                        <span>
                                            {
                                                currently.add(1, 'month').format('MMMM')
                                            }
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="scrollLists">
                                <TableMonth />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rightDashboard">
                    <div className="containerRightDashboard">
                        <CountByMonth />
                        <BetterClient />
                    </div>
                </div>
            </div>
            <div className="graphAllClients">
                <div className="containerGraphs">
                    <div className="divideGraph">
                        <div className="leftGraph">
                            <div className="bigGraph">
                                <BigGeneralGraph />
                            </div>
                        </div>

                        <div className="rightGraph">
                            <div className="smallGraph">
                                <ProgressCotizacion />
                            </div>

                        </div>
                    </div>
                    {/* <div className="divideGraph">
                        <div className="leftGraph">
                            <BigTortalGeneral />

                        </div>
                        <div className="rightGraph">
                            <h1>Aca</h1>
                        </div>
                    </div> */}

                </div>
            </div>
        </div>
    )
}