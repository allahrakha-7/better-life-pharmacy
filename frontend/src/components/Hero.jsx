import heroImg from '../assets/images/hero.png';

export default function Hero({ onNavigate }) {
    return (
        <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
            {/* Background Hero Image */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={heroImg}
                    alt="Better Life Hero"
                    className="w-full h-full object-cover object-left md:object-center transform scale-102 transition-transform duration-10000 ease-out hover:scale-100"
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#004d38]/30 via-transparent to-transparent"></div>
            </div>

            {/* Hero Content */}
            <div className="relative h-full max-w-[96%] mx-auto px-6 md:px-12 pt-24 flex flex-col justify-center items-start text-white z-10">
                <div className="max-w-2xl space-y-6">
                    <h1 className="text-4xl leading-4 tracking-wide md:text-6xl font-semibold tracking-tight leading-tight">
                        Your Trusted <br />
                        Online Pharmacy <br />
                        <span className="text-[#dffe5e]">for Every Need</span>
                    </h1>
                    <p className="text-base md:text-lg text-slate-200 font-normal leading-relaxed max-w-lg">
                        Get your medicines, health supplies and get door step delivery within 24 hours. Upload your prescription now and let us take care of the rest.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <button
                            onClick={() => onNavigate && onNavigate('medicines')}
                            className="bg-[#dffe5e] active:scale-95 text-[#033126] border border-[#033126] hover:border-[#dffe5e] font-semibold px-9 py-2.5 rounded-full shadow-lg transition-all cursor-pointer"
                        >
                            Shop Now
                        </button>
                        <button
                            onClick={() => onNavigate && onNavigate('medicines')}
                            className="bg-[#033126] active:scale-95 text-white font-semibold px-9 py-2.5 rounded-full border border-white/30 hover:border-white backdrop-blur-sm transition-all cursor-pointer"
                        >
                            Explore More
                        </button>
                    </div>

                    {/* Customer Reviews/Ratings */}
                    <div className="flex items-center gap-4.5 pt-4">
                        {/* Overlapping Avatars */}
                        <div className="flex -space-x-3.5">
                            <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                                alt="Customer 1"
                                className="w-10.5 h-10.5 rounded-full object-cover border-2 border-white/80 shadow-md"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                                alt="Customer 2"
                                className="w-10.5 h-10.5 rounded-full object-cover border-2 border-white/80 shadow-md"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                                alt="Customer 3"
                                className="w-10.5 h-10.5 rounded-full object-cover border-2 border-white/80 shadow-md"
                            />
                        </div>

                        {/* Rating Info */}
                        <div className="flex flex-col justify-center text-left">
                            <div className="flex items-center gap-1.5 leading-none">
                                <span className="text-yellow-400 text-sm leading-none">★</span>
                                <span className="text-sm font-bold text-white leading-none">4.9/5</span>
                            </div>
                            <span className="text-xs text-white/80 font-medium mt-1 leading-none">
                                Rated by 2,400+ families
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
