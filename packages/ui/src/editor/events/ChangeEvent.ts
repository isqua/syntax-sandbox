import type { EditorState } from '@codemirror/state';
import type { ViewUpdate } from '@codemirror/view';

import { EditorEvents } from './types';

type ChangeEventDetails = {
    state: EditorState;
    text: string;
};

export class ChangeEvent extends CustomEvent<ChangeEventDetails> {
    constructor(event: ViewUpdate) {
        const state = event.state;
        const text = state.doc.sliceString(0);

        super(EditorEvents.change, {
            detail: { state, text },
        });
    }
}
