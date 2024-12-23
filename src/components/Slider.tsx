import { useState, useEffect } from "react";

const images = [
	"https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
	"https://images.pexels.com/photos/1300975/pexels-photo-1300975.jpeg?auto=compress&cs=tinysrgb&w=600",
	"https://images.pexels.com/photos/533353/pexels-photo-533353.jpeg?auto=compress&cs=tinysrgb&w=600",
];

const Slider = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	// Automatically update the slide every 3 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
		}, 3000);

		return () => clearInterval(interval); // Clear interval on component unmount
	}, []);

	return (
		<div className='slider'>
			<div
				className='slider-images'
				style={{ transform: `translateX(-${currentIndex * 100}%)` }}>

				{images.map((image, index) => (
					<img
					    src={image}
						key={index}
						alt={`Slide ${index + 1}`}
						className='slider-image'
					/>
				))}

			</div>
			<div className='slider-dots'>
				{images.map((_, index) => (
					<span
						key={index}
						className={`dot ${
							currentIndex === index ? "active" : ""
						}`}
						onClick={() => setCurrentIndex(index)} // Manual slide navigation
					/>
				))}
			</div>
		</div>
	);
};

export default Slider;
