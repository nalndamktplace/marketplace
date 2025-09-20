import { useEffect, useState } from "react";
import { isUsable } from "../utils/getUrls";

const TocPanel = ({
  rendition,
  onGoto = () => {},
  onSelect = () => {},
}: any) => {
  const [tocItems, setTocItems] = useState([]);

  useEffect(() => {
    if (!isUsable(rendition)) return;
    if (!isUsable(rendition.book)) return;
    rendition.book.loaded.navigation.then(({ toc }: any) => {
      const toc_ = toc.map((t: any) => ({ label: t.label, href: t.href }));
      setTocItems(toc_);
    });
  }, [rendition]);

  const renderTOCItems = () => {
    const domItems = [];
    if (!isUsable(rendition)) return "";
    tocItems.forEach((item: any, i) => {
      domItems.push(
        <div
          key={i}
          className="p-1 transition-all rounded-md hover:bg-slate-300 "
          onClick={() => gotoTOCItem(`${item?.href}`)}
        >
          <div className="text-xl font-medium leading-loose ">{item.label}</div>
        </div>
      );
    });
    if (domItems.length === 0)
      domItems.push(
        <div key="empty" className="panel__empty">
          No Items
        </div>
      );
    return domItems;
  };

  const gotoTOCItem = (cfi: any) => {
    onSelect();
    if (!isUsable(rendition)) return;
    rendition.display(cfi);
    rendition.display(cfi);
    onGoto();
  };

  return <div className="text-black panel">{renderTOCItems()}</div>;
};

export default TocPanel;
