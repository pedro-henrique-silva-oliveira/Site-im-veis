import { Sparkles, Phone, CheckCircle } from 'lucide-react';

export default function BenefitsSection() {
  return (
    <section className="bg-indigo-900 text-white py-16 border-t border-indigo-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-indigo-300 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold mb-2">Imóveis para Você</h4>
            <p className="text-indigo-200/80 text-sm max-w-xs">
              Do studio ao casarão. Busco no mercado a opção ideal para seu momento de vida e orçamento.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-indigo-300 mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold mb-2">Atendimento Pessoal</h4>
            <p className="text-indigo-200/80 text-sm max-w-xs">
              Você fala direto comigo, sem roteiros prontos. Atendimento humano, transparente e sem pressão.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-indigo-300 mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold mb-2">Processo Sem Stress</h4>
            <p className="text-indigo-200/80 text-sm max-w-xs">
              Cuidamos de toda a documentação, cartório e burocracia para que sua experiência de compra seja perfeita.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
