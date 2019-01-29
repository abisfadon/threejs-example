import * as THREE from 'three';

import Shape from './shape';

export default class SphereShape extends Shape {
    constructor(name, visible = true) {
        super(name, visible);

        this.mesh.geometry = new THREE.SphereGeometry(0.5, 16, 16).translate(0, 0.5, 0);
    }
}
