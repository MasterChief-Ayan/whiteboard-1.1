import {  TOOL_ITEMS } from "../constants";
import rough from "roughjs/bin/rough"
import getStroke from "perfect-freehand"
import { arrowHead, isPointCloseToCircle, isPointCloseToLine } from "./MathHelper";

const gen = rough.generator();

function createElement(id,x1,y1,x2,y2,{type,stroke,fill,size}) {
  const element ={id,x1,y1,x2,y2,type,fill,stroke,size};
  // EACH element in the BOARD-PROVIDER is being saved as above format

  let options ={
    seed: id+1, // id must be +VE , avoid error in rough
    fillStyle: "solid", // OTHERS : hachure(default), solid, zigzag, cross-hatch, dots, sunburst, dashed, or zigzag-line
    
}

if (stroke) {
  options.stroke = stroke;
}
if (fill){
  options.fill = fill;
}
if (size){
  options.strokeWidth = size;
}

  switch (type){
      case TOOL_ITEMS.BRUSH:{
        // Initially when the mouse is pressed down, just single point in SVG PATH
        const brushElement={
          id,
          points:[{x:x1,y:y1}],
          path: new Path2D(getSvgPathFromStroke(getStroke([{x:x1,y:y1}]))),
          type,
          stroke,
        }
        return brushElement;
      }
      case TOOL_ITEMS.LINE:{
        element.roughEle = gen.line(x1,y1,x2,y2,options); //start_x,start_y,end_x,end_y
        return element;
      }
      case TOOL_ITEMS.RECTANGLE:{
        element.roughEle = gen.rectangle(x1,y1,x2-x1,y2-y1,options);//start_x,start_y,width,height
        return element;
      }
      case TOOL_ITEMS.CIRCLE:{
        element.roughEle = gen.ellipse((x1+x2)*0.5,(y1+y2)*0.5,x2-x1,y2-y1,options);// center_X,center_Y,width,height
        return element;
      }
      case TOOL_ITEMS.ARROW:{
        const {leftPoint,rightPoint} = arrowHead(x1,y1,x2,y2);

        element.roughEle = gen.linearPath([[x1,y1],[x2,y2],leftPoint,[x2,y2],rightPoint,[x2,y2]]); // as its like drawing a arrow with pen without lifiting the pen tip, thus start, end, left,end, right, end (i again went to end at the last just to make sure the arrow density/thickness)
        return element;
      }
      case (TOOL_ITEMS.TEXT):{
        element.text=""
        return element;
      }
      default:
        return element;
  }
}

export const isPointerNearElement = (element,clientX,clientY) => {
  // ITS A PROXIMITY FUNCTION so we must define a range for the eraser point to be removed
  //-larger eraser size, larger the proximity, latgert the range
  const {x1,y1,x2,y2,fill} = element;
  clientY-=5;// ERASER offset due to div
  switch(element.type){
    case (TOOL_ITEMS.BRUSH):{
      const canvas = document.getElementById("canvas");   
      const context = canvas.getContext("2d");      // just like we defined context using useRef tag in Board Index

      return context.isPointInPath(element.path,clientX,clientY); // incuilt function
    }
    case (TOOL_ITEMS.LINE):{
      return isPointCloseToLine(x1,y1,x2,y2,clientX,clientY);
      
    }
    case (TOOL_ITEMS.RECTANGLE):{

      //top OR right OR bottom OR left  OR INSIDE***  IMP
      // console.log(stroke,"this");
      return (isPointCloseToLine(x1,y1,x2,y1,clientX,clientY) || 
              isPointCloseToLine(x2,y1,x2,y2,clientX,clientY) || 
              isPointCloseToLine(x2,y2,x1,y2,clientX,clientY) || 
              isPointCloseToLine(x1,y2,x1,y1,clientX,clientY) ||
              (fill!==null && clientX<=Math.max(x1,x2) && clientX>=Math.min(x1,x2) && clientY<=Math.max(y1,y2) && clientY>=Math.min(y1,y2)));
    }
    case (TOOL_ITEMS.CIRCLE):{
      return isPointCloseToCircle(x1,y1,x2,y2,clientX,clientY,fill);
    }
    case (TOOL_ITEMS.ARROW):{
      const {leftPoint,rightPoint} = arrowHead(x1,y1,x2,y2);

      // main arrow line OR left arrow edge OR right arrow edge
      return (isPointCloseToLine(x1,y1,x2,y2,clientX,clientY) ||
              isPointCloseToLine(x2,y2,leftPoint[0],leftPoint[1],clientX,clientY) ||
              isPointCloseToLine(x2,y2,rightPoint[0],rightPoint[1],clientX,clientY));
    }
    case (TOOL_ITEMS.TEXT):{
      const {size,text,stroke} = element;
      const context = document.getElementById("canvas").getContext("2d");
      context.font = `${size}px Caveat`;
      context.fillStyle = stroke;
      const textWidth = context.measureText(text).width;             // to get the width  of the text input-field
      const textHeight = parseInt(size); //ParseInt-> always number  // to get the height of the text input-field
      context.restore();

      clientY+=50; // offset for the text eraser

      return (
        isPointCloseToLine(x1,y1,x1+textWidth,y1,clientX,clientY) ||
        isPointCloseToLine(x1+textWidth,y1,x1+textWidth,y1+textHeight,clientX,clientY) ||
        isPointCloseToLine(x1+textWidth,y1+textHeight,x1,y1+textHeight,clientX,clientY) ||
        isPointCloseToLine(x1,y1+textHeight,x1,y1,clientX,clientY) 
      )

    }
    default:{
      throw new Error("Kaisa type Select kar rahe ho tum?");
    }

  }


 
}

export const getSvgPathFromStroke= (stroke)=> {
  if (!stroke.length) return ''
                  // acc -> accumulator
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ['M', ...stroke[0], 'Q']
  )

  d.push('Z')
  return d.join(' ')
}

export default createElement

