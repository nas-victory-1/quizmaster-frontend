import { ArrowRight } from "lucide-react";
import Button from "./Button";

const HowItWorksSection = () => {
    return ( 
           <section id="how-it-works" className="py-20 bg-gray-50">
                <div className="container">
                    <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Create and share quizzes in just a few simple steps</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mb-4">
                        1
                        </div>
                        <h3 className="text-xl font-bold mb-2">Create Your Quiz</h3>
                        <p className="text-gray-600">
                        Design your quiz with custom questions or use AI to generate them. Set time limits and schedule when
                        it goes live.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mb-4">
                        2
                        </div>
                        <h3 className="text-xl font-bold mb-2">Share With Participants</h3>
                        <p className="text-gray-600">
                        Invite participants via a unique link. They can join from any device without installing anything.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mb-4">
                        3
                        </div>
                        <h3 className="text-xl font-bold mb-2">Run Your Quiz</h3>
                        <p className="text-gray-600">
                        Start the quiz at the scheduled time. Watch real-time results and leaderboards as participants answer.
                        </p>
                    </div>
                    </div>

                    <div className="mt-12 text-center">
                    {/* <Link href="/signup"> */}
                        <Button label = "Start creating quizzes" mode="filled">
                            <ArrowRight className="ml-2 h-4 w-4 inline" />
                        </Button>
                    {/* </Link> */}
                    </div>
                </div>
                </section>
     );
}
 
export default HowItWorksSection;