import {
    autocompletion,
    closeBrackets,
    closeBracketsKeymap,
    completionKeymap,
    startCompletion,
} from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import type { LanguageSupport } from '@codemirror/language';
import { Diagnostic, lintKeymap } from '@codemirror/lint';
import { EditorState, type EditorStateConfig, type Extension } from '@codemirror/state';
import { EditorView, keymap, placeholder, type ViewUpdate } from '@codemirror/view';

import { debounce } from '../utils';
import {
    HISTORY_GROUP_DELAY_IN_MS,
    ONCHANGE_DEBOUNCE_TIMEOUT_IN_MS,
    PLACEHOLDER_TEXT,
} from './constants';
import { ChangeEvent, DiagnosisEvent } from './events';
import { errorListener } from './extensions/errorListener';

import './editor.css';

type EditorOptions = {
    parent: HTMLElement;
    language: LanguageSupport;
}

export class Editor extends EventTarget {
    protected box: HTMLElement;
    protected state: EditorState;
    protected view: EditorView;

    constructor(options: EditorOptions) {
        super();

        this.box = this.injectElement(options.parent);

        this.state = EditorState.create(this.buildStateConfig(options));

        this.onDocChanged = debounce(this.onDocChanged, ONCHANGE_DEBOUNCE_TIMEOUT_IN_MS, this);
        this.startCompletion = debounce(this.startCompletion, ONCHANGE_DEBOUNCE_TIMEOUT_IN_MS, this);

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
        const extensions: Extension[] = [
            EditorView.lineWrapping,
            history({ newGroupDelay: HISTORY_GROUP_DELAY_IN_MS }),
            closeBrackets(),
            autocompletion(),
            keymap.of([
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...historyKeymap,
                ...completionKeymap,
                ...lintKeymap,
            ]),
            placeholder(PLACEHOLDER_TEXT),
            options.language,
            errorListener((errors, event) => this.onDiagnosticsUpdate(errors, event)),
            EditorView.updateListener.of(event => this.onViewUpdate(event)),
        ];

        return { extensions };
    }

    protected onViewUpdate(event: ViewUpdate) {
        if (event.docChanged) {
            this.onDocChanged(event);

            if (event.view.hasFocus) {
                this.startCompletion();
            }
        }
    }

    protected startCompletion() {
        window.requestIdleCallback(() => startCompletion(this.view));
    }

    protected onDocChanged(event: ViewUpdate) {
        this.dispatchEvent(new ChangeEvent(event));
    }

    protected onDiagnosticsUpdate(errors: Diagnostic[], event: ViewUpdate) {
        if (errors.length) {
            this.box.classList.add('editorWithError');
        } else {
            this.box.classList.remove('editorWithError');
        }

        this.dispatchEvent(new DiagnosisEvent(event, errors));
    }
}
