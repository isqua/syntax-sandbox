import { WidgetType } from '@codemirror/view';
import type { Person } from '../../data';

import styles from './PersonWidget.module.css';

export class PersonWidget extends WidgetType {
    constructor(readonly person: Person) { super(); }

    eq(other: PersonWidget) {
        return other.person.username == this.person.username;
    }

    toDOM() {
        const name = document.createElement('span');
        name.innerHTML = `${this.person.name} ${this.person.surname}`;

        const avatar = new Image();
        avatar.src = `./persons/${this.person.username}.jpg`;
        avatar.classList.add(styles.avatar);

        const wrap = document.createElement('span');
        wrap.classList.add(styles.person);
        wrap.title = `@${this.person.username}, ${this.person.job}`;

        wrap.appendChild(avatar);
        wrap.appendChild(name);

        return wrap;
    }

    destroy(dom: HTMLElement): void {
        dom.parentElement?.removeChild(dom);
    }
}
