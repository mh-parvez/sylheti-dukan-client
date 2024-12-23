import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
	const [isHovered, setIsHovered] = useState(false);

	const styles = {
		container: {
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			height: "100vh",
			backgroundColor: "#f8f9fa",
			color: "#343a40",
			textAlign: "center",
			fontFamily: "Arial, sans-serif",
		},
		icon: {
			fontSize: "5rem",
			color: "#dc3545",
			marginBottom: "20px",
		},
		heading: {
			fontSize: "2rem",
			marginBottom: "10px",
		},
		message: {
			fontSize: "1.2rem",
			marginBottom: "20px",
		},
		button: {
			padding: "10px 20px",
			fontSize: "1rem",
			color: "#fff",
			backgroundColor: isHovered ? "#0056b3" : "#007bff",
			border: "none",
			borderRadius: "5px",
			cursor: "pointer",
			textDecoration: "none",
			transition: "background-color 0.3s ease",
		},
	};

	return (
		<div style={styles.container}>
			<FaExclamationTriangle style={styles.icon} />
			<h1 style={styles.heading}>404 - Page Not Found</h1>
			<p style={styles.message}>
				Sorry, the page you are looking for does not exist.
			</p>
			<a
				href='/'
				style={styles.button}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}>
				Go Back to Home
			</a>
		</div>
	);
};

export default NotFoundPage;
