import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
export default function ModalSeeOnline(){
    const [params, setParams] = useSearchParams();

    const embudo = useSelector(store => store.embudo);
    const { fuente } = embudo;
    const dispatch = useDispatch();
    return (
        <div className="modal">
            <div className="hidden" onClick={() => {
                params.delete('add');
                setParams(params);
            }}></div>
            <div className="containerModalSmall">
                <div className="header">
                    <h3>Fuente - <strong>Digítal</strong></h3>
                </div>
                <div className="result">
                    <div className="containerResult">
                        <div className="inputDivQr">
                            <div className="qrCode">
                                <QRCode className="qrComponent" value={`https://fenix-rosy.vercel.app/get/add/${fuente.nombre}`} />
                            </div>
                            <h3>{fuente.nombre}</h3>
                        </div>
                    </div>
                </div>
            
            </div>

        </div>
    )
}