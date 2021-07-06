import '../Searcher/Searcher.css'
//import ChapterList from "../ChapterList/ChapterList"
import ChapterFeed from "../ChapterFeed/ChapterFeed"
import MangaCard from "../../components/MangaCard/MangaCard"
import React, { useEffect, useState } from 'react';
import MangaFeed from "../MangaFeed/MangaFeed"

function Searcher(){

    const [searchQuery, setSearchQuery] = useState("a")
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
        if(history){
            //console.log("https://api.mangadex.org/cover?manga[]="+history[0].mangaId)
            fetch("https://lit-taiga-28516.herokuapp.com/https://api.mangadex.org/cover?manga[]="+history[0].mangaId, {
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
        }
    }, [chapterListShown])

    let searchInput = (<input placeholder="Search" onChange={e =>{setSearchQuery(e.target.value)}}></input>)
    let  search = async ()=>{
        let coverIds = null
        await fetch("https://lit-taiga-28516.herokuapp.com/https://api.mangadex.org/manga?title=" + searchQuery)
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
                        coverIds = result.results.map((entry)=>{
                            let cover = entry.relationships.filter((relationship)=>{
                                return relationship.type === "cover_art"
                            })
                            if(cover.length > 0){
                                return cover[0].id
                            }
                            return null
                            
                        })
                        
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

    let searchIntro = ()=>{
        let history = JSON.parse(localStorage.getItem('lastRead'));
        if(!history){
            return (
            <div className="SearchIntroInitial" >
                {manga.length <= 0 ? <MangaFeed setReaderData={setReaderData} toggleVisible={toggleVisible}/> : null}
                {manga.length <= 0 ? <div className="SearchIntroPrompt">Kaku Reader <br/> Search for manga. <br/> Read manga. </div>: null}
                
            </div>)
        }
        else{
            return (
            <div className="SearchIntro" >
                {coverFileName && manga.length <= 0 ? <img className={"SearchCover"}src = {coverFileName} alt="n/a"/> : null}
                {manga.length <= 0 ? <div className="SearchIntroPrompt">Kaku Reader <br/> Search for manga. <br/> Read manga. </div>: null}
                {manga.length <= 0 ? <MangaFeed setReaderData={setReaderData} toggleVisible={toggleVisible}/> : null}
            </div>)
        }
    }
    
    return(
        <div className="Searcher">
            {showChapterList()}
            
            <br/>
            <div className="searchInputContainer">
                {searchInput}
                <button className="SearchButton" onClick={search}>Search</button>
                <span>Kaku Reader</span>
            </div>
            
            <div className="SearchContainer"><br/>
            {manga}
                {searchIntro()}
                
            </div>
            <div className="ListClose" onClick={toggleVisible}>{closeSymbol}</div>
        </div>
        
    )
}

export default Searcher