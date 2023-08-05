export interface ImageFile {
  name: string;
  path: string;
  type?: string;
  size?: number;
  lastModified?: number;
  encodingStatus: 'pending' | 'succeeded' | 'failed';
}
