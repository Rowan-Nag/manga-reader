import './Main.css'
import Searcher from '../Searcher/Searcher'
import * as History from "../History/History";
function Main(){
    return(
        <div className="Main">
            
            <Searcher></Searcher>
            <History.HistoryBar></History.HistoryBar>

            

            
        </div>
    )
}

export default Main