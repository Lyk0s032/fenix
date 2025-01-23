import dayjs from 'dayjs';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdLocalPhone, MdOutlineClose, MdOutlineQuestionMark } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import 'dayjs/locale/es';  // Importar idioma español
import { useDispatch } from 'react-redux';
import * as actions from '../../../store/action/action';

export default function Item(props){
    dayjs.locale('es');
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    const item = props.item;
    const type = props.type;
    const openAction = (data) => {
        dispatch(actions.getItem(data))
        if(params.get('w') == 'action'){
            params.delete(w);
            setParams(params);
        }
        params.set('w', 'action');
        setParams(params);
    }
    let proximaFecha = item.calendaries ? item.calendaries.find(time => time.state == 'active') : null
    return (
    type == 'contacto' ?
        <tr onClick={() => openAction(item)}>
            <td>
                <div className='aboutClient'>
                    <div className="containerAbout">
                        <div className="div">
                            <img src={item.client.photo} alt="" />
                        </div>
                        <div className="dataAbout">
                            <h3>{item.client.nombreEmpresa}</h3>
                            <h4>{item.client.phone}</h4>
                            <span>{item.client.type}</span>
                        </div>
                    </div>
                </div>
            </td>

            <td>
                <div className="razon">

                    <h3>
                        {item.title}
                    </h3>
                    <h4>
                        {
                            item.calendaries && item.calendaries.length ?
                            item.calendaries.map((time, i) => {
                                return (
                                    time.state == 'active' ?
                                    <span key={i+1}>Fecha de llamada: {dayjs(time.time.split('T')[0]).format('DD [de] MMMM [del] YYYY')}</span>
                                    
                                    :null
                                )
                            }) 
                            : 'Sin definir'
                        }
                    </h4>
                </div>
            </td>
            <td>
                {

                    params.get('filter') == 'aplazado'  ?
                    <div className="try">
                        <div className="containerTry">
                            {
                                item.case == 'contacto 2' || item.case == 'contacto 3' ?
                                <button className='cancel'>
                                    <MdOutlineClose className='icon' />
                                </button>
                                : item.case == 'contacto 1' ? 
                                <button className='great'>

                                    <MdOutlineQuestionMark className='icon' />
                                </button>
                                : null
                            }
                            
                            {
                                item.case == 'contacto 3' ?
                                <button className='cancel'>
                                    
                                    <MdOutlineClose className='icon' />
                                </button>
                                : item.case == 'contacto 2' ?
                                <button className='great'>
                                    <MdOutlineQuestionMark className='icon' />
                                </button>
                                :
                                <button className='inactive'>
                                    <MdOutlineQuestionMark className='icon' />
                                </button>
                            }



                            {
                                item.case == 'contacto 3' ?
                                <button className='great'>
                                    <MdOutlineQuestionMark className='icon' />
                                </button>
                                : 
                                <button className='inactive'>
                                    <MdOutlineQuestionMark className='icon' />
                                </button>
                            }
                        </div>
                    </div>

                    :params.get('filter') == 'perdido' ?
                        <div className="try">
                            <span>perdido</span>
                        </div>
                    :
                    <div className="try">
                        <div className="containerTry">
                            {
                                item.case == 'contacto 2' || item.case == 'contacto 3' ?
                                <button className='cancel'>
                                    <div className="hidden">
                                        {item.calendaries && item.calendaries.length ? 
                                            item.calendaries.map((t, i) => {
                                                
                                                return (
                                                    t.case == 'contacto 1' ? 
                                                        <span key={i+1}>
                                                        {dayjs(t.time.split('T')[0]).format('DD [de] MMMM [del] YYYY') }
                                                        </span>
                                                    : null
                                                )
                                            })
                                        : null}
                                    </div>
                                    <MdOutlineClose className='icon' />
                                </button>
                                : item.case == 'contacto 1' ? 
                                <button className='great'>
                                    <div className="hidden">
                                        {
                                            item.calendaries && item.calendaries.length ?
                                            item.calendaries.map((time, i) => {
                                                return (
                                                    time.state == 'active' ?
                                                    <span key={i+1}>{dayjs(time.time.split('T')[0]).format('dddd, MMMM D, YYYY')}</span>
                                                    
                                                    :null
                                                ) 
                                            }) 
                                            : 'Sin definir'
                                        }
                                    </div>
                                    <MdOutlineQuestionMark className='icon' />
                                </button>
                                : null
                            }
                            
                            {
                                item.case == 'contacto 3' ?
                                <button className='cancel'>
                                    <div className="hidden">
                                        {item.calendaries && item.calendaries.length ? 
                                            item.calendaries.map((t, i) => {
                                                
                                                return (
                                                    t.case == 'contacto 2' ?
                                                        <span key={i+1}>
                                                        {dayjs(t.time.split('T')[0]).format('dddd, MMMM D, YYYY') }
                                                        </span>
                                                    : null
                                                )
                                            })
                                        : null}
                                    </div>
                                    <MdOutlineClose className='icon' />
                                </button>
                                : item.case == 'contacto 2' ?
                                <button className='great'>
                                    <div className="hidden">
                                        <span>{proximaFecha ? dayjs(proximaFecha.time.split('T')[0]).format('dddd, MMMM D, YYYY') : null}</span>
                                    </div>
                                    <MdOutlineQuestionMark className='icon' />
                                </button>
                                :
                                <button className='inactive'>
                                    <MdOutlineQuestionMark className='icon' />
                                </button>
                            }



                            {
                                item.case == 'contacto 3' ?
                                <button className='great'>
                                    <div className="hidden">
                                        <span>{proximaFecha ? dayjs(proximaFecha.time.split('T')[0]).format('dddd, MMMM D, YYYY') : 0}</span>
                                    </div>
                                    <MdOutlineQuestionMark className='icon' />
                                </button>
                                : 
                                <button className='inactive'>
                                    <MdOutlineQuestionMark className='icon' />
                                </button>
                            }
                        </div>
                    </div>
                }
            </td>
        </tr> 
    : type == 'visita' ?
        <tr onClick={() => openAction(item)}>
            <td>
                <div className='aboutClient'>
                    <div className="containerAbout">
                        <div className="div">
                            <img src={item.client.photo} alt="" />
                        </div>
                        <div className="dataAbout">
                            <h3>{item.client.nombreEmpresa ? item.client.nombreEmpresa : 'Sin definir'}</h3>
                            <h4>{item.client.phone}</h4>
                            <span>{item.client.type}</span>
                        </div>
                    </div>
                </div>
            </td>

            <td>
                <div className="razon">

                    <h3>
                        {item.title}
                    </h3>
                    
                    <h4> 
                        {
                        item.calendaries && item.calendaries.length ?
                            item.calendaries.map((time, i) => {
                                return (
                                    time.state == 'active' ?
                                    <span key={i+1}>Fecha de visita: {dayjs(time.time.split('T')[0]).format('dddd, MMMM D, YYYY')}</span>
                                    
                                    :null
                                )
                            }) 
                            : 'Sin definir'
                        }
                    </h4>
                </div>
            </td>
            <td>
                <div className="try">
                    <div className="containerTry">
                        
                        
                    </div>
                </div>
            </td>
        </tr>
    : type == 'prospecto' ?
        <tr onClick={() => openAction(item)}>
            <td>
                <div className='aboutClient'>
                    <div className="containerAbout">
                        <div className="div">
                        </div>
                        <div className="dataAbout">
                            <h3>{item.nombreEmpresa ? item.nombreEmpresa : 'Sin definir'}</h3>
                            <h4>{item.phone}</h4>
                            <span>{item.type}</span>
                        </div>
                    </div>
                </div>
            </td>

            <td>
                
            </td>
            <td>
                <div className="try">
                    <div className="containerTry">
                        {
                            item.state == 'intento 2' || item.state == 'intento 3' ?
                            <button className='cancel'>
                                <MdOutlineClose className='icon' />
                            </button>
                            : item.state == 'intento 1' ? 
                            <button className='great'>

                                <MdOutlineQuestionMark className='icon' />
                            </button>
                            : null
                        }
                        
                        {
                            item.state == 'intento 3' ?
                            <button className='cancel'>
                                <div className="hidden">
                                    {item.calendaries && item.calendaries.length ? 
                                        item.calendaries.map((t, i) => {
                                            
                                            return (
                                                t.case == 'intento 2' ?
                                                    <span key={i+1}>
                                                    {dayjs(t.time.split('T')[0]).format('dddd, MMMM D, YYYY') }
                                                    </span>
                                                : null
                                            )
                                        })
                                    : null}
                                </div>
                                <MdOutlineClose className='icon' />
                            </button>
                            : item.state == 'intento 2' ?
                            <button className='great'>

                                <MdOutlineQuestionMark className='icon' />
                            </button>
                            :
                            <button className='inactive'>
                                <MdOutlineQuestionMark className='icon' />
                            </button>
                        }



                        {
                            item.state == 'intento 3' ?
                            <button className='great'>
                                <MdOutlineQuestionMark className='icon' />
                            </button>
                            : 
                            <button className='inactive'>
                                <MdOutlineQuestionMark className='icon' />
                            </button>
                        }
                    </div>
                </div>
            </td>
        </tr>
    :null
    )
}