import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import Navbar from "@/components/Navbar";
const Homepage = () => {
    return ( 
        <div className="px-5 py-5">
            <main>
                <Navbar />
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
            </main>
        </div>
     );
}
 
export default Homepage;