import Hero from './Home/Hero'
import Choosen from './Artisan/Choosen'

export default function Artisan(){
    return(
        <>
        <div>
        < Hero
            message = "ARE YOU A SKILLED ARTISAN STRUGGLING TO FIND CUSTOMERS? JOIN US AND GET CONNECTED TO CLIENTS AND INCREASE YOUR INCOME" 
            action = "Get Started"
            image = "images/construction-man.jpg"
        />
        < Choosen />
        </div>
        </>
    )
}