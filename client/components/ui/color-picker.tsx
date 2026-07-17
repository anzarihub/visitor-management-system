'use client';

import React, { useEffect, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover';

const hslToHex = (h: number, s: number, l: number): string => {
   l /= 100;
   const a = (s * Math.min(l, 1 - l)) / 100;
   const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
         .toString(16)
         .padStart(2, '0');
   };
   return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

const hexToHsl = (hex: string): [number, number, number] => {
   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
   if (!result) return [0, 0, 0];

   let r = parseInt(result[1], 16) / 255;
   let g = parseInt(result[2], 16) / 255;
   let b = parseInt(result[3], 16) / 255;

   const max = Math.max(r, g, b);
   const min = Math.min(r, g, b);
   let h = 0;
   let s = 0;
   const l = (max + min) / 2;

   if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
         case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
         case g:
            h = (b - r) / d + 2;
            break;
         case b:
            h = (r - g) / d + 4;
            break;
      }
      h /= 6;
   }

   return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const trimColorString = (color: string, maxLength: number = 20): string => {
   if (color.length <= maxLength) return color;
   return `${color.slice(0, maxLength - 3)}...`;
};

const defaultPresets = [
   '#35B9E9',
   '#6E3FF3',
   '#375DFB',
   '#E255F2',
   '#00D084',
   '#FF6900',
   '#FCB900',
   '#EB144C',
   '#14B8A6',
   '#A855F7',
   '#EC4899',
   '#84CC16',
   '#6366F1',
   '#64748B',
];

export function ColorPicker({
   color,
   onChange,
   presets = defaultPresets,
}: {
   color?: string;
   onChange: (color: string) => void;
   presets?: string[];
}) {
   const [hsl, setHsl] = useState<[number, number, number]>([200, 80, 50]);
   const [colorInput, setColorInput] = useState(color?.toUpperCase() ?? '');
   const [isOpen, setIsOpen] = useState(false);

   useEffect(() => {
      if (!color) return;

      handleColorChange(color);
   }, [color]);

   // Always works in HEX internally; emits HEX to parent via onChange
   const handleColorChange = (newColor: string) => {
      const hex = newColor.startsWith('#')
         ? newColor.toUpperCase()
         : hslToHex(
              ...((newColor.match(/\d+(\.\d+)?/g)?.map(Number) as [
                 number,
                 number,
                 number,
              ]) || [0, 0, 0]),
           );

      setColorInput(hex);
      setHsl(hexToHsl(hex));
      onChange(hex); // ✅ emits clean HEX like "#35B9E9"
   };

   const handleHueChange = (hue: number) => {
      const newHsl: [number, number, number] = [hue, hsl[1], hsl[2]];
      setHsl(newHsl);
      const hex = hslToHex(...newHsl);
      setColorInput(hex);
      onChange(hex);
   };

   const handleSaturationLightnessChange = (
      event: React.MouseEvent<HTMLDivElement>,
   ) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const s = Math.round((x / rect.width) * 100);
      const l = Math.round(100 - (y / rect.height) * 100);
      const newHsl: [number, number, number] = [hsl[0], s, l];
      setHsl(newHsl);
      const hex = hslToHex(...newHsl);
      setColorInput(hex);
      onChange(hex);
   };

   const handleColorInputChange = (
      event: React.ChangeEvent<HTMLInputElement>,
   ) => {
      const newColor = event.target.value;
      setColorInput(newColor); // show raw input while typing

      // HEX input
      if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
         const hex = newColor.toUpperCase();
         setHsl(hexToHsl(hex));
         onChange(hex);
         return;
      }

      // HSL input e.g. hsl(200, 80%, 50%) or 200, 80%, 50%
      const hslMatch =
         newColor.match(/^hsl\(\s*(\d+),\s*(\d+)%,\s*(\d+)%\s*\)$/) ||
         newColor.match(/^(\d+),\s*(\d+)%,\s*(\d+)%$/);

      if (hslMatch) {
         const h = Number(hslMatch[1]);
         const s = Number(hslMatch[2]);
         const l = Number(hslMatch[3]);
         const hex = hslToHex(h, s, l).toUpperCase();
         setHsl([h, s, l]);
         setColorInput(hex); // replace input display with hex once valid
         onChange(hex); // store hex
      }
   };

   return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               className="w-50 justify-start text-left font-normal"
            >
               {colorInput ? (
                  <>
                     <div
                        className="w-4 h-4 rounded-full mr-2 shadow-sm"
                        style={{ backgroundColor: colorInput }}
                     />
                     <span className="grow">{trimColorString(colorInput)}</span>
                  </>
               ) : (
                  <span className="grow text-muted-foreground">
                     🎨 Select department color
                  </span>
               )}
               <ChevronDown className="h-4 w-4 opacity-50 ml-auto" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-[320px] p-3">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.2 }}
               className="space-y-3 w-full"
            >
               <motion.div
                  className="w-full h-40 rounded-lg cursor-crosshair relative overflow-hidden"
                  style={{
                     background: `
                        linear-gradient(to top, rgba(0,0,0,1), transparent),
                        linear-gradient(to right, rgba(255,255,255,1), rgba(255,0,0,0)),
                        hsl(${hsl[0]}, 100%, 50%)
                     `,
                  }}
                  onClick={handleSaturationLightnessChange}
               >
                  <motion.div
                     className="w-4 h-4 rounded-full border-2 border-white absolute shadow-md"
                     style={{
                        left: `${hsl[1]}%`,
                        top: `${100 - hsl[2]}%`,
                        backgroundColor: colorInput,
                     }}
                     whileHover={{ scale: 1.2 }}
                     whileTap={{ scale: 0.9 }}
                  />
               </motion.div>

               <motion.input
                  type="range"
                  min="0"
                  max="360"
                  value={hsl[0]}
                  onChange={(e) => handleHueChange(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                     background: `linear-gradient(to right,
                        hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%),
                        hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%)
                     )`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
               />

               <div className="flex items-center space-x-2">
                  <Label htmlFor="color-input" className="sr-only">
                     Color
                  </Label>
                  <Input
                     id="color-input"
                     type="text"
                     value={colorInput}
                     onChange={handleColorInputChange}
                     className="grow bg-white border border-gray-300 rounded-md text-sm h-8 px-2"
                     placeholder="#RRGGBB"
                  />
                  <motion.div
                     className="w-8 h-8 rounded-md shadow-sm"
                     style={{ backgroundColor: colorInput }}
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                  />
               </div>

               <div className="grid grid-cols-7 gap-2 mt-2">
                  <AnimatePresence>
                     {presets.map((preset) => (
                        <motion.button
                           key={preset}
                           className="w-8 h-8 rounded-full relative shrink-0"
                           style={{ backgroundColor: preset }}
                           onClick={() => handleColorChange(preset)}
                           whileHover={{ scale: 1.2, zIndex: 1 }}
                           whileTap={{ scale: 0.9 }}
                        >
                           {colorInput === preset && (
                              <motion.div
                                 initial={{ scale: 0 }}
                                 animate={{ scale: 1 }}
                                 exit={{ scale: 0 }}
                                 transition={{ duration: 0.2 }}
                              >
                                 <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                              </motion.div>
                           )}
                        </motion.button>
                     ))}
                  </AnimatePresence>
               </div>
            </motion.div>
         </PopoverContent>
      </Popover>
   );
}

export default ColorPicker;
