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
    });
});
