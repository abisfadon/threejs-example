import React, { Component } from 'react';
import ShapeEdit from './shape-edit';

export default class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [],
        };
    }

    componentWillMount() {
        const { editor } = this.props;

        editor.onHistoryChange((history) => {
            this.setState({
                history,
            });
        });
    }

    render() {
        const { editor } = this.props;
        const { history } = this.state;

        return (
            <div className="history p-2">
                {history.map((shape, i) => (
                    <div key={shape.id}>
                        <ShapeEdit editor={editor} shape={shape}/>
                        {i !== history.length - 1 && <hr className="my-2"/>}
                    </div>
                ))}
            </div>
        );
    }
}
