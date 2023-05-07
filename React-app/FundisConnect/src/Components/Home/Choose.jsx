export default function Choose(props){
    return (
        <>
        <div class="reason--listed">
            <p class="reason--stated">{props.reason}</p>
            <p class="reason--explained">{props.explanation}</p>
        </div>        
        </>
    )
}