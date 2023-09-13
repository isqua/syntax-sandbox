import { Query } from '../../parser';
import { EditorEvents } from './types';

type ChangeEventDetails = {
    query: Query | null;
    text: string;
};

export class ChangeEvent extends CustomEvent<ChangeEventDetails> {
    constructor(query: Query | null, text: string) {
        super(EditorEvents.change, {
            detail: { query, text },
        });
    }
}
