import React from 'react';

export default function ItemSelect(){
    return (
        <tr>
            <td>
                <div className='check'>
                    <input type="checkbox" />
                </div>
                    </td>
                    <td>
                <div className='aboutClient'>
                    <div className="containerAbout">
                        <div className="div">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCvh-j7HsTHJ8ZckknAoiZMx9VcFmsFkv72g&s" alt="" />
                        </div>
                        <div className="dataAbout">
                            <h3>Apple</h3>
                            <h4>315 047 5512</h4>
                            <span>Empresa</span>
                        </div>
                    </div>
                </div>
                    </td>

                    <td>
                <div className="razon">

                    <h3>
                        Llamar a Etimarcas para cotización básica
                    </h3>
                    <h4>Próxima llamada: 25 de Enero del 2024</h4>
                </div>
            </td>
                    
        </tr>
    )
}