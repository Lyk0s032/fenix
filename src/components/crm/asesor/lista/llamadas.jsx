import React from 'react';

export default function Llamadas(props){
    const calls = props.llamadas;
    return (
        <div className="listTable">  
            <table>
                <tbody>
                    {
                        calls && calls.length ?
                            calls.map((llamada, i) => {
                                return (
                                    <tr key={i+1}>
                                        <td>
                                            <div className="business">
                                                <div className="photo">
                                                    <img src={llamada.client.photo} alt="" />
                                                </div>
                                                <div className="data">
                                                    <h3>{llamada.client.nombreEmpresa}</h3>
                                                    <span>{llamada.client.type}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="title">
                                                <h3>{llamada.title}</h3>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="try">
                                                <span>{llamada.case}</span>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        :
                        <div className="loading">
                            <h1>No hay registros</h1>
                        </div>
                    }
                    
                </tbody>
            </table>
        </div>
    )
}