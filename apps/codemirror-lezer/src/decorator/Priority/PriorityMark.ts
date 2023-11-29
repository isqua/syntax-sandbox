import styles from './PriorityMark.module.css';

const priorityStyleByValue: Record<string, string> = {
    high: styles.high,
    medium: styles.medium,
    low: styles.low,
};

export const getPriorityMark = (priority: string) => ({
    class: [
        styles.priority,
        priorityStyleByValue[priority],
    ].filter(Boolean).join(' '),
});
