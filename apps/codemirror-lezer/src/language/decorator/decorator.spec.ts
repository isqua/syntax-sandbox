import { type Range } from '@codemirror/state';
import { Decoration } from '@codemirror/view';
import { describe, expect, it } from 'vitest';

import type { PropertyToken, ValueToken } from '../../parser';
import { getEditorState } from '../../test/utils/state';
import { decorate } from './decorator';

type DecorationExpectation = {
    from: number;
    to: number;
    className: string;
}

const createEditor = (text: string) => {
    const state = getEditorState({}, text);

    const view = {
        state,
        visibleRanges: [ { from: 0, to: text.length } ],
    };

    return { state, view };
};

const assertDecorations = (actual: Range<Decoration>[], expected: DecorationExpectation[]) => {
    const decorations = actual.map((deco) => ({
        from: deco.from,
        to: deco.to,
        className: deco.value.spec.attributes.class,
    }));

    expect(decorations).toEqual(expected);
};

const testValueDecoration = (token: ValueToken) => [
    Decoration
        .mark({ attributes: { class: 'value' } })
        .range(token.node.from, token.node.to),
];

const testPropertyDecoration = (token: PropertyToken) => [
    Decoration
        .mark({ attributes: { class: 'property' } })
        .range(token.node.from, token.node.to),
];

describe('decorator', () => {
    it('should decorate properties', () => {
        const { view } = createEditor('status = open and priority = low');

        const decorations = decorate(view, {
            decorateProperty: testPropertyDecoration,
            decorateValue: () => [],
        });

        assertDecorations(decorations, [
            {
                from: 0,
                to: 6,
                className: 'property',
            },
            {
                from: 18,
                to: 26,
                className: 'property',
            },
        ]);
    });

    it('should decorate values', () => {
        const { view } = createEditor('status = open and priority = low');

        const decorations = decorate(view, {
            decorateValue: testValueDecoration,
            decorateProperty: () => [],
        });

        assertDecorations(decorations, [
            {
                from: 9,
                to: 13,
                className: 'value',
            },
            {
                from: 29,
                to: 32,
                className: 'value',
            },
        ]);
    });
});
