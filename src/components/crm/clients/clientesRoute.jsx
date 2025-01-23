import React from 'react';
import Dashboard from './dashboard';
import { Route, Routes } from 'react-router-dom';
import RouteClient from './client/routeClient';

export default function RoutesClients(){
    return (
        <div className="clients">
            <div className="topHeader">
                <div className="logo">
                    <img src="https://www.metalicascosta.com.co/assets/img/logo_metalicas_costa.png" alt="" />
                </div>
            </div>
           <Routes>
                <Route path="/*" element={<Dashboard />} />
                <Route path="/client/:id/*" element={<RouteClient />} />

           </Routes>
        </div>
    )
}