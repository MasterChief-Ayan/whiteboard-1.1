import {createContext} from "react";

const boardContext = createContext({
    activeToolItem: "",
    toolActionTypye:"",
    element: [],
    history:[[]],
    index:0,
    boardMouseDownHandler: ()=>{},
    changeToolHandler:()=>{},
    boardMouseMoveHandler:()=>{},
    boardMouseUpHandler:()=>{},
    handleDownloadClick:()=>{},
})

export default boardContext;