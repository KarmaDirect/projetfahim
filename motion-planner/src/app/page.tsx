'use client'

import React from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { MotionLogo } from '@/components/coursue/Sidebar'
import LightRays from '@/components/ui/LightRays'
import BorderGlow from '@/components/ui/BorderGlow'
import { ArrowRight, Play, CheckCircle, Zap, ShieldCheck, TrendingUp, Clock, Layers, Star, Mail } from 'lucide-react'

const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
)
const TikTokIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2 6.34 6.34 0 0 0 9.49 21.5a6.34 6.34 0 0 0 6.34-6.34V8.71a8.19 8.19 0 0 0 4.76 1.52V6.78a4.83 4.83 0 0 1-1-.09z"/></svg>
)
const TwitchIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/></svg>
)
const DiscordIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.11 13.11 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/></svg>
)
const YoutubeIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
)

const SOCIALS = [
  { href: 'https://www.instagram.com/19fahimm', icon: InstagramIcon, label: 'Instagram', hoverColor: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888]' },
  { href: 'https://www.tiktok.com/@19fahimm', icon: TikTokIcon, label: 'TikTok', hoverColor: 'hover:bg-[#00f2ea]' },
  { href: 'https://www.youtube.com/@19Fahim', icon: YoutubeIcon, label: 'YouTube', hoverColor: 'hover:bg-[#FF0000]' },
  { href: 'https://www.twitch.tv/himfaa', icon: TwitchIcon, label: 'Twitch', hoverColor: 'hover:bg-[#9146FF]' },
  { href: 'https://discord.com/users/1260355652086272051', icon: DiscordIcon, label: 'Discord', hoverColor: 'hover:bg-[#5865F2]' },
]


