var $ = require('jquery');
var base = require('./baseAnimation');
import { timelLineLite } from '../uploader';

export function implementAnimation(element, frameCounter, isDrag) {
    if(frameCounter == 1) {
        implementAnimationStart(element, isDrag);
    } else {
        implementAnimationEnd(element, isDrag)
    }
}

export function implementAnimationStart(element, isDrag) {
    var frame = $("#pointerEvent");
    if(isDrag) {
        base.setCurrentDragDropTimeline(element.timeLine);
    }

    var box = $(base.box);
    box.attr("id", "box" + element.timeLine);
    box.appendTo("#screenBackground");

    var positions = base.calculPositions(element);

    timelLineLite.to(frame, 0, {
        onComplete: function() { 
            positions = base.calculPositions(element);

            var box = $("#box" + element.timeLine);
            box.css("width", positions.width + "px");
            box.css("height", positions.height + "px");
            box.css("left", positions.x + "px");
            box.css("top", positions.y + "px");

            frame.css("left", positions.xMouse + "px");
            frame.css("top", positions.yMouse + "px");
        }
    });

    base.createBox(element.timeLine, positions.x,positions.y,positions.width, positions.height,0.2);
    timelLineLite.fromTo(frame, 1, {top: base.previousMousePosition.y + "px", left: base.previousMousePosition.x + "px"}, {
        opacity: 1,
        display: "flex",
        onComplete: function() { 
            if(isDrag) {
                frame.children("img").attr("src", base.pathToAssets52 + "mouse_select_left.png");
            } else {
                frame.children("img").attr("src", base.pathToAssets52 + "mouse.png");
            }
        }
    });
    base.previousMousePosition.x = positions.xMouse;
    base.previousMousePosition.y = positions.yMouse;
}

export function implementAnimationEnd(element, isDrag) {
    var frame = $("#pointerEvent");
    base.hideBox(element.timeLine ,0.2);
    if(!isDrag) {
        timelLineLite.to(frame, 1, {
            opacity: 0,
            display: "none"
        });
        base.setCurrentDragDropTimeline(null);
    }
}