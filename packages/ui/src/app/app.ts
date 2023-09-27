import './base.css';

import styles from './app.module.css';

export const getAppRoot = (selector: string): HTMLDivElement => {
    const appRoot = document.querySelector<HTMLDivElement>(selector);

    if (!appRoot) {
        throw new Error('Root element not found');
    }

    appRoot.classList.add(styles.app);

    return appRoot;
};
