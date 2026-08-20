import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, FileText } from "lucide-react";
import { BrandHeader } from "@/components/BrandHeader";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Full Sound Garage" },
      {
        name: "description",
        content:
          "Termos e condições de uso do sistema de agendamento online da Full Sound Garage.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a", color: "#ffffff" }}>
      <BrandHeader />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <ChevronLeft className="h-4 w-4" /> Início
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "rgba(234,88,12,0.12)", color: "#ea580c" }}
          >
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "#ea580c" }}
            >
              Agendamento online
            </p>
            <h1 className="text-2xl font-extrabold uppercase tracking-tight">
              Termos de Uso
            </h1>
          </div>
        </div>

        <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          Última atualização: agosto de 2025
        </p>

        <div
          className="mt-8 space-y-8 text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          <Section title="1. Sobre o serviço">
            <p>
              O sistema de agendamento da{" "}
              <strong style={{ color: "#fff" }}>Full Sound Garage</strong> permite que clientes
              reservem horários para serviços de insulfilme, envelopamento, som automotivo e LEDs
              de forma online, sem necessidade de ligação ou deslocamento prévio.
            </p>
            <p>
              Ao utilizar este sistema, você concorda com os termos descritos neste documento.
            </p>
          </Section>

          <Section title="2. Cadastro e autenticação">
            <p>
              O agendamento exige autenticação via conta Google. Você é responsável pela
              veracidade das informações fornecidas (nome, WhatsApp, dados do veículo). Dados
              falsos ou incompletos podem resultar no cancelamento da reserva.
            </p>
          </Section>

          <Section title="3. Natureza do agendamento">
            <p>
              O agendamento online é uma{" "}
              <strong style={{ color: "#fff" }}>solicitação de reserva</strong>, não uma
              confirmação automática. A Full Sound Garage revisará cada pedido e o confirmará via
              WhatsApp. A reserva só é considerada confirmada após esse retorno.
            </p>
          </Section>

          <Section title="4. Pagamento">
            <ul className="space-y-1.5 pl-4 list-disc marker:text-orange-500">
              <li>O pagamento é realizado exclusivamente no local, na entrega do veículo.</li>
              <li>Não há cobrança antecipada ou depósito no momento do agendamento.</li>
              <li>
                Os preços dos serviços podem variar conforme o modelo do veículo e o escopo do
                serviço; o valor final é informado presencialmente antes da execução.
              </li>
            </ul>
          </Section>

          <Section title="5. Cancelamento e reagendamento">
            <ul className="space-y-1.5 pl-4 list-disc marker:text-orange-500">
              <li>
                O cliente pode cancelar ou reagendar um agendamento{" "}
                <strong style={{ color: "#fff" }}>pendente</strong> diretamente pelo sistema, sem
                custo.
              </li>
              <li>
                Agendamentos <strong style={{ color: "#fff" }}>confirmados</strong> devem ser
                cancelados com pelo menos <strong style={{ color: "#fff" }}>24 horas</strong> de
                antecedência; cancelamentos de última hora podem impedir o reagendamento
                imediato.
              </li>
              <li>
                Em caso de não comparecimento sem aviso prévio (no-show), a Full Sound Garage
                reserva-se o direito de negar novos agendamentos ao cliente.
              </li>
            </ul>
          </Section>

          <Section title="6. Responsabilidades da Full Sound Garage">
            <ul className="space-y-1.5 pl-4 list-disc marker:text-orange-500">
              <li>Executar o serviço contratado com qualidade e dentro do prazo combinado.</li>
              <li>
                Notificar o cliente em caso de imprevistos que exijam reagendamento.
              </li>
              <li>
                Tratar os dados pessoais de acordo com a{" "}
                <Link to="/privacidade" style={{ color: "#ea580c" }}>
                  Política de Privacidade
                </Link>{" "}
                e a LGPD.
              </li>
            </ul>
          </Section>

          <Section title="7. Responsabilidades do cliente">
            <ul className="space-y-1.5 pl-4 list-disc marker:text-orange-500">
              <li>Comparecer no horário agendado.</li>
              <li>Fornecer dados corretos sobre o veículo.</li>
              <li>
                Verificar, no ato da entrega, se o serviço foi executado conforme o combinado e
                comunicar qualquer inconformidade antes de retirar o veículo.
              </li>
            </ul>
          </Section>

          <Section title="8. Limitação de responsabilidade">
            <p>
              A Full Sound Garage não se responsabiliza por danos causados por informações
              incorretas fornecidas pelo cliente (modelo do veículo, tipo de película solicitada,
              etc.) nem por incompatibilidades técnicas do veículo não informadas previamente.
            </p>
          </Section>

          <Section title="9. Disponibilidade do sistema">
            <p>
              O sistema de agendamento pode ficar indisponível por manutenção ou falhas técnicas.
              Nesses casos, o agendamento pode ser feito diretamente via WhatsApp ou Instagram.
            </p>
          </Section>

          <Section title="10. Legislação aplicável">
            <p>
              Estes termos são regidos pelas leis brasileiras, especialmente o{" "}
              <strong style={{ color: "#fff" }}>Código de Defesa do Consumidor (Lei 8.078/1990)</strong>{" "}
              e a{" "}
              <strong style={{ color: "#fff" }}>LGPD (Lei 13.709/2018)</strong>. Eventuais
              conflitos serão submetidos ao foro da comarca de{" "}
              <strong style={{ color: "#fff" }}>Praia Grande, SP</strong>.
            </p>
          </Section>

          <Section title="11. Contato">
            <p>
              Dúvidas sobre estes termos? Entre em contato:
            </p>
            <p className="mt-2">
              <strong style={{ color: "#fff" }}>Full Sound Garage</strong>
              <br />
              Rua Emílio de Menezes, 747 — Praia Grande, SP
              <br />
              <a
                href="https://www.instagram.com/fullsound_garage/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ea580c" }}
              >
                @fullsound_garage
              </a>
            </p>
          </Section>
        </div>

        <div
          className="mt-12 rounded-xl p-5 text-xs"
          style={{
            background: "rgba(234,88,12,0.06)",
            border: "1px solid rgba(234,88,12,0.18)",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          Ao realizar um agendamento, você confirma que leu e aceita estes Termos de Uso.
        </div>

        <div className="mt-8 flex gap-4 text-sm">
          <Link to="/privacidade" style={{ color: "#ea580c" }}>
            Política de Privacidade →
          </Link>
          <Link to="/" style={{ color: "rgba(255,255,255,0.35)" }}>
            Voltar ao início
          </Link>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        className="mb-3 text-xs font-bold uppercase tracking-widest"
        style={{ color: "#ea580c" }}
      >
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}