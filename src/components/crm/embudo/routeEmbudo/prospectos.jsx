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

export default function ProspectosEmbudo(props){
    const [params, setParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const embudo = useSelector(store => store.embudo);
    const { prospectos, loadingProspectos } = embudo;
   
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
                                {loadingProspectos || !prospectos  ? <Skeleton width={200} height={20} /> : <h3>Prospectos </h3>} 
                                {loadingProspectos || !prospectos  ? <Skeleton width={100} height={10} /> : <span>Panel de prospectos</span>} 


                                <div className="optionsNavFilter">
                                    <nav>
                                        {
                                            loadingProspectos || !prospectos  ? 
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
                                            !prospectos || prospectos == 'notrequest' ?
                                                null
                                            :
                                            <ul> 
                                                <li className={params.get('filter') == 'intento 1' ? 'Active' : null} onClick={() => {
                                                        params.set('filter', 'intento 1')
                                                        setParams(params);
                                                    }}>
                                                    <div >
                                                        <span>Primer 
                                                            <strong>
                                                                {
                                                                    prospectos && prospectos.length ? ` ${prospectos.filter(cl => cl.state == 'intento 1').length}` : 0
                                                                }    
                                                            </strong>
                                                        </span>
                                                    </div>
                                                </li>
                                                
                                                <li className={params.get('filter') == 'intento 2' ? 'Active' : null} onClick={() => {
                                                        params.set('filter', 'intento 2')
                                                        setParams(params);
                                                    }}>
                                                    <div > 
                                                        <span>Segundo 
                                                            <strong>
                                                                {
                                                                    prospectos ? ` ${prospectos.filter(cl => cl.state == 'intento 2').length}` : 0
                                                                }
                                                            </strong>
                                                        </span>
                                                    </div>
                                                </li>
                                                <li className={params.get('filter') == 'intento 3' ? 'Active' : null} onClick={() => {
                                                        params.set('filter', 'intento 3')
                                                        setParams(params);
                                                    }}>
                                                    <div >
                                                        <span>Tercero 
                                                        <strong>
                                                                {
                                                                    prospectos ? ` ${prospectos.filter(cl => cl.state == 'intento 3').length}` : 0
                                                                }
                                                            </strong>
                                                        </span>
                                                    </div>
                                                </li>
                                                        
                                            </ul>
                                        }
                                        
                                    </nav>
                                    <div className="setting">
                                       {console.log(prospectos)}
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
                <div className="infoDataEmbudo">
                    {
                        loadingProspectos || !prospectos ?
                            <ListsItemsLoading />
                        :
                            <ListsItems data={prospectos} type='prospecto' />
                    }
                </div>
          
            </div>
        </div>
    )
}