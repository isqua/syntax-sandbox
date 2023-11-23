import { syntaxTree } from '@codemirror/language';
import { type Range } from '@codemirror/state';
import { Decoration, EditorView, ViewPlugin, type DecorationSet, type ViewUpdate } from '@codemirror/view';

import type { Decorator } from '../../model';
import { TokenDetector } from '../common/TokenDetector';

type DecorableView = Pick<EditorView, 'state' | 'visibleRanges'>;

export function decorate(view: DecorableView, decorator: Decorator) {
    const ranges: Range<Decoration>[] = [];

    for (const { from, to } of view.visibleRanges) {
        const state = view.state;
        const detector = new TokenDetector();

        syntaxTree(state).iterate({
            from, to,
            enter: (node) => {
                if (detector.isProperty(node)) {
                    const token = detector.getPropertyToken(node, state);

                    ranges.push(...decorator.decorateProperty(token));
                } else if (detector.isValue(node)) {
                    const token = detector.getValueToken(node, state);

                    ranges.push(...decorator.decorateValue(token));
                }
            }
        });
    }

    return ranges;
}

export const decorator = (decorator: Decorator) => {
    class UserDefinedDecorator {
        decorations: DecorationSet;

        constructor(view: EditorView) {
            this.decorations = Decoration.set(decorate(view, decorator));
        }

        update(update: ViewUpdate) {
            if (update.docChanged || update.viewportChanged) {
                this.decorations = Decoration.set(decorate(update.view, decorator));
            }
        }
    }

    return ViewPlugin.fromClass(UserDefinedDecorator, {
        decorations: pluginValue => pluginValue.decorations,
        provide: plugin => EditorView.atomicRanges.of(
            view => view.plugin(plugin)?.decorations ?? Decoration.none
        ),
    });
};
