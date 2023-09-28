import { CompletionContext, type CompletionResult } from '@codemirror/autocomplete';
import { EditorState } from '@codemirror/state';
import { describe, expect, it } from 'vitest';

import type { PropertiesConfig } from '../../config';
import { queryLanguage } from '..';
import { buildCompletion } from './autocomplete';

const getEditorState = (properties: PropertiesConfig, document: string) => EditorState.create({
    doc: document,
    extensions: [ queryLanguage(properties) ],
});

const getCompletion = (
    properties: PropertiesConfig,
    document: string,
    position: number,
): CompletionResult | null => {
    const state = getEditorState(properties, document);
    const ctx = new CompletionContext(state, position, false);
    const autocomplete = buildCompletion(properties);

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
                    { label: '=', apply: '= ' },
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
                status: { values: [ 'open', 'wip', 'fixed' ] },
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

        it('should complete values for current property after an operator and a space', () => {
            const document = 'status = ';
            const position = document.length;
            const properties: PropertiesConfig = {
                status: { values: [ 'open', 'wip', 'fixed' ] },
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
                status: { values: [ 'open', 'wip', 'fixed' ] },
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
