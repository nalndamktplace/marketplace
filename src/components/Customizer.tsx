import { useEffect, useState } from "react";

import { useCallback } from "react";
import { ReaderDefault, ReaderPreferenceOptions } from "../config/readerTheme";
import { isUsable } from "../utils/getUrls";
import NumberInput from "./NumberInput";

const Customizer = ({ rendition }: any) => {
  const [readerPreferences, setReaderPreferences] = useState({
    ...ReaderDefault,
    fontFamily: ReaderDefault.fontFamily.id,
    theme: ReaderDefault.theme.id,
  });

  const rerender = useCallback(() => {
    if (rendition) {
      try {
        const location = rendition?.currentLocation();
        rendition?.clear();
        rendition?.display(location.start.cfi);
      } catch (err) {
        console.error(err);
      }
    }
  }, [rendition]);

  const savePreferences = (readerPreferences: any) => {
    if (!window.localStorage) return;
    window.localStorage.setItem(
      "READER_PREFERENCES",
      JSON.stringify(readerPreferences)
    );
  };

  const loadSavedPreferences = () => {
    if (!window.localStorage) return {};
    try {
      const savedItem = JSON.parse(
        window?.localStorage?.getItem("READER_PREFERENCES") as any
      );
      return savedItem || {};
    } catch (err) {
      return {};
    }
  };

  useEffect(() => {
    const {
      fontSize = ReaderDefault.fontSize,
      lineHeight = ReaderDefault.lineHeight,
      fontFamily = ReaderDefault.fontFamily.id,
      theme = ReaderDefault.theme.id,
    } = loadSavedPreferences();
    setReaderPreferences({ fontSize, lineHeight, fontFamily, theme });
  }, []);

  useEffect(() => {
    if (!isUsable(rendition)) return;
    let selectedTheme: any = ReaderPreferenceOptions.themes.find(
      (s) => s.id === readerPreferences.theme
    );
    let selectedFontFamily: any = ReaderPreferenceOptions.fontFamily.find(
      (s) => s.id === readerPreferences.fontFamily
    );
    if (!isUsable(selectedTheme))
      selectedTheme = ReaderPreferenceOptions.themes[0];
    if (!isUsable(selectedFontFamily))
      selectedFontFamily = ReaderPreferenceOptions.fontFamily[0];
    rendition.themes.override("--font-size", readerPreferences.fontSize + "%");
    rendition.themes.override("--font-family", selectedFontFamily.value);
    rendition.themes.override("--line-height", readerPreferences.lineHeight);
    rendition.themes.override(
      "--background-color",
      selectedTheme.backgroundColor
    );
    rendition.themes.override("--color", selectedTheme.color);
    window.document.body.setAttribute("data-theme", selectedTheme.bodyTheme);
    // await rerender();
    savePreferences(readerPreferences);
  }, [readerPreferences, rendition, rerender]);

  const updateFontSize = (fontSize: any) => {
    setReaderPreferences((rp: any) => ({ ...rp, fontSize }));
  };

  const updateLineHeight = (lineHeight: any) => {
    setReaderPreferences((rp: any) => ({ ...rp, lineHeight }));
  };

  const setTheme = (theme = "reader-theme-light") => {
    setReaderPreferences((rp: any) => ({ ...rp, theme }));
  };

  const setFont = (fontFamily: any) => {
    setReaderPreferences((rp: any) => ({ ...rp, fontFamily }));
  };

  return (
    <div className="text-black">
      <div className="">
        <div className="text-lg font-medium">Font Size</div>
        <div className="">
          <NumberInput
            value={readerPreferences.fontSize}
            setValue={updateFontSize}
            unit="%"
            offset={ReaderPreferenceOptions.fontSize.offset}
            min={ReaderPreferenceOptions.fontSize.min}
            max={ReaderPreferenceOptions.fontSize.max}
            step={ReaderPreferenceOptions.fontSize.step}
          />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-lg font-medium">Line Spacing</div>
        <div className="">
          <NumberInput
            value={readerPreferences.lineHeight}
            setValue={updateLineHeight}
            min={ReaderPreferenceOptions.lineHeight.min}
            max={ReaderPreferenceOptions.lineHeight.max}
            step={ReaderPreferenceOptions.lineHeight.step}
          />
        </div>
      </div>
      <div className="">
        <div className="text-lg font-medium">Themes</div>
        <div className="flex gap-3">
          {ReaderPreferenceOptions.themes.map((theme) => (
            <div
              key={theme.id}
              className={
                "text-xl rounded-full w-10 h-10 items-center flex justify-center " +
                (readerPreferences.theme === theme.id
                  ? "border-2 border-primary"
                  : "")
              }
              onClick={() => setTheme(theme.id)}
              style={{
                color: theme.color,
                backgroundColor: theme.backgroundColor,
              }}
            >
              Aa
            </div>
          ))}
        </div>
      </div>
      <div className="">
        <div className="mt-4 text-lg font-medium">Fonts</div>
        <div className="flex flex-wrap gap-3 mt-4">
          {ReaderPreferenceOptions.fontFamily.map((ff) => (
            <div
              key={ff.id}
              className={
                "border-2 flex flex-col hover:bg-gray-100 cursor-pointer p-3 min-w-12 w-full max-w-24 mx-auto text-center" +
                (readerPreferences.fontFamily === ff.id
                  ? "  border-orange-300"
                  : "")
              }
              style={{ fontFamily: ff.value }}
              onClick={() => {
                setFont(ff.id);
              }}
            >
              <div className="text-xl font-medium text-center text-gray-800">
                Aa
              </div>
              <div className="text-xs text-center">{ff.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Customizer;
