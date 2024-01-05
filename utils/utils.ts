import ASCIIFolder from "fold-to-ascii";

export async function sequentialAsyncOperations<T>(
  values: T[],
  asyncOperation: (value: T) => Promise<any>
) {
  try {
    const result = await values.reduce(async (previousPromise: Promise<any>, currentValue: T) => {
      const currentResult = await asyncOperation(currentValue);
      await previousPromise;
      return [...(await previousPromise), currentResult];
    }, Promise.resolve([]));
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

export const toSnakeCase = (str: string) => {
  const ascii = ASCIIFolder.foldReplacing(str);
  const groups = ascii.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
  if (groups === null) return;
  return groups.map((x) => x.toLowerCase()).join("_");
};
