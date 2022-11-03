let video;
let poseNet;
let pose;
let skeleton;
let img;
let allMarkers = [];
let marker = [];
let colorBox = [];
let canvas;
let centerX = 0;
let centerY = 0;
let videoWidth = 0;
let videoHeight = 0;
let markerColor = 0;
let videoTop = 0;
let videoBottom = 0;
let videoLeft = 0;
let videoRight = 0;
let smoothDist = 0;
let allMarkersLength = 0;
let prevMarkerOn = false;
let markerOn = false;
let markerForRealOn = false;
let saved = false;
let farther = document.getElementById("farther");
let saveP = document.getElementById("saveP");
let clearP = document.getElementById("clearP");

function markerPoint(x, y, color, stroke) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.stroke = stroke;
}
let leftPointer = new markerPoint(0,0);
let colorPoint = new markerPoint(0,0);
let smoothEyeR = new markerPoint(0,0);
let smoothEyeL = new markerPoint(0,0);
let firstLeftPointer = new markerPoint(0,0);
let smoothRightShoulder = new markerPoint(0,0);

document.getElementById("img");
function setup() {
    colorPickerImg = loadImage('location pin.png');
    brushImg = loadImage('brush.svg');
    pointerImg = loadImage('arrow mouse pointer.png');
    // colorPickerImg = loadImage('data:image/png;base64,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');
    // brushImg = loadImage('data:image/png;base64,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');
    // pointerImg = loadImage('data:image/png;base64,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');
    frameRate(30);
    createCanvas(windowWidth, windowHeight);
    background(0);
    canvas = document.getElementById("defaultCanvas0");
    canvas.willReadFrequently = true;
    video = createCapture(VIDEO);
    video.hide();
    imageMode(CENTER);
    rectMode(CENTER);
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
    centerX = width/2;
    centerY = height/2;
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

// check if x y coordinates are in the bounds of the page
function inBound(x, y) {
    return y <= videoBottom && y >= videoTop && x <= videoLeft && x >= videoRight;
}

function flipX(xCoordinate){
    return w - xCoordinate;
}

function flipY(yCoordinate){
    return height - yCoordinate;
}

// smooth a point
function shmooth(smoothed, newPoint){
    let confidence = newPoint.confidence;
    // if first point
    if(smoothed.x == 0 || smoothed.y == 0) {
        smoothed = newPoint;
        return smoothed;
    }

    // if higher confidence, smooth less
    if(confidence > .1) {
        smoothed.x += (newPoint.x - smoothed.x)/10;
        smoothed.y += (newPoint.y - smoothed.y)/10;
    } else{
        smoothed.x += (newPoint.x - smoothed.x)/30;
        smoothed.y += (newPoint.y - smoothed.y)/30;
    }
    return smoothed;
}

// draw color palette
function palette(){
    push();
    // create color picker box
    colorMode(HSB, 100);
    // i is the y-coordinate
    for(i = 0; i < 7; i ++) {
        noStroke();
        // i * 10 = hue; j * 10 = alpha/opacity
        fill(i * (100/7), 100, 100, 100);
        // x, y, w, h
        rectMode(CORNER);
        // // if player is too close to screen
        // // height of entire box is greater than height of canvas
        if(7 * (smoothDist * 2) > height - 100) {
            farther.style.display = "unset";
            rectMode(CORNER);
            if ((smoothEyeR.x - colorPoint.x) < smoothDist * 2 ){ //if hand is close to body
                markerOn = false;
                markerForRealOn = false;
                rect(70, i * ((height-100)/7) + 70, ((height-100)/7), ((height-100)/7));
            } else{
                markerOn = true;
                markerForRealOn = true;
                rect(colorPoint.x - ((height-100)/7)/2, i * ((height-100)/7) + 70, ((height-100)/7), ((height-100)/7));
                // if not over a color
                if(colorPoint.y <= 70 + 5 || colorPoint.y > height-100 + 70 - 5) {
                    markerOn = false;
                }
            }
        } else {
            farther.style.display = "none";
            rectMode(CENTER);
            // distance between hand and shoulder and distance from y coordinate of right eye
            if (dist(smoothRightShoulder.x, smoothRightShoulder.y, colorPoint.x, colorPoint.y) < smoothDist * 3 || (smoothEyeR.x - colorPoint.x) < smoothDist * 4 ){ //if hand is close to body
                markerOn = false;
                markerForRealOn = false;
                rect(70, smoothEyeR.y - smoothDist * 2.5 + i * (smoothDist * 2), (smoothDist * 2), (smoothDist * 2));
            } else{ //if player is positioned well
                markerOn = true;
                markerForRealOn = true;
                rect(colorPoint.x, smoothEyeR.y - smoothDist * 2.5 + i * (smoothDist * 2), (smoothDist * 2), (smoothDist * 2));
                // if not over a color
                if(colorPoint.y <= smoothEyeR.y - smoothDist * 2.5 - .5 * (smoothDist * 2) + 5 || colorPoint.y >= smoothEyeR.y - smoothDist * 2.5 + 6.5 * (smoothDist * 2) - 5) {
                    markerOn = false;
                }
            }
        } 
    }
    pop();
}

// scale the image to be the size of the canvas scaled proportionally
function scaleImg(){
    push();
    fill(255,255);
    noStroke();
    videoWidth = video.width * (height/video.height);
    videoHeight = video.height * (width/video.width);
    // if scaled image width is less than canvas width
    if(video.width * (height/video.height) < width) {
        image(video, centerX, centerY, videoWidth, height);
        rect(centerX, centerY, width, height);
        videoHeight = height;
    } else{ //if scaled image width is greater than canvas width
        image(video, centerX, centerY, width, videoHeight);
        rect(centerX, centerY, width, height);
        videoWidth = width;
    }
    pop();
    videoTop = centerY - videoHeight/2;
    videoBottom = centerY + videoHeight/2;
    videoLeft = centerX + videoWidth/2;
    videoRight = centerX - videoWidth/2;
}

// resize canvas and reset reference points when window is resized
function windowResized() {
    console.log("resized");
    resizeCanvas(windowWidth, windowHeight);
    background(0);
    centerX = width/2; 
    centerY = height/2;
    videoBottom = centerY + videoHeight/2;
    videoLeft = centerX + videoWidth/2;
    videoTop = centerY - videoHeight/2;
    videoRight = centerY - videoWidth/2;
}

function draw() {
    //move image by the width of image to the left
    translate(width,0);
    //then scale it by -1 in the x-axis
    //to flip the image
    scale(-1, 1);
    background(0);

    //draw video capture feed as image inside p5 canvas
    scaleImg();   
     
    if (pose) {
        // image(colorPickerImg, centerX,centerY);
        let eyeR=pose.rightEye;
        let eyeL=pose.leftEye;
        let earR=pose.rightEar;
        let earL=pose.leftEar;
        let nose=pose.nose;
        let shoulderR=pose.rightShoulder;
        let shoulderL=pose.leftShoulder;
        let elbowR=pose.rightElbow;
        let elbowL=pose.leftElbow;
        let wristR=pose.rightWrist;
        let wristL=pose.leftWrist;
        let hipR=pose.rightHip;
        let hipL=pose.leftHip;
        let kneeR=pose.rightKnee;
        let kneeL=pose.leftKnee;
        let ankleR=pose.rightAnkle;
        let ankleL=pose.leftAnkle;

        smoothEyeL = shmooth(smoothEyeL, eyeL);
        smoothEyeR = shmooth(smoothEyeR, eyeR);
        smoothRightShoulder = shmooth(smoothRightShoulder, shoulderR);
        smoothDist = dist(smoothEyeR.x, smoothEyeR.y, smoothEyeL.x, smoothEyeL.y);
        strokeWeight(smoothDist/15);     

        // // Display Pose Points
        // for (let i = 0; i < pose.keypoints.length; i++) {
        //     let x = pose.keypoints[i].position.x;
        //     let y = pose.keypoints[i].position.y;
        //     // only display if within canvas
        //     if(inBound(x,y)) {
        //         noFill();
        //         ellipse(x,y,smoothDist/5,smoothDist/5);   
        //     }
        // }
        
        // // Display Skeleton
        // for (let i = 0; i < skeleton.length; i++) {
        //     let a = skeleton[i][0];
        //     let b = skeleton[i][1];
        //     line(a.position.x, a.position.y,b.position.x,b.position.y);      
        // }

        prevMarkerOn = markerOn;
        palette();

        push();
        // draw marker history
        for (let j = 0; j < allMarkers.length - 1; j++) {
            for (let i = 0; i < allMarkers[j].length - 1; i++) {
                let x1 = allMarkers[j][i].x;
                let y1 = allMarkers[j][i].y;
                let x2 = allMarkers[j][i + 1].x;
                let y2 = allMarkers[j][i + 1].y;
            
                stroke(allMarkers[j][i + 1].color);
                strokeWeight(allMarkers[j][i + 1].stroke);
                line(x1, y1, x2, y2);
            }
        }
        // draw current marker
        for (let i = 0; i < marker.length - 1; i++) {
            let x1 = marker[i].x;
            let y1 = marker[i].y;
            let x2 = marker[i + 1].x;
            let y2 = marker[i + 1].y;

            stroke(marker[i + 1].color);
            strokeWeight(marker[i + 1].stroke);
            line(x1, y1, x2, y2);
        }
        pop();

        // right wrist smoothing
        colorPoint = shmooth(colorPoint, wristR);

        // left wrist pointer smoothing (for when user is not drawing)
        leftPointer = shmooth(leftPointer, wristL);

        // get color of right wrist
        context = canvas.getContext('2d', true, false, 'srgb', true);
        let r = context.getImageData((width - colorPoint.x)*2, colorPoint.y*2, 1, 1).data[0];
        let g = context.getImageData((width - colorPoint.x)*2, colorPoint.y*2, 1, 1).data[1];
        let b = context.getImageData((width - colorPoint.x)*2, colorPoint.y*2, 1, 1).data[2];
        let a = context.getImageData((width - colorPoint.x)*2, colorPoint.y*2, 1, 1).data[3];
        markerColor = color(r,g,b,a);

        stroke(0);
        noFill(); 
        // add wrist position to marker array
        if(markerOn) {
            if(marker.length > 1) {
                // smoothing
                let x = shmooth(marker[marker.length - 1], wristL).x;
                let y = shmooth(marker[marker.length - 1], wristL).y;
                let currMarkerPoint = new markerPoint(x,y, markerColor, smoothDist/3);
                marker.push(currMarkerPoint);
            } else{ //if first point in array
                let currMarkerPoint = new markerPoint(wristL.x,wristL.y, markerColor, smoothDist/3);  
                marker.push(currMarkerPoint);
            }

            allMarkersLength += 1;
            // left hand drawer shape
            image(brushImg, marker[marker.length - 1].x + (smoothDist/5) * 3, marker[marker.length - 1].y - (smoothDist/5) * 3, smoothDist, smoothDist);
            ellipse(marker[marker.length - 1].x, marker[marker.length - 1].y, smoothDist/5, smoothDist/5);     
        } else {
            // left wrist pointer
            image(pointerImg, leftPointer.x, leftPointer.y, smoothDist, smoothDist);
        }

        // create functionality for saving and clearing artwork
        if(markerForRealOn) {
            // hide save and clear options
            saveP.style.display = "none";
            clearP.style.display = "none";
        } else if(allMarkerslength > 20) {
            // show save and clear options
            saveP.style.display = "unset";
            clearP.style.display = "unset";

            // save is above hand
            saveP.style.top = firstLeftPointer.y - smoothDist * 4 + "px";
            saveP.style.right = leftPointer.x + "px";
            // clear is below hand
            clearP.style.top = firstLeftPointer.y + smoothDist * 4 + "px";
            clearP.style.right = leftPointer.x + "px";

            // if pointer is over clear, then clear screen
            if(leftPointer.y >= firstLeftPointer.y + smoothDist * 4) {
                // remove all points from marker arrays
                marker = [];
                allMarkers = [];
                allMarkersLength = 0;
                console.log("clear");
                // hide save and clear options
                saveP.style.display = "none";
                clearP.style.display = "none";
            }
            // if pointer is over save and screen has not already been cleared, save screen
            if(leftPointer.y <= firstLeftPointer.y - smoothDist * 4 && allMarkers[0].length > 20) {
                // Prevent from running more that once 
                if(!saved) {
                    console.log("save");
                    saveCanvas(canvas, 'myCanvas');
                    saved = true;
                }
            }
        }

        palette();

        // if first point in new marker push marker to all markers array
        if(!prevMarkerOn && markerOn){
            marker = [];
            allMarkers.push(marker);
        }

        // if first point when marker is off designate where save and clear should be fixed
        if(prevMarkerOn && !markerOn) {
            firstLeftPointer = new markerPoint(leftPointer.x, leftPointer.y);
            console.log(markerOn);
            saved = false;
        }

        // right hand color picker
        image(colorPickerImg, colorPoint.x, colorPoint.y - (smoothDist/5) * 3 - smoothDist/10, smoothDist, smoothDist);
        ellipse(colorPoint.x, colorPoint.y, smoothDist/5, smoothDist/5);
    }
}