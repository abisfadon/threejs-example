import uniqid from 'uniqid';
import React from 'react';

export default function ShapeEdit({ editor, shape }) {
    const id = uniqid();

    return (
        <div>
            <div className="row">
                <div className="col-9 pr-1">
                    <input
                        type="text"
                        className="form-control mr-1"
                        value={shape.name}
                        onChange={event => editor.updateShape(shape, 'name', event.target.value)}
                    />
                </div>
                <div className="col-3 pl-1">
                    <button
                        className="btn btn-block btn-primary"
                        type="button"
                        data-toggle="collapse"
                        data-target={`#collapse-${id}`}
                    >
                        <i className="fa fa-arrow-down"/>
                    </button>
                </div>
            </div>

            <div id={`collapse-${id}`} className="collapse mt-2">
                <div className="row">
                    <div className="col pr-1">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            value={shape.position.x}
                            onChange={event => editor.updateShape(shape, 'position.x', event.target.value)}
                        />
                    </div>
                    <div className="col px-1">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            value={shape.position.y}
                            onChange={event => editor.updateShape(shape, 'position.y', event.target.value)}
                        />
                    </div>
                    <div className="col pl-1">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            value={shape.position.z}
                            onChange={event => editor.updateShape(shape, 'position.z', event.target.value)}
                        />
                    </div>
                </div>
                <input
                    type="color"
                    className="form-control form-control-sm my-2"
                    value={shape.color}
                    onChange={event => editor.updateShape(shape, 'color', event.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={shape.visible}
                        onChange={event => editor.updateShape(shape, 'visible', event.target.checked)}
                    /> Visible
                </label>
                <button type="button" className="btn btn-danger btn-sm btn-block" onClick={() => editor.removeShape(shape)}>&times;</button>
            </div>
        </div>
    );
}
