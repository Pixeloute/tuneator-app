
export type FileStatus = "waiting" | "uploading" | "error" | "success";

export type FileWithPreview = {
  file: File;
  preview?: string;
  progress: number;
  status: FileStatus;
  error?: string;
};
