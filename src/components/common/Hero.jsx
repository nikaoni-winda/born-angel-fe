import React from 'react';
import { Link } from 'react-router-dom';
import bannerImg from '../../assets/banner.jpg';

const Hero = () => {
    return (
        <section className="relative w-full min-h-[90vh] pt-8 pb-16 flex items-center overflow-hidden bg-[radial-gradient(circle_at_50%_50%,var(--color-bg-primary),#fff)]">
            <div className="container grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_0.8fr] gap-8 items-center relative">

                {/* Left Content */}
                <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <h1 className="font-heading text-[2.5rem] lg:text-[3.2rem] text-polar-night font-bold mb-4 leading-[1.15] tracking-tight">
                        Unveil Your <br />
                        <span className="italic font-light text-frost-byte">True Radiance</span> <br />
                        Through Artistry
                    </h1>
                    <p className="text-[1rem] text-text-primary max-w-[450px] mb-8 leading-[1.7] opacity-80 font-light">
                        Elevate your beauty routine with our expert-led makeup classes. From flawless basics to red-carpet glam, learn techniques that celebrate your unique features.
                    </p>

                    <div className="flex items-center gap-8 mt-2 mb-6">
                        <div>
                            <h4 className="font-heading text-[1.8rem] text-polar-night font-bold leading-none">500+</h4>
                            <p className="text-[0.75rem] text-text-primary opacity-70 uppercase tracking-widest font-medium mt-1">Students</p>
                        </div>
                        <div className="w-[1px] h-10 bg-polar-night/10"></div>
                        <div>
                            <h4 className="font-heading text-[1.8rem] text-polar-night font-bold leading-none">5+</h4>
                            <p className="text-[0.75rem] text-text-primary opacity-70 uppercase tracking-widest font-medium mt-1">Classes</p>
                        </div>
                        <div className="w-[1px] h-10 bg-polar-night/10"></div>
                        <div>
                            <h4 className="font-heading text-[1.8rem] text-polar-night font-bold leading-none">4.9</h4>
                            <p className="text-[0.75rem] text-text-primary opacity-70 uppercase tracking-widest font-medium mt-1">Rating</p>
                        </div>
                    </div>


                </div>

                {/* Center Image (Oval) */}
                <div className="flex justify-center relative my-4 lg:my-0">
                    <div className="w-[260px] h-[390px] lg:w-[320px] lg:h-[480px] rounded-[160px] border border-text-secondary p-2 relative bg-transparent">
                        <div className="w-full h-full rounded-[150px] bg-icy-veil bg-cover bg-center" style={{ backgroundImage: `url(${bannerImg})` }}></div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="pt-8 hidden lg:block">
                    <div className="mb-0">
                        <h3 className="font-heading text-[1.4rem] mb-3 text-polar-night font-medium">Expert Guidance</h3>
                        <p className="text-[1rem] text-text-primary leading-[1.7] opacity-90 mb-3 font-light">
                            Learn directly from professional makeup artists who share industry secrets tailored to your face shape and skin type.
                        </p>
                        <p className="text-[1rem] text-text-primary leading-[1.7] opacity-90 font-light mb-8">
                            Master techniques that boost your confidence and refine your personal style.
                        </p>
                        <Link to="/services" className="inline-block px-8 py-3 bg-polar-night text-white font-heading font-semibold text-[0.95rem] rounded-full shadow-lg hover:bg-frost-byte hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline">
                            Book Makeup Class Now!
                        </Link>
                    </div>
                </div>

            </div>

            {/* Seamless Transition Gradient Overlay */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-white pointer-events-none z-20"></div>
        </section>
    );
};

export default Hero;
