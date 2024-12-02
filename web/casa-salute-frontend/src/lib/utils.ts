import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatData = (timestamp: number): string => {
  let data = new Date(timestamp);
  let ora = data.toString().substr(16, 5);
  
  return formatDataEurope(data.toDateString()) + " " + ora;
};

export function formatDataEurope(dateString: string, withHour: boolean = false, noIncrease: boolean = false): string {
  const date = new Date(dateString);
  let day = String(date.getUTCDate()+1).padStart(2, '0');
  if (noIncrease) {
   day = String(date.getUTCDate()).padStart(2, '0');
  }
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getUTCFullYear();
  if(withHour){
    const hours = String(date.getUTCHours()+2).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  return `${day}-${month}-${year}`;
}


export function formatDataUSA(dateString: Date): string {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()+1).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getUTCFullYear();

  return `${year}-${month}-${day}`;
}

export function convertToISO8601(date: Date | undefined): string | null {
  if (!date) {
      return null;
  }

  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + 2);
  const isoString = newDate.toISOString();
  
  return isoString;
}
