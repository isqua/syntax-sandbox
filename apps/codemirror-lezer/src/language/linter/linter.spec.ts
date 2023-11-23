import { Diagnostic } from '@codemirror/lint';
import { describe, expect, it } from 'vitest';

import { PropertiesConfig } from '../../model';
import { getEditorState } from '../../test/utils/state';
import { buildQueryLinter } from './linter';

const getDiagnostic = (
    properties: PropertiesConfig,
    document: string,
): Diagnostic[] => {
    const state = getEditorState(properties, document);
    const lint = buildQueryLinter(properties);

    return lint(state);
};

describe('linter', () => {
    it('should highlght invalid property', () => {
        const document = 'foo = bar';
        const properties: PropertiesConfig = {
            status: { values: [] },
        };

        const diagnosis = getDiagnostic(properties, document);

        expect(diagnosis).toEqual<Diagnostic[]>([{
            from: 0,
            to: 3,
            message: 'Property ‘foo’ does not exist',
            severity: 'error',
        }]);
    });

    it('should highlght invalid property value', () => {
        const document = 'priority = critical';
        const properties: PropertiesConfig = {
            priority: { values: [ 'low', 'medium', 'high' ] },
        };

        const diagnosis = getDiagnostic(properties, document);

        expect(diagnosis).toEqual<Diagnostic[]>([{
            from: 11,
            to: 19,
            message: 'Value ‘critical’ is not allowed for property ‘priority’',
            severity: 'error',
        }]);
    });
});
