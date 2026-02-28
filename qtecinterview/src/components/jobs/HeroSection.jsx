import React from 'react';
import Image from 'next/image';
import SearchBar from './SearchBar';

const HeroSection = () => {
    return (
        <section className="relative pt-16 pb-10 lg:pt-20 lg:pb-16 bg-white overflow-hidden">
            {/* Geometric pattern decoration — behind the person */}
            <div className="absolute top-0 right-0 w-[55%] h-full pointer-events-none z-0 hidden lg:block">
                <Image
                    src="/assets/Pattern.png"
                    alt=""
                    fill
                    className="object-contain object-right-top"
                    unoptimized
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-0">

                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start text-left z-10 pt-8 lg:pt-16">
                        <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight text-[#25324B] mb-2" style={{ fontFamily: "'Clash Display', 'Epilogue', sans-serif", lineHeight: '110%' }}>
                            Discover <br />
                            more than <br />
                            <span className="text-accent-blue relative inline-block">
                                5000+ Jobs
                                {/* Scribble underline image */}
                                <img
                                    src="/assets/Vector.png"
                                    alt=""
                                    className="absolute left-0 -bottom-3 w-full h-auto"
                                />
                            </span>
                        </h1>

                        <p className="text-base text-gray-500 mt-6 mb-10 max-w-md" style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 500, lineHeight: '160%' }}>
                            Great platform for the job seeker that searching for
                            new career heights and passionate about startups.
                        </p>

                        {/* Search Bar */}
                        <div className="w-full max-w-2xl z-20">
                            <SearchBar />
                        </div>

                        <p className="mt-6 text-sm text-gray-500 font-medium" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                            Popular : <span className="text-gray-700">UI Designer, UX Researcher, Android, Admin</span>
                        </p>
                    </div>

                    {/* Hero Person — transparent PNG, no container styling */}
                    <div className="w-full lg:w-1/2 relative flex justify-end items-end z-[1]">
                        <div className="relative w-full max-w-[500px] h-[400px] lg:h-[550px] ml-auto">
                            <Image
                                src="/assets/Hero_person.png"
                                alt="Professional person"
                                fill
                                className="object-contain object-bottom"
                                priority
                                unoptimized
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;
