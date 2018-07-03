let localStream;
// start local video
function startVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function (stream) { // success
    localStream = stream;
    video.src = window.URL.createObjectURL(localStream);

    }).catch(function (error) { // error
    console.error('mediaDevice.getUserMedia() error:', error);
    return;
    });
}

const canvas = document.getElementById('canvas');

const scale = 4;
const detector = new objectdetect.detector(
    canvas.width / scale, canvas.height / scale, 
    1.1, objectdetect.frontalface
    );

const video = document.getElementById("camera");

let pre_coords = [];
let coords = [];

let det = () => {
    coords = detector.detect(video, 1);

    // console.log(coords);
    if(!pre_coords.length>0 && !coords.length>0){
        pre_coords = coords;
        return;
    }

    let c1 = (pre_coords.length==5 && typeof pre_coords[0]=='number') ? pre_coords : pre_coords[0];
    let c2 = (coords.length==5 && typeof coords[0]=='number') ? coords : coords[0];
    // console.log(coords.length);
    // let box = [];
    
    // for(let i=0; i<c2.length; i++) {
    //     box[i] = smooth(c1[i], c2[i]);
    // }

    let box = smooth(c1, c2);
    // box = c2;
    console.log(c1.length);
    console.log(c2.length);
    let p = getViewPoint(canvas, box);
    drawWindow(canvas, p);

    // console.log("true");
    pre_coords = coords;

}

setInterval(det, 10);





function smooth(old_value, new_value, alpha = 0.2) {
    return old_value * (1 - alpha) + new_value * alpha;
}

function getViewPoint(canvas, box) {
    const x = - (box[0] + box[2] / 2 - canvas.width / 2) / (canvas.width / 2);
    const y = - (box[1] + box[3] / 2 - canvas.height / 2) / (canvas.height / 2);
    return [x, y];
}

function drawWindow(window_canvas, point) {
    const ctx = window_canvas.getContext("2d");
    ctx.clearRect(0, 0, window_canvas.width, window_canvas.height);

    let x = window_canvas.width / 2;
    let y = window_canvas.height / 2;
    let w = window_canvas.width
    let h = window_canvas.height
    let color = 200;

    let num = 100;
    for (let i = 0; i < num; i++) {
        ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
        ctx.fillRect(x - w / 2, y - h / 2, w, h);

        x += point[0] * 50 * 0.9 ** i;
        y -= point[1] * 50 * 0.9 ** i;
        w *= 0.9;
        h *= 0.9;
        color *= 0.9;
    }
}