import Header from "../components/Header";
import Hero from "../components/Hero";
import "../styles/Home.css";

function Home() {
    return (
        <>
            <Header />
            <div className="background-effects">
                <div className="grid-overlay"></div>
                {/* <div className="glow-orb glow-orb-1"></div>
                <div className="glow-orb glow-orb-2"></div>
                <div className="glow-orb glow-orb-3"></div> */}
            </div>
            <div className="content-wrapper">
                <Hero />
            </div>    
        </>
    );
}

export default Home;