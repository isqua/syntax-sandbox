import { syntaxTree } from '@codemirror/language';
import { describe, expect, it } from 'vitest';

import { PropertiesConfig } from '../../config';
import { PropertyToken, ValueToken } from '../../parser';
import { getEditorState } from '../../test/utils/state';
import { TokenDetector } from './TokenDetector';

describe('TokenDetector', () => {
    it('should find properties correctly', () => {
        const config: PropertiesConfig = {};
        const text = '(status = in_progress or resolution = done) and priority = high';
        const state = getEditorState(config, text);
        const detector = new TokenDetector();
        const foundProperties: PropertyToken[] = [];

        syntaxTree(state).cursor().iterate(node => {
            if (detector.isProperty(node)) {
                foundProperties.push(detector.getPropertyToken(node, state));
            }
        });

        expect(foundProperties).toEqual([
            expect.objectContaining<PropertyToken>({
                tokenType: 'property',
                name: 'status',
                // WARNING: Lezer mutates node, so here will be last visited node
                node: expect.any(Object),
            }),
            expect.objectContaining<PropertyToken>({
                tokenType: 'property',
                name: 'resolution',
                node: expect.any(Object),
            }),
            expect.objectContaining<PropertyToken>({
                tokenType: 'property',
                name: 'priority',
                node: expect.any(Object),
            }),
        ]);
    });

    it('should find values correctly', () => {
        const config: PropertiesConfig = {};
        const text = '(status = in_progress or resolution = done) and priority = high';
        const state = getEditorState(config, text);
        const detector = new TokenDetector();
        const foundValues: ValueToken[] = [];

        syntaxTree(state).cursor().iterate(node => {
            if (detector.isValue(node)) {
                foundValues.push(detector.getValueToken(node, state));
            }
        });

        expect(foundValues).toEqual([
            expect.objectContaining<ValueToken>({
                tokenType: 'value',
                property: 'status',
                value: 'in_progress',
                node: expect.any(Object),
            }),
            expect.objectContaining<ValueToken>({
                tokenType: 'value',
                property: 'resolution',
                value: 'done',
                node: expect.any(Object),
            }),
            expect.objectContaining<ValueToken>({
                tokenType: 'value',
                property: 'priority',
                value: 'high',
                node: expect.any(Object),
            }),
        ]);
    });
});
