import $ from 'jquery';
import React, { Component, createRef } from 'react';

import Editor from '../../editor';
import Loader from './loader';
import Sidebar from './sidebar';
import Popover from './popover';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.editor = new Editor();

        this.viewportRef = createRef();
        this.menuBtnCubeRef = createRef();
        this.menuBtnSphereRef = createRef();
        this.menuBtnDodecahedronRef = createRef();
    }

    componentDidMount() {
        this.editor.appendTo(this.viewportRef.current);

        $([
            this.menuBtnCubeRef.current,
            this.menuBtnDodecahedronRef.current,
            this.menuBtnSphereRef.current,
        ]).draggable({
            revert: true,
            revertDuration: 0,
            cursor: 'move',
            helper: false,
            cancel: false,
            start: event => this.editor.handleDragStart(event),
            drag: event => this.editor.handleDragMove(event),
            stop: event => this.editor.handleDragStop(event),
        });
    }

    render() {
        return (
            <>
                <Loader editor={this.editor}/>

                <div className="viewport" ref={this.viewportRef}/>

                <div className="menu p-2">
                    <button
                        type="button"
                        className="btn btn-light mr-2"
                        ref={this.menuBtnCubeRef}
                        data-type="CubeShape"
                    >
                        Cube
                    </button>
                    <button
                        type="button"
                        className="btn btn-light mr-2"
                        ref={this.menuBtnSphereRef}
                        data-type="SphereShape"
                    >
                        Sphere
                    </button>
                    <button
                        type="button"
                        className="btn btn-light mr-2"
                        ref={this.menuBtnDodecahedronRef}
                        data-type="DodecahedronShape"
                    >
                        Dodecahedron
                    </button>
                </div>

                <Sidebar editor={this.editor}/>

                <Popover editor={this.editor}/>
            </>
        );
    }
}
