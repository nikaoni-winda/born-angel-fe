import React from 'react';
import { Sparkles, Star, Heart, Flower } from 'lucide-react';
import girl1 from '../../assets/girl1.jpg';
import girl2 from '../../assets/girl2.jpg';
import girl3 from '../../assets/girl3.jpg';

const AestheticCTA = () => {
    return (
        <section className="pt-0 pb-12 bg-[#fff0f5] w-full relative overflow-hidden">
            <div className="container relative z-10">
                {/* Title Section - Centered and Compact */}
                <div className="mb-8 text-center max-w-4xl mx-auto">
                    <h2 className="font-heading text-[2.5rem] md:text-[3.5rem] text-polar-night leading-tight relative inline-block">
                        What Are You <span className="italic font-light text-frost-byte">Waiting For?</span>
                    </h2>
                </div>

                {/* Images Grid - Cascading Right (High) to Left (Low) with Reduced Stagger */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 relative">

                    {/* Decorative Icons Between Columns */}
                    <div className="hidden md:block absolute top-[40%] left-[32%] text-polar-night/20 z-0">
                        <Star size={24} strokeWidth={1} className="rotate-12" />
                    </div>
                    <div className="hidden md:block absolute top-[25%] right-[32%] text-frost-byte/30 z-0">
                        <Heart size={20} strokeWidth={1} className="-rotate-12" />
                    </div>

                    {/* Item 1 - Left (Lowest) */}
                    <div className="flex flex-col items-center mt-0 md:mt-24 relative group">
                        {/* Extra Decor Above First Image (User Request) */}
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-polar-night/10 hidden md:block animate-pulse">
                            <Flower size={48} strokeWidth={0.8} />
                        </div>

                        <div className="absolute -left-6 top-1/2 text-frost-byte/20 hidden md:block">
                            <Sparkles size={28} strokeWidth={1} />
                        </div>
                        <div className="relative p-2 border border-polar-night/30 rounded-t-[110px] w-full max-w-[260px]">
                            <div className="w-full aspect-[3/4] rounded-t-[100px] overflow-hidden relative">
                                <img src={girl1} alt="Makeup Enthusiast" className="w-full h-full object-cover transition-all duration-700" />
                            </div>
                        </div>
                        <h3 className="font-heading text-lg text-polar-night mt-3 tracking-wide group-hover:text-frost-byte transition-colors">Unlock Potential</h3>
                    </div>

                    {/* Item 2 - Center (Middle) */}
                    <div className="flex flex-col items-center mt-0 md:mt-12 relative group">
                        <div className="relative p-2 border border-polar-night/30 rounded-t-[110px] w-full max-w-[260px]">
                            <div className="w-full aspect-[3/4] rounded-t-[100px] overflow-hidden relative">
                                <img src={girl2} alt="Expert Guidance" className="w-full h-full object-cover transition-all duration-700" />
                            </div>
                        </div>
                        <h3 className="font-heading text-lg text-polar-night mt-3 tracking-wide group-hover:text-frost-byte transition-colors">Expert Guidance</h3>
                    </div>

                    {/* Item 3 - Right (Highest) */}
                    <div className="flex flex-col items-center mt-0 md:mt-0 relative group">
                        <div className="absolute -right-4 bottom-1/3 text-polar-night/20 hidden md:block">
                            <Star size={24} strokeWidth={1} fill="currentColor" className="opacity-40" />
                        </div>
                        <div className="relative p-2 border border-polar-night/30 rounded-t-[110px] w-full max-w-[260px]">
                            <div className="w-full aspect-[3/4] rounded-t-[100px] overflow-hidden relative">
                                <img src={girl3} alt="Creative Freedom" className="w-full h-full object-cover transition-all duration-700" />
                            </div>
                        </div>
                        <h3 className="font-heading text-lg text-polar-night mt-3 tracking-wide group-hover:text-frost-byte transition-colors">Creative Freedom</h3>
                    </div>

                </div>

                {/* CTA Button */}
                <div className="text-center mt-12">
                    <button className="relative overflow-hidden group bg-transparent border border-polar-night text-polar-night px-10 py-3 rounded-full font-body font-medium uppercase tracking-[0.2em] hover:text-white transition-colors duration-300 transform">
                        <span className="absolute inset-0 w-full h-full bg-polar-night scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        <span className="relative z-10">Start Your Journey</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AestheticCTA;
