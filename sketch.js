let video;
let poseNet;
let pose;
let skeleton;
let img
var w = window.innerWidth;
var h = window.innerHeight;  
var on = false;
centerX = 640/2;
centerY = 480/2; 

function setup() {
  
//   img = loadImage('catnose.png');
    cvn = createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
    frameRate(15);
}



function gotPoses(poses) {
//   console.log(poses); 
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function turnOn(){
    if (on) {
        textSize(32);
        loop();
        image(video,0,0);
        if (pose) {
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
            
            let d=dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
            
            fill(255,0,0);
                    
            
            // Display Pose Points
            for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            fill(255,255,255);
            ellipse(x,y,10,10);
            }
            
            // Display Skeleton
            for (let i = 0; i < skeleton.length; i++) {
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            strokeWeight(2);
            stroke(255);
            line(a.position.x, a.position.y,b.position.x,b.position.y);      
            }
        }
        // on = false;
    } else{
        fill(50);
        noLoop();
        // on = true;
    }
}

function mouseClicked(){
    turnOn();
    if(on) {
        on = false;
    } else{
        on = true;
    }
    console.log(on);
}

function draw() {
    // scale(.5,.5);  
    mouseClicked();

    // if (mouseClicked()) {
    //     textSize(32);
    //     // if(on){
    //         loop();
    //         image(video,0,0);
    //         if (pose) {
    //             let eyeR=pose.rightEye;
    //             let eyeL=pose.leftEye;
    //             let earR=pose.rightEar;
    //             let earL=pose.leftEar;
    //             let nose=pose.nose;
    //             let shoulderR=pose.rightShoulder;
    //             let shoulderL=pose.leftShoulder;
    //             let elbowR=pose.rightElbow;
    //             let elbowL=pose.leftElbow;
    //             let wristR=pose.rightWrist;
    //             let wristL=pose.leftWrist;
    //             let hipR=pose.rightHip;
    //             let hipL=pose.leftHip;
    //             let kneeR=pose.rightKnee;
    //             let kneeL=pose.leftKnee;
    //             let ankleR=pose.rightAnkle;
    //             let ankleL=pose.leftAnkle;
                
    //             let d=dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
                
    //             fill(255,0,0);
                        
                
    //             // Display Pose Points
    //             for (let i = 0; i < pose.keypoints.length; i++) {
    //             let x = pose.keypoints[i].position.x;
    //             let y = pose.keypoints[i].position.y;
    //             fill(255,255,255);
    //             ellipse(x,y,10,10);
    //             }
                
    //             // Display Skeleton
    //             for (let i = 0; i < skeleton.length; i++) {
    //             let a = skeleton[i][0];
    //             let b = skeleton[i][1];
    //             strokeWeight(2);
    //             stroke(255);
    //             line(a.position.x, a.position.y,b.position.x,b.position.y);      
    //             }
    //         }
    //         on = false;
    //     // } else{
            
    //     // }
    // } else{
    //     fill(50);
    
    //         text("off", 0, 0);
    //         noLoop();
    //         on = true;
    // }
    
    // If the mouse is not pressed, draw the image as normal
        // Scale -1, 1 means reverse the x axis, keep y the same.
    // scale(-1, 1);
    // fill(50);
    
    // // Because the x-axis is reversed, we need to draw at different x position.
    // rect(-centerX, centerY, -20, 60);
}
  
// function mouseReleased() {
// }