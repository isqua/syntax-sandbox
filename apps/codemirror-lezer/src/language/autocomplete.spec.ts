import { CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { EditorState } from '@codemirror/state';
import { describe, expect, it } from 'vitest';

import type { PropertiesConfig } from '../config';
import { buildCompletion } from './autocomplete';
import { queryLanguage } from './language';

const getEditorState = (document: string) => EditorState.create({
    doc: document,
    extensions: [ queryLanguage() ],
});

const getCompletion = (
    properties: PropertiesConfig,
    document: string,
    position: number,
): CompletionResult | null => {
    const state = getEditorState(document);
    const ctx = new CompletionContext(state, position, false);
    const autocomplete = buildCompletion(properties);

    return autocomplete(ctx);
};

describe('autocomplete', () => {
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
});

