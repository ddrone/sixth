export function catClasses(curr: string | undefined, appendix: string): string {
  if (curr === undefined) {
    return appendix;
  }
  return `${curr} ${appendix}`;
}
