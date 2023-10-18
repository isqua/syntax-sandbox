import { Decoration } from '@codemirror/view';

import type { Person } from '../data';
import type { ValueToken } from '../language';

import { PersonWidget } from './Person/PersonWidget';
import { BaseDecorator, Decorator } from '../language';

export class AppDecorator extends BaseDecorator implements Decorator {
    constructor(protected persons: Person[]) {
        super();
    }

    decorateValue(token: ValueToken) {
        const isUsername = token.value.charAt(0) === '@';
        const username = isUsername && token.value.slice(1);
        const person = username && this.persons.find(user => user.username === username);

        if (!person || token.property !== 'author') {
            return [];
        }

        const deco = Decoration.replace({
            widget: new PersonWidget(person),
            inclusive: true,
        });

        return [deco.range(token.node.from, token.node.to)];
    }
}
