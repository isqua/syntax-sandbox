import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { ensureSyntaxTree } from '@codemirror/language';
import { EditorState, EditorStateConfig } from '@codemirror/state';
import { EditorView, ViewUpdate, keymap, placeholder } from '@codemirror/view';
import { getQueryFromTree } from '../parser';
import { debounce } from '../utils';

import {
    HISTORY_GROUP_DELAY_IN_MS,
    ONCHANGE_DEBOUNCE_TIMEOUT_IN_MS,
    PARSE_TREE_TIMEOUT_IN_MS,
    PLACEHOLDER_TEXT,
} from './constants';
import { ChangeEvent } from './events';
import { queryLanguage } from './language';

import './editor.css';

export class Editor extends EventTarget {
    protected box: HTMLElement;
    protected state: EditorState;
    protected view: EditorView;

    constructor(parent: HTMLElement) {
        super();

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
        const onUpdate = debounce(
            (event: ViewUpdate) => this.onViewUpdate(event),
            ONCHANGE_DEBOUNCE_TIMEOUT_IN_MS,
        );

        return {
            extensions: [
                EditorView.lineWrapping,
                history({ newGroupDelay: HISTORY_GROUP_DELAY_IN_MS }),
                keymap.of([
                    ...defaultKeymap,
                    ...historyKeymap,
                ]),
                placeholder(PLACEHOLDER_TEXT),
                queryLanguage(),
                EditorView.updateListener.of(onUpdate),
            ],
        };
    }

    protected onViewUpdate(event: ViewUpdate) {
        if (event.docChanged) {
            const tree = ensureSyntaxTree(event.state, event.state.doc.length, PARSE_TREE_TIMEOUT_IN_MS);
            const text = event.state.doc.sliceString(0);
            const query = getQueryFromTree(text, tree);

            this.dispatchEvent(new ChangeEvent(query, text));
        }
    }
}
