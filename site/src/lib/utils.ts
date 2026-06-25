import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function whatsappUrl(message: string) {
  const text = encodeURIComponent(message)
  return `https://wa.me/351917914696?text=${text}`
}
