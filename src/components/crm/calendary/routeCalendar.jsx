import dayjs from 'dayjs';
import React from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css"
import "dayjs/locale/es";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import ItemCalendario from './itemCaledario';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from './../../store/action/action';


dayjs.locale("es")
// Extiende dayjs con los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export default function Calendary(props){
    const user = props.user;
    const calendary = useSelector(store => store.calendar);

    const { calendar, itemCalendar, loadingCalendar } = calendary;
    const localizer = dayjsLocalizer(dayjs);

    const dispatch = useDispatch();
    console.log(calendar)
    const component = {
        event: props => {
            const handleClick = (e) => {
                // Prevenir la propagación del clic si solo quieres que se ejecute una vez
                e.stopPropagation();
                // Despachar la acción
                dispatch(actions.getItemCalendar(props.event.data));
                // Alternar la clase para mostrar/ocultar el panel de acciones
                document.querySelector("#nubeAcciones").classList.toggle('nubeItemCalendarioActive');
            };
            return (
                <div className='itemCalendario' onClick={handleClick}> 
                    <div className="containerItem" >
                        <label htmlFor=""> <span>{props.event.data.note}</span></label>
                    </div>
                </div>
            )
        }
    }

    const message = {
        next: 'Siguiente',
        previous: 'Anterior',
        today: 'Hoy',
        month: 'mes',
        week: 'semana',
        day: 'día'
    }
    
    return (
        <div className='calendar'>
            <div className="containerCalendar">
                <div className="calendario">
                    <Calendar className='etiquetaCalendary' 
                    localizer={localizer}  
                     culture='es'
                    events={calendar.map((cal, i) => {
                        let fechaConFormato = dayjs(cal.time.split('T')[0]).format('YYYY-MM-DD')
                        let fecha = fechaConFormato+" "+cal.hour;
                        const fechaColombia = dayjs(fecha).tz('America/Bogota');
                        // let a = dayjs(``).tz('America/Bogota').toDate()
                        // let b = dayjs(`${cal.time.split('T')[0]}T${cal.hour}`).tz('America/Bogota').toDate()
                        return (
                            {
                                start: fechaColombia.toDate(),
                                end: fechaColombia.toDate(),
                                data: cal
                            }
                        )
                    })}
                    views={['month', 'week', 'day']}
                    defaultView='week'
                    formats={
                        {
                            dayHeaderFormat: date => {
                                return dayjs(date).format('DD [de] MMMM [del] YYYY')
                            },
                        }
                    }
                    messages={message}
                    components={component}

                    />
                </div>
            </div> 
            <ItemCalendario user={user}/>
        </div>
    )
}