import { type Ref, ref } from "vue";
import domtoimage from "dom-to-image-more";

type ImageType = "jpeg" | "png";
type CaptureScreenshot = (el: HTMLElement, options?: UseScreenshotOptions) => Promise<object>;
type Download = (fileName: string) => void;

interface UseScreenshotOptions {
  type?: ImageType;
  fileName?: string;
  shouldDownload?: boolean;
  fetchRequestInit?: RequestInit;
  isNodeDataOnly?: boolean;
}

interface DomToImageOptions {
  bgcolor?: string;
  width?: number;
  height?: number;
  style?: { [key: string]: string };
  quality?: number; // Only for JPEG
  filter?: (node: Node) => boolean;
  imagePlaceholder?: string;
  cacheBust?: boolean;
  skipFonts?: boolean;
  skipAutoScale?: boolean;
  skipStyle?: boolean;
  fetchRequestInit?: RequestInit;
}

interface UseScreenshot {
  // returns the data url of the screenshot
  capture: CaptureScreenshot;
  download?: Download;
  dataUrl?: Ref<string>;
  error?: Ref;
}

export default function useScreenshot(): UseScreenshot {
  const dataUrl = ref<string>("");
  const imgType = ref<ImageType>("png");
  const error = ref();

  const capture = async (el: HTMLElement, options: UseScreenshotOptions = {}) => {
    const fileName = options.fileName ?? `vue-flow-screenshot-${Date.now()}`;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    try {
      const data = await convertToImage(el, {
        quality: 0.95,
        filter: (node: Node) => {
          return !(node instanceof HTMLElement && node.matches(".vue-flow__panel"));
        }
      });

      if (options.shouldDownload) {
        download(fileName);
      }

      return data;
    } catch (err) {
      console.error("이미지 생성 실패:", err);
      error.value = err;
    } finally {
      document.body.style.overflow = originalOverflow;
    }
  };

  const convertToImage = async (el: HTMLElement, options: any): Promise<any> => {
    switch (options.type) {
      case "jpeg":
        return await toJpeg(el, options);
      case "png":
      default:
        return await toPng(el, options);
    }
  };

  const toJpeg = (el: HTMLElement, options: DomToImageOptions) => {
    error.value = null;

    return domtoimage
      .toJPeg(el, options)
      .then((data: string) => {
        dataUrl.value = data;
        imgType.value = "jpeg";
        return data;
      })
      .catch((error: any) => {
        error.value = error;
        throw new Error(error);
      });
  };

  const toPng = (el: HTMLElement, options: DomToImageOptions) => {
    error.value = null;

    return domtoimage
      .toPng(el, options)
      .then((data: string) => {
        dataUrl.value = data;
        imgType.value = "png";
        return data;
      })
      .catch((error: any) => {
        error.value = error;
        throw new Error(error);
      });
  };

  const download = (fileName: string) => {
    if (!dataUrl.value) {
      console.warn("dataUrl이 비어 있어 다운로드할 수 없습니다.");
      return;
    }

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
