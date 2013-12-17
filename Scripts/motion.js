var iVideo = {
    size: { width: 854, height: 480 },//size of the video that used for tracking keyframe data on after effects
    frameData: {
        "0": [{ "e": "testCenter", "x": 385, "y": 212 }, { "e": "testCircle", "x": 289, "y": 106 }, { "e": "testTriangle", "x": 407, "y": 135 }]
    }
};

function init() {
    //TODO check if below are supported
    //html5 video

    iVideo.video = document.querySelector(".videoSection video"),
    iVideo.interactiveContainer = document.querySelector(".interactiveContainer");
    iVideo.aspectRatio = iVideo.size.width / iVideo.size.height;
    iVideo.time = 0;
    iVideo.frame = 0;


    //TODO get each element as a var
    //TODO Hide unneccessary elements

    //make sure video covers the screen on load and on every resize action
    resize();
    window.onresize = resize;
}

function getsupportedprop(proparray) {
    //TODO cache these values
    var root = document.documentElement;

    for (var i = 0; i < proparray.length; i++) {
        if (proparray[i] in root.style) {
            return proparray[i]
        }
    }
}

function setElementPosition(positionData, widthRatio, currentElement) {
    //calculate interactive element x,y position using video width change ratio
    var frameTranslateX = positionData.x * widthRatio;
    var frameTranslateY = positionData.y * widthRatio;

    //set element position and rescale according to change ratio
    var transformResult = "translate(" + frameTranslateX + "px, " + frameTranslateY + "px) scale(" + widthRatio + ")";
    var vendorPrefix = getsupportedprop(['transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform']);

    currentElement.style[vendorPrefix] = transformResult;

    //center the element by getting half of it's calculated width height, including padding and borders
    currentElement.style.marginLeft = (currentElement.offsetWidth / -2) + "px";
    currentElement.style.marginTop = (currentElement.offsetHeight / -2) + "px";
}

function positionFrameElements(frameNumber, widthRatio) {
    var currentFrameData = iVideo.frameData[frameNumber];//current frame data

    for (var i = 0; i < currentFrameData.length; i++) {
        setElementPosition(
            currentFrameData[i],
            widthRatio,//size change ratio of video width
            document.getElementById(currentFrameData[i].e)
        );
    }
}

function resize() {
    //Below calculations sets video size for covering the entire screen
    //It uses outside(minus) margin to center the video without breaking aspect ratio
    var wWidth = window.innerWidth, wHeight = window.innerHeight, videoWidth, videoHeight;

    if (wHeight * iVideo.aspectRatio >= wWidth) {
        //set outside margin of video to width

        videoWidth = wHeight * iVideo.aspectRatio;
        videoHeight = wHeight;
        iVideo.video.style.left = ((wWidth - videoWidth) / 2) + "px";
        iVideo.video.style.top = "";
    }
    else {
        //set outside margin of video to height

        videoWidth = wWidth;
        videoHeight = wWidth / iVideo.aspectRatio;
        iVideo.video.style.left = "";
        iVideo.video.style.top = ((wHeight - videoHeight) / 2) + "px";
    }

    iVideo.video.style.width = videoWidth + "px";
    iVideo.video.style.height = videoHeight + "px";

    //copy all style on video to interactive container element
    iVideo.interactiveContainer.setAttribute("style", iVideo.video.getAttribute('style'));

    //reset position of every element that is shown while resizing
    positionFrameElements(
        iVideo.frame,
        videoWidth / iVideo.size.width
    );
}

window.onload = function () {
    init();
};