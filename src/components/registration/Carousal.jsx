import { useEffect, useState } from 'react'
import DashboardImg from '../../assets/images/dashboardImg.png'
import '../../assets/styles/registration/carousal.css'

function RegistrationCarousal() {
    const [currentSlide, setCurrentSlide] = useState(0)

    const carouselData = [
        {
            image: DashboardImg,
            title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
            description: "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            image: DashboardImg,
            title: "Lorem 2 ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
            description: "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            image: DashboardImg,
            title: "Lorem 3 ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
            description: "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselData.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [carouselData.length])

    const goToSlide = (index) => {
        setCurrentSlide(index)
    }

    return (
        <div className='carousel-container'>
            <div className='image-container'>
                <img
                    src={carouselData[currentSlide].image}
                    alt="dashboard"
                    className='carousel-image'
                />
            </div>
            <div className='content-container'>
                <p className='carousel-title'>
                    {carouselData[currentSlide].title}
                </p>
                <p className='carousel-description'>
                    {carouselData[currentSlide].description}
                </p>
            </div>

            {/* Carousel dots */}
            <div className='dots-container'>
                {carouselData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`carousel-dot ${currentSlide === index ? 'active' : 'inactive'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default RegistrationCarousal
