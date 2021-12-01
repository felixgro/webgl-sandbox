import{g as P}from"./index.9dfc6b81.js";import{i as l,l as T,p as L,r as m,m as _}from"./mat4.5774bfd4.js";var h="precision mediump float;attribute vec3 vertPosition;attribute vec3 vertColor;varying vec3 fragColor;uniform mat4 mWorld;uniform mat4 mView;uniform mat4 mProj;void main(){fragColor=vertColor;gl_Position=mProj*mView*mWorld*vec4(vertPosition,1.0);}",R="precision mediump float;varying vec3 fragColor;void main(){gl_FragColor=vec4(fragColor,1.0);}";const r=P();r.viewport(0,0,r.canvas.width,r.canvas.height);r.enable(r.DEPTH_TEST);r.enable(r.CULL_FACE);r.frontFace(r.CCW);r.cullFace(r.BACK);const t=r.createShader(r.VERTEX_SHADER),a=r.createShader(r.FRAGMENT_SHADER);r.shaderSource(t,h);r.shaderSource(a,R);r.compileShader(t);r.compileShader(a);if(!r.getShaderParameter(t,r.COMPILE_STATUS)){const i=r.getShaderInfoLog(t);console.warn("Vertex shader compilation failed:",i)}if(!r.getShaderParameter(a,r.COMPILE_STATUS)){const i=r.getShaderInfoLog(a);console.warn("Fragment shader compilation failed:",i)}const e=r.createProgram();r.attachShader(e,t);r.attachShader(e,a);r.linkProgram(e);r.getProgramParameter(e,r.LINK_STATUS)||console.warn("Program linking failed:",r.getProgramInfoLog(e));r.validateProgram(e);r.getProgramParameter(e,r.VALIDATE_STATUS)||console.warn("Program validation failed:",r.getProgramInfoLog(e));var b=[-1,1,-1,.5,.5,.5,-1,1,1,.5,.5,.5,1,1,1,.5,.5,.5,1,1,-1,.5,.5,.5,-1,1,1,.75,.25,.5,-1,-1,1,.75,.25,.5,-1,-1,-1,.75,.25,.5,-1,1,-1,.75,.25,.5,1,1,1,.25,.25,.75,1,-1,1,.25,.25,.75,1,-1,-1,.25,.25,.75,1,1,-1,.25,.25,.75,1,1,1,1,0,.15,1,-1,1,1,0,.15,-1,-1,1,1,0,.15,-1,1,1,1,0,.15,1,1,-1,0,1,.15,1,-1,-1,0,1,.15,-1,-1,-1,0,1,.15,-1,1,-1,0,1,.15,-1,-1,-1,.5,.5,1,-1,-1,1,.5,.5,1,1,-1,1,.5,.5,1,1,-1,-1,.5,.5,1],f=[0,1,2,0,2,3,5,4,6,6,4,7,8,9,10,8,10,11,13,12,14,15,14,12,16,17,18,16,18,19,21,20,22,22,20,23];const u=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,u);r.bufferData(r.ARRAY_BUFFER,new Float32Array(b),r.STATIC_DRAW);const x=r.createBuffer();r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,x);r.bufferData(r.ELEMENT_ARRAY_BUFFER,new Uint16Array(f),r.STATIC_DRAW);const s=r.getAttribLocation(e,"vertPosition"),g=r.getAttribLocation(e,"vertColor");r.vertexAttribPointer(s,3,r.FLOAT,!1,6*Float32Array.BYTES_PER_ELEMENT,0);r.vertexAttribPointer(g,3,r.FLOAT,!1,6*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);r.enableVertexAttribArray(s);r.enableVertexAttribArray(g);r.useProgram(e);const A=r.getUniformLocation(e,"mWorld"),w=r.getUniformLocation(e,"mView"),C=r.getUniformLocation(e,"mProj"),o=new Float32Array(16),d=new Float32Array(16),E=new Float32Array(16);l(o);T(d,[0,0,-8],[0,0,0],[0,1,0]);L(E,45*Math.PI/180,r.canvas.clientWidth/r.canvas.clientHeight,.1,1e3);r.uniformMatrix4fv(A,!1,o);r.uniformMatrix4fv(w,!1,d);r.uniformMatrix4fv(C,!1,E);const v=new Float32Array(16),S=new Float32Array(16);let n=0;const c=new Float32Array(16);l(c);const F=()=>{n=performance.now()/1e3/6*2*Math.PI,m(S,c,n,[0,1,0]),m(v,c,n/4,[1,0,0]),_(o,S,v),r.uniformMatrix4fv(A,!1,o),r.clearColor(1,1,1,1),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),r.drawElements(r.TRIANGLES,f.length,r.UNSIGNED_SHORT,0),requestAnimationFrame(F)};requestAnimationFrame(F);