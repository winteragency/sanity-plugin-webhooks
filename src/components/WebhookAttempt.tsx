import { CalendarIcon, ClockIcon, CodeIcon } from '@sanity/icons';
import {
  Badge,
  Box,
  Button,
  Card,
  Code,
  Flex,
  Inline,
  Stack,
  Text,
  Tooltip
} from '@sanity/ui';
import {
  addMilliseconds,
  formatDistance,
  formatDuration,
  intervalToDuration
} from 'date-fns';
import { FC, useState } from 'react';
import { SanityWebhookAttempt } from '../types/SanityWebhookAttempt';
import { WebhookBodyComponentProps } from '../types/WebhookBodyComponentProps';
import { BadgeRow } from './BadgeRow';

export interface WebhookAttemptProps {
  attempt: SanityWebhookAttempt;
  webhookBodyComponent: FC<WebhookBodyComponentProps>;
}

export function WebhookAttempt({
  attempt,
  webhookBodyComponent: WebhookBody
}: WebhookAttemptProps) {
  const [showResponse, setShowResponse] = useState(false);
  const formatDistanceLocale: { [s: string]: string } = {
    xSeconds: '{{count}}s',
    xMinutes: '{{count}}m',
    xHours: '{{count}}h'
  };

  return (
    <Card key={attempt.id} padding={[3, 3, 3, 4]} radius={2} shadow={1}>
      <Stack space={[3, 3, 3, 4]}>
        <Flex align="center" justify="space-between" gap={3} wrap="wrap">
          <Inline style={{ lineHeight: 1.5 }}>
            <Inline paddingRight={3}>
              {attempt.inProgress ? (
                <Badge tone="primary">In Progress</Badge>
              ) : attempt.isFailure ? (
                <Badge tone="critical">Failed</Badge>
              ) : (
                <Badge tone="positive">Completed</Badge>
              )}
            </Inline>
            <Inline paddingRight={3}>
              <Inline paddingRight={1}>
                <ClockIcon style={{ fontSize: '17' }} />
              </Inline>
              <Inline>
                <Text size={2}>
                  {formatDuration(
                    intervalToDuration({
                      start: new Date(attempt.createdAt),
                      end: addMilliseconds(
                        new Date(attempt.createdAt),
                        attempt.duration || 0
                      )
                    }),
                    {
                      delimiter: ' ',
                      format: ['days', 'hours', 'minutes', 'seconds'],
                      locale: {
                        formatDistance: (token, count) =>
                          formatDistanceLocale[token].replace(
                            '{{count}}',
                            count
                          )
                      }
                    }
                  )}
                </Text>
              </Inline>
              <Inline paddingLeft={3}>
                <Badge
                  mode="outline"
                  tone={attempt.isFailure ? 'critical' : 'positive'}
                >
                  <span>{attempt.resultCode}</span>
                </Badge>
              </Inline>
            </Inline>
          </Inline>

          <Tooltip
            content={
              <Box padding={2}>
                <Text muted size={1}>
                  {new Date(attempt.createdAt).toLocaleString()}
                </Text>
              </Box>
            }
            fallbackPlacements={['right', 'left']}
            placement="top"
            portal
          >
            <Inline>
              <Text size={1}>
                <CalendarIcon style={{ marginLeft: 0, marginRight: 4 }} />
                {formatDistance(new Date(attempt.createdAt), new Date(), {
                  addSuffix: true
                })}
              </Text>
            </Inline>
          </Tooltip>
        </Flex>

        <Flex justify="space-between" align="flex-end" gap={3}>
          <Stack space={4}>
            {attempt.failureReason && (
              <BadgeRow
                heading="Failure Reason"
                badges={[attempt.failureReason]}
                tone="critical"
              />
            )}

            <WebhookBody attempt={attempt} />
          </Stack>

          <Button
            fontSize={1}
            icon={CodeIcon}
            mode="ghost"
            padding={3}
            aria-label="Response"
            text="Response"
            onClick={() => setShowResponse(!showResponse)}
          />
        </Flex>

        {showResponse && (
          <Card padding={[3, 3, 4]} radius={2} tone="primary">
            <Code style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
              {attempt.resultIsJson
                ? JSON.stringify(attempt.resultBody, null, 2)
                : attempt.resultBody}
            </Code>
          </Card>
        )}
      </Stack>
    </Card>
  );
}
