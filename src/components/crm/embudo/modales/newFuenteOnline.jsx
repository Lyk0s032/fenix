import React from 'react';

export default function ModalNewFuenteOnline(){
    return (
        <div className="modal">
            <div className="containerModalSmall">
                <div className="header">
                    <h3>Nueva fuente - <strong>Digítal</strong></h3>
                </div>
                <div className="result">
                    <div className="containerResult">
                        <div className="inputDiv">
                            <label htmlFor="">Nombre de la fuente</label>
                            <input type="text" placeholder='Ej. Fería comfenalco' />
                        </div>

                        <div className="inputDiv">
                            <button>
                                <span>Añadir fuente   </span>
                            </button>
                        </div>
                        
                    </div>
                </div>
            
            </div>

        </div>
    )
}