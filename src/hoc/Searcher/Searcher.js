import '../Searcher/Searcher.css'
//import ChapterList from "../ChapterList/ChapterList"
import ChapterFeed from "../ChapterFeed/ChapterFeed"
import MangaCard from "../../components/MangaCard/MangaCard"
import React, { useEffect, useState } from 'react';


import woosh from "../../res/WOOOSH.JPG" 

function Searcher(){

    const [searchQuery, setSearchQuery] = useState("frieren")
    const [manga, setManga] = useState([]);
    const [closeSymbol, setSymbol] = useState("+")
    const [readerData, setReaderData] = useState("");
    const [chapterListShown, setChapterListShown] = useState(false);
    const [coverFileName, setCoverFileName] = useState(null);
    let toggleVisible = ()=>{
        if(searchQuery){
            if(chapterListShown){
                setSymbol("+")
            }else{
                setSymbol("X")
            }
            //console.log(chapterListShown)
            setChapterListShown(!chapterListShown);
        }
    }

    let showChapterList = ()=>{
        if(chapterListShown){
            // return (<ChapterList data={readerData}/>)
            return (<ChapterFeed data={readerData}/>)
        }else{
            return null
        }
    }

    useEffect(()=>{
        
        let history = JSON.parse(localStorage.getItem('lastRead'));
        //console.log("https://api.mangadex.org/cover?manga[]="+history[0].mangaId)
        fetch("https://api.mangadex.org/cover?manga[]="+history[0].mangaId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              }
        }).then(res => res.json())
        .then(
            (result) => {
                
                //console.log(result)
                if(result.result === "error"){
                    result.errors.map(error=>{
                        console.error(error.status + " ERROR: " + error.detail)
                        return false;
                    })
                }
                else{
                    if(result.results[0]){
                        let file = result.results[0].data.attributes.fileName
                        setCoverFileName("https://uploads.mangadex.org/covers/" + history[0].mangaId + "/" + file)
                        console.log("file: " + file)
                    }
                }
            })
    }, [chapterListShown])

    let searchInput = (<input placeholder="frieren" onChange={e =>{setSearchQuery(e.target.value)}}></input>)
    let search = ()=>{
        fetch("https://api.mangadex.org/manga?title=" + searchQuery)
            .then(res => res.json())
            .then(
                (result) => {
                    
                    console.log(result)
                    if(result.result === "error"){
                        result.errors.map(error=>{
                            console.error(error.status + " ERROR: " + error.detail)
                            return false;
                        })
                    }
                    else{
                        setManga(result.results.map((manga)=>{
                            if(manga.data.attributes.contentRating === "safe"){
                                return(<MangaCard 
                                    data={manga.data} 
                                    setReaderData = {setReaderData} 
                                    toggleVisible = {toggleVisible}
                                    key = {manga.data.id} />)
                            }
                            return null
                        }))
                    }
                },
                (error) => {
                    alert(error)
            }
            )
    }
    
    return(
        <div className="Searcher">
            {showChapterList()}
            
            <br/>
            <div className="searchInputContainer">
                {searchInput}
                <button className="SearchButton" onClick={search}>Search</button>
            </div>
            
            <div className="SearchContainer"><br/>
            {manga}
                <div className="SearchIntro" >
                    {coverFileName && manga.length <= 0 ? <img className={"SearchCover"}src = {coverFileName} alt="n/a"/> : null}
                    {manga.length <= 0 ? <div className="SearchIntroPrompt">Kaku Reader <br/> Search for manga. <br/> Read manga. </div>: null}
                </div>
                
            </div>
            <div className="ListClose" onClick={toggleVisible}>{closeSymbol}</div>
        </div>
        
    )
}

export default Searcher