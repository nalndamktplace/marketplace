import axios from 'axios'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import React, { useEffect, useState } from 'react'

import Page from '../components/hoc/Page/Page'
import Button from '../components/ui/Buttons/Button'
import StatsMarquee from '../components/ui/StatsMarquee/StatsMarquee'

import {Carousel} from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { setSnackbar } from '../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

import GaTracker from '../trackers/ga-tracker'
import { BASE_URL } from '../config/env'
import { isFilled, isUsable } from '../helpers/functions'

const IndexPage = (props) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [IsLoading, setIsLoading] = useState(false)
    const [Collections, setCollections] = useState([])
    const [CollectionBooks, setCollectionBooks] = useState([])
    const [Genres, setGenres] = useState([])
    const [MediumData, setMediumData] = useState([])

    const openHandler = (nft) => {
        GaTracker('navigate_index_book')
        navigate(`/book/${nft.id}`)
    }

    const renderGenres = () => {
        const renderNfts = (books, collection) => {
            let booksDOM = []

            if (isFilled(books)) {
                books.forEach((book) => {
                    booksDOM.push(
                        <div
                            className="index__collection__books__item"
                            key={book.id + '|' + collection.id}
                            onClick={() => openHandler(book)}
                        >
                            <img
                                src={
                                    book.cover_public_url
                                        ? book.cover_public_url
                                        : book.cover
                                }
                                alt={book.name}
                                className="index__collection__books__item__cover"
                                loading="lazy"
                            />
                            <div className="index__collection__books__item__data">
                                <p className="index__collection__books__item__data__name typo__head typo__head--6">
                                    {(book?.title || '').slice(0, 40)}
                                    {book?.title?.length > 40 && '...'}
                                </p>
                                <p className="index__collection__books__item__data__author typo__subtitle">
                                    {book.author}
                                </p>
                                <div className="index__collection__books__item__data__price typo__act typo__color--success">
                                    {book.price === 0 ? (
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
                                            &nbsp;{book.price}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            return booksDOM
        }

        let collectionsDOM = []
        if (isFilled(Genres)) {
            Genres.forEach((collection) => {
                collectionsDOM.push(
                    <div className="index__collection" key={collection.id}>
                        <div className="index__collection__header">
                            <h4 className="typo__head typo__head--4 index__collection__header__title typo__transform--capital">
                                {collection.name}
                            </h4>
                        </div>

                        <div className="index__collection__books">
                            <div className="index__collection__books__wrapper">
                                {renderNfts(collection.books, collection)}
                            </div>
                        </div>
                    </div>
                )
            })
        }
        return collectionsDOM
    }

    const renderCollections2 = () => {
        const renderCollection = (collection) => {
            let collectionDOM = []
            if (isUsable(collection) && isFilled(collection.books)) {
                collection.books.forEach((book) => {
                    if (collectionDOM.length < 3)
                        collectionDOM.push(
                            <img
                                src={
                                    book.cover_public_url
                                        ? book.cover_public_url
                                        : book.cover
                                }
                                alt={book.title}
                                className="index__featured__container__row__item__container__image"
                                loading="lazy"
                            />
                        )
                })
            }
            return collectionDOM
        }

        let collectionsDOM = []
        if (isFilled(CollectionBooks)) {
            CollectionBooks.sort((a, b) => a.order > b.order).forEach(
                (collection) => {
                    collectionsDOM.push(
                        <div
                            onClick={() => {
                                GaTracker('navigate_index_collection')
                                navigate('/collection', {
                                    state: {
                                        id: collection.id,
                                        name: collection.name,
                                    },
                                })
                            }}
                            className="index__featured__container__row__item"
                            key={collection.id}
                        >
                            <div className="index__featured__container__row__item__container">
                                {renderCollection(collection)}
                            </div>
                            <div className="index__featured__container__row__item__title typo__head--5 typo__transform--capital">
                                {collection.name}
                            </div>
                        </div>
                    )
                }
            )
        }
        return collectionsDOM
    }

    const renderMediumArticles = () => {
        const renderCategories = (categories) => {
            let categoriesDOM = []
            categories.forEach((category) => {
                categoriesDOM.push(
                    <div className="index__medium__article__data__categories__item typo__body typo__body--2 typo__transform--capital">
                        {category}
                    </div>
                )
            })
            return categoriesDOM
        }

        let mediumArticlesDOM = []
        if (isFilled(MediumData.items))
            MediumData.items.slice(0, 3).forEach((item, index) => {
                mediumArticlesDOM.push(
                    <div
                        className="index__medium__article"
                        onClick={() => {
                            GaTracker('external_link_medium_article')
                            window.open(item.link, '_blank')
                        }}
                    >
                        <img
                            src={item.thumbnail.replace('1024', '512')}
                            alt={item.title}
                            className="index__medium__article__banner"
                            loading="lazy"
                        />
                        <div className="index__medium__article__data">
                            <h5 className="typo__head typo__head--6">
                                {item.title}
                            </h5>
                            <p className="typo__cap">
                                {moment(item.pubDate).format('DD MMM, YYYY')}
                            </p>
                            <div className="index__medium__article__data__categories">
                                {renderCategories(item.categories)}
                            </div>
                        </div>
                    </div>
                )
            })
        return mediumArticlesDOM
    }

    useEffect(() => {
        GaTracker('page_view_index')
    }, [])

    useEffect(() => {
        axios({
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@nalndamktplace',
            method: 'GET',
        })
            .then((res) => {
                if (res.status === 200) setMediumData(res.data)
            })
            .catch((err) => {})
    }, [])

    useEffect(() => {
        if (IsLoading) dispatch(showSpinner())
        else dispatch(hideSpinner())
    }, [dispatch, IsLoading])

    useEffect(() => {
        setIsLoading(true)
        axios({
            url: BASE_URL + '/api/collections/genres',
            method: 'GET',
        })
            .then((res) => {
                if (res.status === 200) setGenres(res.data)
            })
            .catch((err) => {})
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        setCollections([])
        setIsLoading(true)
        axios({
            url: BASE_URL + '/api/collections',
            method: 'GET',
        })
            .then((res) => {
                if (res.status === 200) setCollections(res.data)
            })
            .catch((err) => {})
            .finally(() => setIsLoading(false))
    }, [dispatch])

    useEffect(() => {
        if (isFilled(Collections)) {
            setCollectionBooks([])
            Collections.forEach((collection) => {
                setIsLoading(true)
                axios({
                    url:
                        BASE_URL +
                        '/api/collections/books?cid=' +
                        collection.id,
                    method: 'GET',
                })
                    .then((res) => {
                        if (res.status === 200)
                            setCollectionBooks((old) => [
                                ...old,
                                {
                                    id: collection.id,
                                    order: collection.order,
                                    name: collection.name,
                                    books: res.data,
                                },
                            ])
                        else dispatch(setSnackbar('NOT200'))
                    })
                    .catch((err) => {})
                    .finally(() => setIsLoading(false))
            })
        }
    }, [Collections, dispatch])

    return (
        <Page containerClass="index" fluid>
            <StatsMarquee />
            <Carousel showArrows={true} showStatus={false} autoPlay={true} showThumbs={false} infiniteLoop={true} transitionTime={1000} interval={5000}>
                <div style={{height: window.visualViewport.width/2.5, width: window.visualViewport.width}}>
                    <img alt={'banner'} style={{height: '100%', width: '100%', objectFit: 'cover'}} src="https://miro.medium.com/max/1400/1*Rv0RecX9Th90htNyv46TAw.png" />
                </div>
                <div style={{height: window.visualViewport.width/2.5, width: window.visualViewport.width}}>
                    <img alt={'banner'} style={{height: '100%', width: '100%', objectFit: 'cover'}} src="https://miro.medium.com/max/1400/1*Rv0RecX9Th90htNyv46TAw.png" />
                </div>
                <div style={{height: window.visualViewport.width/2.5, width: window.visualViewport.width}}>
                    <img alt={'banner'} style={{height: '100%', width: '100%', objectFit: 'cover'}} src="https://miro.medium.com/max/1400/1*Rv0RecX9Th90htNyv46TAw.png" />
                </div>
                <div style={{height: window.visualViewport.width/2.5, width: window.visualViewport.width}}>
                    <img alt={'banner'} style={{height: '100%', width: '100%', objectFit: 'cover'}} src="https://miro.medium.com/max/1400/1*Rv0RecX9Th90htNyv46TAw.png" />
                </div>
            </Carousel>
            <div className="index__featured">
                <div className="index__featured__container">
                    <div className="index__featured__container__row">
                        {renderCollections2()}
                    </div>
                </div>
            </div>
            <div className="index__section">{renderGenres()}</div>
            <div className="index__section">
                <div className="index__medium__header">
                    <h4 className="typo__head typo__head--4 index__collection__header__title typo__transform--capital">
                        {isUsable(MediumData.feed)
                            ? MediumData.feed.title
                            : 'Loading Stories By Nalnda...'}
                    </h4>
                    <Button
                        type="secondary"
                        onClick={() =>
                            window.open(
                                'https://nalndamktplace.medium.com/',
                                '_blank'
                            )
                        }
                    >
                        View More
                    </Button>
                </div>
                <div className="index__medium">{renderMediumArticles()}</div>
            </div>
        </Page>
    )
}

export default IndexPage
