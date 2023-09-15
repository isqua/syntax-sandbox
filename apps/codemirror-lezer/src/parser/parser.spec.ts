import { describe, expect, it } from 'vitest';

import { getQueryFromTree } from './query';
import { Query } from './types';

describe('parser', () => {
    it('should parse string equality', () => {
        const actual = getQueryFromTree('type = bug');

        expect(actual).toEqual<Query>({ type: { '=': 'bug' } });
    });

    it('should parse string inequality', () => {
        const actual = getQueryFromTree('status != todo');

        expect(actual).toEqual<Query>({ status: { '!=': 'todo' } });
    });

    it('should parse empty string', () => {
        const actual = getQueryFromTree('');

        expect(actual).toEqual<Query>({});
    });

    it('should parse empty request with spaces', () => {
        const actual = getQueryFromTree(' ');

        expect(actual).toEqual<Query>({});
    });

    it('should partially parse predicate without value', () => {
        const actual = getQueryFromTree('assignee =');

        expect(actual).toEqual<Query>({ assignee: { '=': '' }});
    });

    it('should partially parse property', () => {
        const actual = getQueryFromTree('reviewer');

        expect(actual).toEqual<Query>({ reviewer: { '': '' }});
    });

    describe('nesting', () => {
        it('should parse expression in parentheses', () => {
            const actual = getQueryFromTree('(type = bug)');

            expect(actual).toEqual<Query>({ type: { '=': 'bug' } });
        });

        it('should parse negated expression in parentheses', () => {
            const actual = getQueryFromTree('!(type = bug)');

            expect(actual).toEqual<Query>({ '!': { type: { '=': 'bug' } } });
        });

        it('should parse double negation', () => {
            const actual = getQueryFromTree('!!(type = bug)');

            expect(actual).toEqual<Query>({ '!': { '!': { type: { '=': 'bug' } } } });
        });

        it('should parse expressions conjunction', () => {
            const actual = getQueryFromTree('type = bug and priority = normal');

            expect(actual).toEqual<Query>({
                'and': [
                    { type: { '=': 'bug' } },
                    { priority: { '=': 'normal' } }
                ]
            });
        });

        it('should parse expressions disjunction', () => {
            const actual = getQueryFromTree('type = bug or priority = normal');

            expect(actual).toEqual<Query>({
                'or': [
                    { type: { '=': 'bug' } },
                    { priority: { '=': 'normal' } }
                ]
            });
        });

        it('should prioritize first conjunction over right disjunction', () => {
            const actual = getQueryFromTree('type = bug and priority = normal or color = red');

            expect(actual).toEqual<Query>({
                'or': [
                    {
                        and: [
                            { type: { '=': 'bug' } },
                            { priority: { '=': 'normal' } },
                        ]
                    },
                    { color: { '=': 'red' } },
                ]
            });
        });

        it('should prioritize right conjunction over left disjunction', () => {
            const actual = getQueryFromTree('type = bug or priority = normal and color = red');

            expect(actual).toEqual<Query>({
                'or': [
                    { type: { '=': 'bug' } },
                    {
                        and: [
                            { priority: { '=': 'normal' } },
                            { color: { '=': 'red' } },
                        ]
                    },
                ]
            });
        });

        it('should prioritize parens disjunction over conjunction', () => {
            const actual = getQueryFromTree('(type = bug or priority = normal) and color = red');

            expect(actual).toEqual<Query>({
                'and': [
                    {
                        or: [
                            { type: { '=': 'bug' } },
                            { priority: { '=': 'normal' } },
                        ]
                    },
                    { color: { '=': 'red' } },
                ]
            });
        });

        it('should parse negated conjunction', () => {
            const actual = getQueryFromTree('!(type = bug and priority = normal)');

            expect(actual).toEqual<Query>({
                '!': {
                    and: [
                        { type: { '=': 'bug' } },
                        { priority: { '=': 'normal' } },
                    ]
                },
            });
        });

        it('should parse negated disjunction', () => {
            const actual = getQueryFromTree('!(type = bug or priority = normal)');

            expect(actual).toEqual<Query>({
                '!': {
                    or: [
                        { type: { '=': 'bug' } },
                        { priority: { '=': 'normal' } },
                    ]
                },
            });
        });
    });
});
