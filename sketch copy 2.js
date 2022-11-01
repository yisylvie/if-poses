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
let prevMarkerOn = false;
let markerOn = false;
let farther = document.getElementById("farther");
function markerPoint(x, y, color, stroke) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.stroke = stroke;
}
let colorPoint = new markerPoint(0,0);
let smoothEyeR = new markerPoint(0,0);
let smoothEyeL = new markerPoint(0,0);
let smoothRightShoulder = new markerPoint(0,0);

document.getElementById("img");
function setup() {
    colorPickerImg = loadImage('location pin.svg');
    frameRate(30);
    createCanvas(windowWidth, windowHeight);
    background(0);
    canvas = document.getElementById("defaultCanvas0");
    canvas.willReadFrequently = true;
    video = createCapture(VIDEO);
    video.hide();
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
function shmooth(smoothed, newPoint, confidence){
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
            if ((smoothEyeR.x - colorPoint.x) < smoothDist * 2 ){ //if hand is close to body
                markerOn = false;
            } else{
                markerOn = true;
                rectMode(CORNER);
                rect(colorPoint.x - ((height-100)/7)/2, i * ((height-100)/7) + 70, ((height-100)/7), ((height-100)/7));
                // if not over a color
                if(colorPoint.y <= 70 + 5 || colorPoint.y > height-100 + 70 - 5) {
                    markerOn = false;
                }
            }
        } else {
            farther.style.display = "none";
            // distance between hand and shoulder and distance from y coordinate of right eye
            if (dist(smoothRightShoulder.x, smoothRightShoulder.y, colorPoint.x, colorPoint.y) < smoothDist * 3 || (smoothEyeR.x - colorPoint.x) < smoothDist * 4 ){ //if hand is close to body
                rectMode(CENTER);
                markerOn = false;
            } else{ //if player is positioned well
                rectMode(CENTER);
                markerOn = true;
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
    imageMode(CENTER);
    rectMode(CENTER);
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

        smoothEyeL = shmooth(smoothEyeL, eyeL, eyeL.confidence);
        smoothEyeR = shmooth(smoothEyeR, eyeR, eyeR.confidence);
        smoothRightShoulder = shmooth(smoothRightShoulder, shoulderR, shoulderR.confidence);
        smoothDist = dist(smoothEyeR.x, smoothEyeR.y, smoothEyeL.x, smoothEyeL.y);
        strokeWeight(smoothDist/5);     

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
        colorPoint = shmooth(colorPoint, wristR, wristR.confidence);

        // get color of right wrist
        let r = canvas.getContext('2d').getImageData((width - colorPoint.x)*2, colorPoint.y*2, 1, 1).data[0];
        let g = canvas.getContext('2d').getImageData((width - colorPoint.x)*2, colorPoint.y*2, 1, 1).data[1];
        let b = canvas.getContext('2d').getImageData((width - colorPoint.x)*2, colorPoint.y*2, 1, 1).data[2];
        let a = canvas.getContext('2d').getImageData((width - colorPoint.x)*2, colorPoint.y*2, 1, 1).data[3];
        markerColor = color(r,g,b,a);

        

        stroke(0);
        noFill(); 
        // add wrist position to marker array
        if(markerOn) {
            if(marker.length > 1) {
                // smoothing
                let x = shmooth(marker[marker.length - 1], wristL, wristL.confidence).x;
                let y = shmooth(marker[marker.length - 1], wristL, wristL.confidence).y;
                let currMarkerPoint = new markerPoint(x,y, markerColor, smoothDist/3);
                marker.push(currMarkerPoint);
            } else{ //if first point in array
                let currMarkerPoint = new markerPoint(wristL.x,wristL.y, markerColor, smoothDist/3);  
                marker.push(currMarkerPoint);
            }
            // left hand drawer shape
            ellipse(marker[marker.length - 1].x, marker[marker.length - 1].y, smoothDist/1.5, smoothDist/1.5);     
        } 

        palette();

        // create a new line if da kine stay off
        if(!prevMarkerOn && markerOn){
            // console.log(markerOn);
            marker = [];
            allMarkers.push(marker);
            console.log(allMarkers);
        }
        console.log(prevMarkerOn);

        // right hand color picker
        image(colorPickerImg, colorPoint.x, colorPoint.y, smoothDist/1.5, smoothDist/1.5);
        ellipse(colorPoint.x, colorPoint.y, smoothDist/1.5, smoothDist/1.5);
    }
}