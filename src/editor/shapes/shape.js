import * as THREE from 'three';

export default class Shape {
    constructor(name, visible = true) {
        this.mesh = new THREE.Mesh();
        this.mesh.name = name;
        this.mesh.material = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
        });
        this.mesh.userData = this;

        this.visible = visible;
    }

    get id() {
        return this.mesh.uuid;
    }

    get name() {
        return this.mesh.name;
    }

    set name(value) {
        this.mesh.name = value;
    }

    get position() {
        return this.mesh.position;
    }

    set position(value) {
        this.mesh.position.copy(value);
    }

    get color() {
        return `#${this.mesh.material.color.getHexString()}`;
    }

    set color(value) {
        this.mesh.material.color.set(value);
    }

    get opacity() {
        return this.mesh.material.opacity;
    }

    set opacity(value) {
        this.mesh.material.transparent = value !== 1;
        this.mesh.material.opacity = value;
    }

    get visible() {
        return this.mesh.visible;
    }

    set visible(value) {
        this.mesh.visible = value;
    }

    moveTo(position) {
        this.mesh.position.copy(position);
    }

    addToScene(scene) {
        scene.add(this.mesh);
    }

    removeFromScene() {
        if (this.mesh.parent) {
            this.mesh.parent.remove(this.mesh);
        }
    }

    toJSON() {
        return {
            type: this.constructor.name,
            name: this.name,
            position: this.position.toArray(),
            color: this.color,
            visible: this.visible,
        };
    }
}
