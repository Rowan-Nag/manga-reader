
import './Reader.css'

import Chapter from "../../components/Chapter/Chapter"
import { useState } from 'react'

function Reader(props){

    const [currentChapter, setCurrentChapter] = useState(props.ch.data.attributes.chapter)
    
    let nextChapter = ()=>{
        if(currentChapter+1 < props.chFeed.length){
            setCurrentChapter(currentChapter-1+2)
        }
        else{
            props.toggleReader();
        }
    }
    let prevChapter = ()=>{
        if(currentChapter > 1){
            setCurrentChapter(currentChapter-1)
        }else{
            props.toggleReader();
        }
    }

    let chData = props.chFeed[currentChapter-1].data;
    console.log(chData)
    return(
        <div className="Reader">
            <div className="ReaderSidebar">
                <div className="ReaderSidebarContent">
                    <div className="ReaderBackButton" onClick={props.toggleReader}> &lt;--</div>
                    <div className="ReaderChapterInfo">
                        <b>{props.manga} </b><br/>
                        Chapter {chData.attributes.chapter}, <br/>
                        Volume {chData.attributes.volume}, <br/>
                        {chData.attributes.title}
                    </div>
                    <div className="NavigationButtons">
                        <div onClick={prevChapter}>Previous Chapter</div>
                        <p></p>
                        <div onClick={nextChapter}>Next Chapter</div>
                    
                    </div>
                </div>
            </div>
            <div className="ReaderMain">
                
                {(props.ch) ? (<Chapter data={chData}/>) : (<div>No Chapter Loaded</div>)}

            </div>
        </div>
    )
}

export default Reader