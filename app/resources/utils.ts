export function timeout (ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms);
    });
}
