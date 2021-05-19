import { useEffect, useState } from 'react'
import './Reader.css'

import Chapter from "../../components/Chapter/Chapter"

function Reader(props){
    const [visibility, setVisibility] = useState(props.visibility)

    useEffect(()=>{
        //console.log("setting visibility to " + props.visibility)
        setVisibility(props.visibility)
    }, [props.visibility])




    return(
        <div className="Reader" style={{display: visibility}}>
            <div className="ReaderSidebar">
                <div className="ReaderBackButton" onClick={()=>{setVisibility('none');props.setReaderVisibility('none')}}> &lt;--</div>
                <div className="ReaderChapterInfo">
                    {()=>{if(props.ch != null){return props.ch.data.attributes.title}}}
                </div>
                <div className="NavigationButtons">
                    <div>Previous Chapter</div>
                    <p></p>
                    <div>Next Chapter</div>
                   
                </div>
            </div>
            <div className="ReaderMain">
                
                {(props.ch) ? (<Chapter data={props.ch.data}/>) : (<div>No Chapter Loaded</div>)}

            </div>
        </div>
    )
}

export default Reader