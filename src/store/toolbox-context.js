import {createContext} from "react";

const toolBoxContext = createContext({
    toolboxState:{},
    changeStrokeHandler:()=>{},
    changeFillHandler:()=>{},
    changeSizeHandler:()=>{},

});

export default toolBoxContext;