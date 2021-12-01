import { getContext } from '../utils';
import VertexShader from './shaders/vertex.glsl';
import FragmentShader from './shaders/fragment.glsl';
const gl = getContext();
// create shader program
const vertex = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertex, VertexShader);
gl.compileShader(vertex);
if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(vertex));
}
const fragment = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragment, FragmentShader);
gl.compileShader(fragment);
if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(fragment));
}
const program = gl.createProgram();
gl.attachShader(program, vertex);
gl.attachShader(program, fragment);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
}
gl.validateProgram(program);
if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
}
gl.useProgram(program);
// get uniform locations
const uniforms = {
    viewportDimensions: gl.getUniformLocation(program, 'viewportDimensions'),
    minI: gl.getUniformLocation(program, 'minI'),
    maxI: gl.getUniformLocation(program, 'maxI'),
    minR: gl.getUniformLocation(program, 'minR'),
    maxR: gl.getUniformLocation(program, 'maxR'),
};
// set CPU-side variables for shader
const vpDimensions = [gl.canvas.width, gl.canvas.height];
let minI = -2.0;
let maxI = 2.0;
let minR = -2.0;
let maxR = 2.0;
// create buffers
const vertexBuffer = gl.createBuffer();
const vertices = [
    -1.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0,
    -1.0, 1.0,
    1.0, 1.0,
    1.0, -1.0
];
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
const vPosAttrib = gl.getAttribLocation(program, 'vPos');
gl.vertexAttribPointer(vPosAttrib, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.enableVertexAttribArray(vPosAttrib);
let frameTime;
let lastFrameTime = performance.now();
let dt;
let frames = [];
let lastPrintTime = performance.now();
const loop = () => {
    // fps calculation
    frameTime = performance.now();
    dt = (frameTime - lastFrameTime);
    lastFrameTime = frameTime;
    frames.push(dt);
    if (lastPrintTime + 1000 < frameTime) {
        lastPrintTime = frameTime;
        let average = 0;
        for (let i = 0; i < frames.length; i++) {
            average += frames[i];
        }
        ;
        average /= frames.length;
        document.title = 1000 / average + ' fps';
    }
    // draw
    requestAnimationFrame(loop);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.uniform2fv(uniforms.viewportDimensions, vpDimensions);
    gl.uniform1f(uniforms.minI, minI);
    gl.uniform1f(uniforms.maxI, maxI);
    gl.uniform1f(uniforms.minR, minR);
    gl.uniform1f(uniforms.maxR, maxR);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
};
requestAnimationFrame(loop);
const onResizeWindow = () => {
    gl.canvas.width = window.innerWidth;
    gl.canvas.height = window.innerHeight;
    vpDimensions[0] = gl.canvas.width;
    vpDimensions[1] = gl.canvas.height;
    const oldRealRange = maxR - minR;
    maxR = (maxI - minI) * (gl.canvas.width / gl.canvas.height) + minR;
    const newRealRange = maxR - minR;
    minR -= (newRealRange - oldRealRange) / 2;
    maxR = (maxI - minI) * (gl.canvas.width / gl.canvas.height) + minR;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};
onResizeWindow();
const onZoom = (e) => {
    const imaginaryRange = maxI - minI;
    let newRange;
    if (e.deltaY < 0) {
        newRange = imaginaryRange * 0.95;
    }
    else {
        newRange = imaginaryRange * 1.05;
    }
    const delta = newRange - imaginaryRange;
    minI -= delta / 2;
    maxI = minI + newRange;
    onResizeWindow();
};
const onMouseMove = (e) => {
    if (e.buttons === 1) {
        const IRange = maxI - minI;
        const rRange = maxR - minR;
        const iDelta = (e.movementY / gl.canvas.height) * IRange;
        const rDelta = (e.movementX / gl.canvas.width) * rRange;
        minI += iDelta;
        maxI += iDelta;
        minR -= rDelta;
        maxR -= rDelta;
    }
};
window.addEventListener('wheel', onZoom);
window.addEventListener('resize', onResizeWindow);
window.addEventListener('mousemove', onMouseMove);
