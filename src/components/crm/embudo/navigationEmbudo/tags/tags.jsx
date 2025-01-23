import axios from 'axios';
import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdArrowBack, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from './../../../../store/action/action';

export default function Tags(){
    const dispatch = useDispatch();
    
    const [interes, setInteres] = useState(true);
    const sistema = useSelector(store => store.system);
    const [tag, setTag] = useState(null);

    const { system, alerta} = sistema;

    const sendNav = (route) => {
        dispatch(actions.HandleNav(route))
    }
    const handleNewTags = async () => {
        console.log('cn etender envia');
        let body = {
            name: tag,
            type: interes ? 'positive' : 'negative'
        }
        const newTag = await axios.post('/api/prospecto/addTag', body)
        .then((res) => {
            console.log(res)
            dispatch(actions.axiosGetSystem(false))
            setTag("")
            dispatch(actions.HandleAlerta('Tag creado con exito', 'positive'))
        })
        .catch(err => {
            console.log(err);
            console.log('Error');
            dispatch(actions.HandleAlerta('Tag creado con exito', 'positive'))


        })
    }

    const deleteTag = async (tgId) => {
        console.log('doble clic')
        let body = {
            idTg: tgId
        }
        const deleteTg = await axios.delete(`/api/prospecto/deleteTag/${tgId}`)
        .then((res) => {
            console.log(res)
            dispatch(actions.axiosGetSystem(false))
        })
        .catch(err => {
            console.log(err);
            console.log('Error');

        })
        return deleteTg
    }

    return (
        <div className="embudoNav">
            <div className="containerEmbudoLeft">
                <div className="headerNavEmbudo">
                    <div className="before">
                        <button onClick={() => sendNav(null)}>
                            <MdArrowBack className="icon" />
                        </button>
                    </div>
                    <div className="headerNavEmbudoTitle" style={{textAlign:'center'}}>
                        <h3>Tags</h3>
                    </div>
                    <div className="before">
                        <button>
                        </button>
                    </div>
                </div>
                <div className="scrollLeftEmbudo">
                    <div className="containerScrollLeft">
                        <div className="searchAll">
                            <div className="search">
                                <nav>
                                    <ul>
                                        <li className={interes ? 'Active' : null}
                                         onClick={() => setInteres(true)}> 
                                            <div>
                                                <span>Interés</span>
                                            </div>
                                        </li>
                                        <li className={!interes ? 'Active' : null} 
                                        onClick={() => setInteres(false)}>
                                            <div>
                                                <span>Sin Interés</span>
                                            </div>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div className="listLonger">
                                <div className="containerListLonger">
                                    <form className="createTags" onSubmit={(e) => {
                                        e.preventDefault()
                                        handleNewTags();
                                    }}>
                                        <input type="text" placeholder='Nombre del tag y presiona enter' 
                                        value={tag} onChange={(e) => setTag(e.target.value)}/>
                                    </form> 
                                    <div className="containerTagsOk">
                                    {
                                        interes ?
                                        <div className="flexDiv">
                                            {
                                                system.tags && system.tags.length ?
                                                    system.tags.map((tg, i) => {
                                                        console.log(tg)
                                                        return (
                                                            tg.type == 'positive' ?
                                                                <button  onDoubleClick={() => deleteTag(tg.id)} className='tagGreat' key={i+1}>
                                                                    <span>{tg.nombre}</span>
                                                                </button>
                                                            : null
                                                        )
                                                    })
                                                : <span>No hay tags</span>
                                            }

                                            
                                        </div>
                                        :
                                        <div className="flexDiv">
                                            {
                                                system.tags && system.tags.length ?
                                                    system.tags.map((tg, i) => {
                                                        return (
                                                            tg.type == 'negative' ?
                                                                <button  onDoubleClick={() => deleteTag(tg.id)} className='tagCancel' key={i+1}>
                                                                    <span>{tg.nombre}</span>
                                                                </button>
                                                            : null
                                                        )
                                                    })
                                                : <span>No hay tags</span>
                                            }
                                        </div>        
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}