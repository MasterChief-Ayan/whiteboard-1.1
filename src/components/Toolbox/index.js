import React,{useContext} from 'react'
import classes from "./index.module.css"
import cx from "classnames"
import { COLORS, FILL_TOOL_TYPES, SIZE_TOOL_TYPES, STROKE_TOOL_TYPES, TOOL_ITEMS } from '../../constants'
import toolBoxContext from '../../store/toolbox-context'
import boardContext from '../../store/board-context'

function Toolbox() {

    const {activeToolItem} = useContext(boardContext)
    const {toolboxState,changeStrokeHandler,changeFillHandler,changeSizeHandler} = useContext(toolBoxContext)


    const strokeColor= toolboxState[activeToolItem]?.stroke; // ? -> if it does not exist depending upon the active tool
    const fillColor= toolboxState[activeToolItem]?.fill;
    const size=toolboxState[activeToolItem]?.size; 

    // COLOR PICKER : assiging to the current stroke color, thus when diff color selected, the picker color gets elected automatically

  return (
    <div className={classes.container}>
        {STROKE_TOOL_TYPES.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
            <div className={classes.toolBoxLabel}>{activeToolItem===TOOL_ITEMS.TEXT?"Text Color":"Stroke Color"}</div>
                <div className = {classes.colorsContainer}>
                    <div>
                        <input className={classes.colorPicker} type="color" value={strokeColor} onChange={(cur) => changeStrokeHandler(activeToolItem,cur.target.value)}></input>
                    </div>
                    {Object.keys(COLORS).map((idx)=> {
                        return <div key={idx} className={cx(classes.colorBox,{[classes.activeColorBox]:strokeColor===COLORS[idx]})} 
                        style={{backgroundColor:COLORS[idx]}}
                        onClick = {() => changeStrokeHandler(activeToolItem,COLORS[idx])}
                        ></div>
                    })}
                </div>
                
            
        </div>}
        {FILL_TOOL_TYPES.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
            <div className={classes.toolBoxLabel}>Fill Color</div>
                <div className = {classes.colorsContainer}>
                    {fillColor === null?
                        <div className={cx(classes.colorPicker,classes.noFillColorBox)} onClick={( )=>changeFillHandler(activeToolItem,COLORS.BLACK)}></div>
                    :
                    <div>
                        <input className={classes.colorPicker} type="color" value={fillColor} onChange={(cur) => changeFillHandler(activeToolItem,cur.target.value)}></input>
                    </div>}
                    <div className={cx(classes.colorBox,classes.noFillColorBox,{[classes.activeColorBox]:fillColor===null})} 
                    onClick = {() => changeFillHandler(activeToolItem,null)}
                    ></div>
                    {Object.keys(COLORS).map((idx)=> {
                        return <div key={idx} className={cx(classes.colorBox,{[classes.activeColorBox]:fillColor===COLORS[idx]})} 
                        style={{backgroundColor:COLORS[idx]}}
                        onClick = {() => changeFillHandler(activeToolItem,COLORS[idx])}
                        ></div>
                    })}
                </div>
            
        </div>}
        {SIZE_TOOL_TYPES.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
            <div className={classes.toolBoxLabel}>{activeToolItem===TOOL_ITEMS.TEXT?"Font Size":"Brush Size"}</div>
                <input type="range" 
                min = {activeToolItem === TOOL_ITEMS.TEXT?12:1}
                max = {activeToolItem === TOOL_ITEMS.TEXT?64:10}
                step={1} value={size} onChange={(event)=>changeSizeHandler(activeToolItem,event.target.value)}
                >
                </input>
            
        </div>}
    </div>
  )
}
    //Iterating through all the COLOR Object and printing it as an option in the toolBOX
export default Toolbox