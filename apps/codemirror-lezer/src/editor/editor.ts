import {
    autocompletion,
    closeBrackets,
    closeBracketsKeymap,
    completionKeymap,
    startCompletion,
} from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import {
    ensureSyntaxTree,
    type LanguageSupport,
} from '@codemirror/language';
import { EditorState, EditorStateConfig } from '@codemirror/state';
import { EditorView, ViewUpdate, keymap, placeholder } from '@codemirror/view';
import { type Tree } from '@lezer/common';
import { type Query } from '../parser';
import { debounce } from '../utils';

import {
    HISTORY_GROUP_DELAY_IN_MS,
    ONCHANGE_DEBOUNCE_TIMEOUT_IN_MS,
    PARSE_TREE_TIMEOUT_IN_MS,
    PLACEHOLDER_TEXT,
} from './constants';
import { ChangeEvent } from './events';

import './editor.css';

type QueryParser = (doc: string, editorTree?: Tree | null) => Query;

type EditorOptions = {
    parent: HTMLElement;
    language: LanguageSupport;
    toQuery: QueryParser;
}

export class Editor extends EventTarget {
    protected box: HTMLElement;
    protected state: EditorState;
    protected view: EditorView;

    constructor(options: EditorOptions) {
        super();

        this.box = this.injectElement(options.parent);

        this.state = EditorState.create(this.buildStateConfig(options));

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

    protected buildStateConfig(options: EditorOptions): EditorStateConfig {
        const onUpdate = debounce(
            (event: ViewUpdate) => this.onViewUpdate(event, options.toQuery),
            ONCHANGE_DEBOUNCE_TIMEOUT_IN_MS,
        );

        return {
            extensions: [
                EditorView.lineWrapping,
                history({ newGroupDelay: HISTORY_GROUP_DELAY_IN_MS }),
                closeBrackets(),
                autocompletion(),
                keymap.of([
                    ...closeBracketsKeymap,
                    ...defaultKeymap,
                    ...historyKeymap,
                    ...completionKeymap,
                ]),
                placeholder(PLACEHOLDER_TEXT),
                options.language,
                EditorView.updateListener.of(onUpdate),
            ],
        };
    }

    protected onViewUpdate(event: ViewUpdate, toQuery: QueryParser) {
        if (event.docChanged) {
            const tree = ensureSyntaxTree(event.state, event.state.doc.length, PARSE_TREE_TIMEOUT_IN_MS);
            const text = event.state.doc.sliceString(0);
            const query = toQuery(text, tree);

            this.dispatchEvent(new ChangeEvent(query, text));

            if (event.view.hasFocus) {
                window.requestIdleCallback(() => startCompletion(event.view));
            }
        }
    }
}
