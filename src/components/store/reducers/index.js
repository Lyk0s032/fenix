import { combineReducers } from "redux";

import usuario from './usuario';
import games from "./games";
import embudo from "./embudo";
import system from "./system";
import calendar from "./calendar";
import clients from "./clients";

const appReducer = combineReducers({
    usuario,
    embudo,
    calendar,
    system,
    clients
});

export default appReducer