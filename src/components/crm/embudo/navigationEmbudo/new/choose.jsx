import React, { useEffect } from 'react';
import { MdBusiness, MdCall } from 'react-icons/md';
import { TbMoodDollar } from 'react-icons/tb';
import * as actions from '../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';

export default function Choose(){
    const dispatch = useDispatch();
    const sistema = useSelector(store => store.system);

    const { cliente } = sistema;
    const setStep = (route) => {
        dispatch(actions.HandleNew(route))
    }

    useEffect(() => {
        if(!cliente){
            setStep(null);
        }
    }, [])
    return (
        <div className="leftNavEmbudoNew">
            <div className="containerLeftNavEmbudoNew">

                <div className="clientChoosed">
                    <div className="containerChoosed">
                        <div className="img">
                            <img src={cliente.photo} alt="" />
                        </div>
                        <div className="name">
                            <h3>{cliente.nombreEmpresa}</h3>
                        </div>
                    </div>
                </div>
                <div className="titleNew">
                    <h3>Selecciona</h3>
                </div>
                <div className="choose">
                    <div className="containerChoose">
                        <div className="itemChoose" onClick={() => setStep('call')}>
                            <div className="containerItemChoose">
                                <div className="icono">
                                    <MdCall className='icon' />
                                </div>
                                <div className="Description">
                                    <h3>Llamada</h3>
                                </div>
                            </div>
                        </div>
                        <div className="itemChoose" onClick={() => setStep('visita')}>
                            <div className="containerItemChoose">
                                <div className="icono">
                                    <MdBusiness className='icon' />
                                </div>
                                <div className="Description">
                                    <h3>Visita</h3>
                                </div>
                            </div>
                        </div>

                        <div className="itemChoose" onClick={() => setStep('cotizacion')}>
                            <div className="containerItemChoose">
                                <div className="icono">
                                    <TbMoodDollar className='icon' />
                                </div>
                                <div className="Description">
                                    <h3>Cotización</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}