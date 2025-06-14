import Button from "./Button";
import randomPic from '../assets/icons8_dice_80px.png';

const Navbar = () => {
    return ( 
        <nav className="flex justify-between px-5 py-2 items-center bg-white fixed left-0 right-0 top-0 z-50">
            <div className="flex items-center">
                <img src={randomPic} alt="" className="w-10" />
                <div className="font-bold text-2xl">QuizMaster</div>
            </div>

            <div className="flex gap-5">
                <div className="font-semibold">Features</div>
                <div className="font-semibold">Pricing</div>
            </div>

            <div className=" flex gap-4">
                <Button label="Log in" mode="notFilled" />
                <Button label = "Sign Up"/>
            </div>
        </nav>
     );
}
 
export default Navbar;