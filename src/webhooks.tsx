import {PlugIcon} from '@sanity/icons'
import {FC} from 'react'
import {definePlugin} from 'sanity'
import {route} from 'sanity/router'

import {DefaultWebhookBody} from './components/DefaultWebhookBody'
import {Webhooks} from './components/Webhooks'
import {type WebhookBodyComponentProps} from './types/WebhookBodyComponentProps'

export interface WebhooksPluginConfig {
  /**  Refresh interval for webhook events in milliseconds; set to 0 to disable live reload */
  refreshInterval?: number
  /** Component that displays the webhook request result */
  webhookBodyComponent?: FC<WebhookBodyComponentProps>
}

/**
 * A tool that lists your Sanity webhooks and displays their events along with
 * status, duration and response.
 *
 * @param options - Options for the plugin. See {@link WebhooksPluginConfig}
 *
 * @example Minimal example
 * ```ts
 * // sanity.config.ts
 * import { defineConfig } from 'sanity'
 * import { webhooks } from 'sanity-plugin-webhooks'
 *
 * export default defineConfig((
 *  // ...
 *  plugins: [
 *    webhooks()
 *  ]
 * })
 * ```
 */
export const webhooks = definePlugin<WebhooksPluginConfig | void>((config = {}) => ({
  name: 'sanity-plugin-webhooks',
  tools: [
    {
      title: 'Webhooks',
      name: 'webhooks',
      icon: PlugIcon,
      router: route.create({
        path: '/:webhookId',
      }),
      component: () => (
        <Webhooks
          refreshInterval={
            config?.refreshInterval === 0 ? undefined : config?.refreshInterval || 10000
          }
          webhookBodyComponent={config?.webhookBodyComponent || DefaultWebhookBody}
        />
      ),
    },
  ],
}))
