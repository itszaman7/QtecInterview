import React from 'react';
import Image from 'next/image';

const DashboardBanner = () => {
    return (
        <section className="py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="relative bg-primary rounded-lg overflow-hidden flex flex-col lg:flex-row items-center">
                    {/* Top-left diagonal cut */}
                    <div className="absolute top-0 left-0 w-32 h-32 z-10 pointer-events-none">
                        <div className="absolute -top-16 -left-16 w-32 h-32 bg-white rotate-45 origin-center"></div>
                    </div>

                    {/* Bottom-right diagonal cut */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 z-10 pointer-events-none">
                        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-white rotate-45 origin-center"></div>
                    </div>

                    {/* Left Text */}
                    <div className="p-10 lg:p-16 lg:w-1/2 relative z-20">
                        <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-4" style={{ fontFamily: "'Clash Display', 'Epilogue', sans-serif", lineHeight: '110%' }}>
                            Start posting<br />jobs today
                        </h2>
                        <p className="text-blue-200 mb-8 text-base" style={{ fontFamily: "'Epilogue', sans-serif", lineHeight: '160%' }}>
                            Start posting jobs for only $10.
                        </p>
                        <button className="bg-white text-primary font-semibold px-8 py-3 rounded-sm hover:bg-gray-100 transition-colors">
                            Sign Up For Free
                        </button>
                    </div>

                    {/* Right Dashboard Image */}
                    <div className="lg:w-1/2 p-6 lg:p-8 flex items-center justify-center relative z-20">
                        <div className="relative w-full max-w-lg rounded-lg overflow-hidden shadow-2xl">
                            <Image
                                src="/assets/3.1 Dashboard Company.png"
                                alt="QuickHire Dashboard"
                                width={600}
                                height={400}
                                className="w-full h-auto"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardBanner;
