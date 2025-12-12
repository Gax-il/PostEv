import JSZip from "jszip";
import { Data, PhotoAngleValues } from "../types";

export const importPhotosWithJson = async (
  file: File
): Promise<{ data: Data[]; photoAngleValues: PhotoAngleValues[] }> => {
  const zip = await JSZip.loadAsync(file);
  const newData: Data[] = [];
  const newPhotoAngleValues: PhotoAngleValues[] = [];

  const jsonFiles = Object.keys(zip.files).filter(
    (filename) =>
      filename.endsWith(".json") && !filename.includes("appinfo.json")
  );

  for (const jsonPath of jsonFiles) {
    try {
      const jsonContent = await zip.file(jsonPath)?.async("text");
      if (!jsonContent) continue;

      const metadata = JSON.parse(jsonContent);
      const baseName = jsonPath.replace(/\.json$/i, "");
      
      const extensions = ["png", "jpg", "jpeg", "webp"];
      let imageZipObject = null;
      let foundExt = "png";

      for (const ext of extensions) {
        const testPath = `${baseName}.${ext}`;
        if (zip.files[testPath]) {
          imageZipObject = zip.files[testPath];
          foundExt = ext;
          break;
        }
      }

      if (!imageZipObject) continue;

      const blob = await imageZipObject.async("blob");
      
      const reconstructedFile = new File(
        [blob], 
        metadata.filename || `${baseName.split('/').pop()}.${foundExt}`, 
        { type: `image/${foundExt === 'jpg' ? 'jpeg' : foundExt}` }
      );

      if (metadata.originalPath) {
        Object.defineProperty(reconstructedFile, "webkitRelativePath", {
          value: metadata.originalPath,
          writable: false,
        });
      }

      newData.push({
        file: reconstructedFile,
        angle: metadata.angle,
        isFlipped: metadata.isFlipped,
        usedAngle: metadata.usedAngle,
        lastSelectedAngleTool: metadata.lastSelectedAngleTool,
      });

      newPhotoAngleValues.push({
        name: metadata.filename,
        angles: metadata.angleValues || [],
      });
    } catch (error) {
      console.error(error);
    }
  }

  return { data: newData, photoAngleValues: newPhotoAngleValues };
};