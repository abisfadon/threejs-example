import * as THREE from 'three';

import Shape from './shape';

export default class DodecahedronShape extends Shape {
    constructor(name, visible = true) {
        super(name, visible);

        this.mesh.geometry = new THREE.DodecahedronGeometry(0.5, 0).translate(0, 0.5, 0);
    }
}
