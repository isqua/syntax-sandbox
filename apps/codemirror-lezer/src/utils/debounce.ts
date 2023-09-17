export interface debounceCallback<TArgs extends unknown[], TRes> {
    (...args: TArgs): TRes;
}

export interface debounceResult<TArgs extends unknown[], TRes> {
    (...args: TArgs): Promise<TRes>;
}

export function debounce<TArgs extends unknown[], TRes = void>(
    fn: debounceCallback<TArgs, TRes>,
    delayInMs: number,
    ctx: unknown,
): debounceResult<TArgs, TRes> {
    let timer: number;

    const debouncedFunc: debounceResult<TArgs, TRes> = (...args) => new Promise((resolve) => {
        if (timer) {
            clearTimeout(timer);
        }

        timer = window.setTimeout(
            () => resolve(fn.apply(ctx, args)),
            delayInMs,
        );
    });

    return debouncedFunc;
}
