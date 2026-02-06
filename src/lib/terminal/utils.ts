
export const stripAnsi = (str: string): string => {
    return str
        .replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
        .replace(/\x1b\][0-9];.*?\x07/g, '')
        .replace(/\x1b\][0-9];.*?\x1b\\/g, '')
        .replace(/\x1b[()][AB012]/g, '')
        .replace(/\r/g, '');
};
