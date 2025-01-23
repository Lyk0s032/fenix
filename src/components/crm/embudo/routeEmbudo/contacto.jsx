import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdLocalPhone, MdOutlineClose } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import ListsItems from './listItems';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ListsItemsLoading from './listItemLoading';

export default function ContactoEmbudo(props){
    const [params, setParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const embudo = useSelector(store => store.embudo);
    const { contactos, loadingContactos } = embudo;
    return (
        <div className="pestanaEmbudo">
            <div className="containerPestanaEmbudo">
                <div className="topPestana">
                    <div className="containerTop">
                        <div className="title">
                            <div className="icono">
                                <MdLocalPhone className="icon" />
                            </div>
                            <div className="dataTitle"> 
                                {loadingContactos || !contactos  ? <Skeleton width={200} height={20} /> : <h3>Contacto</h3>} 
                                {loadingContactos || !contactos  ? <Skeleton width={100} height={10} /> : <span>Panel de llamadas</span>} 


                                <div className="optionsNavFilter">
                                    <nav>
                                        {
                                            loadingContactos || !contactos  ? 
                                                <ul>
                                                    <li>
                                                        <Skeleton width={100} height={20} />
                                                    </li>
                                                    <li>
                                                        <Skeleton width={100} height={20} />
                                                    </li>
                                                    <li>
                                                        <Skeleton width={100} height={20} />
                                                    </li>
                                                </ul>
                                            : 
                                            !contactos || contactos == 'notrequest' ?
                                                null
                                            :
                                            <ul> 
 
                                                <li className={params.get('filter') == 'contacto 1' ? 'Active' : null} onClick={() => {
                                                        params.set('filter', 'contacto 1')
                                                        setParams(params);
                                                    }}>
                                                    <div className="" >
                                                        <span>Primer  
                                                            <strong>
                                                                {
                                                                    contactos ? ` ${contactos.filter(cl => cl.case == 'contacto 1' && cl.state == 'active').length}` : 0
                                                                }
                                                            </strong>
                                                        </span>
                                                    </div>
                                                </li>
                                                
                                                <li className={params.get('filter') == 'contacto 2' ? 'Active' : null} onClick={() => {
                                                        params.set('filter', 'contacto 2')
                                                        setParams(params);
                                                    }}>
                                                    <div className="">
                                                        <span>Segundo 
                                                            <strong>
                                                                {
                                                                   contactos ? ` ${contactos.filter(cl => cl.case == 'contacto 2' && cl.state == 'active').length}` : 0
                                                                }
                                                            </strong>
                                                        </span>
                                                    </div>
                                                </li>
                                                <li className={params.get('filter') == 'contacto 3' ? 'Active' : null} onClick={() => {
                                                        params.set('filter', 'contacto 3')
                                                        setParams(params);
                                                    }}>
                                                    <div className="">
                                                        <span>Tercero 
                                                            <strong>
                                                                {
                                                                   contactos ?  ` ${contactos.filter(cl => cl.case == 'contacto 3' && cl.state == 'active').length}` : 0
                                                                }
                                                            </strong>
                                                        </span>
                                                            
                                                    </div>
                                                </li>
                                                <li className={params.get('filter') == 'aplazado' ? 'Active' : null} onClick={() => {
                                                        params.set('filter', 'aplazado')
                                                        setParams(params);
                                                    }}>
                                                    <div className="">
                                                        <span>Aplazado 
                                                            <strong>
                                                                {
                                                                    ` ${contactos.filter(cl => cl.state == 'aplazado').length}`
                                                                }
                                                            </strong>
                                                        </span>
                                                            
                                                    </div>
                                                </li>
                                                <li className={params.get('filter') == 'perdido' ? 'Active' : null} onClick={() => {
                                                        params.set('filter', 'perdido')
                                                        setParams(params);
                                                    }}>
                                                    <div className="">
                                                        <span>Perdido 
                                                            <strong>
                                                                {
                                                                    ` ${contactos.filter(cl => cl.state == 'perdido').length}`
                                                                }
                                                            </strong>
                                                        </span>
                                                            
                                                    </div>
                                                </li>
                                                {/* <li className={params.get('filter') == 'perdido' ? 'Active' : null} onClick={() => {
                                                        params.set('filter', 'perdido')
                                                        setParams(params);
                                                    }}>
                                                    <div className="">
                                                        <span>Perdido 
                                                            <strong>
                                                                {
                                                                    ` ${contactos.filter(cl => cl.state == 'perdido').length}`
                                                                }
                                                            </strong>
                                                        </span>
                                                            
                                                    </div>
                                                </li> */}
                                                        
                                            </ul>
                                        }
                                        
                                    </nav>
                                    <div className="setting">
                                        <button>
                                            <BsThreeDotsVertical className="icon" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
                <div className="infoDataEmbudo">
                    {
                        loadingContactos || !contactos ?
                            <ListsItemsLoading />
                        :
                            <ListsItems data={contactos} type='contacto' />

                    }
                </div>
          
            </div>
        </div>
    )
}