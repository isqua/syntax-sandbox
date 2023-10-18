import { syntaxTree } from '@codemirror/language';
import type { Diagnostic } from '@codemirror/lint';
import type { EditorState } from '@codemirror/state';

import type { PropertiesConfig } from '../../config';
import { TokenDetector } from '../common/TokenDetector';
import { QueryValidator } from './QueryValidator';

export const buildQueryLinter = (properties: PropertiesConfig) => {
    const validator = new QueryValidator(properties);

    return (state: EditorState) => {
        const diagnostics: Diagnostic[] = [];
        const detector = new TokenDetector();

        syntaxTree(state).cursor().iterate(node => {
            if (detector.isProperty(node)) {
                const token = detector.getPropertyToken(node, state);

                diagnostics.push(...validator.getPropertyDiagnostics(token));
            } else if (detector.isValue(node)) {
                const token = detector.getValueToken(node, state);

                diagnostics.push(...validator.getValueDiagnostics(token));
            }
        });

        return diagnostics;
    };
};
