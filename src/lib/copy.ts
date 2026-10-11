import { createContext, useContext } from 'react';

export const ToastContext = createContext<(message: string) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
