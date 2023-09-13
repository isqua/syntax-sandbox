import type { Query } from '../parser';

import styles from './preview.module.css';

export class Preview {
    private element: HTMLElement;
    private code: HTMLElement;
    private title: HTMLHeadingElement;

    constructor(parent: HTMLElement) {
        this.element = document.createElement('section');
        parent.appendChild(this.element);

        this.title = this.injectTitle();
        this.code = this.injectCode();
    }

    protected injectCode() {
        const code = document.createElement('code');
        const wrapper = document.createElement('pre');

        wrapper.classList.add(styles.code);
        wrapper.appendChild(code);
        this.element.appendChild(wrapper);

        return code;
    }

    protected injectTitle() {
        const title = document.createElement('h2');

        this.element.appendChild(title);

        return title;
    }

    protected isQueryEmpty(query: Query | null) {
        return query === null || Object.keys(query).length === 0;
    }

    protected setEmptyState() {
        this.element.classList.remove(styles.full);
        this.title.innerText = 'The query is empty';
        this.code.innerText = '';
    }

    protected setText(text: string) {
        this.title.innerText = 'Parsed query';
        this.code.innerText = text;
        this.element.classList.add(styles.full);
    }

    update(query: Query | null) {
        if (this.isQueryEmpty(query)) {
            this.setEmptyState();
            return;
        }

        try {
            const text = JSON.stringify(query, null, 2);
            this.setText(text);
        } catch (e) {
            return;
        }
    }
}
