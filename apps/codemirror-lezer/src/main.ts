import { Editor } from './editor';

import './style.css';

const appRoot = document.querySelector<HTMLDivElement>('#app')!;
const editor = new Editor(appRoot);

editor.focus();
