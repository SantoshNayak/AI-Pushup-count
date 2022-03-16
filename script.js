let video = document.getElementById("video");
let model;
// let canvas = document.getElementById("canvas");
// let ctx = canvas.getContext("2d");
let windowHeight = window.outerHeight * 0.4;
let windowWidth = window.outerWidth - 100;

var targetCount = 10;
const detectorConfig = {
  modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
};

// Hacks for Mobile Safari
video.setAttribute("playsinline", true);
video.setAttribute("controls", true);
setTimeout(() => {
  video.removeAttribute("controls");
});

var upValue = 150;
var downValue = 130;

var upAnguleValue = 170;
var downAnguleValue = 145;

var threshHoldKneeAnkleDistance = 30;
let detector;

var canCountIncrease = true;
var countValue = 0;
const setupCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: { width: windowWidth, height: windowHeight },
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
      // document.getElementById("targetCount").innerHTML = targetCount;
    });
};

const detectPose = async () => {
  // alert(document.getElementById("video").offsetWidth)
  const poses = await detector.estimatePoses(document.querySelector("video"));

  // const predictions = await model.estimateHands(document.querySelector("video"));
  // console.log(poses);

  // temporary area
  if (poses.length) {
    let right_shoulder = poses[0].keypoints.find(
      (x) => x.name == "right_shoulder"
    );
    let right_wrist = poses[0].keypoints.find((x) => x.name == "right_wrist");

    let right_knee = poses[0].keypoints.find((x) => x.name == "right_knee");
    let right_ankle = poses[0].keypoints.find((x) => x.name == "right_ankle");
    let right_elbow = poses[0].keypoints.find((x) => x.name == "right_elbow");

    if (
      right_shoulder.score > 0.5 &&
      right_wrist.score > 0.5 &&
      right_knee.score > 0.5 &&
      right_ankle.score > 0.5 &&
      right_elbow.score > 0.5
    ) {
      angleBetweenTwo(right_wrist, right_elbow, right_shoulder);
      // var rightShoulderAndWristDistance = distanceBetweenTwo(
      //   right_shoulder.x,
      //   right_wrist.x,
      //   right_shoulder.y,
      //   right_wrist.y
      // );

      // var rightKneeAndAnkleDistance = distanceBetweenTwo(
      //   right_knee.x,
      //   right_ankle.x,
      //   right_knee.y,
      //   right_ankle.y
      // );

      // if (
      //   rightShoulderAndWristDistance > upValue &&
      //   rightKneeAndAnkleDistance < threshHoldKneeAnkleDistance
      // ) {
      //   document.getElementById("positionValue").innerHTML = "UP";
      //   canCountIncrease = true;
      // } else if (rightShoulderAndWristDistance < downValue) {
      //   document.getElementById("positionValue").innerHTML = "DOWN";

      //   if (canCountIncrease) {
      //     countValue = countValue + 1;
      //     document.getElementById("countValue").innerHTML = countValue;

      //     if (countValue >= targetCount) {
      //       //target achieved
      //       console.log(true);

      //       document.getElementById("targetAchieve").innerHTML =
      //         "🎂 Goal Achieved 🎂 ";
      //     }
      //     canCountIncrease = false;
      //   }
      // }
    }
  }
};

setupCamera();
video.addEventListener("loadeddata", async () => {
  // document.getElementById("video").offsetWidth, document.getElementById("video").offsetHeight

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.get("goal")) {
    targetCount = urlParams.get("goal");
  }
  document.getElementById("targetCount").innerHTML = targetCount;

  // console.log("queryString", targetCount);

  // canvas.width = document.getElementById("video").offsetWidth;
  // canvas.height = document.getElementById("video").offsetHeight;
  // canvas.setAttribute("width", windowWidth);
  // canvas.setAttribute("height", windowHeight);

  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );

  document.getElementById("loadingText").innerHTML =
    "Please stand in front of camera";

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

function angleBetweenTwo(wrist, elbow, shoulder) {
  var radian =
    Math.atan2(wrist.y - elbow.y, wrist.x - elbow.x) -
    Math.atan2(shoulder.y - elbow.y, shoulder.x - elbow.x);
  var pi = Math.PI;
  let angle = radian * (180 / pi);
  document.getElementById("angle").innerHTML = angle;

  // more than 180
  // less than 120

  if (angle < downAnguleValue && canCountIncrease && handWasStraightOnce) {
    countValue = countValue + 1;
    document.getElementById("countValue").innerHTML = countValue;
    canCountIncrease = false
  }

  if(angle > upAnguleValue){
    handWasStraightOnce =true
    canCountIncrease =true
  }
}
var handWasStraightOnce = false