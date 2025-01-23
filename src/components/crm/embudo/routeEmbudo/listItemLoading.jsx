import React, { useState } from 'react';
import { MdLocalPhone, MdOutlineClose } from 'react-icons/md';

import ItemLoading from './itemLoading';

export default function ListsItemsLoading(props){
    return (
    <div className="containerInfoData">
        <table>
            <tbody>
                <ItemLoading />
                <ItemLoading />
                <ItemLoading />


            </tbody>
        </table>
    </div>
    )
}