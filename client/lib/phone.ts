// Phone formatter
export function formatEthiopianPhone(value: string): string {
   let cleaned = value.replace(/\D/g, '');
   if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
   if (cleaned.startsWith('251')) cleaned = cleaned.substring(3);
   cleaned = cleaned.slice(0, 9);
   const parts = cleaned.match(/.{1,3}/g);
   return '+251 ' + (parts ? parts.join(' ') : '');
}

export function isValidEthiopianPhone(phone: string) {
   const digits = phone.replace(/\D/g, '');

   return digits.length === 12;
}
