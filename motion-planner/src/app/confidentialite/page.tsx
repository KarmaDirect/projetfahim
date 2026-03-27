import Link from 'next/link';

export default function PolitiqueConfidentialite() {
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
        <h1 className="text-4xl md:text-5xl font-black mb-12">Politique de Confidentialité</h1>
        
        <div className="space-y-8 text-gray-400 leading-relaxed text-lg">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Collecte des données personnelles</h2>
            <p>Fahim AE collecte des données personnelles relatives à ses clients (nom, prénom, adresse e-mail, numéros de téléphone) à des fins de gestion de compte, de facturation et de communication liée exclusivement à la production des visuels Motion Design de votre entreprise.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Utilisation et transmission des données</h2>
            <p>Ces données sont strictement confidentielles. Elles ne sont ni vendues ni cédées à des tiers. Les partenaires d'infrastructures (ex: Stripe pour les transactions bancaires) obéissent à des normes européennes très strictes certifiant la sécurité de vos informations.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Droits de l'utilisateur (RGPD)</h2>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité des informations qui vous concernent. Pour exercer ces droits, vous pouvez nous contacter à : <a href="mailto:contact@fahim-ae.com" className="text-[#6B7280] hover:underline">contact@fahim-ae.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Cookies</h2>
            <p>Le site peut utiliser des cookies strictement nécessaires au fonctionnement de la session utilisateur dans le Dashboard, ou afin d'établir des statistiques de fréquentation anonymes via la plateforme publiquement accessible.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
