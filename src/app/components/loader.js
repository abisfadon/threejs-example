import React, { Component } from 'react';

export default class Loader extends Component {
    async openScene(event, mode = 'ls') {
        event.preventDefault();

        let promise = null;

        if (mode === 'ls') {
            promise = Promise.resolve(JSON.parse(localStorage.getItem('threejs-example:history')));
        } else if (mode === 'fs') {
            const file = event.target.files[0];

            if (!file) {
                return;
            }

            promise = new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = event => resolve(JSON.parse(event.target.result));
                reader.readAsText(file);
            });
        } else {
            return;
        }

        const data = await promise;

        if (!data) {
            return;
        }

        const { editor } = this.props;

        editor.fromJSON(data);
    }

    async saveScene(event, mode = 'ls') {
        event.preventDefault();

        const { editor } = this.props;

        const data = JSON.stringify(editor);

        if (mode === 'ls') {
            localStorage.setItem('threejs-example:history', data);
        } else if (mode === 'fs') {
            const filename = `${Date.now()}-scene.json`;
            const file = new Blob([data], { type: 'application/json' });

            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(file, filename);
            } else {
                const a = document.createElement('a');
                const url = URL.createObjectURL(file);

                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();

                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        }
    }

    render() {
        return (
            <div className="loader p-2">
                <div className="btn-group mr-2">
                    <button type="button" className="btn btn-secondary" onClick={event => this.openScene(event, 'ls')}>Open</button>
                    <button
                        className="btn btn-secondary dropdown-toggle dropdown-toggle-split"
                        type="button"
                        data-toggle="dropdown"
                        data-reference="parent"
                    />
                    <div className="dropdown-menu">
                        <a className="dropdown-item" href="/" onClick={event => this.openScene(event, 'ls')}>Local storage</a>
                        <label className="dropdown-item mb-0">
                            <input type="file" className="d-none" onChange={event => this.openScene(event, 'fs')}/> File system
                        </label>
                    </div>
                </div>
                <div className="btn-group mr-2">
                    <button type="button" className="btn btn-secondary" onClick={event => this.saveScene(event, 'ls')}>Save</button>
                    <button
                        className="btn btn-secondary dropdown-toggle dropdown-toggle-split"
                        type="button"
                        data-toggle="dropdown"
                        data-reference="parent"
                    />
                    <div className="dropdown-menu">
                        <a className="dropdown-item" href="/" onClick={event => this.saveScene(event, 'ls')}>Local storage</a>
                        <a className="dropdown-item" href="/" onClick={event => this.saveScene(event, 'fs')}>File system</a>
                    </div>
                </div>
            </div>
        );
    }
}
