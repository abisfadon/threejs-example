import $ from 'jquery';
import * as THREE from 'three';
import set from 'lodash/set';

import Renderer from './renderer';
import CubeShape from './shapes/cube';
import SphereShape from './shapes/sphere';
import DodecahedronShape from './shapes/dodecahedron';

const shapes = {
    CubeShape,
    SphereShape,
    DodecahedronShape,
};

export default class Editor {
    constructor(container) {
        this.history = [];
        this.dragShape = null;
        this.dragOffset = new THREE.Vector3();
        this.shape = null;
        this.counter = 0;

        this.renderer = new Renderer();
        this.renderer.onCameraChange(() => this.handleCameraChange());
        this.renderer.onMouseDown(event => this.handleMouseDown(event));
        this.renderer.onMouseMove(event => this.handleMouseMove(event));
        this.renderer.onMouseUp(event => this.handleMouseUp(event));
        this.renderer.onContextMenu(event => this.handleContextMenu(event));

        this.emitHistoryChange = () => {};
        this.emitLabelChange = () => {};
        this.emitShapeSelected = () => {};
    }

    onHistoryChange(callback) {
        this.emitHistoryChange = () => {
            callback(this.history);
            this.emitLabelChange(this.shape);
        };
    }

    onLabelChange(callback) {
        this.emitLabelChange = callback;
    }

    onShapeSelected(callback) {
        this.emitShapeSelected = callback;
    }

    handleCameraChange() {
        this.history.forEach(shape => this.emitLabelChange(shape));
    }

    handleMouseDown(event) {
        const floorIntersect = this.renderer.checkMouseIntersection(event);

        if (!floorIntersect) {
            return;
        }

        const shapeIntersect = this.renderer.checkMouseIntersection(event, this.history
            .map(historyShape => historyShape.mesh));

        if (!shapeIntersect) {
            return;
        }

        this.dragShape = shapeIntersect.object.userData;
        this.dragOffset = floorIntersect.point.sub(this.dragShape.position);

        this.renderer.controls.enabled = false;
        this.renderer.controls.update();
    }

    handleMouseMove(event) {
        if (!this.dragShape) {
            return;
        }

        const intersect = this.renderer.checkMouseIntersection(event);

        if (!intersect) {
            return;
        }

        const collectionForCollision = this.history.filter(shape => shape !== this.dragShape);
        const shapeIntersect = this.renderer.checkMouseIntersection(event, collectionForCollision
            .map(historyShape => historyShape.mesh));

        if (shapeIntersect) {
            const firstBB = new THREE.Box3().setFromObject(intersect.object);
            const secondBB = new THREE.Box3().setFromObject(shapeIntersect.object);
            const collision = firstBB.isIntersectionBox(secondBB);

            if (collision) {
                this.dragShape.color = '#ff0000';
            }
        }

        this.dragShape.opacity = 0.25;
        this.dragShape.visible = true;
        this.dragShape.moveTo(intersect.point.clone().sub(this.dragOffset));

        this.emitLabelChange(this.dragShape);
    }

    handleMouseUp() {
        if (!this.dragShape) {
            return;
        }

        this.renderer.controls.enabled = true;
        this.renderer.controls.update();

        this.dragShape.opacity = 1;
        this.dragShape.visible = true;
        this.dragShape = null;

        this.emitHistoryChange();
    }

    handleContextMenu(event) {
        const shapeIntersect = this.renderer.checkMouseIntersection(event, this.history
            .map(historyShape => historyShape.mesh));

        if (!shapeIntersect) {
            this.emitShapeSelected(null);
            return;
        }

        const shape = shapeIntersect.object.userData;

        this.emitShapeSelected(shape);
    }

    handleDragStart(event) {
        this.renderer.controls.enabled = false;
        this.renderer.controls.update();

        const type = $(event.target).data('type');

        this.shape = this.addShape(type);
    }

    handleDragMove(event) {
        if (!this.shape) {
            return;
        }

        const intersect = this.renderer.checkMouseIntersection(event);

        if (!intersect) {
            return;
        }

        this.shape.opacity = 0.25;
        this.shape.visible = true;
        this.shape.moveTo(intersect.point);
    }

    handleDragStop() {
        this.renderer.controls.enabled = true;
        this.renderer.controls.update();

        if (!this.shape) {
            return;
        }

        this.shape.opacity = 1;
        this.shape.visible = true;

        this.history.push(this.shape);

        this.emitHistoryChange();
    }

    addShape(type) {
        if (!shapes[type]) {
            return null;
        }

        const shape = new shapes[type](type + ++this.counter, false);
        shape.addToScene(this.renderer.scene);

        return shape;
    }

    updateShape(shape, key, value) {
        set(shape, key, value);

        this.emitHistoryChange();
    }

    removeShape(shape) {
        this.history = this.history.filter(historyShape => historyShape !== shape);

        shape.removeFromScene();

        this.emitHistoryChange();
        this.emitShapeSelected(null);
    }

    computeShapePosition(shape) {
        const position = this.renderer.computeCssPosition(shape.mesh, new THREE.Vector3(0, 1, 0));

        return {
            top: position.y,
            left: position.x,
        };
    }

    fromJSON(data) {
        this.history.forEach(shape => shape.removeFromScene());
        this.history = [];

        this.counter = 0;

        data.forEach((item) => {
            const shape = new shapes[item.type](item.name, item.visible);
            shape.color = item.color;
            shape.position.fromArray(item.position);
            shape.addToScene(this.renderer.scene);

            this.history.push(shape);
        });

        this.emitHistoryChange();
    }

    toJSON() {
        return this.history;
    }

    appendTo(container) {
        this.renderer.appendTo(container);
    }
}
