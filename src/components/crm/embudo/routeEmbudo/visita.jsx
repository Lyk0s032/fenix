import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdLocalPhone, MdOutlineClose } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import ListsItems from './listItems';
import { useSelector } from 'react-redux';
import ListsItemsLoading from './listItemLoading';
import Skeleton from 'react-loading-skeleton';

export default function VisitaEmbudo(props){
    const [params, setParams] = useSearchParams();

    const embudo = useSelector(store => store.embudo);

    const { visitas, loadingVisitas } = embudo;
   
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
                                {loadingVisitas || !visitas  ? <Skeleton width={200} height={20} /> : <h3>Visitas </h3>} 
                                <span>Panel de visitas</span>

                                <div className="optionsNavFilter">
                                    <nav>
                                        {
                                            loadingVisitas || !visitas  ? 
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
                                            !visitas || visitas == 'notrequest' ?
                                                null
                                            :
                                            <ul> 
                                                <li className={!params.get('filter') ? 'Active' : null} onClick={() => {
                                                        params.delete('filter')
                                                        setParams(params);
                                                    }}>
                                                    <div className="" >
                                                        <span>Pendientes  
                                                            <strong>
                                                                {
                                                                    ` ${visitas.filter(cl => cl.state == 'active').length}`
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
                                                                    ` ${visitas.filter(cl => cl.state == 'aplazado').length}`
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
                                                        <span>Perdidas 
                                                            <strong>
                                                                { 
                                                                    ` ${visitas.filter(cl => cl.state == 'cancelada').length}`
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
                        loadingVisitas || !visitas ?
                            <ListsItemsLoading />
                        :
                        <ListsItems data={visitas} type='visita' />
                    }
                </div>
          
            </div>
        </div>
    )
}