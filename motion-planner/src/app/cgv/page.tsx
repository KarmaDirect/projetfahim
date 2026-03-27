import Link from 'next/link';

export default function CGV() {
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
        <h1 className="text-4xl md:text-5xl font-black mb-12">Conditions Générales de Vente et d'Utilisation (CGV & CGU)</h1>
        
        <div className="space-y-8 text-gray-400 leading-relaxed text-lg">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Objet</h2>
            <p>Les présentes Conditions Générales régissent les relations contractuelles entre Fahim AE et ses clients dans le cadre de la prestation de services de création de Motion Design, ainsi que l'utilisation du site web associé et des tableaux de bord client.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Prestations de service</h2>
            <p>Fahim AE s'engage à concevoir et réaliser des projets de Motion Design (animations, vidéos promotionnelles, design d'interfaces, etc.) selon le cahier des charges fourni par le client. Toute demande modification substantielle hors du brief initial fera l'objet d'un devis supplémentaire.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Utilisation de la plateforme</h2>
            <p>L'accès au tableau de bord (Dashboard) est strictement personnel et confidentiel. Le client s'engage à ne pas divulguer ses identifiants. Fahim AE se réserve le droit de suspendre tout compte en cas d'utilisation abusive (spam, partage d'accès illicite, non-paiement).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Tarifs et Conditions de paiement</h2>
            <p>Sauf mention contraire, les règlements s'effectuent via la plateforme sécurisée intégrée au tableau de bord (Stripe). Le démarrage effectif du travail de production ne débute qu'à réception de la commande ou de l'acompte prévu convenu entre les parties.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
