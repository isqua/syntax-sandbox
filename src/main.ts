import { ensureSyntaxTree } from '@codemirror/language';
import { ChangeEvent, DiagnosisEvent, Editor, EditorEvents, Preview, getAppRoot } from './ui';

import { persons, properties } from './data';
import { AppDecorator } from './decorator';
import { getQueryFromTree, queryLanguage } from './language';
import { Model } from './model';

const PARSE_TREE_TIMEOUT_IN_MS = 500;

const appRoot = getAppRoot('#app');

const model = new Model(properties);

const language = queryLanguage(
    model,
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

editor.addEventListener(EditorEvents.diagnosis, (event) => {
    if (event instanceof DiagnosisEvent) {
        const { diagnostics } = event.detail;

        preview.showErrors(diagnostics);
    }
});

editor.focus();
