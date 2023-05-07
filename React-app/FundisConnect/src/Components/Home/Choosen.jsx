import Choose from './Choose'

export default function Choosen(){
    return (
        <>
        <div className="choosen">
                <h3 className="choosen--prompt">Why Choose us?</h3>
                <div className="reason">
                    < Choose 
                    reason="Convenience"
                    explanation="Connect you with artisan nearest to you"
                    />
                      < Choose 
                    reason="Preference"
                    explanation="Choose your preferred artisan after viewing their detailed profile and customer reviews"
                    />
                      < Choose 
                    reason="Skilled and Vetted Artisans"
                    explanation="All artisans on the platform are vetted for skills, reliability and integrity"
                    />
                </div>
        </div>
        </>
    )
}