export default function Home() {
  const { currentUser } = useStore()

  return (
    <div className="min-h-screen bg-[#111827] text-white font-sans overflow-x-hidden selection:bg-primary selection:text-white relative">
      {/* LightRays - full page background behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-none w-screen h-screen">
        <LightRays
          raysOrigin="top-center"
          raysColor="#4B5563"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>

      {/* Floating Pill Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 px-6 pointer-events-none animate-title-reveal items-start">
        <nav className="pointer-events-auto flex items-center justify-between bg-[#1F2937]/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 w-full max-w-5xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-all hover:bg-[#1F2937] hover:border-white/20">
          <Link href="/" className="flex items-center gap-3">
             <MotionLogo className="w-8 h-8" />
             <span className="text-lg font-black tracking-tight text-white hidden sm:block">FAHIM <span className="text-[#6B7280]">AE</span></span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-400">
             <Link href="/portfolio" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">Portfolio</Link>
             <Link href="#pourquoi" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">Concept</Link>
             <Link href="#plateforme" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">Plateforme</Link>
             <Link href="#avis" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">Avis</Link>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <Link href="/dashboard" className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 font-bold transition-all text-[11px] text-white uppercase tracking-widest">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block text-[11px] font-bold uppercase tracking-widest transition-all text-gray-400 hover:text-white">
                  Connexion
                </Link>
                <Link href="/partenaire" className="px-6 py-2.5 rounded-full bg-linear-to-r from-primary to-[#6B7280] hover:from-primary-dark hover:to-[#6B7280] text-white text-[11px] font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(75,85,99,0.4)] hover:shadow-[0_0_30px_rgba(75,85,99,0.6)]">
                  Partenaire
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 max-w-[1440px] mx-auto px-6 pt-40 md:pt-48 pb-20 flex flex-col items-center text-center">

        <h1 className="text-5xl md:text-7xl lg:text-[85px] font-black leading-[1.05] tracking-tighter mb-8 max-w-5xl animate-title-reveal animation-delay-100">
          Vendez du Motion Design.<br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#6B7280] via-primary to-[#6B7280]">Je m'occupe du reste.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mb-12 leading-relaxed animate-title-reveal animation-delay-200">
          Ne dites plus jamais non à un client qui demande des animations complexes. Sous-traitez l'esprit tranquille, livrez de la qualité, et encaissez la marge.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 animate-title-reveal animation-delay-300">
           <Link href={currentUser ? "/dashboard" : "/setup"} className="px-10 py-5 rounded-[20px] sm:rounded-full bg-white text-[#1F2937] font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center gap-3 group shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)]">
             Commencer à déléguer
             <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
           </Link>
           <Link href="/portfolio" className="px-10 py-5 rounded-[20px] sm:rounded-full bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-lg transition-all flex items-center gap-3 backdrop-blur-md">
             <Play className="w-5 h-5 fill-white" />
             Voir le Portfolio
           </Link>
        </div>

        {/* Social Proof Strip */}
        <div className="mt-10 flex items-center gap-3 animate-title-reveal animation-delay-500">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mr-2 hidden sm:block">Suivez-moi</span>
          {SOCIALS.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
              className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white ${s.hoverColor} hover:scale-110 transition-all border border-white/10 hover:border-transparent`}>
              <s.icon size={18} />
            </a>
          ))}
        </div>

        {/* Dashboard Image Showcase */}
        <div className="mt-32 w-full max-w-6xl relative perspective-[2000px] z-10 flex justify-center animate-title-reveal animation-delay-500">

          {/* Slightly Curved Horizontal Marquee Background */}
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[200vw] max-w-[3000px] h-[650px] z-[-1] pointer-events-none flex justify-center overflow-hidden opacity-90" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <div className="absolute top-[100px] left-1/2 w-[6000px] h-[6000px] rounded-full border border-primary/10" style={{ animation: 'orbit 250s linear infinite' }}>
               {[...Array(72)].map((_, i) => {
                 const tool = [
                   { src: '/blender.png', alt: 'Blender', wrapper: 'rounded-[24px] bg-[#1F2937] shadow-[0_0_40px_rgba(245,121,42,0.4)]', img: 'drop-shadow-[0_0_20px_rgba(245,121,42,0.6)]' },
                   { src: '/Youtube.png', alt: 'Youtube', wrapper: '', img: 'drop-shadow-[0_0_20px_rgba(255,0,0,0.6)]' },
                   { src: '/ae.png', alt: 'After Effects', wrapper: 'rounded-[24px] bg-[#1F2937] shadow-[0_0_40px_rgba(153,153,255,0.4)]', img: 'drop-shadow-[0_0_20px_rgba(153,153,255,0.6)]' },
                   { src: '/Instagram.png', alt: 'Instagram', wrapper: '', img: 'drop-shadow-[0_0_20px_rgba(193,53,132,0.6)]' },
                   { src: '/pr.png', alt: 'Premiere Pro', wrapper: 'rounded-[24px] bg-[#1F2937] shadow-[0_0_40px_rgba(153,153,255,0.4)]', img: 'drop-shadow-[0_0_20px_rgba(153,153,255,0.6)]' },
                   { src: '/tiktok.png', alt: 'TikTok', wrapper: '', img: 'drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]' }
                 ][i % 6];
                 
                 return (
                   <div key={i} className="absolute top-1/2 left-1/2" style={{ transform: `translate(-50%, -50%) rotate(${i * 5}deg) translateY(-3000px)` }}>
                     <div style={{ animation: 'reverse-orbit 250s linear infinite' }}>
                       <div style={{ transform: `rotate(-${i * 5}deg)` }}>
                         <div className={`w-20 h-20 md:w-32 md:h-32 flex items-center justify-center ${tool.wrapper}`}>
                           <img src={tool.src} alt={tool.alt} className={`w-16 h-16 md:w-24 md:h-24 object-contain ${tool.img}`} />
                         </div>
                       </div>
                     </div>
                   </div>
                 );
               })}
            </div>
          </div>
           {/* Ultimate glowing background for the mockup -> Replaced with proper inner glow to avoid square overflow */}
           
           <div className="animate-float w-full relative z-10">
           <div className="relative rounded-[24px] md:rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_80px_-20px_rgba(75,85,99,0.6)] bg-[#1F2937] aspect-16/10 md:aspect-21/10 transform transition-all duration-1000 ease-out transform-[rotateX(12deg)_scale(0.95)] hover:transform-[rotateX(0deg)_scale(1)] group ring-1 ring-white/10">
             {/* Beautiful MacOS Web Browser Topbar */}
             <div className="absolute top-0 left-0 w-full h-12 bg-[#1F2937]/80 backdrop-blur-xl border-b border-white/10 flex items-center px-6 shrink-0 z-10">
               <div className="flex gap-2.5">
                 <div className="w-3.5 h-3.5 rounded-full bg-[#ED695E] border border-[#CF544D]"></div>
                 <div className="w-3.5 h-3.5 rounded-full bg-[#F4BF4F] border border-[#D09E38]"></div>
                 <div className="w-3.5 h-3.5 rounded-full bg-[#61C554] border border-[#48A53B]"></div>
               </div>
               <div className="mx-auto flex items-center justify-center -ml-16 w-full absolute pointer-events-none">
                 <div className="bg-[#111827] border border-white/10 rounded-md px-16 py-1.5 text-[10px] text-gray-400 tracking-widest uppercase font-bold flex items-center gap-2 shadow-inner">
                   🔒 fahim-ae.com/dashboard
                 </div>
               </div>
             </div>
             
             {/* Real Dashboard Image Placeholder */}
             <img 
               src="/dashboard-preview.png" 
               alt="Aperçu du dashboard Fahim AE" 
               className="w-full h-full object-cover object-top pt-10"
               onError={(e) => {
                 e.currentTarget.style.display = 'none';
                 const parent = e.currentTarget.parentElement;
                 if(parent) {
                    parent.classList.add('bg-[#1F2937]', 'flex', 'items-center', 'justify-center');
                    const fallbackText = document.createElement('div');
                    fallbackText.className = 'text-center p-8 mt-10';
                    fallbackText.innerHTML = '<p class="text-primary font-bold text-xl mb-2">Image Dashboard Manquante</p><p class="text-gray-400 text-sm">Veuillez glisser "dashboard-preview.png" dans le dossier /public</p>';
                    parent.appendChild(fallbackText);
                 }
               }}
             />
           </div>
        </div>
        </div>

        {/* Brand strip */}
        <div className="mt-20 flex flex-col items-center w-full max-w-4xl border-t border-b border-white/5 py-8">
           <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mb-6">Ils font déjà de la marge avec moi</p>
           <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
             <span className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2"><CheckCircle size={20} className="text-primary" /> FUZE</span>
             <span className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2"><CheckCircle size={20} className="text-primary" /> CODEALUX</span>
             <span className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2"><CheckCircle size={20} className="text-primary" /> HATIM</span>
             <span className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2"><CheckCircle size={20} className="text-primary" /> AEBID</span>
           </div>
        </div>
      </main>

      {/* Video Promo Section */}
      <section className="relative z-10 py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[24px] md:rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_80px_-20px_rgba(75,85,99,0.6)] bg-black">
            <video
              className="w-full h-auto"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/FahimAE1-Promo.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* Pourquoi Externaliser / ROI */}
      <section id="pourquoi" className="relative py-24 md:py-32 px-6 bg-[#1F2937]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Ouvrir After Effects vous donne des sueurs froides ?
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              En tant que monteur, votre temps, c'est du dérushage et du rythme. Pas passer 4 heures sur des courbes de bézier pour animer un logo ou créer une intro dynamique. 
              <br/><br/>
              Pourtant, vos clients réclament du Motion Design. Et si vous refusez, ils iront voir ailleurs. La solution ? <strong className="text-white">On fait équipe.</strong> Vous gardez le client, je produis l'animation.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <TrendingUp className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Augmentez votre panier moyen</h3>
                  <p className="text-gray-400 text-sm">Proposez des packages vidéo + motion design et facturez plus cher, sans travailler plus.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 mt-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <ShieldCheck className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Zéro friction, 100% Marque Blanche</h3>
                  <p className="text-gray-400 text-sm">Je suis votre prestataire fantôme. Le client ne voit que vous et la qualité finale.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-tr from-primary to-gray-800 rounded-[40px] transform rotate-3 scale-105 opacity-50 blur-lg"></div>
            <div className="relative bg-[#1F2937] p-10 md:p-12 rounded-[40px] border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-black mb-6 border-b border-white/10 pb-6">Calcul rapide de votre ROI</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-400">Vous facturez au client :</span>
                  <span className="font-bold text-white">1500 €</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-400">Coût Fahim AE :</span>
                  <span className="font-bold text-[#FF5F56]">- 400 €</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-400">Votre temps passé :</span>
                  <span className="font-bold text-white">0 h</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center text-2xl font-black text-primary">
                  <span>Marge brute :</span>
                  <span>1100 €</span>
                </div>
              </div>
              <div className="mt-8 p-5 bg-[#111827] rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                <p className="text-sm text-gray-300 font-medium italic">
                  "J'ai pris le contrat, délégué le motion, pris mes 1100€ de marge sans ouvrir After Effect, et le client m'a recommandé."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Dashboard Section */}
      <section id="plateforme" className="relative py-24 md:py-32 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary rounded-full mix-blend-screen filter blur-[200px] opacity-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center mb-20 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Finis les mails à rallonge.</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Gérer un prestataire par WhatsApp, c'est l'enfer. C'est pour ça que j'ai créé Fahim AE : un espace de travail centralisé pour qu'on soit ultra-efficaces.
          </p>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 perspective-[2000px]">
           <div className="relative rounded-[24px] md:rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_80px_-20px_rgba(75,85,99,0.6)] bg-[#1F2937] aspect-16/10 md:aspect-21/10 transform transition-all duration-1000 ease-out transform-[rotateX(12deg)_scale(0.95)] hover:transform-[rotateX(0deg)_scale(1)] group ring-1 ring-white/10">
             {/* Beautiful MacOS Web Browser Topbar */}
             <div className="absolute top-0 left-0 w-full h-12 bg-[#1F2937]/80 backdrop-blur-xl border-b border-white/10 flex items-center px-6 shrink-0 z-10">
               <div className="flex gap-2.5">
                 <div className="w-3.5 h-3.5 rounded-full bg-[#ED695E] border border-[#CF544D]"></div>
                 <div className="w-3.5 h-3.5 rounded-full bg-[#F4BF4F] border border-[#D09E38]"></div>
                 <div className="w-3.5 h-3.5 rounded-full bg-[#61C554] border border-[#48A53B]"></div>
               </div>
               <div className="mx-auto flex items-center justify-center -ml-16 w-full absolute pointer-events-none">
                 <div className="bg-[#111827] border border-white/10 rounded-md px-16 py-1.5 text-[10px] text-gray-400 tracking-widest uppercase font-bold flex items-center gap-2 shadow-inner">
                   🔒 fahim-ae.com/planning
                 </div>
               </div>
             </div>
             
             {/* Real Dashboard Image */}
             <img 
               src="/planning-preview.png" 
               alt="Aperçu du Planning" 
               className="w-full h-full object-cover object-top pt-10"
               onError={(e) => {
                 e.currentTarget.style.display = 'none';
                 const parent = e.currentTarget.parentElement;
                 if(parent) {
                    parent.classList.add('bg-[#1F2937]', 'flex', 'items-center', 'justify-center');
                    const fallbackText = document.createElement('div');
                    fallbackText.className = 'text-center p-8 mt-10';
                    fallbackText.innerHTML = '<p class="text-primary font-bold text-xl mb-2">Image Planning Manquante</p><p class="text-gray-400 text-sm">Veuillez glisser "planning-preview.png" dans le dossier /public</p>';
                    parent.appendChild(fallbackText);
                 }
               }}
             />
           </div>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 relative z-10">
          <BorderGlow glowColor="269 80 70" backgroundColor="#1F2937" borderRadius={32} glowRadius={35} glowIntensity={0.8} coneSpread={20} colors={['#4B5563', '#6B7280', '#38bdf8']}>
            <div className="p-8">
              <Layers className="text-primary w-8 h-8 mb-6" />
              <h3 className="text-xl font-bold mb-3">Tableau de bord</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Passez vos commandes d'animation en 2 clics. Tout est stocké, archivé et propre.</p>
            </div>
          </BorderGlow>
          <BorderGlow glowColor="269 80 70" backgroundColor="#1F2937" borderRadius={32} glowRadius={35} glowIntensity={0.8} coneSpread={20} colors={['#4B5563', '#6B7280', '#38bdf8']}>
            <div className="p-8">
              <Clock className="text-primary w-8 h-8 mb-6" />
              <h3 className="text-xl font-bold mb-3">Planning temps réel</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Vous savez exactement sur quoi je bosse. Pas besoin de m'envoyer un message pour savoir où ça en est.</p>
            </div>
          </BorderGlow>
          <BorderGlow glowColor="269 80 70" backgroundColor="#1F2937" borderRadius={32} glowRadius={35} glowIntensity={0.8} coneSpread={20} colors={['#4B5563', '#6B7280', '#38bdf8']}>
            <div className="p-8">
              <Zap className="text-primary w-8 h-8 mb-6" />
              <h3 className="text-xl font-bold mb-3">Efficacité militaire</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Des process huilés. C'est carré, rapide, pas cher par rapport à une agence, et le résultat tue.</p>
            </div>
          </BorderGlow>
        </div>
      </section>



      {/* Testimonials / Avis */}
      <section id="avis" className="py-24 md:py-32 px-6 bg-[#111827] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Témoignages</span>
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ceux qui me délèguent leur motion.</h2>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Julien (Fuze)",
              role: "Créateur / Agence",
              quote: "Depuis que j'ai donné les clés du motion à Hatim, je sors 2x plus de vidéos. Ses rendus AE sont clean, le dashboard est une dinguerie pour s'y retrouver."
            },
            {
              name: "Samir (Codealux)",
              role: "Monteur Freelance",
              quote: "Mes clients me demandaient des intros en 3D... j'étais perdu. Je lui envoie un brief sur le dashboard, 3 jours après c'est plié. Je marge à 40% sans rien faire."
            },
            {
              name: "Amine (Aebid)",
              role: "Réalisateur",
              quote: "Organisation militaire c'est le mot. Finis les wetransfers expirés ou les WhatsApp qui se perdent. Je vois le planning, je télécharge le rendu, basta."
            }
          ].map((avis, i) => (
            <BorderGlow key={i} glowColor="269 80 70" backgroundColor="#1F2937" borderRadius={32} glowRadius={30} glowIntensity={0.7} coneSpread={20} colors={['#4B5563', '#6B7280', '#9CA3AF']} className="transform transition-transform hover:-translate-y-2">
              <div className="p-8">
                <div className="flex text-[#FFBD2E] mb-6">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-gray-300 mb-8 italic text-lg leading-relaxed">"{avis.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center font-bold text-primary">
                    {avis.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{avis.name}</p>
                    <p className="text-xs text-gray-500">{avis.role}</p>
                  </div>
                </div>
              </div>
            </BorderGlow>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 bg-[#111827] relative z-10">
        <div className="max-w-5xl mx-auto bg-linear-to-br from-[#1F2937] to-[#1F2937] border border-white/10 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full filter blur-[100px] opacity-30 pointer-events-none"></div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">
            Prêt à muscler votre offre ?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto relative z-10">
            Devenez partenaire. Ajoutez le Motion Design à votre catalogue de compétences dès demain matin, sans rien apprendre de nouveau.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
             <Link href="/setup" className="inline-flex justify-center px-10 py-5 rounded-full bg-primary hover:bg-[#6B7280] text-white font-bold text-xl transition-all shadow-[0_0_40px_rgba(75,85,99,0.4)] hover:shadow-[0_0_60px_rgba(75,85,99,0.6)] hover:scale-105">
               Devenir Partenaire
             </Link>
             <Link href="/portfolio" className="inline-flex justify-center px-10 py-5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xl transition-all backdrop-blur-md">
               Voir le Portfolio
             </Link>
          </div>
        </div>
      </section>
      
      {/* Magnificent Footer */}
      <footer className="relative z-10 bg-[#111827] pt-20 overflow-hidden border-t border-white/5 mt-20">
        {/* Top glowing line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>
        {/* Bottom glowing aura */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-primary rounded-t-full filter blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto px-6 pb-12">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 relative z-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <MotionLogo className="w-8 h-8" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400 tracking-tight">Fahim AE</span>
              </div>
              <p className="text-gray-400 max-w-sm leading-relaxed mb-8">
                La plateforme privée qui transforme les monteurs vidéo en agences complètes. Déléguez le Motion Design, gardez toute la marge.
              </p>
              <div className="flex items-center gap-3">
                {SOCIALS.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                    className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white ${s.hoverColor} hover:scale-110 transition-all border border-white/10 hover:border-transparent`}>
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-sm">Plateforme</h4>
              <ul className="flex flex-col gap-4 text-gray-400 text-sm font-medium">
                <li><Link href="/dashboard" className="hover:text-[#6B7280] transition-colors">Tableau de bord</Link></li>
                <li><Link href="/portfolio" className="hover:text-[#6B7280] transition-colors">Le Portfolio</Link></li>
                <li><Link href="/setup" className="hover:text-[#6B7280] transition-colors">Devenir Partenaire</Link></li>
                <li><Link href="/login" className="hover:text-[#6B7280] transition-colors">Connexion</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-sm">Contact & Légal</h4>
              <ul className="flex flex-col gap-4 text-gray-400 text-sm font-medium">
                <li><a href="mailto:contact@fahim-ae.com" className="hover:text-[#6B7280] transition-colors flex items-center gap-2"><Mail size={14} /> contact@fahim-ae.com</a></li>
                <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link></li>
                <li><Link href="/cgv" className="hover:text-white transition-colors">CGV & CGU</Link></li>
                <li><Link href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
              </ul>
            </div>
          </div>

          {/* Massive Watermark */}
          <div className="relative w-full flex justify-center items-center overflow-hidden mb-12 select-none pointer-events-none">
            <h1 className="text-[12vw] font-black leading-none text-transparent bg-clip-text bg-linear-to-b from-white/10 to-transparent tracking-tighter mix-blend-screen opacity-50">
              FAHIM AE
            </h1>
          </div>

          {/* Copyright Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-gray-500 text-sm font-medium">
            <p>© {new Date().getFullYear()} Fahim AE. Tous droits réservés.</p>
            <p className="mt-4 md:mt-0 flex items-center gap-1">Fait avec <span className="text-primary animate-pulse mx-1">❤</span> pour les créatifs.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
