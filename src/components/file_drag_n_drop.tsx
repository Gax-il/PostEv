import { cn } from "@/lib/utils";
import { UploadIcon } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileDragNDropProps {
  setFiles: (files: File[]) => void;
  disabled: boolean;
  open: boolean;
}

const FileDragNDrop = ({ setFiles, disabled, open }: FileDragNDropProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const imageFiles = acceptedFiles.filter((file) => {
        return file.type.startsWith("image/");
      });
      setFiles(imageFiles);
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/bmp": [],
      "image/webp": [],
    },
    noDragEventsBubbling: true,
  });

  return (
    <>
      {!disabled && !open && (
        <div
          {...getRootProps()}
          className="h-screen-dvw absolute bottom-0 left-0 right-0 top-0 w-screen-dvw">
          <input {...getInputProps()} className="h-full w-full" />
          <div className="flex h-full w-full items-center justify-center">
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl bg-card p-10 shadow-xl transition-all duration-200 ease-in-out",
                isDragActive ? "scale-100" : "scale-0"
              )}>
              <UploadIcon width={150} height={150} />
              <p>We are holding the photos</p>
              <p className="text-italic">You can drop them here</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileDragNDrop;
