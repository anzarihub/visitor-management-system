'use client';

import { Button } from '@/components/ui/button';
import {
   Field,
   FieldContent,
   FieldDescription,
   FieldGroup,
   FieldLabel,
   FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useUpdateGeneralSettings } from '@/hooks/use-settings';
import type { Settings } from '@/types/setting.types';
import * as React from 'react';
import { toast } from 'sonner';
import { SectionCard } from '../shared/section-card';
import { SaveSettingsDialog } from './save-settings-dialog';

const OVERSTAY_OPTIONS = [
   { label: '30 Minutes', value: '30' },
   { label: '1 Hour', value: '60' },
   { label: '2 Hours', value: '120' },
   { label: '4 Hours', value: '240' },
   { label: '8 Hours', value: '480' },
   { label: '24 Hours', value: '1440' },
];

type GeneralTabProps = {
   settings: Settings;
};

export function GeneralTab({ settings }: GeneralTabProps) {
   const [orgName, setOrgName] = React.useState(settings.orgName);
   const [badgePrefix, setBadgePrefix] = React.useState(settings.badgePrefix);
   const [overstayEnabled, setOverstayEnabled] = React.useState(
      settings.overstayEnabled,
   );
   const [overstayValue, setOverstayValue] = React.useState(
      settings.overstayAfterMins.toString(),
   );
   const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);

   const { mutate: updateGeneral, isPending } = useUpdateGeneralSettings();

   const handleSave = () => {
      updateGeneral(
         {
            orgName,
            badgePrefix,
            overstayEnabled,
            overstayAfterMins: Number(overstayValue),
         },
         {
            onSuccess: () => {
               toast.success('General settings saved successfully');
               setSaveDialogOpen(false);
            },
            onError: () => {
               toast.error('Failed to save settings. Please try again.');
               setSaveDialogOpen(false);
            },
         },
      );
   };

   return (
      <>
         <SectionCard
            title="General"
            description="Configure organization information and visitor management rules."
         >
            <div className="text-sm">
               <FieldGroup>
                  <Field>
                     <FieldLabel htmlFor="org-name">
                        Organization Name
                     </FieldLabel>
                     <FieldDescription>
                        The official organization name displayed throughout the
                        system and on generated reports.
                     </FieldDescription>
                     <Input
                        id="org-name"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                     />
                  </Field>

                  <Field>
                     <FieldLabel htmlFor="badge-prefix">
                        Badge Prefix
                     </FieldLabel>
                     <FieldDescription>
                        Prefix used to identify and manage badge records within
                        the system.
                     </FieldDescription>
                     <Input
                        id="badge-prefix"
                        value={badgePrefix}
                        onChange={(e) => setBadgePrefix(e.target.value)}
                     />
                  </Field>

                  <FieldGroup className="w-full">
                     <FieldLabel htmlFor="overstay-detection">
                        <Field orientation="horizontal">
                           <FieldContent
                              className={
                                 !overstayEnabled
                                    ? 'opacity-50 pointer-events-none'
                                    : ''
                              }
                           >
                              <FieldTitle>
                                 Automatic Overstay Detection
                              </FieldTitle>
                              <FieldDescription>
                                 Automatically flag active visits that exceed
                                 the allowed visit duration.
                              </FieldDescription>

                              <div className="flex items-center gap-4 mt-5">
                                 <div className="w-1/2">
                                    <Select
                                       value={overstayValue}
                                       onValueChange={setOverstayValue}
                                    >
                                       <SelectTrigger className="w-full">
                                          <SelectValue />
                                       </SelectTrigger>
                                       <SelectContent>
                                          <SelectGroup>
                                             {OVERSTAY_OPTIONS.map((opt) => (
                                                <SelectItem
                                                   key={opt.value}
                                                   value={opt.value}
                                                >
                                                   {opt.label}
                                                </SelectItem>
                                             ))}
                                          </SelectGroup>
                                       </SelectContent>
                                    </Select>
                                 </div>
                              </div>

                              <FieldDescription>
                                 Choose how long a visitor may stay before being
                                 marked as an overstay.
                              </FieldDescription>
                           </FieldContent>
                           <Switch
                              id="overstay-detection"
                              checked={overstayEnabled}
                              onCheckedChange={setOverstayEnabled}
                           />
                        </Field>
                     </FieldLabel>
                  </FieldGroup>
               </FieldGroup>

               <div className="flex justify-end pt-6 gap-4">
                  <Button
                     variant="outline"
                     type="button"
                     onClick={() => {
                        setOrgName(settings.orgName);
                        setBadgePrefix(settings.badgePrefix);
                        setOverstayEnabled(settings.overstayEnabled);
                        setOverstayValue(settings.overstayAfterMins.toString());
                     }}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="button"
                     onClick={() => setSaveDialogOpen(true)}
                     disabled={isPending}
                  >
                     {isPending ? 'Saving…' : 'Save Settings'}
                  </Button>
               </div>
            </div>
         </SectionCard>

         <SaveSettingsDialog
            open={saveDialogOpen}
            onOpenChange={setSaveDialogOpen}
            onConfirm={handleSave}
            isPending={isPending}
         />
      </>
   );
}
