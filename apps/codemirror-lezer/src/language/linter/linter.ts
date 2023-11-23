import { syntaxTree } from '@codemirror/language';
import type { Diagnostic } from '@codemirror/lint';
import type { EditorState } from '@codemirror/state';

import type { IValidator } from '../../model';
import { TokenDetector } from '../common/TokenDetector';

export const buildQueryLinter = (validator: IValidator) => {
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
