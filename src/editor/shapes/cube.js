import * as THREE from 'three';

import Shape from './shape';

export default class CubeShape extends Shape {
    constructor(name, visible = true) {
        super(name, visible);

        this.mesh.geometry = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
    }
}
