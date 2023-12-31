import type { Range } from '@codemirror/state';
import type { Decoration } from '@codemirror/view';
import type { PropertyToken, ValueToken } from './tokens';

export interface IDecorator {
    decorateValue(token: ValueToken): Range<Decoration>[];
    decorateProperty(token: PropertyToken): Range<Decoration>[];
}

export class BaseDecorator implements IDecorator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    decorateValue(_: ValueToken): Range<Decoration>[] {
        return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    decorateProperty(_: PropertyToken): Range<Decoration>[] {
        return [];
    }
}
