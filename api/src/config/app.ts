import packageJson from '../../package.json' with { type: 'json' };

export const APP_INFO = {
   systemVersion: packageJson.version,
   databaseLabel: 'MySQL',
} as const;
