import { WidgetType } from '@codemirror/view';
import type { Person } from '../../data';

import styles from './PersonWidget.module.css';

export class PersonWidget extends WidgetType {
    constructor(readonly person: Person) { super(); }

    eq(other: PersonWidget) {
        return other.person.username == this.person.username;
    }

    toDOM() {
        const wrap = document.createElement('span');

        wrap.innerHTML = `${this.person.name} ${this.person.surname}`;
        wrap.classList.add(styles.person);
        wrap.title = `@${this.person.username}, ${this.person.job}`;

        return wrap;
    }

    destroy(dom: HTMLElement): void {
        dom.parentElement?.removeChild(dom);
    }
}
