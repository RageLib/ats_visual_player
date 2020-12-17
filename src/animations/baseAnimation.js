var $ = require('jquery');
import { timelLineLite } from '../uploader';
import {TweenLite, Power0} from "gsap";

export var pathToAssets32 = "./assets/icons/32/";
export var pathToAssets52 = "./assets/icons/52/";
export var box = '<div class="box"><span id="left-side"></span><span id="top-side"></span><span id="right-side"></span><span id="bottom-side"></span></div>';
export var clickEffectElement = '<div class="circle"><div class="inner"></div></div>';
export var frameBackground = '<div class="popupFrame"><img class="imgFrame" /></div>';
export var frameTitle = '<h3 class="popupTitle"></h3>';
export var frameContent = '<div class="popupContent"></div>';
export var mousePointer = "<div id='pointerEvent' class='pointerAction'><img class='animationImg' src='"+pathToAssets52+"mouse.png' /></div>";
export var keyboardPointer = "<div class='pointerAction keyboardImg'></div>"; //<img class='animationImg' src='"+pathToAssets32+"keyboard.png' />
export var textInputAnimationFrame = "<div class='textInputAnimation'></div>";
export var arrowUp = "<div class='pointerAction'><img class='animationImg' src='"+pathToAssets52+"up.png' /></div>";
export var arrowDown = pathToAssets52+"down.png";
export var defaultDelay = 4;
export var currentDragDropTimeline = null;

export function setCurrentDragDropTimeline(val) {
    currentDragDropTimeline = val;
}

export var previousMousePosition = {x: 0, y: 0};
export var borderSize = 3;

