import { getContext } from '../utils';
import VertexShader from './shaders/vertex.glsl';
import FragmentShader from './shaders/fragment.glsl';
const gl = getContext();
// set viewport to fit canvas size
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
// specify rgba for clearing the canvas without clearing it yet
// clear canvas using gl.DEPTH_BUFFER_BIT or gl.COLOR_BUFFER_BIT
gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
// create shaders
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
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
const program = gl.createProgram();
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
const triangleVertices = new Float32Array([
    // x, y        r, g, b
    0.0, 0.5, 1.0, 0.0, 0.0,
    0.5, -0.5, 0.0, 1.0, 0.0,
    -0.5, -0.5, 0.0, 0.0, 1.0,
]);
// create buffer for passing data to the vertex shader
const triangleVertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
// get attribute location in vertex shader as number
const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
gl.vertexAttribPointer(positionAttribLocation, // attribute location
2, // number of elements per attribute
gl.FLOAT, // type of elements
// @ts-ignore
gl.FALSE, // normalize
5 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
0 // offset from the beginning of a single vertex to this attribute
);
gl.vertexAttribPointer(colorAttribLocation, // attribute location
3, // number of elements per attribute
gl.FLOAT, // type of elements
// @ts-ignore
gl.FALSE, // normalize
5 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
2 * Float32Array.BYTES_PER_ELEMENT // offset from the beginning of a single vertex to this attribute
);
gl.enableVertexAttribArray(positionAttribLocation);
gl.enableVertexAttribArray(colorAttribLocation);
// main render loop
gl.useProgram(program);
// use last created buffer for drawing
gl.drawArrays(gl.TRIANGLES, 0, 3);
