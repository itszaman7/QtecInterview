import React from 'react';

const CompaniesStrip = () => {
    return (
        <section className="py-8 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <p className="text-sm text-gray-400 mb-6 font-medium">Companies we helped grow</p>
                <div className="flex items-center justify-between gap-8 flex-wrap">
                    {/* Vodafone */}
                    <div className="company-logo flex items-center gap-2">
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                            <circle cx="12" cy="8" r="3" />
                        </svg>
                        <span>vodafone</span>
                    </div>

                    {/* Intel */}
                    <div className="company-logo">
                        <span style={{ letterSpacing: '3px' }}>intel</span>
                    </div>

                    {/* Tesla */}
                    <div className="company-logo">
                        <span style={{ letterSpacing: '5px', fontSize: '22px' }}>TESLA</span>
                    </div>

                    {/* AMD */}
                    <div className="company-logo">
                        <span style={{ fontWeight: 800, letterSpacing: '4px' }}>AMD</span>
                    </div>

                    {/* Talkit */}
                    <div className="company-logo">
                        <span style={{ fontWeight: 800 }}>Talkit</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CompaniesStrip;
