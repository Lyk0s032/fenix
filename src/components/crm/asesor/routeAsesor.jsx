import React, { useEffect } from 'react';
import LeftAsesores from './leftAsesores';
import PanelAsesor from './dataAsesor';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/action/action';
import { MdYoutubeSearchedFor } from 'react-icons/md';
export default function RouteAsesor(props){
    const user = props.user;
    const dispatch = useDispatch();
    const usuarios = useSelector(store => store.usuario);
    const { asesores, loadingAsesores } = usuarios;

    console.log(user)
    useEffect(() => { 
        dispatch(actions.axiosToGetAsesores(user.id, true)) 
    }, [])
    return (
        <div className="asesores">
            <div className="containerAsesor">
                <div className="leftAll"> 
                    {
                        loadingAsesores || !asesores ?
                            <div className="loading">
                                <h3>Cargando</h3>
                            </div>
                        : 
                        <LeftAsesores asesores={asesores} user={user} />
                    }
                </div>
                <div className="rightComponent">
                    <PanelAsesor />
                </div>
            </div>
        </div>
    )
}