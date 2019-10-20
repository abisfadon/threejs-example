import * as THREE from 'three';

export default class Renderer {
    constructor() {
        this.init();

        this.helpers();
        this.resize();
        this.animate();
    }

    init() {
        this.renderer = new THREE.WebGLRenderer({
            alpha: false,
            antialias: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xe1e1e1);
        this.scene.name = 'Scene';

        const ambientLight = new THREE.AmbientLight(0xcccccc, 1);
        ambientLight.name = 'AmbientLight';
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight.name = 'DirectionalLight';
        directionalLight.position.set(1, 1, 1).multiplyScalar(10);
        this.scene.add(directionalLight);

        this.camera = new THREE.PerspectiveCamera(75, window.width / window.height, 1, 5000);
        this.camera.name = 'Camera';
        this.camera.position.set(5, 5, 5);
        this.scene.background = new THREE.Color(0x000000);
        this.scene.add(this.camera);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.minDistance = 1;
        this.controls.maxDistance = 25;
        this.controls.addEventListener('change', () => this.emitCameraChange && this.emitCameraChange());

        const sprite = new THREE.TextureLoader().load('/stars.png');
        const starMaterial = new THREE.PointsMaterial({
            color: 'transparent',
            size: 0.5,
            map: sprite,
        });

        const starGeo = new THREE.Geometry();
        for (let i = 0; i < 6000; i++) {
            const star = new THREE.Vector3(
                Math.random() * 600 - 300,
                Math.random() * 600 - 300,
                Math.random() * 600 - 300,
            );
            starGeo.vertices.push(star);
        }

        const stars = new THREE.Points(starGeo, starMaterial);
        this.scene.add(stars);

        this.raycaster = new THREE.Raycaster();

        this.renderer.domElement.addEventListener('mousedown', event => this.emitMouseDown && this.emitMouseDown(event), false);
        this.renderer.domElement.addEventListener('mousemove', event => this.emitMouseMove && this.emitMouseMove(event), false);
        this.renderer.domElement.addEventListener('mouseup', event => this.emitMouseUp && this.emitMouseUp(event), false);
        this.renderer.domElement.addEventListener('contextmenu', (event) => {
            event.preventDefault();

            if (this.emitContextMenu) {
                this.emitContextMenu(event);
            }
        }, false);

        window.addEventListener('resize', () => this.resize(), false);
    }

    onCameraChange(callback) {
        this.emitCameraChange = callback;
    }

    onMouseDown(callback) {
        this.emitMouseDown = callback;
    }

    onMouseMove(callback) {
        this.emitMouseMove = callback;
    }

    onMouseUp(callback) {
        this.emitMouseUp = callback;
    }

    onContextMenu(callback) {
        this.emitContextMenu = callback;
    }

    helpers() {
        this.floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshBasicMaterial({ visible: false }),
        );
        this.floor.name = 'Floor';
        this.floor.rotation.x = -Math.PI / 2;
        this.scene.add(this.floor);
        //
        // this.axes = new THREE.AxesHelper(2);
        // this.axes.name = 'Axes';
        // this.scene.add(this.axes);
        //
        // this.grid = new THREE.GridHelper(10, 10, 0x0000ff, 0x808080);
        // this.grid.name = 'Grid';
        // this.grid.material.transparent = true;
        // this.grid.material.opacity = 0.25;
        // this.scene.add(this.grid);
    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    animate() {
        window.requestAnimationFrame(() => this.animate());

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.render(this.scene, this.camera);
    }

    checkMouseIntersection(event, objects) {
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
        );

        this.raycaster.setFromCamera(mouse, this.camera);

        const intersects = objects
            ? this.raycaster.intersectObjects(objects)
            : this.raycaster.intersectObject(this.floor);

        if (!intersects.length) {
            return null;
        }

        return intersects[0];
    }

    computeCssPosition(object3d, offset = new THREE.Vector3()) {
        object3d.updateMatrixWorld();

        const worldMatrix = object3d.matrixWorld;
        const worldPosition = new THREE.Vector3().setFromMatrixPosition(worldMatrix);

        const position = worldPosition.clone().add(offset).project(this.camera);
        position.x = ((position.x / 2 + 0.5)) * this.renderer.domElement.width / this.renderer.getPixelRatio();
        position.y = (1 - (position.y / 2 + 0.5)) * this.renderer.domElement.height / this.renderer.getPixelRatio();
        return position;
    }

    appendTo(container) {
        this.container = container;
        this.container.appendChild(this.renderer.domElement);
    }
}
