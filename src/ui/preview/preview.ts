import type { Diagnostic } from '@codemirror/lint';

type Query = Record<string, unknown>;

import styles from './preview.module.css';

export class Preview {
    private alert: HTMLElement;
    private element: HTMLElement;
    private code: HTMLElement;
    private title: HTMLHeadingElement;

    constructor(parent: HTMLElement) {
        this.element = document.createElement('section');
        parent.appendChild(this.element);

        this.title = this.injectTitle();
        this.alert = this.injectAlert();
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

    protected injectAlert() {
        const alert = document.createElement('ul');

        alert.classList.add(styles.alert);
        this.element.appendChild(alert);

        return alert;
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

    protected clearErrors() {
        this.alert.innerHTML = '';
    }

    protected appendErrorMessage(message: string) {
        const item = document.createElement('li');

        item.innerText = message + '.';
        item.classList.add(styles.message);
        this.alert.appendChild(item);
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

    showErrors(errors: Diagnostic[]) {
        this.clearErrors();

        errors.forEach((error) => {
            this.appendErrorMessage(error.message);
        });
    }
}
