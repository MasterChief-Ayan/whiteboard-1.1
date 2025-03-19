import React,{useRef,useEffect,useContext,useLayoutEffect} from 'react' 
import "./index.module.css"
import rough from "roughjs"
import boardContext from '../../store/board-context';
import {  TOOL_ACTION_TYPES, TOOL_ITEMS } from '../../constants';
// import Toolbox from '../Toolbox';
import toolBoxContext from '../../store/toolbox-context';
import classes from "./index.module.css"

function Board() {
    const canvasRef = useRef();
    const textAreaRef = useRef();
    const {elements,boardMouseDownHandler,boardMouseMoveHandler,boardMouseUpHandler,toolActionType,activeToolItem,textAreaBlurHandler,undo,redo} = useContext(boardContext) //Keep on importing each func from context

    const {toolboxState} = useContext(toolBoxContext);

    useEffect(() => {
      const canvas = canvasRef.current;
      canvas.height = window.innerHeight; // entire vw
      canvas.width = window.innerWidth;   // entire vh
    }, []);

    useEffect(() => {

      function handleKeyDown(event) {
        if(event.ctrlKey && event.key === "z") undo();
        else if(event.ctrlKey &&  event.key ==="x") redo();
      }

      document.addEventListener("keydown",handleKeyDown);
      return () => {
        document.removeEventListener("keydown",handleKeyDown);
      }
    }, [undo,redo]);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const roughCanvas = rough.canvas(canvas); // canvas <---> getelementbyid
        // const generator = roughCanvas.generator;  // Generator -> easy draw in canvas

        elements.forEach((element) => {

          switch (element.type) {
            case TOOL_ITEMS.LINE:
            case TOOL_ITEMS.RECTANGLE:
            case TOOL_ITEMS.CIRCLE:
            case TOOL_ITEMS.ARROW:
              roughCanvas.draw(element.roughEle)  // drawing all the existing elements
              break;
            case TOOL_ITEMS.BRUSH:  
              //as each points is added, RE-RENDERING TAKES PLACE
              context.fillStyle=element.stroke;
              context.fill(element.path);
              context.restore();
              break; 
            case TOOL_ITEMS.TEXT:{
              // to insert it into the canvas
              context.textBaseline = "top";
              context.font = `${element.size}px Caveat`;
              context.fillStyle = element.stroke;
              context.fillText(element.text,element.x1,element.y1-45);// "-45" as the offSet position
              context.restore();
              break;
            }         
            default:
              throw new Error("Kaisa type Select kar rahe ho tum?");
          }
          
        })

        // WHEN ELEMENTS CHANGE, We want THE BOARD RE-RENDERS

        return () => {
          context.clearRect(0,0,canvas.width,canvas.height); // TO clr RECTANGLE(aka White Board)
        }


        // let rect1 = generator.rectangle(10, 10, 100, 100);  // (x.start,y.start,length,height)
        // let rect2 = generator.rectangle(10, 120, 100, 100, {fill: 'black',stroke:'red'});
        // roughCanvas.draw(rect1);
        // roughCanvas.draw(rect2);
/*
        By default it takes the available size in the parent Div
        const context = canvas.getContext("2d");
        context.fillStyle = "#FF0000"; // or even like "blue"
        context.fillRect(0,0,150,150);  // (x.start,y.start,length,height)
*/
        
    }, [elements]);

    useEffect(() => {
      const textarea = textAreaRef.current;
      if(toolActionType === TOOL_ACTION_TYPES.WRITING){

        //manually setting due to lag(in default behaviour)
        setTimeout(() => {
          textarea.focus()
        }, 0);
      }
    

    }, [toolActionType])
    

    function handleMouseDown (event) {
      // const clientX = event.clientX;       // X-Pos of MOUSE-CLICK
      // const clientY = event.clientY-59;    // Y-Pos of MOUSE-CLICK
      if(activeToolItem=== TOOL_ITEMS.TEXT)event.clientY-=20;          // OFF-SET Y-PIXEL due to NAVBAR at the top
      else event.clientY-=64;
      boardMouseDownHandler(event,toolboxState); 
    }

    function handleMouseMove(event){
      event.clientY-=64; // OFF-SET Y-PIXEL due to NAVBAR at the top
      boardMouseMoveHandler(event,toolboxState);   //needs the coordinates as user, is holding and moving the cursor
    }

    function handleMouseUp () {
      boardMouseUpHandler(); // No need of event as just o set the toolActionType===NONE
    }


  return (
    <div>
        {toolActionType === TOOL_ACTION_TYPES.WRITING && 
          <textarea type= "text" 
          ref={textAreaRef}  
          style = {{
            top:elements[elements.length-1].y1,
            left:elements[elements.length-1].x1,
            fontSize:`${elements[elements.length-1]?.size}px`,
            color:elements[elements.length-1]?.stroke
          }}
          className={classes.textElementBox}
          onBlur={(event) => textAreaBlurHandler(event.target.value,toolboxState)}
          />
        }
        <canvas ref={canvasRef} id ="canvas" className="canvas" onMouseDown ={handleMouseDown}
        onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}></canvas>
    </div>
  )
}

export default Board;
