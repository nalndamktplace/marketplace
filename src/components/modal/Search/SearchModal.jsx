import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import Modal from "../../hoc/Modal/Modal";
import Button from "../../ui/Buttons/Button";
import InputField from "../../ui/Input/Input";
import Backdrop from "../../hoc/Backdrop/Backdrop";

import { hideModal, SHOW_SEARCH_MODAL } from "../../../store/actions/modal";

import { ReactComponent as SearchIcon } from "../../../assets/icons/search.svg";
import GaTracker from "../../../trackers/ga-tracker";
import { FEEDBACK_CATEGORIES } from "../../../config/feedbackCategory";
import { isFilled, isUsable } from "../../../helpers/functions";
import { BASE_URL } from "../../../config/env";
import axios from "axios";
import { setSnackbar } from "../../../store/actions/snackbar";

const SearchModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ModalState = useSelector((state) => state.ModalState);
  const [Show, setShow] = useState(false);
  const [SearchResults, setSearchResults] = useState([]);
  const [SearchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (ModalState.show === true && ModalState.type === SHOW_SEARCH_MODAL) {
      setShow(true);
    } else setShow(false);
  }, [ModalState]);

  const modalCloseHandler = (state) => {
    if (state === false) dispatch(hideModal());
  };

  // const getSearchBarClasses = () => {
  //   let classes = ["header__content__search dropdown"];
  //   if (isFilled(SearchQuery) && SearchQuery.length > 3)
  //     classes.push("dropdown--open");
  //   return classes.join(" ");
  // };

  const getSearchResultsClasses = () => {
    let classes = ["dropdown__options"];
    if (isFilled(SearchQuery) && SearchQuery.length > 3)
      classes.push("dropdown__options--open");
    return classes.join(" ");
  };

  const renderSearchResults = () => {
    let searchResultsDOM = [];
    if (isFilled(SearchResults))
      SearchResults.forEach((result) => {
        searchResultsDOM.push(
          <div
            onClick={() => {
              navigate("/book", { state: result });
              setSearchQuery("");
            }}
            className="header__content__search__result"
            key={result.id}
          >
            <img
              src={
                result.cover_public_url ? result.cover_public_url : result.cover
              }
              alt={result.title + "'s Cover"}
              className="header__content__search__result__cover"
              loading="lazy"
            />
            <div className="header__content__search__result__info">
              <div className="header__content__search__result__info__name typo__head typo__subtitle typo__transform--capital">
                {result.title}
              </div>
              <div className="header__content__search__result__info__author typo__subtitle typo__subtitle--2 typo__transform--upper">
                {result.author}
              </div>
              <div className="index__collection__books__item__data__price typo__act typo__color--success">
                {result.price === 0 ? (
                  "FREE"
                ) : (
                  <>
                    <img
                      src="https://imagedelivery.net/yOWneHxM1h9mu46Te3Yjwg/59c27d12-e4eb-4f74-7a6e-b33ba6537600/icon48"
                      style={{ width: 20, height: 20, objectFit: "contain" }}
                      alt="USDC"
                    />
                    &nbsp;{result.price}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      });
    return searchResultsDOM;
  };

  return (
    <Backdrop show={Show}>
      <Modal
        title="Search"
        open={Show}
        toggleModal={modalCloseHandler}
        cancellable
      >
        <div className="modal_search">
          <input
            value={SearchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search books and authors"
            className="modal_search__input"
          />
          <div className="modal_search__icon">
            <SearchIcon width={24} height={24} stroke="currentColor"  />
          </div>
          <div className={getSearchResultsClasses()}>
            {renderSearchResults()}
          </div>
        </div>
      </Modal>
    </Backdrop>
  );
};

export default SearchModal;
