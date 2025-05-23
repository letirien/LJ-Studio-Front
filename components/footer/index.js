import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white text-sm font-mono">
      {/* Top section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-12 border-b border-white/20">
        {/* Left block with video or badge */}
        <div className="flex flex-col items-start justify-between gap-4">
          <div className="bg-orange-500 px-3 py-1 text-black font-bold uppercase rounded-sm">
            Game Time ▶
          </div>
        </div>

        {/* Contact */}
        <div className="col-span-2 flex flex-col gap-24">
            <div className="flex justify-between">
                <p>jean@LJSTUDIO.xyz</p>
                <div className="text-end text-white">
                    <span className="text-orange-500">thanks</span><span className="text-white/60"> for your visit</span>
                </div>
            </div>
            <div>
                <div className="flex justify-between">
                    <div className="flex gap-12">
                        <h4 className="text-xs text-white/40 mb-1">OUR FIELD</h4>
                        <p className="leading-relaxed">
                            128 rue de la Boetie<br />
                            75008 | Paris<br />
                            FRANCE
                        </p>
                    </div>

                    {/* Menu */}
                    <div className="flex flex-col gap-1">
                        <a href="#" className="hover:text-orange-500">Home</a>
                        <a href="#" className="hover:text-orange-500">Work</a>
                        <a href="#" className="hover:text-orange-500">Services</a>
                        <a href="#" className="hover:text-orange-500">Contact</a>
                    </div>
                                    {/* Socials + Thanks */}
                    <div className="flex flex-col justify-between gap-4">
                    <div className="flex flex-col items-end gap-1">
                        <a href="#" className="hover:text-orange-500">Instagram</a>
                        <a href="#" className="hover:text-orange-500">Twitter</a>
                        <a href="#" className="hover:text-orange-500">LinkedIn</a>
                        <a href="#" className="hover:text-orange-500">Behance</a>
                    </div>
                </div>
                </div>
            </div>
        </div>
      </div>
      <div className="w-full overflow-hidden bg-black">
        <img
          src="/images/TYPO_LJ-STUDIO_BLACK.svg"
          alt="LJ Studio Logo"
          className="w-full object-cover invert"
        />
      </div>
      {/* Bottom section */}
      <div className="bg-[#fa6218] text-black flex justify-between items-center px-6 py-4 text-xs">
        <span>© 2025 | LJ Studio · All rights reserved</span>
        <a href="#" className="underline hover:text-white">Back to the top ↑</a>
      </div>
    </footer>
  );
};

export default Footer;
