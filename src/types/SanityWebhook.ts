export interface SanityWebhook {
  type: 'document';
  rule: {
    on: ('create' | 'update' | 'delete')[];
    filter: string | null;
    projection: string | null;
  };
  filter: string | null;
  projection: string | null;
  apiVersion: string;
  httpMethod: string;
  includeDrafts: boolean;
  headers: Record<string, string | undefined>;
  secret: string | null;
  id: string;
  name: string;
  projectId: string;
  dataset: string;
  url: string;
  createdAt: string;
  createdByUserId: string;
  isDisabled: boolean;
  isDisabledByUser: boolean;
  deletedAt: string | null;
  description: string | null;
}
