import { getContext } from '../utils';
import VertexShader from './shaders/vertex.glsl';
import FragmentShader from './shaders/fragment.glsl';
import { mat4 } from 'gl-matrix';

const gl = getContext();

// set viewport to fit canvas size
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// enable depth test for hidden surface removal
// calculates still hidden surfaces!
gl.enable(gl.DEPTH_TEST);
// this prevents drawing of hidden surfaces:
gl.enable(gl.CULL_FACE);
gl.frontFace(gl.CCW);
gl.cullFace(gl.BACK);

// create shaders
const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;

// set shader source for compilation
gl.shaderSource(vertexShader, VertexShader);
gl.shaderSource(fragmentShader, FragmentShader);

// compile glsl shader
gl.compileShader(vertexShader);
gl.compileShader(fragmentShader);

// check for compilation errors
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(vertexShader);
    console.warn('Vertex shader compilation failed:', log);
}
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(fragmentShader);
    console.warn('Fragment shader compilation failed:', log);
}

// bundle shaders into a program
const program = gl.createProgram()!;
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

// link program to scene
gl.linkProgram(program);

// check for linking errors
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('Program linking failed:', gl.getProgramInfoLog(program));
}

// validate program
gl.validateProgram(program);
if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.warn('Program validation failed:', gl.getProgramInfoLog(program));
}

// create triangle vertices
var boxVertices = [ // X, Y, Z           R, G, B
    // Top
    -1.0, 1.0, -1.0, 0.5, 0.5, 0.5,
    -1.0, 1.0, 1.0, 0.5, 0.5, 0.5,
    1.0, 1.0, 1.0, 0.5, 0.5, 0.5,
    1.0, 1.0, -1.0, 0.5, 0.5, 0.5,

    // Left
    -1.0, 1.0, 1.0, 0.75, 0.25, 0.5,
    -1.0, -1.0, 1.0, 0.75, 0.25, 0.5,
    -1.0, -1.0, -1.0, 0.75, 0.25, 0.5,
    -1.0, 1.0, -1.0, 0.75, 0.25, 0.5,

    // Right
    1.0, 1.0, 1.0, 0.25, 0.25, 0.75,
    1.0, -1.0, 1.0, 0.25, 0.25, 0.75,
    1.0, -1.0, -1.0, 0.25, 0.25, 0.75,
    1.0, 1.0, -1.0, 0.25, 0.25, 0.75,

    // Front
    1.0, 1.0, 1.0, 1.0, 0.0, 0.15,
    1.0, -1.0, 1.0, 1.0, 0.0, 0.15,
    -1.0, -1.0, 1.0, 1.0, 0.0, 0.15,
    -1.0, 1.0, 1.0, 1.0, 0.0, 0.15,

    // Back
    1.0, 1.0, -1.0, 0.0, 1.0, 0.15,
    1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
    -1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
    -1.0, 1.0, -1.0, 0.0, 1.0, 0.15,

    // Bottom
    -1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
    -1.0, -1.0, 1.0, 0.5, 0.5, 1.0,
    1.0, -1.0, 1.0, 0.5, 0.5, 1.0,
    1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
];

var boxIndices = [
    // Top
    0, 1, 2,
    0, 2, 3,

    // Left
    5, 4, 6,
    6, 4, 7,

    // Right
    8, 9, 10,
    8, 10, 11,

    // Front
    13, 12, 14,
    15, 14, 12,

    // Back
    16, 17, 18,
    16, 18, 19,

    // Bottom
    21, 20, 22,
    22, 20, 23
];


// create buffer for passing data to the vertex shader
const boxVertexBufferObject = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

const boxIndexBufferObject = gl.createBuffer()!;
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

// get attribute location in vertex shader as number
const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

gl.vertexAttribPointer(
    positionAttribLocation, // attribute location
    3, // number of elements per attribute
    gl.FLOAT, // type of elements
    false,
    6 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
    0 // offset from the beginning of a single vertex to this attribute
);

gl.vertexAttribPointer(
    colorAttribLocation,
    3,
    gl.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT
);

gl.enableVertexAttribArray(positionAttribLocation);
gl.enableVertexAttribArray(colorAttribLocation);

// tell which program to use before getting uniform locations
gl.useProgram(program);

// set uniform, view and projection matrix
const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

// create matrices
const worldMatrix = new Float32Array(16);
const viewMatrix = new Float32Array(16);
const projMatrix = new Float32Array(16);

// set identity matrix
mat4.identity(worldMatrix);
mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
mat4.perspective(projMatrix, 45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 1000);

gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);
gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

const xRotationMatrix = new Float32Array(16);
const yRotationMatrix = new Float32Array(16);

// use last created buffer for drawing
let angle = 0;
const identityMatrix = new Float32Array(16);
mat4.identity(identityMatrix);

const render = () => {
    angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
    mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
    mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
    gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);

    // clear & draw fresh frame
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
