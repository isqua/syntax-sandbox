import { ensureSyntaxTree } from '@codemirror/language';
import { ChangeEvent, Editor, EditorEvents, Preview, getAppRoot } from '@syntax-sandbox/ui';

import { persons, properties } from './data';
import { AppDecorator } from './decorator';
import { getQueryFromTree, queryLanguage } from './language';

const PARSE_TREE_TIMEOUT_IN_MS = 500;

const appRoot = getAppRoot('#app');

const language = queryLanguage(
    properties,
    new AppDecorator(persons),
);

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
