import React from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import ASCIIFolder from "fold-to-ascii";
import dayjslib from "dayjs";
import "dayjs/locale/fr-ca";

dayjslib.locale("fr-ca");
export const dayjs = dayjslib;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getValidChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter((child) =>
    React.isValidElement(child)
  ) as React.ReactElement[];
}

export async function sequentialAsyncOperations<T>(
  values: T[],
  asyncOperation: (value: T) => Promise<any>
) {
  try {
    const result = await values.reduce(
      async (previousPromise: Promise<any>, currentValue: T) => {
        const currentResult = await asyncOperation(currentValue);
        await previousPromise;
        return [...(await previousPromise), currentResult];
      },
      Promise.resolve([])
    );
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

export const toSnakeCase = (str: string) => {
  const ascii = ASCIIFolder.foldReplacing(str);
  const groups = ascii.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
  );
  if (groups === null) return;
  return groups.map((x) => x.toLowerCase()).join("_");
};

export function shuffleArray(array: any[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function getTps(amount: number) {
  return amount * 0.05;
}

export function getTvq(amount: number) {
  return amount * 0.09975;
}
