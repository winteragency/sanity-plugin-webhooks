# sanity-plugin-webhooks

[![Latest Stable Version](https://img.shields.io/npm/v/sanity-plugin-webhooks.svg)](https://www.npmjs.com/package/sanity-plugin-webhooks) [![Weekly Downloads](https://img.shields.io/npm/dw/sanity-plugin-webhooks?style=flat-square)](https://npm-stat.com/charts.html?package=sanity-plugin-webhooks)
[![License](https://img.shields.io/github/license/winteragency/sanity-plugin-webhooks.svg)](https://github.com/winteragency/sanity-plugin-webhooks) [![Made by Winter](https://img.shields.io/badge/made%20by-Winter-blue.svg)](https://winteragency.se)

> This is a **Sanity Studio v3** plugin.

## What is it?

A tool that lists your Sanity webhooks and displays their events along with status, duration and response.

## Installation

```sh
npm install sanity-plugin-webhooks
```

## Usage

Add it as a plugin in `sanity.config.ts`:

```ts
import { defineConfig } from 'sanity';
import { webhooks } from 'sanity-plugin-webhooks';

export default defineConfig({
  //...
  plugins: [webhooks()]
});
```

This will render a list of webhooks and for each webhook show a basic list of attempts and their status. You will also be able to see the exact response that the webhook received.

### Customize the list of events

To fully utilize this tool and make it as useful as possible for the Studio editors you can inject a custom component to render details about the webhook response.

For example, given a JSON response such as the following which comes from a Next.js revalidation API route:

```json
{
  "success": true,
  "message": "Revalidated 1 tag",
  "tags": ["page-about"],
  "received": {
    "_id": "f5e882dc-6713-4b0e-988a-03cb8ae453b1",
    "_type": "page",
    "slug": {
      "_type": "slug",
      "current": "about"
    }
  }
}
```

You can inject a custom result component such as this:

```ts
import { Stack } from '@sanity/ui';
import {
  BadgeRow,
  type WebhookBodyComponentProps
} from 'sanity-plugin-webhooks';

export function WebhookBody({ attempt }: WebhookBodyComponentProps) {
  // The result body is the response from the webhook endpoint
  const resultBody = attempt.resultBody;

  return (
    <>
      {resultBody?.message}

      {resultBody?.tags?.length > 0 && (
        <Stack space={[2, 2, 2]}>
          {resultBody.tags?.length > 0 && (
            <BadgeRow heading="Tags" badges={resultBody.tags} />
          )}
        </Stack>
      )}

      {resultBody?.received?.slug?.current && (
        <Stack space={[2, 2, 2]}>
          <BadgeRow
            heading="Triggered By"
            badges={[resultBody.received._type]}
            tone="default"
          />

          <BadgeRow
            heading="Slug"
            badges={[resultBody.received.slug.current]}
            tone="default"
          />
        </Stack>
      )}
    </>
  );
}
```

Then add the component to the plugin config like this:

```ts
import { defineConfig } from 'sanity';
import { webhooks } from 'sanity-plugin-webhooks';
import { WebhookBody } from './components/WebhookBody';

export default defineConfig({
  //...
  plugins: [webhooks({ webhookBodyComponent: WebhookBody })]
});
```

## License

[MIT](LICENSE) © [Winter Agency](https://winteragency.se)

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.

### Release new version

Run ["CI & Release" workflow](https://github.com/winteragency/sanity-plugin-webhooks/actions/workflows/main.yml).
Make sure to select the main branch and check "Release new version".

Semantic release will only release on configured branches, so it is safe to run release on any branch.
