import React, { useState, useEffect } from 'react'
import Loader from './Loader'
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {

    const [articles, setarticles] = useState([])
    const [loading, setloading] = useState(false)
    const [Page, setPage] = useState(1)
    const [totalArticles, settotalArticles] = useState(0)

    
    const updateNews = async () => {
        props.setProgress(10)
        let url = `https://newsapi.org/v2/top-headlines?country=in&category=${props.category}&apiKey=687fd619ebcd4209baf5b4e94d04ec5b&page=${Page}&pageSize=${props.pageSize}`
        let data = await fetch(url)
        props.setProgress(30)
        let parsedData = await data.json()
        props.setProgress(70)

        setarticles(parsedData.articles)
        settotalArticles(parsedData.totalResults)
        setloading(false)

        props.setProgress(100)
    }

    useEffect(() => {
        updateNews()
    }, [])
    



    const fetchMoreData = async () => {

        setPage(Page + 1)
        let url = `https://newsapi.org/v2/top-headlines?country=in&category=${props.category}&apiKey=687fd619ebcd4209baf5b4e94d04ec5b&page=${Page}&pageSize=${props.pageSize}`
        setloading(true)
        let data = await fetch(url)
        let parsedData = await data.json()
        setarticles(articles.concat(parsedData.articles))
        settotalArticles(parsedData.totalResults)
        setloading(false)
    }



        return (
            <>
                <h1 className="text-center my-4">NewsDaily - Top Headlines</h1>
                <div className="my-3 text-center">
                    {loading && <Loader />}
                </div>
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalArticles}
                    loader={loading && <Loader />}
                >
                    <div className="container">


                        <div className="row">
                            {articles.map((element) => {
                                return <div className="col-md-4 mb-3" key={element.url}>
                                    <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""} imageUrl={!element.urlToImage ? "https://images.moneycontrol.com/static-mcnews/2021/06/Sensex-2-770x433.jpg" : element.urlToImage} url={element.url} author={element.author ? element.author : "Unknown"} date={element.publishedAt ? element.publishedAt : ""} source={element.source.name ? element.source.name : ""} />
                                </div>
                            })}
                        </div>
                    </div>
                </InfiniteScroll>

            </>
        )
    }


    News.defaultProps = {
        pageSize: 8,
    }

    News.propTypes = {
        pageSize: PropTypes.number,
    }

export default News


