let video;
let poseNet;
let pose;
let skeleton;
let img;
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
    // colorPickerImg = loadImage('color_picker.jpeg');
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
  // console.log(poses); 
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
    // rect(centerX, centerY, 20,20);
    // console.log(left);
    // console.log(videoBottom);
    // console.log(mouseX);
    // console.log(mouseY);
    
    // // rect(top, videoRight, 20,20);
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
    if(smoothed.x == 0 || smoothed.y == 0) {
        smoothed = newPoint;
        return smoothed;
    }

    if(confidence > .1) {
        smoothed.x += (newPoint.x - smoothed.x)/10;
        smoothed.y += (newPoint.y - smoothed.y)/10;
        console.log("no");
    } else{
        smoothed.x += (newPoint.x - smoothed.x)/30;
        smoothed.y += (newPoint.y - smoothed.y)/30;
        console.log(confidence);
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
        // j is the x-coordinate
        // for(j = 0; j < 10; j ++) {
            // j = videoRight;
            noStroke();
            // i * 10 = hue; j * 10 = alpha/opacity
            fill(i * (100/7), 100, 100, 100);
            // x, y, w, h
            rectMode(CORNER);
            // // if player is close to screen
            // // height of entire box is greater than height of canvas
            // push();
            // fill(20,100,100,20);
            // ellipse(smoothEyeR.x, smoothEyeR.y, smoothDist * 3 * 2, smoothDist * 3 * 2);
            // fill(100,50,100,50);
            // ellipse(smoothRightShoulder.x, smoothRightShoulder.y, smoothDist * 4 * 2, smoothDist * 4 * 2);
            // pop();
            // if person is close to screen
            if(7 * (smoothDist * 2) > height - 40) {
                farther.style.display = "unset";
                // push();
                // fill(20,100,50,20);
                // ellipse(smoothEyeR.x, smoothEyeR.y, smoothDist * 2 * 2, smoothDist * 2 * 2);
                // pop();
                if ((smoothEyeR.x - colorPoint.x) < smoothDist * 2 ){ //if hand is close to body
                    markerOn = false;
                } else{
                    markerOn = true;
                    rectMode(CORNER);
                //     push();
                // fill(20,100,50,20);
                //     rect(colorPoint.x, 70 + 5, (smoothDist * 2), (smoothDist * 2));
                //     rect(colorPoint.x, height-100 + 70 - 5, (smoothDist * 2), (smoothDist * 2));
                //     pop();

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
        
        // if(smoothEyeL.x == 0 || smoothEyeL.y == 0 || smoothEyeR.x == 0 || smoothEyeR.y == 0) {
        //     smoothEyeL.x = eyeL.x;
        //     smoothEyeL.y = eyeL.y;
        //     smoothEyeR.x = eyeR.x;
        //     smoothEyeR.y = eyeR.y;
        // }
        smoothEyeL = shmooth(smoothEyeL, eyeL, eyeL.confidence);
        smoothEyeR = shmooth(smoothEyeR, eyeR, eyeR.confidence);
        smoothRightShoulder = shmooth(smoothRightShoulder, shoulderR, shoulderR.confidence);
        // smoothEyeL.x += (eyeL.x-smoothEyeL.x)/10;
        // smoothEyeL.y += (eyeL.y-smoothEyeL.y)/10;
        // smoothEyeR.x += (eyeR.x-smoothEyeR.x)/10;
        // smoothEyeR.y += (eyeR.y-smoothEyeR.y)/10;

        // smoothDist += (d-smoothDist)/100;
        smoothDist = dist(smoothEyeR.x, smoothEyeR.y, smoothEyeL.x, smoothEyeL.y);
        // let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
        // if(smoothDist == 0) {
        //     smoothDist = d;
        // }
        // smoothDist += (d-smoothDist)/100;
        strokeWeight(smoothDist/5);     
        // console.log(eyeL);
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

        palette();

        push();
        // draw marker lines
        // only display if within canvas   
        for (let i = 0; i < marker.length - 1; i++) {
            let x1 = marker[i].x;
            let y1 = marker[i].y;
            let x2 = marker[i + 1].x;
            let y2 = marker[i + 1].y;
            // if(inBound(x1,y1) && inBound(x2,y2)) {
                stroke(marker[i + 1].color);
                strokeWeight(marker[i + 1].stroke);
                line(x1, y1, x2, y2);
            // }     
        }
        pop();

        // right wrist smoothing
        // if first point
        // if(inBound(wristR.x,wristR.y)){
            // if(colorPoint.x == 0 && colorPoint.y == 0) {
            //     colorPoint.x = wristR.x;
            //     colorPoint.y = wristR.y;
            // }
            colorPoint = shmooth(colorPoint, wristR, wristR.confidence);
            // colorPoint.x+=(wristR.x-colorPoint.x)/10;
            // colorPoint.y+=(wristR.y-colorPoint.y)/10;
        // }

        // get color of right wrist
        let r = canvas.getContext('2d').getImageData((width - colorPoint.x)*2, colorPoint.y*2, 1, 1).data[0];
        let g = canvas.getContext('2d').getImageData((width - colorPoint.x)*2, colorPoint.y*2, 1, 1).data[1];
        let b = canvas.getContext('2d').getImageData((width - colorPoint.x)*2, colorPoint.y*2, 1, 1).data[2];
        let a = canvas.getContext('2d').getImageData((width - colorPoint.x)*2, colorPoint.y*2, 1, 1).data[3];
        // let r = canvas.getContext('2d').getImageData(mouseX*2, mouseY*2, 1, 1).data[0];
        // let g = canvas.getContext('2d').getImageData(mouseX*2, mouseY*2, 1, 1).data[1];
        // let b = canvas.getContext('2d').getImageData(mouseX*2, mouseY*2, 1, 1).data[2];
        // let a = canvas.getContext('2d').getImageData(mouseX*2, mouseY*2, 1, 1).data[3];
        markerColor = color(r,g,b,a);
        // if(r == 0 && b == 0 && g == 0) {
        //     markerOn = false;
        // } else{
        //     markerOn = true;
        // }
        // console.log(r + g + b);
        // console.log(color(0,0,0,1).toString());
        if(!markerOn){
            console.log(markerOn);
        }


        stroke(0);
        noFill(); 
        // add wrist position to marker array
        if(markerOn) {
            if(marker.length > 1) {
                // smoothing
                let x = shmooth(marker[marker.length - 1], wristL, wristL.confidence).x;
                let y = shmooth(marker[marker.length - 1], wristL, wristL.confidence).y;
                // let x = marker[marker.length - 1].x + (wristL.x - marker[marker.length - 1].x)/10;
                // let y = marker[marker.length - 1].y + (wristL.y - marker[marker.length - 1].y)/10;
                let currMarkerPoint = new markerPoint(x,y, markerColor, smoothDist/3);
                marker.push(currMarkerPoint);
            } else{ //if first point in array
                let currMarkerPoint = new markerPoint(wristL.x,wristL.y, markerColor, smoothDist/3);  
                marker.push(currMarkerPoint);
            }
            // left hand drawer shape
            ellipse(marker[marker.length - 1].x, marker[marker.length - 1].y, smoothDist/1.5, smoothDist/1.5);     
        } 
        // rect(smoothEyeR.x - 7 * smoothDist, smoothEyeR.y, 20, 100);

        palette();

        // rect(videoBottom - 20, videoLeft - 20, 20, 20);
        // ellipse(smoothRightShoulder.x, smoothRightShoulder.y, smoothDist/2, smoothDist/2);

        // right hand color picker
        ellipse(colorPoint.x, colorPoint.y, smoothDist/1.5, smoothDist/1.5);
    }
}