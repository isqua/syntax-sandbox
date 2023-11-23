import { describe, expect, it } from 'vitest';

import type { PropertiesConfig } from './properties';
import type { PropertyToken, ValueToken } from './tokens';
import { Validator } from './validator';

describe('validator', () => {
    describe('getPropertyDiagnostics', () => {
        it('should return an empty array if the property exists', () => {
            const properties: PropertiesConfig = { color: { values: [] } };
            const token: PropertyToken = {
                tokenType: 'property',
                node: { from: 0, to: 7 },
                name: 'color',
            };

            const validator = new Validator(properties);
            const result = validator.getPropertyDiagnostics(token);

            expect(result).toHaveLength(0);
        });

        it('should return an error if the property is not allowed', () => {
            const properties: PropertiesConfig = { color: { values: [] } };
            const token: PropertyToken = {
                tokenType: 'property',
                node: { from: 0, to: 4 },
                name: 'size'
            };

            const validator = new Validator(properties);
            const result = validator.getPropertyDiagnostics(token);

            expect(result).toStrictEqual([
                {
                    from: token.node.from,
                    to: token.node.to,
                    severity: 'error',
                    message: 'Property ‘size’ does not exist',
                },
            ]);
        });
    });

    describe('getValueDiagnostics', () => {
        it('should return an empty array if the value is allowed', () => {
            const properties: PropertiesConfig = { size: { values: ['small', 'medium', 'large'] } };
            const token: ValueToken = {
                tokenType: 'value',
                property: 'size',
                node: { from: 7, to: 12 },
                value: 'small'
            };

            const validator = new Validator(properties);
            const result = validator.getValueDiagnostics(token);

            expect(result).toHaveLength(0);
        });

        it('should return an empty array if the value belongs to nonexistent property', () => {
            const properties: PropertiesConfig = { size: { values: [] } };
            const token: ValueToken = {
                tokenType: 'value',
                property: 'color',
                node: { from: 8, to: 11 },
                value: 'red'
            };

            const validator = new Validator(properties);
            const result = validator.getValueDiagnostics(token);

            expect(result).toHaveLength(0);
        });

        it('should return an error if the value is not allowed for this property', () => {
            const properties: PropertiesConfig = { size: { values: ['small', 'medium', 'large'] } };
            const token: ValueToken = {
                tokenType: 'value',
                property: 'size',
                node: { from: 7, to: 18 },
                value: 'extra-large'
            };

            const validator = new Validator(properties);
            const result = validator.getValueDiagnostics(token);

            expect(result).toStrictEqual([
                {
                    from: token.node.from,
                    to: token.node.to,
                    severity: 'error',
                    message: 'Value ‘extra-large’ is not allowed for property ‘size’',
                },
            ]);
        });
    });
});
