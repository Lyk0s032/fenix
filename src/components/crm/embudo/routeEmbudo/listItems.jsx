import React, { useState } from 'react';
import { MdLocalPhone, MdOutlineClose } from 'react-icons/md';

import Item from './item';
import ItemSelect from './itemSelect';
import ItemLoading from './itemLoading';
import { useSearchParams } from 'react-router-dom';

export default function ListsItems(props){
    const type = props.type;
    const data = props.data;
    const [params, setParams] = useSearchParams();
    const [select, setSelect] = useState(false);
    return (
    !data || typeof data != 'object' ?
        <div className="notFound">
            <h1>No hay elementos</h1>
        </div> 
    :
    <div className="containerInfoData">
    {
        !select ?    
        <table>
            {
                type == 'contacto' ?
                    <tbody>
                    
                    {
                        data && data.length ?
                            data.map((item,i) => {
                                return (
                                    !params.get('filter') && item.state == 'active' ? 
                                        <Item type={type} item={item} key={i+1} />
                                    :
                                    params.get('filter') == 'aplazado' && item.state == 'aplazado' ?
                                        <Item type={type} item={item} key={i+1} />
                                    :params.get('filter') == 'perdido' && item.state == 'perdido' ?
                                        <Item type={type} item={item} key={i+1} />
                                    // :params.get('filter') == 'perdido' && item.state == 'perdido' ?
                                    // <Item type={type} item={item} key={i+1} />

                                    :item.case == params.get('filter') && item.state == 'active' ?
                                        <Item type={type} item={item} key={i+1} />
                                    :null
                                )
                            })
                        : null
                    }

                </tbody>
                :type == 'visita' ?
                    <tbody>
                    
                    {
                        data && data.length ?
                            data.map((item,i) => {
                                return (
                                    !params.get('filter') && item.state == 'active' ? 
                                        <Item type={type} item={item} key={i+1} />
                                    :
                                    params.get('filter') == 'aplazado' && item.state == 'aplazado' ?
                                        <Item type={type} item={item} key={i+1} />
                                    :
                                        params.get('filter') == 'perdido' && item.state == 'cancelada' ?
                                            <Item type={type} item={item} key={i+1} />
                                    // :params.get('filter') == 'perdido' && item.state == 'perdido' ?
                                    // <Item type={type} item={item} key={i+1} />

                                    :null
                                )
                            })
                        : null
                    }

                </tbody>
                :
                <tbody>
                    
                    {
                        data && data.length ?
                            data.map((item,i) => {
                                return (
                                    !params.get('filter')  ? 
                                        <Item type={type} item={item} key={i+1} />
                                    :
                                    params.get('filter') == item.state ?
                                        <Item type={type} item={item} key={i+1} />
                                    : null
                                )
                            })
                        : null
                    }

                </tbody>
            }
        </table>
        :
        <table className='Select'>
            <tbody>
               <ItemSelect />
            </tbody>
            <div className="panelDelete">
                <div className="containerPanelDelete">
                    <div className="msg">
                        <h3>
                            3 Elementos seleccionados
                        </h3>
                    </div>
                    <div className="btnGo">
                        <button>
                            <span>Eliminar</span>
                        </button>
                    </div>
                </div>
            </div>
        </table>
    }
    </div>
    )
}