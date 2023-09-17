import { syntaxTree } from '@codemirror/language';
import type { Diagnostic } from '@codemirror/lint';
import type { EditorState } from '@codemirror/state';

import type { PropertiesConfig } from '../config';
import { Terms } from '../parser';
import { QueryValidator } from './QueryValidator';

export const buildQueryLinter = (properties: PropertiesConfig) => {
    const validator = new QueryValidator(properties);

    return (state: EditorState) => {
        const diagnostics: Diagnostic[] = [];

        syntaxTree(state).cursor().iterate(node => {
            if (node.type.id === Terms.Property) {
                const propertyName = state.sliceDoc(node.from, node.to);

                diagnostics.push(...validator.getPropertyDiagnostics({
                    tokenType: 'property',
                    name: propertyName,
                    node,
                }));
            } else if (node.type.id === Terms.Value) {
                const valueText = state.sliceDoc(node.from, node.to);
                const property = node.node?.parent?.getChild(Terms.Property);
                const propertyName = property ? state.sliceDoc(property.from, property.to) : '';

                diagnostics.push(...validator.getValueDiagnostics({
                    tokenType: 'value',
                    value: valueText,
                    property: propertyName,
                    node,
                }));
            }
        });

        return diagnostics;
    };
};
