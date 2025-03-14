//each TOOL will have its own TOOLBOX

import React,{useReducer} from 'react'
import toolBoxContext from './toolbox-context'
import { COLORS, TOOL_ITEMS, TOOLBOX_ACTIONS } from '../constants';

function toolboxReducer(state,action){
    switch (action.type){
        case TOOLBOX_ACTIONS.CHANGE_STROKE:{
            const {tool,stroke} = action.payload;
            const newState = {...state};
            newState[tool].stroke=stroke;
            return newState;    // just updating the stroke of the tool in state
        }
        case TOOLBOX_ACTIONS.CHANGE_FILL:{
            const {tool,fill} = action.payload;
            const newState = {...state};
            newState[tool].fill=fill;
            return newState;    // just updating the stroke of the tool in state
        }
        case TOOLBOX_ACTIONS.CHANGE_SIZE:{
            const {tool,size} = action.payload;
            const newState = {...state};
            newState[tool].size=size;
            return newState;    // just updating the stroke of the tool in state
        }
        default :{
            return state;
        }
    }
}

const initialToolboxState = {
    [TOOL_ITEMS.BRUSH]:{
        stroke:COLORS.BLACK,
    },
    [TOOL_ITEMS.LINE]:{
        stroke: COLORS.BLACK,
        size:1
    },
    [TOOL_ITEMS.RECTANGLE]:{
        stroke:COLORS.BLACK,
        fill:null,
        size:1,
    },
    [TOOL_ITEMS.CIRCLE]:{
        stroke:COLORS.BLACK,
        fill:null,
        size:1,
    },
    [TOOL_ITEMS.ARROW]:{
        stroke:COLORS.BLACK,
        size:1,
    },
    [TOOL_ITEMS.TEXT]:{
        stroke:COLORS.BLACK,
        size:32,
    },
    
}


function ToolboxProvider({children}) {
    const [toolboxState,dispatchtoolboxAction]=useReducer(toolboxReducer,initialToolboxState);

    function changeStrokeHandler (tool,stroke) {
        dispatchtoolboxAction({
            type:TOOLBOX_ACTIONS.CHANGE_STROKE,
            payload:{tool, stroke}
        })
    }

    function changeFillHandler (tool,fill) {
        dispatchtoolboxAction({
            type:TOOLBOX_ACTIONS.CHANGE_FILL,
            payload:{tool, fill}
        })
    }
    function changeSizeHandler (tool,size) {
        dispatchtoolboxAction({
            type:TOOLBOX_ACTIONS.CHANGE_SIZE, //By mistakenly written "type:TOOLBOX_ACTIONS.CHANGE_FILL"
            payload:{tool, size}
        })
    }


    const toolboxValue= {
        toolboxState,
        changeStrokeHandler,
        changeFillHandler,
        changeSizeHandler,
    }
  return (
    <toolBoxContext.Provider value= {toolboxValue}>
        {children}
    </toolBoxContext.Provider>
  )
}

export default ToolboxProvider