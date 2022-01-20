let video = document.getElementById("video");
let model;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let windowHeight = window.outerHeight * 0.6;
let windowWidth = window.outerWidth - 100;
// alert(windowWidth)
// alert(document.getElementsByClassName("test").offsetWidth);
// alert(window.outerWidth);

// var thresholdAngle = 130;

// var rightHandCount = 0;
// var canBeProceedForRightCount = true;
// var hasRightCountIncreasedOnce = false;

// var leftHandCount = 0;
// var canBeProceedForLeftCount = true;
// var hasLeftCountIncreasedOnce = false;

// var isGoalAchieved = false;
// var goalCount = 5;
const detectorConfig = {
  modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
};

var upValue = 150;
var downValue = 120;

let detector;

const setupCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: { width: windowWidth, height: windowHeight },
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
      // document.getElementById("goalCount").innerHTML = goalCount;
    });
};

const detectPose = async () => {
  // alert(document.getElementById("video").offsetWidth)
  const poses = await detector.estimatePoses(document.querySelector("video"));

  // const predictions = await model.estimateHands(document.querySelector("video"));
  console.log(poses);

  // temporary area
  if (poses.length) {
    let right_shoulder = poses[0].keypoints.find(
      (x) => x.name == "right_shoulder"
    );
    let right_wrist = poses[0].keypoints.find((x) => x.name == "right_wrist");

    let right_knee = poses[0].keypoints.find((x) => x.name == "right_knee");
    let right_ankle = poses[0].keypoints.find((x) => x.name == "right_ankle");

    if (right_shoulder.score > 0.5 && right_wrist.score > 0.5) {
      // var a = right_shoulder.x - right_wrist.x;
      // var b = right_shoulder.y - right_wrist.y;

      // var c = Math.sqrt(a * a + b * b);

      var c = distanceBetweenTwo(
        right_shoulder.x,
        right_wrist.x,
        right_shoulder.y,
        right_wrist.y
      );
      document.getElementById("rightShoulderCoordinaye").innerHTML = c;

      if (c > upValue) {
        document.getElementById("positionValue").innerHTML = "UP";
      } else {
        document.getElementById("positionValue").innerHTML = "DOWN";
      }
    }
  }

  //temporary area

  // if (poses.length) angleCalculation(poses[0].keypoints);
  // canvas.width = windowWidth;
  // canvas.height = windowHeight;
  ctx.drawImage(video, 0, 0, windowWidth, windowHeight);

  poses.forEach((eachPose) => {
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "blue";
    //  ctx.rect(
    //   eachPose.keypoints.topLeft[0],
    //   eachPose.keypoints.topLeft[1],
    //   eachPose.keypoints.bottomRight[0] -eachPose.keypoints.topLeft[0],
    //   eachPose.keypoints.bottomRight[1] -eachPose.keypoints.topLeft[1]

    //  )

    ctx.fillStyle = "red";
    eachPose.keypoints.forEach((key, index) => {
      ctx.fillRect(key.x, key.y, 5, 5);

      // if(index == 0){
      //   ctx.moveTo(0, 0);
      // }
      // ctx.lineTo(key.x, key.y);
    });
    // ctx.lineTo(1,5,5,100,25,20);

    ctx.stroke();
  });
};

setupCamera();
video.addEventListener("loadeddata", async () => {
  // document.getElementById("video").offsetWidth, document.getElementById("video").offsetHeight

  canvas.width = document.getElementById("video").offsetWidth;
  canvas.height = document.getElementById("video").offsetHeight;
  canvas.setAttribute("width", windowWidth);
  canvas.setAttribute("height", windowHeight);
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );

  document.getElementById("loadingText").innerHTML =
    "Please stand in camera so that it can see full body";
  setInterval(detectPose, 30);
});

function sendMessagetoFlutter(value) {
  console.log(value);
  // window.CHANNEL_NAME.postMessage('Hello from JS');
}

function distanceBetweenTwo(x2, x1, y2, y1) {
  var a = x2 - x1;
  var b = y2 - y1;

  return Math.sqrt(a * a + b * b);
}
