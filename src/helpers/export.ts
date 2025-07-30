import { Data } from "@/types";
import JSZip from "jszip";

const EXPORT_VERSION = "1.0.0";

export const exportPhotosWithJson = async (
  data: Data[],
  photoAngleValues: any[] = []
) => {
  const zip = new JSZip();

  const appInfo = {
    version: EXPORT_VERSION,
    date: new Date().toISOString(),
  };
  zip.file("appinfo.json", JSON.stringify(appInfo, null, 2));

  for (let i = 0; i < data.length; i++) {
    const dataItem = data[i];
    try {
      const filePath = dataItem.file.webkitRelativePath || dataItem.file.name;
      const pathParts = filePath.split("/");
      const fileName = pathParts.pop() || dataItem.file.name;
      const folderPath = pathParts.join("/");

      const match = fileName.match(/(.+)\.([^/.]+)$/);
      const baseName = match ? match[1] : fileName;
      let extension = match ? match[2] : "png";

      if (extension === null) extension = "png";

      const imageFilePath = folderPath
        ? `${folderPath}/${baseName}.${extension}`
        : `${baseName}.${extension}`;
      const jsonFilePath = folderPath
        ? `${folderPath}/${baseName}.json`
        : `${baseName}.json`;

      const objectUrl = URL.createObjectURL(dataItem.file);
      const imageBlob = await fetch(objectUrl).then((r) => r.blob());
      URL.revokeObjectURL(objectUrl);

      zip.file(imageFilePath, imageBlob);

      const photoAngleValue = photoAngleValues[i] || { angles: [] };
      const jsonData = {
        angle: dataItem.angle,
        filename: dataItem.angle?.filename || dataItem.file.name,
        isFlipped: dataItem.isFlipped,
        usedAngle: dataItem.usedAngle,
        lastSelectedAngleTool: dataItem.lastSelectedAngleTool,
        originalPath: filePath,
        angleValues: photoAngleValue.angles || [],
      };
      zip.file(jsonFilePath, JSON.stringify(jsonData, null, 2));
    } catch (error) {
      console.error(`Error processing data item:`, error);
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const zipUrl = URL.createObjectURL(zipBlob);
  const zipLink = document.createElement("a");
  zipLink.href = zipUrl;
  zipLink.download = "exported_files.zip";
  document.body.appendChild(zipLink);
  zipLink.click();
  document.body.removeChild(zipLink);
  URL.revokeObjectURL(zipUrl);
};
