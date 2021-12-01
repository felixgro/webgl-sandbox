import { createRouter } from './utils';

createRouter({
    '/': () => import('./triangle'),
    '/triangle': () => import('./triangle'),
    '/rotating-cube': () => import('./rotating-cube'),
    '/textures': () => import('./textures'),
});