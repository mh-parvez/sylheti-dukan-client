import { FaShopify } from "react-icons/fa";

const Loader = () => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				fontFamily: "'Roboto', sans-serif",
			}}>
			<div style={{ position: "relative", marginBottom: "1rem" }}>
				<FaShopify
					size={62}
					style={{
						color: "#D21F3C",
						animation: "pulse 1s infinite ease-in-out",
					}}
				/>
			</div>
			<style>
				{`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.7;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
			</style>
		</div>
	);
};

export default Loader;
