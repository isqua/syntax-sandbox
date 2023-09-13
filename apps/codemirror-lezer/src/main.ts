import { ChangeEvent, Editor, EditorEvents } from './editor';
import { Preview } from './preview';

import './style.css';

const appRoot = document.querySelector<HTMLDivElement>('#app')!;
const editor = new Editor(appRoot);
const preview = new Preview(appRoot);

editor.addEventListener(EditorEvents.change, (event) => {
    if (event instanceof ChangeEvent) {
        preview.update(event.detail.query);
    }
});

editor.focus();
