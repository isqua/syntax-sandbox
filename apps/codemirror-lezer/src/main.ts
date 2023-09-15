import { properties } from './config';
import { ChangeEvent, Editor, EditorEvents } from './editor';
import { queryLanguage } from './language';
import { getQueryFromTree } from './parser';
import { Preview } from './preview';

import './style.css';

const appRoot = document.querySelector<HTMLDivElement>('#app')!;

const language = queryLanguage(properties);

const editor = new Editor({
    parent: appRoot,
    language,
    toQuery: getQueryFromTree,
});

const preview = new Preview(appRoot);

editor.addEventListener(EditorEvents.change, (event) => {
    if (event instanceof ChangeEvent) {
        preview.update(event.detail.query);
    }
});

editor.focus();
