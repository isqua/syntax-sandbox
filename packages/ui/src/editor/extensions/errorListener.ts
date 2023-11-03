import { forEachDiagnostic, type Diagnostic } from '@codemirror/lint';
import { EditorView, type ViewUpdate } from '@codemirror/view';

type DiagnosticsCallback = (diagnostics: Diagnostic[], event: ViewUpdate) => void;

function isArraysEqual<T>(arr1: T[], arr2: T[]) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i <= arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}

export const errorListener = (callback: DiagnosticsCallback) => {
    let previousDiagnostics: Diagnostic[] = [];

    return EditorView.updateListener.of(event => {
        const currentDiagnostics: Diagnostic[] = [];

        forEachDiagnostic(event.state, (d) => {
            currentDiagnostics.push(d);
        });

        if (!isArraysEqual(previousDiagnostics, currentDiagnostics)) {
            previousDiagnostics = currentDiagnostics;

            callback(currentDiagnostics, event);
        }
    });
};
