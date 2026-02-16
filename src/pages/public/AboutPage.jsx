import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Award, Heart, Sparkles, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import aboutImg from '../../assets/about.jpg';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-frozen flex flex-col font-body">
            <Navbar />

            <main className="flex-grow">
                {/* 1. Hero Section - Smaller, Elegant */}
                <section className="pt-12 pb-12 px-4 md:px-8 text-center bg-white relative overflow-hidden">

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <span className="inline-block text-[0.9rem] text-frost-byte mb-3 font-heading italic font-medium tracking-wide">Since 2026</span>
                        <h1 className="font-heading text-[2.8rem] md:text-[3.5rem] text-polar-night leading-[1.1] mb-6">
                            Redefining Beauty <br />
                            <span className="text-frost-byte italic font-light">Education</span>
                        </h1>
                        <p className="text-[1rem] text-text-primary/70 font-light leading-relaxed max-w-xl mx-auto">
                            Born Angel is not just a beauty academy; it is a sanctuary for aspiring artists.
                            We blend technical mastery with creative freedom to shape the future of the beauty industry.
                        </p>
                    </div>
                </section>

                {/* 2. Visual Story Section - Radial Gradient */}
                <section className="py-12 px-4 md:px-8 bg-[radial-gradient(circle_at_50%_50%,var(--color-bg-primary)_0%,#ffffff_70%)]">
                    <div className="container mx-auto max-w-5xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            {/* Image Composition - Smaller */}
                            <div className="relative mx-auto md:mx-0 max-w-[350px] w-full">
                                <div className="aspect-[3/4] rounded-[1.5rem] overflow-hidden shadow-xl p-2 border border-text-secondary bg-white">
                                    <div className="w-full h-full rounded-[1rem] bg-icy-veil bg-cover bg-center" style={{ backgroundImage: `url(${aboutImg})` }}></div>
                                </div>
                                {/* Floating Badge - Smaller */}
                                <div className="absolute -bottom-6 -right-6 bg-frost-byte text-white p-6 rounded-full shadow-lg hidden md:block animate-bounce-slow">
                                    <span className="block text-2xl font-heading font-bold">#1</span>
                                    <span className="text-xs tracking-widest uppercase">Academy</span>
                                </div>
                            </div>

                            {/* Philosophy Text - More Compact */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-frost-byte font-heading text-lg italic">
                                    <Sparkles size={18} />
                                    <span>Our Philosophy</span>
                                </div>
                                <h2 className="font-heading text-[2rem] md:text-[2.5rem] text-polar-night leading-tight">
                                    Where Passion Meets <span className="italic text-frost-byte/80">Perfection</span>
                                </h2>
                                <div className="space-y-4">
                                    <p className="text-text-primary/70 text-[0.95rem] leading-relaxed font-light">
                                        We believe that makeup is more than just products applied to a face; it is a powerful form of self-expression.
                                        Our curriculum unlock your unique artistic voice while grounding you in rigorous professional techniques.
                                    </p>
                                    <p className="text-text-primary/70 text-[0.95rem] leading-relaxed font-light">
                                        From bridal glamour to avant-garde editorial looks, our students graduate not just as makeup artists, but as visionaries ready to lead the industry.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="text-frost-byte mt-0.5 flex-shrink-0" size={18} />
                                        <div>
                                            <h4 className="font-bold text-polar-night text-[0.9rem]">Certified Masters</h4>
                                            <p className="text-xs text-text-primary/60">Top tier mentorship.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="text-frost-byte mt-0.5 flex-shrink-0" size={18} />
                                        <div>
                                            <h4 className="font-bold text-polar-night text-[0.9rem]">Career Focus</h4>
                                            <p className="text-xs text-text-primary/60">Business skills included.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. The Numbers (Stats) - White */}
                <section className="py-16 bg-white relative overflow-hidden">
                    {/* Background Pattern - Subtle */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-frost-byte/20 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-glacier-glow/20 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="container mx-auto relative z-10 max-w-5xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-polar-night/10">
                            <div className="p-4">
                                <div className="text-[2.5rem] font-heading font-bold text-frost-byte mb-1">500+</div>
                                <div className="text-sm md:text-base tracking-wide font-light text-polar-night/80">Graduated Angels</div>
                            </div>
                            <div className="p-4">
                                <div className="text-[2.5rem] font-heading font-bold text-frost-byte mb-1">15+</div>
                                <div className="text-sm md:text-base tracking-wide font-light text-polar-night/80">Global Awards</div>
                            </div>
                            <div className="p-4">
                                <div className="text-[2.5rem] font-heading font-bold text-frost-byte mb-1">100%</div>
                                <div className="text-sm md:text-base tracking-wide font-light text-polar-night/80">Certified Curriculum</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Values / Features - White */}
                <section className="py-16 px-4 bg-white">
                    <div className="container mx-auto max-w-5xl">
                        <div className="text-center mb-10">
                            <h2 className="font-heading text-[2.2rem] text-polar-night">Why Choose Born Angel?</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: <Award size={24} />,
                                    title: "Industry Recognition",
                                    desc: "Our certificates are recognized by top beauty brands and agencies worldwide."
                                },
                                {
                                    icon: <Users size={24} />,
                                    title: "Community First",
                                    desc: "Join a supportive network of alumni and mentors that stays with you forever."
                                },
                                {
                                    icon: <TrendingUp size={24} />,
                                    title: "Trend Setting",
                                    desc: "We don't just follow trends; we teach you how to set them."
                                }
                            ].map((item, index) => (
                                <div key={index} className="bg-white p-8 rounded-[1.5rem] shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100">
                                    <div className="w-12 h-12 bg-frozen rounded-xl flex items-center justify-center text-polar-night mb-4 group-hover:bg-polar-night group-hover:text-frost-byte transition-colors duration-300">
                                        {item.icon}
                                    </div>
                                    <h3 className="font-heading text-lg font-bold text-polar-night mb-3">{item.title}</h3>
                                    <p className="text-text-primary/70 text-[0.9rem] font-light leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. Minimal CTA - White */}
                <section className="py-16 px-4 bg-white text-center">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <h2 className="font-heading text-[2.5rem] md:text-[3rem] text-polar-night leading-none">
                            Ready to Claim Your <span className="text-frost-byte italic">Wings?</span>
                        </h2>
                        <p className="text-[1rem] text-text-primary/70 font-light">
                            Your journey to becoming a professional makeup artist starts here.
                        </p>
                        <div className="pt-2">
                            <Link
                                to="/login"
                                className="inline-flex h-12 items-center justify-center rounded-full bg-polar-night px-8 text-[0.9rem] font-medium text-white transition-all hover:bg-frost-byte hover:scale-105 shadow-md"
                            >
                                Join Born Angel Today
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
