import { describe, expect, it } from 'vitest';

import type { PropertiesConfig } from './properties';
import { Suggest } from './suggest';

describe('autocomplete', () => {
    describe('getProperties', () => {
        it('should return an array of available properties', () => {
            const properties: PropertiesConfig = {
                color: { values: [] },
                size: { values: [] }
            };
            const suggest = new Suggest(properties);
            const result = suggest.getProperties();

            expect(result).toStrictEqual([
                { label: 'color', apply: 'color ' },
                { label: 'size', apply: 'size ' }
            ]);
        });
    });

    describe('getPropertyOperators', () => {
        it('should return an array of property operators', () => {
            const suggest = new Suggest({});
            const result = suggest.getPropertyOperators();

            expect(result).toStrictEqual([
                { label: '=', apply: '= ', boost: 99 },
                { label: '!=', apply: '!= ' },
            ]);
        });
    });

    describe('getLogicalOperators', () => {
        it('should return an array of and and or words', () => {
            const suggest = new Suggest({});
            const result = suggest.getLogicalOperators();

            expect(result).toStrictEqual([
                { label: 'and', apply: 'and ' },
                { label: 'or', apply: 'or ' },
            ]);
        });
    });

    describe('getPropertyValues', () => {
        it('should return an array of property values', () => {
            const properties: PropertiesConfig = { size: { values: ['small', 'medium', 'large'] } };
            const suggest = new Suggest(properties);
            const result = suggest.getPropertyValues('size');

            expect(result).toStrictEqual([
                { label: 'small', apply: 'small ' },
                { label: 'medium', apply: 'medium ' },
                { label: 'large', apply: 'large ' },
            ]);
        });

        it('should return an array of property completions if there are any', () => {
            const properties: PropertiesConfig = { size: {
                values: ['small', 'medium', 'large'],
                completions: [
                    { label: 'S', apply: 'small', detail: '4' },
                    { label: 'M', apply: 'medium', detail: '16' },
                    { label: 'L', apply: 'large', detail: '32' },
                ]
            } };
            const suggest = new Suggest(properties);
            const result = suggest.getPropertyValues('size');

            expect(result).toStrictEqual(properties.size.completions);
        });

        it('should return an empty array if the property is missing in the config', () => {
            const properties: PropertiesConfig = { size: { values: [] } };
            const suggest = new Suggest(properties);
            const result = suggest.getPropertyValues('color');

            expect(result).toStrictEqual([]);
        });
    });
});
