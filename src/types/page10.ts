export interface MessageContent {
  from: 'customer' | 'system' | 'owner';
  text: string;
  timestamp?: string;
}

export interface PhoneContent {
  type: 'sms';
  messages: MessageContent[];
}

export interface FlowElement {
  type: 'persona' | 'arrow' | 'phone' | 'labeledArrow';
  id: string;
}

export interface PersonaElement extends FlowElement {
  type: 'persona';
  icon: string;
  label: string;
  description?: string;
}

export interface ArrowElement extends FlowElement {
  type: 'arrow';
  direction?: 'right' | 'left' | 'up' | 'down';
}

export interface PhoneElement extends FlowElement {
  type: 'phone';
  title: string;
  content: PhoneContent;
}

export interface LabeledArrowElement extends FlowElement {
  type: 'labeledArrow';
  icon: string;
  label: string;
  description?: string;
  status?: 'success' | 'failed' | 'pending';
}

export type FlowElementUnion = PersonaElement | ArrowElement | PhoneElement | LabeledArrowElement;

export interface SubtitlePart {
  text: string;
  highlight: boolean;
}

export interface Page10Header {
  title: string;
  subtitle: SubtitlePart[];
}

export interface Page10Data {
  header: Page10Header;
  flow: FlowElementUnion[];
}