import Hero from './Home/Hero'
import Choosen from './Home/Choosen'
import Services from './Home/Services'
import Testimonials from './Home/Testimonials'
import '../Styles/Hero.css'
import '../Styles/Choose.css'
import '../Styles/Services.css'
import '../Styles/Testimonials.css'

export default function Home(){
    return(
        <>
        <div>
            < Hero
            message = "NEED PROPERTY REPAIR OR RENOVATIONS AT HOME OR AT THE WORK PLACE, AN ARTISAN IS JUST A CLICK AWAY" 
            action = "Connect to an Artisan"
            image = "images/artisan.jpg"
            />
            < Choosen />
            < Services />
            < Testimonials />
        </div>
        </>
    )
}
