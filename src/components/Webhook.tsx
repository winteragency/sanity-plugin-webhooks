import { Flex, Spinner, Stack } from '@sanity/ui';
import { FC } from 'react';
import { useClient, useProjectId } from 'sanity';
import useSWR, { type SWRResponse } from 'swr';
import type { SanityWebhookAttempt } from '../types/SanityWebhookAttempt';
import { WebhookBodyComponentProps } from '../types/WebhookBodyComponentProps';
import { WebhookAttempt } from './WebhookAttempt';

export interface WebhookProps {
  webhookId: string;
  refreshInterval: number | undefined;
  webhookBodyComponent: FC<WebhookBodyComponentProps>;
}

export function Webhook({
  webhookId,
  refreshInterval,
  webhookBodyComponent
}: WebhookProps) {
  const apiVersion = '2023-06-21';
  const projectId = useProjectId();
  const client = useClient({ apiVersion }).withConfig({ requestTagPrefix: '' });

  const { isLoading, data }: SWRResponse<SanityWebhookAttempt[], Error> =
    useSWR(
      `hooks/projects/${projectId}/${webhookId}/attempts`,
      async (uri: string) => {
        const response = (
          await client.request<SanityWebhookAttempt[]>({
            uri
          })
        ).map((attempt) => {
          let resultBody = attempt.resultBody;
          let resultIsJson = false;

          try {
            resultBody = JSON.parse(attempt.resultBody);
            resultIsJson = true;
          } catch (e) {
            // Not valid JSON - response could be something different
          }

          return {
            ...attempt,
            resultBody,
            resultIsJson
          } as SanityWebhookAttempt;
        });

        return response;
      },
      { refreshInterval }
    );

  return (
    <Stack space={[3, 3, 4]}>
      {isLoading && (
        <Flex align="center" justify="center">
          {<Spinner muted />}
        </Flex>
      )}

      {data?.map((row) => (
        <WebhookAttempt
          key={row.id}
          attempt={row}
          webhookBodyComponent={webhookBodyComponent}
        />
      ))}
    </Stack>
  );
}
