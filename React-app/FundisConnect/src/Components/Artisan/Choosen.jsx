import Choose from '../Home/Choose'

export default function Choosen(){
    return (
        <>
        <div className="choosen">
                <h3 className="choosen--prompt">Benefits of Working with Us</h3>
                <div className="reason">
                    < Choose 
                    reason="Less Travel"
                    explanation="You will get connected to customers nearest to you"
                    />
                      < Choose 
                    reason="Boosted Online presence"
                    explanation="More customers who are online will know about your services thus more job requests"
                    />
                      < Choose 
                    reason="Gain credibility"
                    explanation="More customer will know you are reliable through other customers rating and reviewing your services"
                    />
                </div>
        </div>
        </>
    )
}