import { type ClassValue, clsx } from "clsx";
import dayjslib from "dayjs";
import "dayjs/locale/fr-ca";
import { twMerge } from "tailwind-merge";

dayjslib.locale("fr-ca");
export const dayjs = dayjslib;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shuffleArray<T>(array: T[]) {
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

export function map(
  value: number,
  oldRange: [number, number],
  newRange: [number, number],
) {
  const newValue =
    ((value - oldRange[0]) * (newRange[1] - newRange[0])) /
      (oldRange[1] - oldRange[0]) +
    newRange[0];
  return Math.round(Math.min(Math.max(newValue, newRange[0]), newRange[1]));
}

export function hexTransp(value: number) {
  if (value > 100 || value < 0) return "ff";
  const byteValue = map(value, [0, 100], [0, 255]);
  let hexValue = byteValue.toString(16);
  if (hexValue.length === 1) hexValue = `0${hexValue}`;
  return hexValue;
}

export function safeLocalStorageGet(key: string) {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(key);
}

export function safeLocalStorageSet(key: string, value: string) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, value);
}
