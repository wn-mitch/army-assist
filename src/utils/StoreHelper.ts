// eslint-disable-next-line @typescript-eslint/no-explicit-any
const arraysEqual = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    a.sort();
    b.sort();
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

export { arraysEqual };
