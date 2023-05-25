export interface State {
  alfredClick: 'rest' | 'recording' | 'stoppingRecording' | 'processing' | 'pasting' | 'answering'
  clip: string
  stop?: () => void
  running: boolean
}

export interface Message {
  messageId?: string
  role: 'assistant' | 'user'
  content: string
}

export interface Conversation {
  conversationId?: string
  title?: string
  model: 'gpt-3.5-turbo' | 'gpt-4'
  messages: Message[]
}
export type PermaState = Conversation[];
