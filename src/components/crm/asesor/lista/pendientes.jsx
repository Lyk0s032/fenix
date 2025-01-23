import React from 'react';

export default function PendientesByUser(){
    return (
        <div className="listTable">
            <table>
                <tbody>
                    <tr>
                        <td>
                            <div className="business">
                                <div className="photo">
                                    <img src="" alt="" />
                                </div>
                                <div className="data">
                                    <h3>Nasur</h3>
                                    <span>Distribuidor</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="title">
                                <h3>Titulo de esa llamadas</h3>
                            </div>
                        </td>
                        <td>
                            <div className="try">
                                <span>Neto</span>
                                <h3>120.000.000 <span>COP</span></h3>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}