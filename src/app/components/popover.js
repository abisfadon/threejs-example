import React, { Component } from 'react';
import ShapeEdit from './shape-edit';

export default class Popover extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shape: null,
        };
    }

    componentWillMount() {
        const { editor } = this.props;

        editor.onLabelChange(() => {
            const { shape } = this.state;

            this.setState({
                shape,
            });
        });

        editor.onShapeSelected((shape) => {
            this.setState({
                shape,
            });
        });
    }

    render() {
        const { editor } = this.props;
        const { shape } = this.state;

        if (!shape) {
            return null;
        }

        return (
            <div
                className="popover fade show bs-popover-top"
                style={{
                    position: 'absolute',
                    ...editor.computeShapePosition(shape),
                    transform: 'translate(-50%, calc(-100% - 8px))',
                }}
            >
                <div className="arrow" style={{ left: '124px' }}/>
                <h3 className="popover-header">{shape.name}</h3>
                <div className="popover-body">
                    <ShapeEdit editor={editor} shape={shape}/>
                </div>
            </div>
        );
    }
}
