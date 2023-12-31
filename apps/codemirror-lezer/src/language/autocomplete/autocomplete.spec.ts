import { CompletionContext, type CompletionResult } from '@codemirror/autocomplete';
import { describe, expect, it } from 'vitest';

import { Suggest, type PropertiesConfig } from '../../model';
import { getEditorState } from '../../test/utils/state';
import { buildCompletion } from './autocomplete';

const getCompletion = (
    properties: PropertiesConfig,
    document: string,
    position: number,
): CompletionResult | null => {
    const state = getEditorState(properties, document);
    const ctx = new CompletionContext(state, position, false);
    const suggest = new Suggest(properties);
    const autocomplete = buildCompletion(suggest);

    return autocomplete(ctx);
};

describe('autocomplete', () => {
    describe('properties', () => {
        it('should complete properties for empty document', () => {
            const document = '';
            const position = 0;
            const properties: PropertiesConfig = {
                status: { values: [] },
                priority: { values: [] },
            };

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: 'status', apply: 'status ' },
                    { label: 'priority', apply: 'priority ' }
                ],
                from: 0,
            });
        });

        it('should complete properties for document with spaces only', () => {
            const document = '  ';
            const position = 2;
            const properties: PropertiesConfig = {
                status: { values: [] },
                priority: { values: [] },
            };

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: 'status', apply: 'status ' },
                    { label: 'priority', apply: 'priority ' }
                ],
                from: 2,
            });
        });

        it('should complete properties when typing property name', () => {
            const document = 'st';
            const position = document.length;
            const properties: PropertiesConfig = {
                status: { values: [] },
                priority: { values: [] },
            };

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: 'status', apply: 'status ' },
                    { label: 'priority', apply: 'priority ' }
                ],
                from: 0,
            });
        });

        it('should complete properties after logical operator', () => {
            const document = 'status = open and ';
            const position = document.length;
            const properties: PropertiesConfig = {
                status: { values: [] },
                priority: { values: [] },
            };

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: 'status', apply: 'status ' },
                    { label: 'priority', apply: 'priority ' }
                ],
                from: position,
            });
        });

        it('should complete properties after logical operator when typing', () => {
            const document = 'status = open and st';
            const position = document.length;
            const properties: PropertiesConfig = {
                status: { values: [] },
                priority: { values: [] },
            };

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: 'status', apply: 'status ' },
                    { label: 'priority', apply: 'priority ' }
                ],
                from: position - 2,
            });
        });
    });

    describe('operators', () => {
        it('should complete operators after property name', () => {
            const document = 'status ';
            const position = document.length;
            const properties: PropertiesConfig = {};

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: '=', apply: '= ', boost: 99 },
                    { label: '!=', apply: '!= ' },
                ],
                from: position,
            });
        });
    });

    describe('values', () => {
        it('should complete values for current property after an operator', () => {
            const document = 'status =';
            const position = document.length;
            const properties: PropertiesConfig = {
                status: { values: ['open', 'wip', 'fixed'] },
            };

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: 'open', apply: 'open ' },
                    { label: 'wip', apply: 'wip ' },
                    { label: 'fixed', apply: 'fixed ' },
                ],
                from: position,
            });
        });

        it('should show rich completion options if they are defined', () => {
            const document = 'status =';
            const position = document.length;
            const properties: PropertiesConfig = {
                status: {
                    values: ['open', 'wip', 'fixed'],
                    completions: [
                        { label: 'OPEN', apply: 'open' },
                        { label: 'Work In Progress', apply: 'wip' },
                        { label: 'We hope it work', apply: 'fixed' },
                    ],
                },
            };

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: properties.status.completions,
                from: position,
            });
        });

        it('should complete values for current property after an operator and a space', () => {
            const document = 'status = ';
            const position = document.length;
            const properties: PropertiesConfig = {
                status: { values: ['open', 'wip', 'fixed'] },
            };

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: 'open', apply: 'open ' },
                    { label: 'wip', apply: 'wip ' },
                    { label: 'fixed', apply: 'fixed ' },
                ],
                from: position,
            });
        });

        it('should complete values when typing a value', () => {
            const document = 'status = op';
            const position = document.length;
            const properties: PropertiesConfig = {
                status: { values: ['open', 'wip', 'fixed'] },
            };

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: 'open', apply: 'open ' },
                    { label: 'wip', apply: 'wip ' },
                    { label: 'fixed', apply: 'fixed ' },
                ],
                from: 'status = '.length,
            });
        });

        it('should show no options when the property is not presented', () => {
            const document = 'resolution = op';
            const position = document.length;
            const properties: PropertiesConfig = {
                status: { values: ['open', 'wip', 'fixed'] },
            };

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [],
                from: 'resolution = '.length,
            });
        });
    });

    describe('logical operators', () => {
        it('should complete logical operators after a predicate', () => {
            const document = 'status = open ';
            const position = document.length;
            const properties: PropertiesConfig = {};

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: 'and', apply: 'and ' },
                    { label: 'or', apply: 'or ' },
                ],
                from: position,
            });
        });

        it('should complete logical operators after a predicate when typing', () => {
            const document = 'status = open a';
            const position = document.length;
            const properties: PropertiesConfig = {};

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: 'and', apply: 'and ' },
                    { label: 'or', apply: 'or ' },
                ],
                from: position - 1,
            });
        });

        it('should complete logical operators after a parentheses', () => {
            const document = '(status = open) ';
            const position = document.length;
            const properties: PropertiesConfig = {};

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: 'and', apply: 'and ' },
                    { label: 'or', apply: 'or ' },
                ],
                from: position,
            });
        });

        it('should complete logical operators after a parentheses when typing', () => {
            const document = '(status = open) o';
            const position = document.length;
            const properties: PropertiesConfig = {};

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: 'and', apply: 'and ' },
                    { label: 'or', apply: 'or ' },
                ],
                from: position - 1,
            });
        });

        it('should complete logical operators after a negation', () => {
            const document = '!(status = open) ';
            const position = document.length;
            const properties: PropertiesConfig = {};

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: 'and', apply: 'and ' },
                    { label: 'or', apply: 'or ' },
                ],
                from: position,
            });
        });

        it('should complete logical operators after a negation when typing', () => {
            const document = '!(status = open) an';
            const position = document.length;
            const properties: PropertiesConfig = {};

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: 'and', apply: 'and ' },
                    { label: 'or', apply: 'or ' },
                ],
                from: position - 2,
            });
        });

        it('should complete logical operators after a logical expression', () => {
            const document = 'priority != high or priority != high ';
            const position = document.length;
            const properties: PropertiesConfig = {};

            const completion = getCompletion(properties, document, position);

            expect(completion).toEqual({
                options: [
                    { label: 'and', apply: 'and ' },
                    { label: 'or', apply: 'or ' },
                ],
                from: position,
            });
        });
    });
});

