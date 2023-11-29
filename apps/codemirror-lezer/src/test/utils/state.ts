import { EditorState } from '@codemirror/state';

import { Model, type PropertiesConfig } from '../../model';
import { queryLanguage } from '../../language';

export const getEditorState = (properties: PropertiesConfig, document: string) => EditorState.create({
    doc: document,
    extensions: [ queryLanguage(new Model(properties)) ],
});
