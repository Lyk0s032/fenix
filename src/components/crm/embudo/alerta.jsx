import React from 'react';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from './../../store/action/action';
export default function Alerta(){
    const dispatch = useDispatch();

    const system = useSelector(store => store.system);
    const { alerta, typeAlerta } = system;

    return (
        <div className={typeAlerta == 'positive' ? "alerta Great" : "alerta Danger"}>
            <div className="containerAlerta">
                <div></div>
                <div className="data">
                    <span>{alerta}</span>
                </div>
                <button onClick={() => {
                    dispatch(actions.HandleAlerta(null, null))
                }}>
                    <MdClose className='icon' />
                </button>
            </div>
        </div>
    )
}