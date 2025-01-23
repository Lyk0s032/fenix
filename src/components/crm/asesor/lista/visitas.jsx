import React from 'react';

export default function Visitas(props){
    const visitas = props.visita;
    console.log(visitas)
    return (
        <div className="listTable">
            <table>
                <tbody>
                {
                        visitas && visitas.length ?
                            visitas.map((go, i) => {
                                return (
                                    <tr key={i+1}>
                                        <td>
                                            <div className="business">
                                                <div className="photo">
                                                    <img src={go.client.photo} alt="" />
                                                </div>
                                                <div className="data">
                                                    <h3>{go.client.nombreEmpresa}</h3>
                                                    <span>{go.client.type}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="title">
                                                <h3>{go.title}</h3>
                                            </div>
                                        </td>

                                    </tr>
                                )
                            })
                        :
                            <div className="loading">
                                <h1>No hay resultados</h1>
                            </div>
                }
                    
                </tbody>
            </table>
        </div>
    )
}