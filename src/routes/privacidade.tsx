import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { BrandHeader } from "@/components/BrandHeader";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Full Sound Garage" },
      {
        name: "description",
        content:
          "Saiba como a Full Sound Garage coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PrivacidadePage,
});

function PrivacidadePage() {
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
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "#ea580c" }}
            >
              LGPD — Lei 13.709/2018
            </p>
            <h1 className="text-2xl font-extrabold uppercase tracking-tight">
              Política de Privacidade
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
          <Section title="1. Quem somos">
            <p>
              <strong style={{ color: "#fff" }}>Full Sound Garage</strong> é uma oficina
              especializada em insulfilme, envelopamento, som automotivo e LEDs, localizada em
              Praia Grande, SP.
            </p>
            <Placeholder label="CNPJ" />
            <Placeholder label="Endereço completo da sede" />
            <Placeholder label="E-mail de contato" />
          </Section>

          <Section title="2. Dados que coletamos">
            <p>Ao realizar um agendamento, coletamos:</p>
            <ul className="mt-2 space-y-1.5 pl-4 list-disc marker:text-orange-500">
              <li>
                <strong style={{ color: "#fff" }}>Identificação:</strong> nome completo e endereço
                de e-mail (via conta Google)
              </li>
              <li>
                <strong style={{ color: "#fff" }}>Contato:</strong> número de WhatsApp
              </li>
              <li>
                <strong style={{ color: "#fff" }}>Veículo:</strong> marca, modelo e ano do carro
              </li>
              <li>
                <strong style={{ color: "#fff" }}>Agendamento:</strong> serviço escolhido, data,
                horário e observações opcionais
              </li>
            </ul>
            <p className="mt-3">
              Não coletamos dados de cartão de crédito, CPF ou documentos de identidade.
            </p>
          </Section>

          <Section title="3. Como usamos seus dados">
            <ul className="space-y-1.5 pl-4 list-disc marker:text-orange-500">
              <li>Confirmar e gerenciar o agendamento do serviço</li>
              <li>Entrar em contato via WhatsApp para confirmar ou reagendar</li>
              <li>Identificar o veículo no dia do serviço</li>
              <li>Enviar notificações transacionais relacionadas ao seu pedido</li>
            </ul>
            <p className="mt-3">
              Não utilizamos seus dados para envio de publicidade de terceiros nem os
              compartilhamos com anunciantes.
            </p>
          </Section>

          <Section title="4. Base legal (LGPD)">
            <p>
              O tratamento dos seus dados é realizado com fundamento no{" "}
              <strong style={{ color: "#fff" }}>
                art. 7º, V, da Lei 13.709/2018 (execução de contrato)
              </strong>
              : os dados são necessários para prestar o serviço que você solicitou. O e-mail é
              obtido por meio de autenticação Google, com seu consentimento explícito ao fazer
              login.
            </p>
          </Section>

          <Section title="5. Compartilhamento de dados">
            <p>Seus dados são armazenados no Firebase (Google Cloud), sujeito à{" "}
              <a
                href="https://firebase.google.com/support/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ea580c" }}
              >
                política de privacidade do Firebase
              </a>
              . Não vendemos, alugamos nem cedemos seus dados a terceiros para fins comerciais.
            </p>
          </Section>

          <Section title="6. Retenção dos dados">
            <p>
              Os dados de agendamento são mantidos por até{" "}
              <strong style={{ color: "#fff" }}>5 anos</strong> para fins de controle operacional
              e atendimento a eventuais disputas. Após esse prazo, são excluídos automaticamente.
              Você pode solicitar a exclusão antecipada a qualquer momento (veja seção 7).
            </p>
          </Section>

          <Section title="7. Seus direitos">
            <p>Nos termos da LGPD, você pode:</p>
            <ul className="mt-2 space-y-1.5 pl-4 list-disc marker:text-orange-500">
              <li>Confirmar que tratamos seus dados e acessá-los</li>
              <li>Solicitar correção de dados incompletos ou incorretos</li>
              <li>Solicitar a exclusão dos seus dados</li>
              <li>Revogar seu consentimento a qualquer momento</li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer desses direitos, entre em contato pelo e-mail indicado na
              seção 1. Respondemos em até 15 dias úteis.
            </p>
          </Section>

          <Section title="8. Cookies e rastreamento">
            <p>
              Este site não utiliza cookies de rastreamento ou pixels de publicidade. O Firebase
              Authentication pode armazenar tokens de sessão no seu dispositivo para manter o
              login ativo. Esses tokens não são compartilhados com terceiros.
            </p>
          </Section>

          <Section title="9. Menores de idade">
            <p>
              Nosso serviço não se destina a menores de 18 anos. Não coletamos intencionalmente
              dados de crianças ou adolescentes.
            </p>
          </Section>

          <Section title="10. Alterações nesta política">
            <p>
              Podemos atualizar esta política periodicamente. A data da última revisão estará
              sempre indicada no topo da página. Em caso de alterações relevantes, informaremos
              via e-mail cadastrado.
            </p>
          </Section>

          <Section title="11. Contato">
            <p>
              Dúvidas sobre privacidade? Fale com nosso responsável pelo tratamento de dados:
            </p>
            <Placeholder label="Nome do responsável (DPO ou proprietário)" />
            <Placeholder label="E-mail de contato para privacidade" />
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
          Ao utilizar o sistema de agendamento da Full Sound Garage, você declara ter lido e
          compreendido esta Política de Privacidade.
        </div>

        <div className="mt-8 flex gap-4 text-sm">
          <Link to="/termos" style={{ color: "#ea580c" }}>
            Termos de Uso →
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

/** Placeholder visual para dados que o dono precisa preencher */
function Placeholder({ label }: { label: string }) {
  return (
    <p
      className="mt-1.5 rounded-md px-3 py-1.5 text-xs font-mono"
      style={{
        background: "rgba(234,88,12,0.08)",
        border: "1px dashed rgba(234,88,12,0.35)",
        color: "#ea580c",
      }}
    >
      ⚠ preencher: {label}
    </p>
  );
}