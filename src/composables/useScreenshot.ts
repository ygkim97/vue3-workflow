import { type Ref, ref } from "vue";
import { toJpeg as ElToJpg, toPng as ElToPng } from "html-to-image";
import type { Options as HTMLToImageOptions } from "html-to-image/es/types";

type ImageType = "jpeg" | "png";
type CaptureScreenshot = (el: HTMLElement, options?: UseScreenshotOptions) => Promise<object>;
type Download = (fileName: string) => void;

interface UseScreenshotOptions extends HTMLToImageOptions {
  type?: ImageType;
  fileName?: string;
  shouldDownload?: boolean;
  fetchRequestInit?: RequestInit;
  isNodeDataOnly?: boolean;
}

interface UseScreenshot {
  // returns the data url of the screenshot
  capture: CaptureScreenshot;
  download?: Download;
  dataUrl?: Ref<string>;
  error?: Ref;
}

// TODO: edgePath 가 자꾸 노출됨. 이슈 해결 필요.
export default function useScreenshot(): UseScreenshot {
  const dataUrl = ref<string>("");
  const imgType = ref<ImageType>("png");
  const error = ref();

  const capture = async (el: HTMLElement, options: UseScreenshotOptions = {}) => {
    const fileName = options.fileName ?? `vue-flow-screenshot-${Date.now()}`;

    const data = await convertToImage(el, {
      filter: (node) => {
        // 캡처 제외 대상 제거
        const exclude = options.isNodeDataOnly ? [".vue-flow__panel"] : [];
        return !exclude.some((sel) => node instanceof HTMLElement && node.matches(sel));
      }
    });

    if (options.shouldDownload && fileName !== "") {
      download(fileName);
    }

    return data;
  };

  const convertToImage = async (el: HTMLElement, options: UseScreenshotOptions): Promise<any> => {
    switch (options.type) {
      case "jpeg":
        return await toJpeg(el, options);
      case "png":
      default:
        return await toPng(el, options);
    }
  };

  const toJpeg = (el: HTMLElement, options: HTMLToImageOptions = { quality: 0.95 }) => {
    error.value = null;

    return ElToJpg(el, options)
      .then((data) => {
        dataUrl.value = data;
        imgType.value = "jpeg";
        return data;
      })
      .catch((error) => {
        error.value = error;
        throw new Error(error);
      });
  };

  const toPng = (el: HTMLElement, options: HTMLToImageOptions = { quality: 0.95 }) => {
    error.value = null;

    return ElToPng(el, options)
      .then((data) => {
        dataUrl.value = data;
        imgType.value = "png";
        return data;
      })
      .catch((error) => {
        error.value = error;
        throw new Error(error);
      });
  };

  const download = (fileName: string) => {
    const link = document.createElement("a");
    link.download = `${fileName}.${imgType.value}`;
    link.href = dataUrl.value;
    link.click();
  };

  return {
    capture,
    download,
    dataUrl,
    error
  };
}
