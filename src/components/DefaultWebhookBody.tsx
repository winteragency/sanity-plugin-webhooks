import { WebhookBodyComponentProps } from '../types/WebhookBodyComponentProps';
import { BadgeRow } from './BadgeRow';

export function DefaultWebhookBody({ attempt }: WebhookBodyComponentProps) {
  return <BadgeRow heading="ID" badges={[attempt.id]} />;
}
