export const createRouter = (routes) => {
    (routes[window.location.pathname] || routes['/']).call({});
};
export const getContext = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas)
        throw new Error('Canvas not found');
    let gl = canvas.getContext('webgl');
    if (!gl)
        gl = canvas.getContext('experimental-webgl');
    if (!gl)
        throw new Error('WebGL not supported');
    return gl;
};
