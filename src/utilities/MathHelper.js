import {  ELEMENT_ERASE_THRESHOLD } from "../constants";

export const arrowHead = (x1,y1,x2,y2) => {
const theta = Math.atan2(y2-y1,x2-x1);
    const phi = (20) * (Math.PI/180);
    const len = 20;

    const alpha = (Math.PI/2)-theta-phi;
    const beta = theta-phi;

    // SEE the ARROW_DERIVATION.PNG for VARIABLE NAMING

    return {leftPoint : [x2-(len*Math.cos(beta)),y2-(len*Math.sin(beta))],
            rightPoint: [x2-(len*Math.sin(alpha)),y2-(len*Math.cos(alpha))]};
}

export const isPointCloseToLine = (x1,y1,x2,y2,clientX,clientY) => {
    const startDistance = distBtwPts(x1,y1,clientX,clientY);
    const endDistance= distBtwPts(x2,y2,clientX,clientY);
    const lineDistance = distBtwPts(x1,y1,x2,y2);

    return Math.abs(startDistance+endDistance-lineDistance)<ELEMENT_ERASE_THRESHOLD 
}

export const isPointCloseToCircle = (x1,y1,x2,y2,clientX,clientY,fill) => {
    const a = Math.abs((x2-x1)/2);
    const b = Math.abs((y2-y1)/2);
    const h=(x1+x2)/2;
    const k=(y1+y2)/2;

    const val = ((((clientX-h)*(clientX-h))/(a*a))+(((clientY-k)*(clientY-k))/(b*b))) -1;

    //THUS inside portion is also a valid color
    if(fill !== null) return (val)<0.05;  
    //FINDING THE EQN VALUE AND THEN CHECK IT WITH THRESHOLD i.e if inside or outside at some threshold
    return Math.abs(val)<0.05;  
}

function distBtwPts (x1,y1,x2,y2){
    return Math.sqrt(((x1-x2)*(x1-x2)) + ((y1-y2)*(y1-y2)));
}