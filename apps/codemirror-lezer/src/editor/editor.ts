import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { EditorState, EditorStateConfig } from '@codemirror/state';
import { EditorView, keymap, placeholder } from '@codemirror/view';

import { HISTORY_GROUP_DELAY_IN_MS, PLACEHOLDER_TEXT } from './constants';

import './editor.css';

export class Editor {
    protected box: HTMLElement;
    protected state: EditorState;
    protected view: EditorView;

    constructor(parent: HTMLElement) {
        this.box = this.injectElement(parent);

        this.state = EditorState.create(this.buildStateConfig());

        this.view = new EditorView({
            state: this.state,
            parent: this.box,
        });
    }

    public focus() {
        this.view.focus();
    }

    protected injectElement(parent: HTMLElement) {
        const box = document.createElement('div');

        box.classList.add('editor');
        parent.appendChild(box);

        return box;
    }

    protected buildStateConfig(): EditorStateConfig {
        return {
            extensions: [
                EditorView.lineWrapping,
                history({ newGroupDelay: HISTORY_GROUP_DELAY_IN_MS }),
                keymap.of([
                    ...defaultKeymap,
                    ...historyKeymap,
                ]),
                placeholder(PLACEHOLDER_TEXT),
            ],
        };
    }
}
