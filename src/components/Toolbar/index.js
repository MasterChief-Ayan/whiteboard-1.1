import React,{useContext} from 'react'
import classes from "./index.module.css"
import {  TOOL_ITEMS } from '../../constants';


//images/icons
import { HiPaintBrush } from "react-icons/hi2";
import { LuRectangleHorizontal } from "react-icons/lu";
import { FaSlash } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { CiText } from "react-icons/ci";
import { FaEraser } from "react-icons/fa";
import { LuUndo2 } from "react-icons/lu";
import { LuRedo2 } from "react-icons/lu";
import { FaDownload } from "react-icons/fa6";
import boardContext from '../../store/board-context';


function Toolbar() {
    const {activeToolItem,changeToolHandler,undo,redo,download} = useContext(boardContext);

  return (<div className={classes.navbar}>
    <div className={classes.container}>
        <div className={(activeToolItem===TOOL_ITEMS.BRUSH?classes.active:classes.toolItem )} onClick={()=>changeToolHandler(TOOL_ITEMS.BRUSH)}><HiPaintBrush/></div>
        <div className={(activeToolItem===TOOL_ITEMS.LINE?classes.active:classes.toolItem )} onClick={()=>changeToolHandler(TOOL_ITEMS.LINE)}><FaSlash/></div>
        <div className={(activeToolItem===TOOL_ITEMS.RECTANGLE?classes.active:classes.toolItem )} onClick={()=>changeToolHandler(TOOL_ITEMS.RECTANGLE)}><LuRectangleHorizontal/></div>
        <div className={(activeToolItem===TOOL_ITEMS.CIRCLE?classes.active:classes.toolItem )} onClick={()=>changeToolHandler(TOOL_ITEMS.CIRCLE)}><FaRegCircle/></div>
        <div className={(activeToolItem===TOOL_ITEMS.ARROW?classes.active:classes.toolItem )} onClick={()=>changeToolHandler(TOOL_ITEMS.ARROW)}><FaArrowRightLong/></div>

        <div className={(activeToolItem===TOOL_ITEMS.TEXT?classes.active:classes.toolItem )} onClick={()=>changeToolHandler(TOOL_ITEMS.TEXT)}><CiText/></div>
        <div className={(activeToolItem===TOOL_ITEMS.ERASER?classes.active:classes.toolItem )} onClick={()=>changeToolHandler(TOOL_ITEMS.ERASER)}><FaEraser/></div>
        <div className={(classes.toolItem)} onClick={()=>undo()}><LuUndo2/></div>
        <div className={(classes.toolItem)} onClick={()=>redo()}><LuRedo2/></div>
        <div className={(classes.toolItem)} onClick={()=>download()}><FaDownload/></div>
    </div>

    </div>
  )
}

/**
 *  <div className={(activeToolItem==8?classes.active:classes.toolItem )} onClick={()=>setActiveTool(8)}><LuUndo2/></div>
    <div className={(activeToolItem==9?classes.active:classes.toolItem )} onClick={()=>setActiveTool(9)}><LuRedo2/></div>
    <div className={(activeToolItem==10?classes.active:classes.toolItem )} onClick={()=>setActiveTool(10)}><FaDownload/></div>
 * 
 */

export default Toolbar