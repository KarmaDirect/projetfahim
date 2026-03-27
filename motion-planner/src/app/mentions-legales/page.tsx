import Link from 'next/link';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-[#1F2937] selection:bg-primary/30 text-white font-sans">
      <nav className="fixed top-0 w-full z-50 bg-[#1F2937]/80 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white">
            FAHIM <span className="text-transparent bg-clip-text bg-linear-to-r from-[#6B7280] to-[#4B5563]">AE</span>
          </Link>
          <Link href="/" className="text-sm font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
            Retour
          </Link>
        </div>
      </nav>

      <main className="pt-40 pb-24 max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black mb-12">Mentions Légales</h1>
        
        <div className="space-y-8 text-gray-400 leading-relaxed text-lg">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Éditeur du site</h2>
            <p>Le site <strong>Fahim AE</strong> est édité par Fahim AE, entreprise spécialisée dans le Motion Design de très haute qualité.</p>
            <p className="mt-2">Email de contact : <a href="mailto:contact@fahim-ae.com" className="text-[#6B7280] hover:underline">contact@fahim-ae.com</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Hébergement</h2>
            <p>Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133 Walnut, CA 91789, USA.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Propriété intellectuelle</h2>
            <p>L'ensemble du contenu du site Fahim AE (illustrations, textes, libellés, marques, images, vidéos) est la propriété de Fahim AE. Toute reproduction partielle ou totale du contenu par quelque procédé que ce soit et sur n'importe quel support est soumise à une autorisation préalable et expresse de Fahim AE.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
