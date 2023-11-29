import { Decoration } from '@codemirror/view';

import type { Person } from '../data';
import type { IDecorator, ValueToken } from '../model';

import { BaseDecorator } from '../model';
import { PersonWidget } from './Person/PersonWidget';

export class AppDecorator extends BaseDecorator implements IDecorator {
    constructor(protected persons: Person[]) {
        super();
    }

    decorateValue(token: ValueToken) {
        if (this.isUsername(token)) {
            return this.decorateUsername(token);
        }

        return [];
    }

    private isUsername(token: ValueToken) {
        return token.property === 'author' && token.value.charAt(0) === '@';
    }

    private decorateUsername(token: ValueToken) {
        const username = token.value.slice(1);
        const person = username && this.persons.find(user => user.username === username);

        if (!person) {
            return [];
        }

        const deco = Decoration.replace({
            widget: new PersonWidget(person),
            inclusive: true,
        });

        return [deco.range(token.node.from, token.node.to)];
    }
}
