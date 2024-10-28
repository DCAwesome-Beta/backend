import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

const circleApiBaseUrl =
  process.env.CIRCLE_API_BASE_URL ?? 'https://api.circle.com';

export const circleDevSdk = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.API_KEY ?? '',
  baseUrl: circleApiBaseUrl,
  userAgent: 'DCAwesomeApp',
  entitySecret: process.env.ENTITY_SECRET ?? ''
});
