import Image from "next/image";
import Button from "./Button";
import { Users } from "lucide-react";
const HeroSection = () => {
    return ( 
        <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
            <div className="container grid gap-8 md:grid-cols-2 items-center">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Create engaging quizzes with <span className="text-purple-600">AI assistance</span>
                    </h1>
                    <p className="text-lg text-gray-600">
                        Build interactive quizzes, share with participants, and analyze results in real-time. Let AI help you
                        generate questions or organize existing ones.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* <Link href="/signup"> */}
                        <Button label="Get started for free" />
                        {/* </Link> */}
                        {/* <Link href="/demo"> */}
                        <Button label="See a demo" mode="notFilled" />
                        {/* </Link> */}
                    </div>
                </div>
                <div className="relative">
                    <div className="bg-white rounded-lg shadow-xl p-6 h-90 ">
                        <Image
                        src='/images/dashboardPic.png'
                        alt="Quiz platform dashboard preview"
                        fill
                        />
                    </div>
                    <div className="absolute -bottom-6 -left-6 bg-purple-100 p-4 rounded-lg shadow-md">
                        <div className="flex items-center gap-2">
                        <Users className="text-purple-600" />
                        <span className="font-medium">10,000+ active users</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
     );
}
 
export default HeroSection;