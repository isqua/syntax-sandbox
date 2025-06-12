import type { EditorState } from '@codemirror/state';
import type { ViewUpdate } from '@codemirror/view';
import type { Diagnostic } from '@codemirror/lint';

import { EditorEvents } from './types';

type DiagnosisEventDetails = {
    state: EditorState;
    diagnostics: Diagnostic[];
};

export class DiagnosisEvent extends CustomEvent<DiagnosisEventDetails> {
    constructor(event: ViewUpdate, diagnostics: Diagnostic[]) {
        const state = event.state;

        super(EditorEvents.diagnosis, {
            detail: { state, diagnostics },
        });
    }
}
