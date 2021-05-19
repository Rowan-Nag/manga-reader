import '../Searcher/Searcher.css'
import ChapterList from "../ChapterList/ChapterList"
import MangaCard from "../../components/MangaCard/MangaCard"
import React, { useState } from 'react';

function Searcher(){

    const [searchQuery, setSearchQuery] = useState("frieren")
    const [manga, setManga] = useState([]);
    const [closeSymbol, setSymbol] = useState("+")
    const [readerData, setReaderData] = useState("");
    const [chapterListShown, setChapterListShown] = useState(false);

    let toggleVisible = ()=>{
        if(chapterListShown){
            setSymbol("+")
        }else{
            setSymbol("X")
        }
        console.log(chapterListShown)
        setChapterListShown(!chapterListShown);
       
    }

    let showChapterList = ()=>{
        console.log("ran")
        if(chapterListShown){
            console.log("loaded")
            return (<ChapterList data={readerData}/>)
        }else{
            return null
        }
    }

    let test = ()=>{
        return (<div>Hello.</div>)
    }

    let searchInput = (<input placeholder="frieren" onChange={e =>{setSearchQuery(e.target.value)}}></input>)
    let search = ()=>{
        fetch("https://api.mangadex.org/manga?title=" + searchQuery)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
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
                    
                },
                (error) => {
                    alert(error)
            }
            )
    }
    
    return(
        <div className="Searcher">
            {showChapterList()}
            Search for manga: <p></p>
            {searchInput}
            <button onClick={search}>Search</button>
            <div id="mangaContainer"><br/>{manga}</div>
            <div className="ListClose" onClick={toggleVisible}>{closeSymbol}</div>
        </div>
        
    )
}

export default Searcher