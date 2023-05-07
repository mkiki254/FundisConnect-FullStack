import Button from 'react-bootstrap/Button'
import {Link} from 'react-router-dom'

export default function Hero(props){

    return (
        <>
        <div className="hero" style={{backgroundImage: `url(${props.image})`}}>
            <p className="hero--message">{props.message}</p>
            <Link to="/signup">
                <Button size="lg">{props.action}</Button>
            </Link>
        </div>
        </>
    )
}