export function format(fmt, withSpan, ...args) {
    if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
        throw new Error('invalid format string.');
    }
    return fmt.replace(/((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g, (m, str, index) => {
        if (str) {
            return str.replace(/(?:{{)|(?:}})/g, m => m[0]);
        } else {
            if (index >= args.length) {
                throw new Error('argument index is out of range in format');
            }
            if(withSpan) {
                return "<span class='animationVariable'>" + args[index] + "</span>";
            }
            return args[index];
        }
    });
}

export function plurialManagement(str, isSingular) {
    return str.replace("(s)", isSingular ? "": "s");
}

export function calculPositions(element) {
    var ratio       = $("#screenBackground").height() / element.channelBound.height;
    if(ratio > 1) {
        ratio = $("#screenBackground").width() / element.channelBound.width;
    }

    var boundWidth = 1;
    var boundHeight = 1;
    var boundX = 1;
    var boundY = 1;
    var vposValue = 0;
    var hposValue = 0;

    if(element.element) {
        boundWidth = element.element.bound.width;
        boundHeight = element.element.bound.height;
        boundX = element.element.bound.x;
        boundY = element.element.bound.y;
        vposValue = element.element.vposValue;
        hposValue = element.element.hposValue;
    }

    var ratioWidth  = boundWidth * ratio;
    var ratioHeight = boundHeight * ratio;
    var ratioX      = boundX * ratio;
    var ratioY      = boundY * ratio;

    var offsetLeft = 0;
    var offsetTop = 0;

    var channelWidth = element.channelBound.width * ratio;
    var leftBand = ($("#screenBackground").width() - channelWidth) / 2;
    offsetLeft = leftBand;
    
    var channelHeight = element.channelBound.height * ratio;
    var topBand = ($("#screenBackground").height() - channelHeight) / 2;
    offsetTop = topBand;

    var x = offsetLeft + ratioX - (ratio * 10);
    var y = offsetTop + ratioY - (ratio * 10);

    var xMouse = x + (ratioWidth / 2); //26 = half of img size
    var yMouse = y + (ratioHeight / 2);

    if(vposValue != 0) {
        switch(element.element.vpos) {
            case "top":
                yMouse = y + (vposValue * ratio);
                break;
            case "bottom":
                yMouse = y + ratioHeight - (vposValue * ratio);
                break;
        }
    }

    if(hposValue != 0) {
        switch(element.element.hpos) {
            case "left":
                xMouse = x + (hposValue * ratio);
                break;
            case "right":
                xMouse = x + ratioWidth - (hposValue * ratio);
                break;
        }
    }

    return {x: x, y:y, xMouse: xMouse, yMouse:yMouse, width: ratioWidth, height: ratioHeight};


    // var screenHeight = $("#screenBackground").height()
    // var screenWidth = $("#screenBackground").width() - 10;
    // var ratio = screenHeight / element.channelBound.height;
    // var ratioW = screenWidth / element.channelBound.width;

    // var channelWidthBound = element.channelBound.width * ratio;
    // var xBound = element.element.bound.x * ratio;
    // var widthBound = element.element.bound.width * ratio;

    // var xRelativeToCenter = (((channelWidthBound/2) - xBound) / screenWidth) * (ratioW * 100);
    
    // var yMouse = (((element.element.bound.y * ratio) + ((element.element.bound.height / 2) * ratio)) / screenHeight) * 100;
    // var xMouse = xRelativeToCenter - (((widthBound/2) / screenWidth) * 100);

    // // Mouse calculation depends of vpos and hpos 
    // if(element.element.vposValue != 0) {
    //     switch(element.element.vpos) {
    //         case "top":
    //             yMouse = ((((element.element.bound.y + element.element.vposValue) * ratio)) / screenHeight) * 100;
    //             break;
    //         case "bottom":
    //             yMouse = ((((element.element.bound.y + element.element.bound.height - element.element.vposValue) * ratio)) / screenHeight) * 100;
    //             break;
    //     }
    // }

    // if(element.element.hposValue != 0) {
    //     switch(element.element.hpos) {
    //         case "left":
    //             xMouse = xRelativeToCenter - (((element.element.hposValue * ratio) / screenWidth) * 100);
    //             break;
    //         case "right":
    //             xMouse = xRelativeToCenter - ((widthBound - (element.element.hposValue * ratio)) / screenWidth) * 100;
    //             break;
    //     }
    // }

    // var x = xRelativeToCenter;
    // var y = (((element.element.bound.y * ratio) / screenHeight) * 100);

    // var elementWidth = ((element.element.bound.width * ratio) / screenHeight) * 100;
    // var elementHeight = ((element.element.bound.height * ratio) / screenHeight) * 100;

    // x = x < 0 ? 0 : x;
    // y = y < 0 ? 0 : y;
    // xMouse = xMouse < 0 ? 0 : xMouse;
    // yMouse = yMouse < 0 ? 0 : yMouse;
}

export function createBox(id, x,y, width, height, duration) { 
    var box = $("#box" + id);
    box.css("width", width + "px");
    box.css("height", height + "px");
    box.css("left", x + "px");
    box.css("top", y + "px");
    var top = box.children("#top-side");
    var bottom = box.children("#bottom-side");
    var left = box.children("#left-side");
    var right = box.children("#right-side");

    // top
    timelLineLite.fromTo(top, duration, 
        {
            width: 0, 
            height: borderSize,
            immediateRender: false,
            autoRound: false,
            ease: Power0.easeNone,
            delay: 1
        }, 
        {
            width: '100%'
        }
    );

    // right
    timelLineLite.fromTo(right, duration, 
        {
            height: 0, 
            width: borderSize,
            immediateRender: false,
            autoRound: false,
            ease: Power0.easeNone
        }, 
        {
            height: '100%'
        }
    );

    // bottom
    timelLineLite.fromTo(bottom, duration, 
        {
            width: 0, 
            height: borderSize,
            immediateRender: false,
            autoRound: false,
            ease: Power0.easeNone
        }, 
        {
            width: '100%'
        }
    );

    // left
    timelLineLite.fromTo(left, duration, 
        {
            height: 0,
            immediateRender: false,
            width: borderSize,
            autoRound: false,
            ease: Power0.easeNone
        }, 
        {
            height: '100%'
        }
    );
};

export function hideBox(id, duration) { 
    var box = $("#box" + id);
    var top = box.children("#top-side");
    var bottom = box.children("#bottom-side");
    var left = box.children("#left-side");
    var right = box.children("#right-side");

    // left
    timelLineLite.to(left, duration, 
        {
            height: 0, 
            immediateRender: false,
            width: borderSize,
            autoRound: false,
            ease: Power0.easeNone,
            delay: 1
        }
    );

        // bottom
        timelLineLite.to(bottom, duration, 
            {
                width: 0, 
                height: borderSize,
                immediateRender: false,
                autoRound: false,
                ease: Power0.easeNone
            }
        );

        // right
        timelLineLite.to(right, duration, 
            {
                height: 0, 
                width: borderSize,
                immediateRender: false,
                autoRound: false,
                ease: Power0.easeNone
            }
        );

        // top
        timelLineLite.to(top, duration, 
            {
                width: 0, 
                height: borderSize,
                immediateRender: false,
                autoRound: false,
                ease: Power0.easeNone
            }
        );
};

export function clickAnimation(id, x,y) {
    var click = $("#click" + id);
    click.css("left", x + "px");
    click.css("top", y + "px");

    timelLineLite.fromTo(click, 0.2, 
        {
            immediateRender: false,
            autoRound: false,
            ease: Power0.easeNone,
            opacity: 0
        },
        {
            opacity: 0.8,
            width: 25,
            height: 25,
            delay : 1
        }
    );

    timelLineLite.to(click, 0.2, 
        {
            opacity: 0
        }
    );
}

export function displayPopUp(frame, title, content, delay) {
    var d = delay ? delay : defaultDelay;
    timelLineLite.fromTo(frame, 0.5, {xPercent: -200}, {
        xPercent: 0,
        opacity: 0.9,
        display: "flex",
        delay: d
    });

    timelLineLite.fromTo(content, 0.3, {xPercent: -200}, {
        xPercent: 2,
        opacity: 1,
        display: "inline-block"
    });

    timelLineLite.fromTo(title, 0.3, {xPercent: -200}, {
        xPercent: 4,
        opacity: 1,
        display: "inline-block"
    });
}

export function hidePopUp(frame, title, content, delay) {
    var d = delay ? delay : defaultDelay;
    timelLineLite.to(title, 0.2, {
        xPercent: -200,
        opacity: 0,
        display: "inline-block",
        delay: d
    });

    timelLineLite.to(content, 0.2, {
        xPercent: -200,
        opacity: 0,
        display: "inline-block"
    });

    timelLineLite.to(frame, 0.2, {
        xPercent: -200,
        opacity: 0,
        display: "flex"
    });
}