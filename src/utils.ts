export const createRouter = (routes: { [key: string]: () => Promise<any> }): void => {
    (routes[window.location.pathname] || routes['/']).call({});
}

export const getContext = (): WebGLRenderingContext => {
    const canvas = document.querySelector('canvas');
    if (!canvas) throw new Error('Canvas not found');
    let gl: WebGLRenderingContext | RenderingContext | null = canvas.getContext('webgl');
    if (!gl) gl = canvas.getContext('experimental-webgl');
    if (!gl) throw new Error('WebGL not supported');
    return gl as WebGLRenderingContext;
}