// CONCERNED WITH DRAWING but not concerned with what to draw

import React,{useReducer,useCallback} from 'react'
import { isEqual } from "lodash";
import boardContext from './board-context'
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from '../constants'
// import rough from "roughjs/bin/rough"
import createElement, { getSvgPathFromStroke, isPointerNearElement } from '../utilities/ElementManager';
import getStroke from 'perfect-freehand';

// const gen = rough.generator();// to generate all the relevent shapes as specified

function  boardReducer (state,action) {
    switch (action.type){
        case BOARD_ACTIONS.CHANGE_TOOL:
            return {...state,activeToolItem: action.payload.tool,};
        case BOARD_ACTIONS.CHANGE_ACTION_TYPE:
            return {...state,toolActionType:action.payload.actionType};

        case BOARD_ACTIONS.DRAW_DOWN:{
            const {clientX,clientY,stroke,fill,size} = action.payload;

            const newElement = createElement(state.elements.length,clientX,clientY,clientX,clientY,{type:state.activeToolItem,stroke,fill,size});  // DONT USE BOARD_ACTIONS.DRAW_DOWN
            return {...state, 
                toolActionType:(state.activeToolItem===TOOL_ITEMS.TEXT?TOOL_ACTION_TYPES.WRITING:TOOL_ACTION_TYPES.DRAWING), 
                elements:[...state.elements,newElement]} // prev state + prev elements+ NEW ELEMENTS
        }
            
        case BOARD_ACTIONS.DRAW_MOVE:{
            const {clientX,clientY,stroke,fill,size} = action.payload;

            const pos=state.elements.length-1;
            const newElements=[...state.elements];
            const {x1,y1,type} = newElements[pos];
            // newElements[pos].x2=clientX; // NOT NEEDED ANY MORE DUE TO ELEMENT MANAGER (NNAM)
            // newElements[pos].y2=clientY; // (NNAM)
            // // newElements[pos].roughEle= gen.line(newElements[pos].x1,newElements[pos].y1,newElements[pos].x2,newElements[pos].y2);  // WRONG as the REAL TIM position is from the clientX and clientY // (NNAM)
            // newElements[pos].roughEle= gen.line(x1,y1,clientX,clientY);// (NNAM) 

            switch(type){
                case (TOOL_ITEMS.LINE):
                case (TOOL_ITEMS.RECTANGLE):
                case (TOOL_ITEMS.CIRCLE):
                case (TOOL_ITEMS.ARROW):
                    const newElement = createElement(pos,x1,y1,clientX,clientY,{type:state.activeToolItem,stroke,fill,size});
                    newElements[pos]=newElement;
                    break; 
                case (TOOL_ITEMS.BRUSH):
                    // INSERTING EACH POINT 
                    newElements[pos].points=[...newElements[pos].points,{x:clientX,y:clientY}];
                    newElements[pos].path = new Path2D(getSvgPathFromStroke(getStroke(newElements[pos].points)));
                    //HERE when moving, ELEMENT MANAGER IS NOT CALLED
                    break;

                default:
                    break;
            }

            return {...state,elements:newElements};
        }
        case BOARD_ACTIONS.DRAW_UP:{
            const newHistory = state.history.slice(0,state.index+1);    // as new input is made, HISTORY beyond current is IRRELEVENT, thus we want from 0 till current index (i+1, is made as its exclusive)
            const newElement = [...state.elements]

            return {...state, toolActionType:TOOL_ACTION_TYPES.NONE,history:[...newHistory,newElement],index:state.index+1}
        }
        case BOARD_ACTIONS.ERASE:{
            const {clientX,clientY} = action.payload;
            let newElements = [...state.elements];      // assignment thus "let" and not "const"

            //if Point is close to a element, then dont take it as its supposed to be deleted
            newElements = newElements.filter((element) => {
                return !isPointerNearElement(element,clientX,clientY);
            })

            if (isEqual(newElements, state.history[state.index])) return state;     // as the eraser moves each point it trvels index increases, so if the final state remains same we return the same state else INCREASE THE INDEX
            const newHistory = state.history.slice(0,state.index+1);
            return {...state,elements:newElements,history:[...newHistory,newElements],index:state.index+1}
        }
        case BOARD_ACTIONS.CHANGE_TEXT:{
            const newHistory = [...state.history,state.elements];
            const idx = state.elements.length-1;
            const newElements = [...state.elements];
            newElements[idx].text=action.payload.text;
            return {...state,toolActionType:TOOL_ACTION_TYPES.NONE,elements:newElements,history:newHistory,index:state.index+1};
        }
        case BOARD_ACTIONS.UNDO:{
            let {index}=state;
            if(index===0) return state;
            index-=1;
            const newElements=[...state.history[index]];
            return {...state,elements:newElements,index:index}
        }
        case BOARD_ACTIONS.REDO:{
            let {index}=state;
            if(index===state.history.length-1) return state;
            index+=1;
            const newElements=[...state.history[index]];
            return {...state,elements:newElements,index:index}
        }
            
        default:
            return state;
    }
}

