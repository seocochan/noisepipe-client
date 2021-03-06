export enum Tab {
  Viewer = 'VIEWER',
  Editor = 'EDITOR',
}
export enum Provider {
  Youtube = 'YOUTUBE',
  Soundcloud = 'SOUNDCLOUD',
}

export type CueFormProps = {
  onAfterSubmit?: () => void;
  onCancel?: () => void;
};
