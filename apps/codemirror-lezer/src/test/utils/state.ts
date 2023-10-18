import { EditorState } from '@codemirror/state';

import type { PropertiesConfig } from '../../config';
import { queryLanguage } from '../../language';

export const getEditorState = (properties: PropertiesConfig, document: string) => EditorState.create({
    doc: document,
    extensions: [ queryLanguage(properties) ],
});