const initialBoardState = {
    activeToolItem: TOOL_ITEMS.BRUSH,
    toolActionType: TOOL_ACTION_TYPES.NONE, // to know what action is going on now
    elements:[],
    history:[[]],
    index:0,
}

function BoardProvider({children}) {


    const [boardState,dispatchBoardAction] = useReducer(boardReducer,initialBoardState);
    function changeToolHandler(tool){
        dispatchBoardAction({type:BOARD_ACTIONS.CHANGE_TOOL, payload:{tool}})
    }

    function boardMouseDownHandler (event,toolboxState) {
        const {clientX,clientY} = event;

        if(boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return; // if done writing and now clicking again somewhere else, thus saving it in board
        
        else if(boardState.activeToolItem === TOOL_ITEMS.ERASER){
            // informing to make the active action type as erasing
            dispatchBoardAction({
                type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
                payload:{actionType:TOOL_ACTION_TYPES.ERASING}
            })
            
        }
        // else if(boardState.activeToolItem === TOOL_ITEMS.TEXT){
        //     dispatchBoardAction({
        //         type:BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        //         payload:{actionType:TOOL_ACTION_TYPES.WRITING}
        //     })
        // }
        else if(boardState.activeToolItem !== TOOL_ITEMS.NONE){
            dispatchBoardAction({type: BOARD_ACTIONS.DRAW_DOWN,
                payload: { 
                    clientX,
                    clientY,
                    stroke: toolboxState[boardState.activeToolItem]?.stroke,
                    fill: toolboxState[boardState.activeToolItem]?.fill,
                    size: toolboxState[boardState.activeToolItem]?.size,
                }});
        }
        
    }
    function boardMouseMoveHandler (event,toolboxState) {
        

        const {clientX,clientY} = event;

        if(boardState.toolActionType === TOOL_ACTION_TYPES.WRITING)  return; // obv dont want to do anything while moving and simultaneously writing

        else if(boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING){
            dispatchBoardAction({type: BOARD_ACTIONS.DRAW_MOVE,
                payload: { 
                    clientX,
                    clientY,
                    stroke: toolboxState[boardState.activeToolItem]?.stroke,
                    fill: toolboxState[boardState.activeToolItem]?.fill,
                    size: toolboxState[boardState.activeToolItem]?.size,
                }});
        }
        else if(boardState.toolActionType === TOOL_ACTION_TYPES.ERASING){    // to identify the pos of erasor when mosue is down and moving
            dispatchBoardAction({type: BOARD_ACTIONS.ERASE,
                payload: { 
                    clientX,
                    clientY,
                }});
        }
        
    }
    function boardMouseUpHandler () {
        if(boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return; // obv no need of any thing here

        if(boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING){
            dispatchBoardAction({ type: BOARD_ACTIONS.DRAW_UP })
        }

        dispatchBoardAction({type: BOARD_ACTIONS.CHANGE_ACTION_TYPE, payload:{actionType:TOOL_ACTION_TYPES.NONE}}); // CHanging the Status of action to NONE
    }
    function textAreaBlurHandler (text) {
        //setting the text once the writing is done in canvas in onBlur attribute

        //COLOR AND STROKE is not required as the intel is send on MOUSE_DOWN
        dispatchBoardAction({type:BOARD_ACTIONS.CHANGE_TEXT,payload:{text}});
    }
    const boardUndoHandler=useCallback (()=> {
        dispatchBoardAction({type:BOARD_ACTIONS.UNDO});
    },[])

    const boardRedoHandler=useCallback( ()=> {
        dispatchBoardAction({type:BOARD_ACTIONS.REDO});
    },[])
    function handleDownloadClick() {
        const canvas = document.getElementById("canvas");
        const data = canvas.toDataURL("image/png"); //data of the canvas
        const anchor = document.createElement("a");    //to refere data and download upon click
        anchor.href=data;
        anchor.download="Sketch.png";
        anchor.click();
    }
    

    const boardValues={
        activeToolItem: boardState.activeToolItem,
        elements:boardState.elements,
        toolActionType:boardState.toolActionType,
        changeToolHandler,
        boardMouseDownHandler,
        boardMouseMoveHandler,
        boardMouseUpHandler,
        textAreaBlurHandler,
        undo:boardUndoHandler,
        redo:boardRedoHandler,
        download:handleDownloadClick,
    }

    
  return (
    <boardContext.Provider value = {boardValues}>
        {children}
    </boardContext.Provider>
  )
}

export default BoardProvider