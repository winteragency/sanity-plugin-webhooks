import {Badge, Box, Card, Flex, Heading, Inline, Spinner, Stack, Text} from '@sanity/ui'
import {FC, useEffect, useState} from 'react'
import {useClient, useDataset, useProjectId} from 'sanity'
import {Link, useRouter} from 'sanity/router'
import styled from 'styled-components'
import useSWR, {type SWRResponse} from 'swr'

import {type SanityWebhook} from '../types/SanityWebhook'
import {WebhookBodyComponentProps} from '../types/WebhookBodyComponentProps'
import {BadgeRow} from './BadgeRow'
import {Webhook} from './Webhook'

const ToolWrapper = styled(Box)`
  @media (min-width: 1000px) {
    height: 100%;
    overflow: hidden;
  }
`

const LayoutWrapper = styled(Flex)`
  flex-direction: column;

  @media (min-width: 1000px) {
    flex-direction: row;
    height: 100%;
  }
`

const WebhooksList = styled(Stack)`
  @media (min-width: 1000px) {
    flex: 0 0 500px;
    overflow-y: auto;
    height: 100%;
  }
`
const AttemptsList = styled(Stack)`
  flex-grow: 1;
  overflow-y: auto;
  height: 100%;
`

export interface WebhooksProps {
  refreshInterval: number | undefined
  webhookBodyComponent: FC<WebhookBodyComponentProps>
}

export function Webhooks({refreshInterval, webhookBodyComponent}: WebhooksProps) {
  const apiVersion = '2023-06-21'
  const router = useRouter()
  const dataset = useDataset()
  const projectId = useProjectId()
  const [webhookId, setWebhookId] = useState<string | null>(null)
  const client = useClient({apiVersion}).withConfig({requestTagPrefix: ''})

  const {isLoading, data}: SWRResponse<SanityWebhook[], Error> = useSWR(
    `hooks/projects/${projectId}`,
    (uri: string) =>
      client.request({
        uri,
      }),
  )

  const webhooks =
    data?.filter(
      (webhook) =>
        webhook.dataset === '*' ||
        (Array.isArray(webhook.dataset) && webhook.dataset.includes(dataset)) ||
        webhook.dataset === dataset,
    ) || []

  useEffect(() => {
    if (router.state) {
      // Navigated to a webhook
      setWebhookId(router.state.webhookId as string)
    }
  }, [router.state])

  return (
    <ToolWrapper padding={[3, 3, 3, 0]} paddingTop={0}>
      <LayoutWrapper gap={[3, 3, 3, 0]}>
        <WebhooksList padding={[1, 1, 1, 4]} space={[3, 3, 3, 4]}>
          <Heading as="h2" size={2}>
            Webhooks
          </Heading>

          {isLoading && (
            <Flex align="center" justify="center">
              <Spinner muted />
            </Flex>
          )}

          {!isLoading && webhooks.length === 0 && (
            <Card padding={[1, 2]} radius={3} tone="caution">
              No webhooks are configured for the current dataset.
            </Card>
          )}

          {!isLoading &&
            webhooks?.map((webhook) => (
              <Link
                key={webhook.id}
                href={`${
                  router.resolvePathFromState(router.state).split('/webhooks')[0]
                }/webhooks/${webhook.id}`}
              >
                <Card
                  padding={[3, 3, 3, 4]}
                  radius={2}
                  shadow={1}
                  tone={webhookId && webhookId === webhook.id ? 'primary' : undefined}
                >
                  <Flex justify="space-between" align="center">
                    <Stack space={4}>
                      <Text size={[2, 3]}>
                        <Flex wrap="wrap" gap={[3]} style={{rowGap: 2}} align="center">
                          {webhook.name}
                          <Inline>
                            <Badge tone={webhook.isDisabled ? 'critical' : 'positive'}>
                              {webhook.isDisabled ? 'Disabled' : 'Enabled'}
                            </Badge>
                          </Inline>
                        </Flex>
                      </Text>

                      <Stack space={2}>
                        <BadgeRow
                          heading="Dataset"
                          badges={[webhook.dataset]}
                          tone="default"
                          wrap="nowrap"
                        />
                        <BadgeRow heading="ID" badges={[webhook.id]} tone="default" wrap="nowrap" />
                        <BadgeRow
                          heading="URL"
                          badges={[webhook.url]}
                          tone="default"
                          wrap="nowrap"
                        />
                      </Stack>
                    </Stack>
                  </Flex>
                </Card>
              </Link>
            ))}
        </WebhooksList>

        <AttemptsList padding={[1, 1, 1, 4]} paddingLeft={[1, 1, 1, 1]} space={[3, 3, 3, 4]}>
          {webhookId && (
            <>
              <Inline paddingBottom={[2, 2, 2, 0]}>
                <Heading as="h2" size={2}>
                  Events for {webhooks?.find((webhook) => webhook.id === webhookId)?.name}
                </Heading>
              </Inline>
              <Webhook
                webhookId={webhookId}
                refreshInterval={refreshInterval}
                webhookBodyComponent={webhookBodyComponent}
              />
            </>
          )}
        </AttemptsList>
      </LayoutWrapper>
    </ToolWrapper>
  )
}
