
import './Reader.css'

import Chapter from "../../components/Chapter/Chapter"

function Reader(props){




    return(
        <div className="Reader">
            <div className="ReaderSidebar">
                <div className="ReaderSidebarContent">
                    <div className="ReaderBackButton" onClick={props.toggleReader}> &lt;--</div>
                    <div className="ReaderChapterInfo">
                        {()=>{if(props.ch != null){return props.ch.data.attributes.title}}}
                    </div>
                    <div className="NavigationButtons">
                        <div>Previous Chapter</div>
                        <p></p>
                        <div>Next Chapter</div>
                    
                    </div>
                </div>
            </div>
            <div className="ReaderMain">
                
                {(props.ch) ? (<Chapter data={props.ch.data}/>) : (<div>No Chapter Loaded</div>)}

            </div>
        </div>
    )
}

export default Reader