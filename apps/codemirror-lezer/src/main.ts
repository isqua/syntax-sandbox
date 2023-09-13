import { Editor, EditorEvents, ChangeEvent } from './editor';

import './style.css';

const appRoot = document.querySelector<HTMLDivElement>('#app')!;
const editor = new Editor(appRoot);

editor.focus();

editor.addEventListener(EditorEvents.change, (event) => {
    if (event instanceof ChangeEvent && event.detail.query) {
        console.log('Query', event.detail.query);
    }
});
