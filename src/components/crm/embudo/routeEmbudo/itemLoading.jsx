import dayjs from 'dayjs';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ItemLoading(props){

    return (
        <tr style={{alignItems:'start'}} >
            <td style={{verticalAlign:'top'}}>
                <div className='aboutClient'>
                    <div className="containerAbout">
                        <div className="div">
                            <Skeleton width={30} height={30} />
                        </div>
                        <div className="dataAbout">
                            <Skeleton width={100} height={25}/>
                            <Skeleton width={100} height={12}/>
                            <Skeleton width={100} height={10}/>
                        </div>
                    </div>
                </div>
            </td>

            <td style={{verticalAlign:'top'}}>
                <div className="razon">

                    <Skeleton count={2} width={250} height={15}/>

                </div>
            </td>
            <td style={{verticalAlign:'top'}}>
                <div className="try">
                    <div className="containerTry"> 
                        <Skeleton count={2} width={100} height={15}/>

                    </div>
                </div>
            </td>
        </tr>
    )
}