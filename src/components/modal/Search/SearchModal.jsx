import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'

import Button from '../../ui/Buttons/Button'
import Backdrop from '../../hoc/Backdrop/Backdrop'

import { hideModal, SHOW_SEARCH_MODAL } from '../../../store/actions/modal'

import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'
import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg'

import { isFilled } from '../../../helpers/functions'
import { BASE_URL } from '../../../config/env'
import axios from 'axios'
import { setSnackbar } from '../../../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../../../store/actions/spinner'

const Modal = ({
    title = '',
    open = false,
    toggleModal,
    children,
    cancellable,
}) => {
    const dispatch = useDispatch()

    useEffect(() => {
        window.document.documentElement.style.overflowY = open
            ? 'hidden'
            : 'auto'
    }, [open])

    const getClasses = () => {
        let classes = ['modal_search__wrapper']
        if (open) classes.push('modal__wrapper--open')
        else classes.push('modal__wrapper--close')
        return classes.join(' ')
    }

    return (
        <Backdrop show={open} hideOnClick={true}>
            <div className={getClasses()}>
                <div className="modal_search__header">
                    <div className="modal__wrapper__header__title typo__head--6">
                        {title}
                    </div>
                    <div className="modal__wrapper__header__close-button">
                        {cancellable ? (
                            <Button
                                type="icon"
                                className="modal_search__wrapper__close-icon"
                                onClick={() => dispatch(hideModal())}
                            >
                                <CloseIcon />
                            </Button>
                        ) : null}
                    </div>
                </div>
                <div className="modal_search__content">{children}</div>
            </div>
        </Backdrop>
    )
}

const SearchModal = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const ModalState = useSelector((state) => state.ModalState)
    const [Loading, setLoading] = useState(false)
    const [Show, setShow] = useState(false)
    const [SearchResults, setSearchResults] = useState([])
    const [SearchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (SearchQuery.length > 3 && SearchQuery.length < 16) {
            setLoading(true)
            axios({
                url: BASE_URL + '/api/book/search',
                method: 'GET',
                params: { query: SearchQuery },
            })
                .then((res) => {
                    if (res.status === 200) setSearchResults(res.data)
                    else dispatch(setSnackbar('NOT200'))
                })
                .catch((err) => {
                    dispatch(setSnackbar('ERROR'))
                })
                .finally(() => setLoading(false))
        }
    }, [dispatch, SearchQuery])

    useEffect(() => {
        if (ModalState.show === true && ModalState.type === SHOW_SEARCH_MODAL) {
            setShow(true)
        } else setShow(false)
    }, [ModalState])

    useEffect(() => {
        if(Loading) dispatch(showSpinner())
        else dispatch(hideSpinner())
    }, [Loading, dispatch])

    const modalCloseHandler = (state) => {
        if (state === false) dispatch(hideModal())
    }

    const getSearchResultsClasses = () => {
        let classes = ['modal_search__options']
        if (isFilled(SearchQuery) && SearchQuery.length > 3)
            classes.push('dropdown__options--open')
        return classes.join(' ')
    }

    const renderSearchResults = () => {
        let searchResultsDOM = []
        if (isFilled(SearchResults))
            SearchResults.forEach((result) => {
                searchResultsDOM.push(
                    <div
                        onClick={() => {
                            navigate('/book', { state: result })
                            setSearchQuery('')
                        }}
                        className="header__content__search__result"
                        key={result.id}
                    >
                        <img
                            src={
                                result.cover_public_url
                                    ? result.cover_public_url
                                    : result.cover
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
                                    'FREE'
                                ) : (
                                    <>
                                        <img
                                            src="https://imagedelivery.net/yOWneHxM1h9mu46Te3Yjwg/59c27d12-e4eb-4f74-7a6e-b33ba6537600/icon48"
                                            style={{
                                                width: 20,
                                                height: 20,
                                                objectFit: 'contain',
                                            }}
                                            alt="USDC"
                                        />
                                        &nbsp;{result.price}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })
        return searchResultsDOM
    }

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
                        <SearchIcon
                            width={24}
                            height={24}
                            stroke="currentColor"
                        />
                    </div>
                </div>
                <div className={getSearchResultsClasses()}>
                    {renderSearchResults()}
                </div>
            </Modal>
        </Backdrop>
    )
}

export default SearchModal
