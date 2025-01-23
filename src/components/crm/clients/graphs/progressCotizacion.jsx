import React from 'react';

export default function ProgressCotizacion(){
    return (
        <div className="progressCotizacionData">
            <div className="containerProgress">
                <div className="titleData">
                    <h3>Cotizaciones</h3>
                </div>
                <div className="resData">
                    <div className="containerResData">
                        <div className="BigNumber">
                            <span>Total</span>
                            <h3>160.000.000 <span>COP</span></h3>
                        </div>
                        <div className="item">
                            <div className="horizontalTitle">
                                <span>Distribuidores</span>
                                <h3>140.000 <span>COP</span></h3>
                            </div>
                            <div className="itemProgressBar">
                                <div className="progressActive">
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="horizontalTitle">
                                <span>Empresa</span>
                                <h3>140.000 <span>COP</span></h3>
                            </div>
                            <div className="itemProgressBar">
                                <div className="progressActive Business">
                                </div>
                            </div>
                        </div>

                        <div className="item">
                            <div className="horizontalTitle">
                                <span>Naturales</span>
                                <h3>140.000 <span>COP</span></h3>
                            </div>
                            <div className="itemProgressBar">
                                <div className="progressActive Nature">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}