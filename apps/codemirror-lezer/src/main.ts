import { ensureSyntaxTree } from '@codemirror/language';

import { properties } from './config';
import { ChangeEvent, Editor, EditorEvents } from './editor';
import { queryLanguage } from './language';
import { getQueryFromTree } from './parser';
import { Preview } from './preview';

import './style.css';

const PARSE_TREE_TIMEOUT_IN_MS = 500;

const appRoot = document.querySelector<HTMLDivElement>('#app')!;

const language = queryLanguage(properties);

const editor = new Editor({
    parent: appRoot,
    language,
});

const preview = new Preview(appRoot);

editor.addEventListener(EditorEvents.change, (event) => {
    if (event instanceof ChangeEvent) {
        const { text, state } = event.detail;
        const tree = ensureSyntaxTree(state, state.doc.length, PARSE_TREE_TIMEOUT_IN_MS);
        const query = tree ? getQueryFromTree(text, tree) : null;

        preview.update(query);
    }
});

editor.focus();
