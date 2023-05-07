import Service from './Service'

export default function Services(){
    return (
        <>
        <div className="services">
                <h3 className="services--title">Our Services</h3>
                <div>
                    < Service
                    default_picture = "images/electrician.jpg"
                    title = "Electrical Works"
                    description = "Include electrical wiring, installations and repairs."
                    />
                    < Service
                    default_picture = "images/carpenter.jpg"
                    title = "Carpentry"
                    description = "Include furniture construction and repairs, woodworks and house projects."
                    />
                    < Service
                    default_picture = "images/plumbing.jpg"
                    title = "Plumbing"
                    description = "Include fixing broken pipes, repairing sinks, fixing showers and roof gutterings."
                    />
                    < Service
                    default_picture = "images/masonry.jpg"
                    title = "Masonry"
                    description = "Include building additional walls, fixing broken walls and house construction projects."
                    />
                    < Service
                    default_picture = "images/tile_installation.jpg"
                    title = "Tile Installation and Repairs"
                    description = "Include installing new tiles and replacing broken tiles."
                    />
                    < Service
                    default_picture = "images/wall_painting.jpg"
                    title = "Painting"
                    description = "Include painting walls and the roof to give the home a new fresh look."
                    />
                </div>
            </div>
        </>
    )
}