import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BsPlus, BsSearch, BsX } from 'react-icons/bs';
import { MdDeleteOutline } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import Pendientes from './cotizaciones/pendiente';
import EnDesarrollo from './cotizaciones/enDesarrollo';
import EnEspera from './cotizaciones/enEspera';
import { useSelector } from 'react-redux';
import EnPerdido from './cotizaciones/EnPerdidas';

export default function CotizacionesEmbudo(){
    const [params, setParams] = useSearchParams();
    const [nav, setNav] = useState(null);
    
    // Estados para filtros
    const [searchText, setSearchText] = useState('');
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedEstado, setSelectedEstado] = useState(null);
    const [showClientDropdown, setShowClientDropdown] = useState(false);
    
    // Ref para el dropdown
    const dropdownRef = useRef(null);
 
    const embudo = useSelector(store => store.embudo);
    const { cotizaciones, loadingCotizaciones } = embudo;

    // Cerrar dropdown cuando se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowClientDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Limpiar filtro de estado cuando se cambia de tab (solo aplica en Activas)
    useEffect(() => {
        if (nav !== null) {
            setSelectedEstado(null);
        }
    }, [nav]);

    // Extraer lista única de clientes de las cotizaciones
    const clientsList = useMemo(() => {
        if (!cotizaciones || cotizaciones === 'notrequest' || cotizaciones === 404) return [];
        
        const uniqueClients = [];
        const clientIds = new Set();
        
        cotizaciones.forEach(cot => {
            if (cot.client && !clientIds.has(cot.client.id)) {
                clientIds.add(cot.client.id);
                uniqueClients.push({
                    id: cot.client.id,
                    nombre: cot.client.nombreEmpresa,
                    nit: cot.client.nit
                });
            }
        });
        
        return uniqueClients;
    }, [cotizaciones]);

    // Filtrar clientes para el dropdown
    const filteredClientsList = useMemo(() => {
        if (!searchText) return clientsList;
        
        const search = searchText.toLowerCase();
        return clientsList.filter(client => 
            client.nombre?.toLowerCase().includes(search) ||
            client.nit?.toLowerCase().includes(search)
        );
    }, [clientsList, searchText]);

    // Aplicar filtros a las cotizaciones (SIN filtro de estado - se aplica en cada tab)
    const filteredCotizaciones = useMemo(() => {
        if (!cotizaciones || cotizaciones === 'notrequest' || cotizaciones === 404) {
            return cotizaciones;
        }

        let filtered = [...cotizaciones];

        // Filtro por texto de búsqueda (nombre de cotización)
        // Solo aplica si hay searchText y NO hay coincidencias de clientes o el dropdown está cerrado
        const hasClientMatches = filteredClientsList.length > 0;
        if (searchText && (!hasClientMatches || !showClientDropdown)) {
            filtered = filtered.filter(cot => 
                cot.name?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filtro por clientes seleccionados
        if (selectedClients.length > 0) {
            filtered = filtered.filter(cot => 
                selectedClients.some(sc => sc.id === cot.client?.id)
            );
        }

        // NOTA: El filtro por estado NO se aplica aquí
        // Se pasa como prop a los componentes hijos para que filtren dentro de su tab

        return filtered;
    }, [cotizaciones, searchText, selectedClients, filteredClientsList, showClientDropdown]);

    // Agregar cliente a la selección
    const addClient = (client) => {
        if (!selectedClients.find(c => c.id === client.id)) {
            setSelectedClients([...selectedClients, client]);
        }
        setSearchText('');
        setShowClientDropdown(false);
    };

    // Remover cliente de la selección
    const removeClient = (clientId) => {
        setSelectedClients(selectedClients.filter(c => c.id !== clientId));
    };

    // Limpiar todos los filtros
    const clearAllFilters = () => {
        setSearchText('');
        setSelectedClients([]);
        setSelectedEstado(null);
    };

    // Verificar si hay filtros activos (solo globales, no incluye estado)
    const hasActiveFilters = searchText || selectedClients.length > 0;

    // Estados disponibles para filtrar
    const estadosFilter = [
        { id: 'sin_enviar', label: 'Sin enviar', value: 'sin_enviar' },
        { id: 'Enviada', label: 'Enviadas', value: 'Enviada' },
        { id: 'en seguimiento', label: 'En seguimiento', value: 'en seguimiento' },
        { id: 'cierre', label: 'Cierre', value: 'cierre' },
        { id: 'sin respuesta', label: 'Sin respuesta', value: 'sin respuesta' }
    ];

    return (
        <div className="pestanaEmbudo">
            <div className="containerPestanaEmbudo">
                <div className="topPestanaCotizacion">
                    <div className="containerTopPestana">
                        <div className="topTitleAndSearch">
                            <div className="containerAndSearch">
                                <div className="titleDiv">
                                    <h1>Cotizaciones</h1>
                                </div>
                                <div className="searchDiv" ref={dropdownRef}>
                                    <div className="searchInputWrapper">
                                        <BsSearch className="searchIcon" />
                                        <input 
                                            type="text" 
                                            placeholder='Buscar por nombre o cliente...'
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            onFocus={() => setShowClientDropdown(true)}
                                        />
                                        {searchText && (
                                            <BsX 
                                                className="clearIcon" 
                                                onClick={() => {
                                                    setSearchText('');
                                                    setShowClientDropdown(false);
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Dropdown de clientes */}
                                    {showClientDropdown && searchText && filteredClientsList.length > 0 && (
                                        <div className="clientDropdown">
                                            {filteredClientsList.slice(0, 5).map(client => (
                                                <div 
                                                    key={client.id}
                                                    className="clientOption"
                                                    onClick={() => addClient(client)}
                                                >
                                                    <div className="clientInfo">
                                                        <span className="clientName">{client.nombre}</span>
                                                        <span className="clientNit">NIT: {client.nit}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Tags de clientes seleccionados */}
                                    {selectedClients.length > 0 && (
                                        <div className="selectedClientsTags">
                                            {selectedClients.map(client => (
                                                <div key={client.id} className="clientTag">
                                                    <span>{client.nombre}</span>
                                                    <BsX 
                                                        className="removeTagIcon"
                                                        onClick={() => removeClient(client.id)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {hasActiveFilters && (
                                        <button className="clearFiltersBtn" onClick={clearAllFilters}>
                                            Limpiar filtros
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="navigationBetweenTaps">
                            <div className="containerNavCoti">
                                <nav>
                                    <ul>
                                        <li className={!nav ? 'Active' : null}
                                        onClick={() => setNav(null)}>
                                            <div>
                                                <span>Activas 
                                                {
                                                    filteredCotizaciones == 'notrequest' || filteredCotizaciones == 404 ? ` 0`:
                                                    filteredCotizaciones && filteredCotizaciones.length ? ` ${filteredCotizaciones.filter(cl => cl.state == 'pendiente').length}` : 0
                                                }
                                                </span>
                                            </div>
                                        </li>
                                        <li className={nav == 'desarrollo' ? 'Active' : null}
                                        onClick={() => setNav('desarrollo')}>
                                            <div>
                                                <span>
                                                    Desarrollo 
                                                    {
                                                        filteredCotizaciones == 'notrequest' || filteredCotizaciones == 404 ? ` 0` :
                                                        filteredCotizaciones && filteredCotizaciones.length ? ` ${filteredCotizaciones.filter(cl => cl.state == 'desarrollo').length}` : 0
                                                    }
                                                </span>
                                            </div>
                                        </li>
                                        <li className={nav == 'espera' ? 'Active' : null}
                                        onClick={() => setNav('espera')}>
                                            <div>
                                                <span>
                                                    Espera 
                                                    {
                                                        filteredCotizaciones == 'notrequest' || filteredCotizaciones == 404 ?  ` 0` :
                                                        filteredCotizaciones && filteredCotizaciones.length ? ` ${filteredCotizaciones.filter(cl => cl.state == 'aplazado').length}` : 0
                                                    }
                                                </span>
                                                    
                                            </div>
                                        </li>
                                        <li className={nav == 'perdido' ? 'Active' : null}
                                        onClick={() => setNav('perdido')}>
                                            <div>
                                                <span>
                                                    Perdidas  
                                                    {
                                                        filteredCotizaciones == 'notrequest' || filteredCotizaciones == 404 ? ` 0` :
                                                        filteredCotizaciones && filteredCotizaciones.length ? ` ${filteredCotizaciones.filter(cl => cl.state == 'perdido').length}` : 0
                                                    }
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </nav>
                                <div className="searchCoti">
                                </div>
                            </div>

                            {/* Filtros de estado - solo aparecen en el tab "Activas" */}
                            {!nav && (
                                <div className="estadoFilters">
                                    {estadosFilter.map(estado => (
                                        <button
                                            key={estado.id}
                                            className={`estadoFilterBtn ${selectedEstado === estado.value ? 'active' : ''}`}
                                            onClick={() => setSelectedEstado(
                                                selectedEstado === estado.value ? null : estado.value
                                            )}
                                        >
                                            {estado.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="infoDataCotizacion">
                    {
                        loadingCotizaciones || !cotizaciones  ?
                            <div className="notFound">
                                <h3>Cargando cotizaciones...</h3>
                            </div>
                        :
                        cotizaciones == 'resquest' || cotizaciones == 'notrequest' || cotizaciones == 404 ?
                            <div className="notFound">
                                <h1>No hay cotizaciones para mostrar</h1>
                            </div>
                        :
                        !nav ? 
                            <Pendientes data={filteredCotizaciones} selectedEstado={selectedEstado} />
                        : nav == 'desarrollo' ?
                            <EnDesarrollo data={filteredCotizaciones} />
                        : nav == 'espera' ? <EnEspera data={filteredCotizaciones} /> 
                        : nav == 'perdido' ? <EnPerdido data={filteredCotizaciones} /> : null
                    }
                </div>
            </div>
        </div>
    )
}