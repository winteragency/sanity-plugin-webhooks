export interface SanityWebhookAttempt {
  id: string
  projectId: string
  inProgress: boolean
  duration: number | null
  createdAt: string
  updatedAt: string | null
  messageId: string
  hookId: string
  isFailure: boolean
  failureReason: string
  resultCode: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resultBody: any
  resultIsJson?: boolean
}
