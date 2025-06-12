import { describe, expect, it } from 'vitest';

import { getQueryFromTree } from './query';
import { Query } from './types';

describe('query', () => {
    it('should parse string equality', () => {
        const actual = getQueryFromTree('type = bug');

        expect(actual).toEqual<Query>({ type: { $eq: 'bug' } });
    });

    it('should parse string inequality', () => {
        const actual = getQueryFromTree('status != todo');

        expect(actual).toEqual<Query>({ status: { $ne: 'todo' } });
    });

    it('should parse value with the at and dash symbols', () => {
        const actual = getQueryFromTree('author = @fo_o.bar-baz42');

        expect(actual).toEqual<Query>({ author: { $eq: '@fo_o.bar-baz42' } });
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

        expect(actual).toEqual<Query>({ assignee: { $eq: '' }});
    });

    it('should partially parse property', () => {
        const actual = getQueryFromTree('reviewer');

        expect(actual).toEqual<Query>({ reviewer: {} });
    });

    describe('nesting', () => {
        it('should parse expression in parentheses', () => {
            const actual = getQueryFromTree('(type = bug)');

            expect(actual).toEqual<Query>({ type: { $eq: 'bug' } });
        });

        it('should parse negated expression in parentheses', () => {
            const actual = getQueryFromTree('!(type = bug)');

            expect(actual).toEqual<Query>({ $not: { type: { $eq: 'bug' } } });
        });

        it('should parse double negation', () => {
            const actual = getQueryFromTree('!!(type = bug)');

            expect(actual).toEqual<Query>({ $not: { $not: { type: { $eq: 'bug' } } } });
        });

        it('should parse expressions conjunction', () => {
            const actual = getQueryFromTree('type = bug and priority = normal');

            expect(actual).toEqual<Query>({
                $and: [
                    { type: { $eq: 'bug' } },
                    { priority: { $eq: 'normal' } }
                ]
            });
        });

        it('should parse expressions disjunction', () => {
            const actual = getQueryFromTree('type = bug or priority = normal');

            expect(actual).toEqual<Query>({
                $or: [
                    { type: { $eq: 'bug' } },
                    { priority: { $eq: 'normal' } }
                ]
            });
        });

        it('should prioritize first conjunction over right disjunction', () => {
            const actual = getQueryFromTree('type = bug and priority = normal or color = red');

            expect(actual).toEqual<Query>({
                $or: [
                    {
                        $and: [
                            { type: { $eq: 'bug' } },
                            { priority: { $eq: 'normal' } },
                        ]
                    },
                    { color: { $eq: 'red' } },
                ]
            });
        });

        it('should prioritize right conjunction over left disjunction', () => {
            const actual = getQueryFromTree('type = bug or priority = normal and color = red');

            expect(actual).toEqual<Query>({
                $or: [
                    { type: { $eq: 'bug' } },
                    {
                        $and: [
                            { priority: { $eq: 'normal' } },
                            { color: { $eq: 'red' } },
                        ]
                    },
                ]
            });
        });

        it('should prioritize parens disjunction over conjunction', () => {
            const actual = getQueryFromTree('(type = bug or priority = normal) and color = red');

            expect(actual).toEqual<Query>({
                $and: [
                    {
                        $or: [
                            { type: { $eq: 'bug' } },
                            { priority: { $eq: 'normal' } },
                        ]
                    },
                    { color: { $eq: 'red' } },
                ]
            });
        });

        it('should parse negated conjunction', () => {
            const actual = getQueryFromTree('!(type = bug and priority = normal)');

            expect(actual).toEqual<Query>({
                $not: {
                    $and: [
                        { type: { $eq: 'bug' } },
                        { priority: { $eq: 'normal' } },
                    ]
                },
            });
        });

        it('should parse negated disjunction', () => {
            const actual = getQueryFromTree('!(type = bug or priority = normal)');

            expect(actual).toEqual<Query>({
                $not: {
                    $or: [
                        { type: { $eq: 'bug' } },
                        { priority: { $eq: 'normal' } },
                    ]
                },
            });
        });
    });
});
