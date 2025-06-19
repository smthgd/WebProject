import { useNavigate } from "react-router";
import { useStore } from "../store/useStore";
import logo from "../assets/ChoosyLogo.png";

const Home: React.FC = () => {
	const navigate = useNavigate();
	const { setIsStarted } = useStore();

	const handleButtonClick = () => {
		setIsStarted(true);
		navigate(`/room/new`);
	};

	return (
		<section id="hero" className="hero-block">
			<img src={logo} alt="Logo" className="logo-big" />
			<div className="blur-background">
				<p>
					We're giving you time. The time you can spend not choosing a
					movie, but watching it. Just connect with a friend, partner,
					or family member and start swiping through suggested movies.
					As soon as the "match" happens, you will get your perfect
					movie for a great evening!
				</p>
			</div>
			<button className="register-button" onClick={handleButtonClick}>
				Get started
			</button>
		</section>
	);
};

export default Home;
