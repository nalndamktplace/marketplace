import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  hideSpinner,
  showSpinner,
} from "../../store/slice/spinnerManageReducer";
import { isUsable } from "../../utils/getUrls";
import { BASE_URL } from "../../api/constant";
import { Button, message } from "antd";

const AnnotationPanel = ({
  mobileView,
  preview,
  rendition,
  bookMeta,
  setRenderAnnotationItems,
  addAnnotationRef,
  onRemove = () => {},
  hideModal = () => {},
}: any) => {
  const { address } = useAccount();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [WalletAddress, setWalletAddress] = useState<any>(null);
  const [Loading, setLoading] = useState(false);
  const [Annotations, setAnnotations] = useState<any>([]);

  useEffect(() => {
    if (Loading) dispatch(showSpinner());
    else dispatch(hideSpinner());
  }, [Loading, dispatch]);

  useEffect(() => {
    if (!isUsable(mobileView) || mobileView === false) {
      if (
        // isUsable(!preview)  &&
        !preview
      ) {
        if (isUsable(address)) setWalletAddress(address);
        else navigate(-1);
      }
    }
  }, [navigate, preview, mobileView]);

  useEffect(() => {
    if (
      // isUsable(!preview) &&
      !preview &&
      isUsable(bookMeta) &&
      isUsable(WalletAddress) &&
      isUsable(rendition)
    ) {
      setLoading(true);
      axios({
        url: `${BASE_URL}/api/reader/annotations`,
        method: "GET",
        params: {
          bookAddress: bookMeta.book_address,
          ownerAddress: WalletAddress,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            const parsedAnnotations = JSON.parse(res.data.annotations) || [];
            setAnnotations(parsedAnnotations);
            parsedAnnotations.forEach((item: any) => {
              rendition.annotations.add(
                "highlight",
                item.cfiRange,
                {},
                () => {},
                "",
                {
                  fill: item.color,
                  "fill-opacity": "0.35",
                  "mix-blend-mode": "multiply",
                }
              );
            });
          } else message.error("Something went wrong");
        })
        .catch(() => {
          message.error("Something went wrong");
        })
        .finally(() => setLoading(false));
    }
  }, [bookMeta, WalletAddress, dispatch, rendition, preview]);

  const renderAnnotationItems = () => {
    const domItems = [];
    if (!isUsable(rendition)) return "";
    if (!isUsable(bookMeta)) return "";

    console.log(Annotations, "AnnotationsAnnotationsAnnotations");
    Annotations.forEach((item: any, i: any) => {
      domItems.push(
        <div
          key={i}
          className="panel__annotation__item"
          onClick={() => gotoPage(item.cfiRange)}
        >
          <div className="panel__annotation__item__container">
            <div
              className="panel__annotation__item__color"
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="panel__annotation__item__name">{item.text}</div>
          </div>
          <Button
            onClick={(e: any) => {
              e.stopPropagation();
              removeAnnotation(i, item);
            }}
          >
            remove
          </Button>
        </div>
      );
    });
    if (domItems.length === 0)
      domItems.push(
        <div key="empty" className="text-black">
          No Items
        </div>
      );
    setRenderAnnotationItems(domItems);
    return domItems;
  };

  const removeAnnotation = (itemIndex: any, item: any) => {
    if (
      // isUsable(!preview) &&
      !preview &&
      isUsable(bookMeta) &&
      isUsable(WalletAddress) &&
      isUsable(rendition)
    ) {
      if (!isUsable(rendition)) return;
      if (!isUsable(bookMeta)) return;
      setLoading(true);
      const newAnnotations = Annotations.filter(
        (_: any, i: any) => i !== itemIndex
      );
      axios({
        url: `${BASE_URL}/api/reader/annotations`,
        method: "POST",
        data: {
          bookAddress: bookMeta.book_address,
          ownerAddress: WalletAddress,
          annotations: JSON.stringify(newAnnotations),
        },
      })
        .then((res) => {
          if (res.status === 200) {
            setAnnotations(newAnnotations);
            rendition.annotations.remove(item.cfiRange, "highlight");
            onRemove();
          } else message.error("Something went wrong");
        })
        .catch(() => {
          message.error("Something went wrong");
        })
        .finally(() => setLoading(false));
    }
  };

  const gotoPage = (cfi: any) => {
    if (!isUsable(rendition)) return;
    rendition.display(cfi);
    rendition.display(cfi);
    hideModal();
  };

  const addAnnotaion = useCallback(
    (annotation: any) => {
      if (
        // isUsable(preview) &&
        !preview &&
        isUsable(bookMeta) &&
        isUsable(WalletAddress) &&
        isUsable(rendition)
      ) {
        if (!isUsable(rendition)) return;
        if (!isUsable(bookMeta)) return;
        setLoading(true);
        const newAnnotations = [...Annotations, annotation];
        axios({
          url: `${BASE_URL}/api/reader/annotations`,
          method: "POST",
          data: {
            bookAddress: bookMeta.book_address,
            ownerAddress: WalletAddress,
            annotations: JSON.stringify(newAnnotations),
          },
        })
          .then((res) => {
            if (res.status === 200) {
              setAnnotations(newAnnotations);
              rendition.annotations.add(
                "highlight",
                annotation.cfiRange,
                {},
                () => {},
                "",
                {
                  fill: annotation.color,
                  "fill-opacity": "0.35",
                  "mix-blend-mode": "multiply",
                }
              );
            } else message.error("Something went wrong");
          })
          .catch(() => {
            message.error("Something went wrong");
          })
          .finally(() => setLoading(false));
      }
    },
    [Annotations, WalletAddress, bookMeta, rendition, preview]
  );

  console.log(
    addAnnotationRef,
    "addAnnotationRefaddAnnotationRefaddAnnotationRef"
  );
  useEffect(() => {
    console.log(
      "addAnnotationRef in AnnotationPanel: ",
      addAnnotationRef.current
    );
    addAnnotationRef.current = addAnnotaion;
  }, [addAnnotationRef, addAnnotaion]);

  useEffect(() => {
    renderAnnotationItems();
  }, [Annotations]);
  // useEffect(() => {
  //   // if (addAnnotationRef) {
  //   addAnnotationRef.current = addAnnotaion;
  //   // }
  // }, [addAnnotationRef, addAnnotaion]);

  return null;
  // return (
  //   <div className="p-1 overflow-y-auto text-gray-800 panel panel__annotation">
  //     {renderAnnotationItems()}
  //   </div>
  // );
};

export default AnnotationPanel;
