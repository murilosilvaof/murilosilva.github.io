export const projectDetails = {
    michelle: {
        role: "Desenvolvi e publiquei a página estática, adaptei a identidade visual para a web e organizei as áreas de atuação, as etapas do atendimento e os canais de contato.",
        points: ["Abertura com retrato profissional e identidade visual em vinho e dourado.", "Menu adaptado para celular e acesso ao WhatsApp, Instagram e e-mail."],
        gallery: [
            { image: "capas/michelle.webp", title: "Versão desktop", description: "Abertura com retrato, posicionamento profissional e acesso ao atendimento." },
            { image: "capas/michelle-mobile.webp", portrait: true, title: "Versão mobile", description: "Conteúdo e controles de navegação adaptados ao espaço da tela." },
            { image: "capas/michelle-post.webp", portrait: true, title: "Arte para o feed", description: "Peça de divulgação com a página inicial no desktop." },
            { image: "capas/michelle-story.webp", portrait: true, title: "Arte para stories", description: "Peça de divulgação com a seção de áreas de atuação no celular." }
        ]
    },
    orbit: {
        role: "Desenvolvi o frontend e o backend para a MDR Advocacia, integrei GLPI, Microsoft Entra ID e Microsoft Planner e preparei a implantação com Docker.",
        tech: ["Docker", "Microsoft Graph", "GLPI"],
        points: ["Login corporativo e permissões por perfil.", "Acompanhamento de chamados, tarefas, avaliações e aprovações."],
        gallery: [
            { image: "orbit/tela_login.png", title: "Login corporativo", description: "Acesso por Microsoft Entra ID com perfis para colaboradores, técnicos e supervisores." },
            { image: "orbit/dashboard.png", title: "Dashboard operacional", description: "Indicadores para acompanhar chamados e pendências." },
            { image: "orbit/tela_chamados.png", title: "Fila de chamados", description: "Atendimento integrado ao GLPI, com histórico, anexos e atribuição de técnicos." },
            { image: "orbit/kanban.png", title: "Kanban", description: "Quadro de tarefas integrado ao Microsoft Planner, com etapas, responsáveis e bonificação." },
            { image: "orbit/abertura_chamados.png", title: "Abertura guiada", description: "Formulário com categorização, anexos e sugestões da base de conhecimento." },
            { image: "orbit/avaliacao.png", title: "Avaliação do atendimento", description: "Validação da solução e avaliação do chamado." }
        ]
    },
    mdr: {
        role: "Atuei no desenvolvimento e na manutenção do portal, nas melhorias de interface e no apoio à infraestrutura de TI.",
        gallery: [
            { image: "sitemdr/mdr-site.png", title: "Página inicial", description: "Apresentação do escritório e acesso às informações institucionais." }
        ]
    },
    nic: {
        role: "Desenvolvi o sistema para a MDR Advocacia, integrei o Chatwoot e atuei na implantação e manutenção em servidor.",
        points: ["Processos e prazos centralizados para a equipe jurídica.", "Canais oficiais de WhatsApp integrados ao atendimento."],
        gallery: [
            { image: "nic/login.png", title: "Controle de acesso", description: "Tela de entrada do sistema interno." },
            { image: "nic/principal.png", title: "Operação central", description: "Acesso aos fluxos e às rotinas do setor jurídico." },
            { image: "nic/dashboard.png", title: "Dashboard interno", description: "Indicadores do volume operacional." },
            { image: "nic/templates.png", title: "Modelos de mensagem", description: "Modelos para padronizar respostas via Chatwoot." },
            { image: "nic/conversanic.png", title: "Conversas do NIC", description: "Histórico de comunicação no fluxo de atendimento." },
            { image: "nic/conversawhats.png", title: "Integração com WhatsApp", description: "Atendimento pelos canais oficiais do escritório usando o Chatwoot." }
        ]
    },
    ism: {
        role: "Estruturei a experiência de navegação, a oferta comercial e o fluxo de compra dos cursos.",
        tech: ["JavaScript", "LMS"],
        gallery: [
            { image: "ismcursos/ism.png", title: "Entrada da plataforma", description: "Catálogo e apresentação da oferta de cursos." },
            { image: "ismcursos/ofertas.png", title: "Ofertas", description: "Página comercial para comparar planos e acessar a compra." },
            { image: "ismcursos/carrinho.png", title: "Carrinho e checkout", description: "Fluxo de compra integrado à plataforma educacional." }
        ]
    },
    mybarbershop: {
        role: "Desenvolvi a experiência responsiva e o fluxo de reserva, com pagamento simulado e confirmação pelo WhatsApp.",
        tech: ["WhatsApp", "Pix"],
        points: ["Seleção de serviço, profissional, data e horário.", "Mensagem de confirmação preparada para o WhatsApp do barbeiro."],
        gallery: [
            { image: "mybarbershop/dashboard.png", title: "Página inicial", description: "Abertura do site com apresentação da barbearia e chamada para reservar." },
            { image: "mybarbershop/services.png", title: "Serviços e preços", description: "Catálogo com descrição, duração e preço de cada serviço." },
            { image: "mybarbershop/equipe.png", title: "Equipe", description: "Apresentação dos profissionais disponíveis." },
            { image: "mybarbershop/agendamento.png", title: "Agendamento em etapas", description: "Fluxo de escolha de serviço, barbeiro, data e forma de pagamento." },
            { image: "mybarbershop/confirmaagendamentowhats.png", title: "Confirmação por WhatsApp", description: "Mensagem de confirmação com link de aceite da reserva." }
        ]
    },
    marcato: {
        role: "Desenvolvi o sistema full stack para a Escola de Música da UFRN, incluindo a consulta de disponibilidade e as confirmações automáticas.",
        tech: ["PHPMailer"],
        gallery: [
            { image: "marcato/principal.png", title: "Agenda de reservas", description: "Interface para verificar horários disponíveis e registrar reservas." },
            { image: "marcato/email.png", title: "Confirmação por e-mail", description: "Comunicação automática sobre o status da reserva." }
        ],
        links: [{ href: "https://github.com/murilosilvaof/sistema-reservas-emufrn", label: "Ver código no GitHub" }]
    },
    safestop: {
        role: "Desenvolvi o fluxo de alertas, o compartilhamento com a comunidade e a simulação de contato com a segurança patrimonial.",
        points: ["Registro de alertas por parada, com nível de risco e opção de anonimato.", "Demonstração de alerta sonoro e aviso em múltiplos aparelhos."],
        gallery: [
            { image: "safestop/principal.png", title: "Página inicial", description: "Acesso ao registro de ocorrências e aos outros recursos do aplicativo." },
            { image: "safestop/principal.png", video: "safestop/SafeStop-Test.mp4", title: "Demonstração de alerta", description: "Vídeo do acionamento da botoeira com alarme sonoro e aviso simultâneo nos aparelhos." },
            { image: "safestop/chatcentral.png", title: "Chat central", description: "Simulação de contato com a central de segurança." },
            { image: "safestop/horarios.png", title: "Horários e rotas", description: "Área de consulta das linhas do circular." },
            { image: "safestop/perfil.png", title: "Perfil", description: "Área de organização das informações do usuário." },
            { image: "safestop/safestop.png", title: "Identidade do MVP", description: "Tela complementar do aplicativo." }
        ],
        links: [{ href: "https://pt.linkedin.com/posts/murilosilvaof_safestop-iot-reactnative-activity-7474846257816154113-oCYU", label: "Ver publicação no LinkedIn" }]
    },
    convite: {
        role: "Os exemplos da galeria foram criados para uma festa de 15 anos. Jardim Encantado tem um envelope floral e uma alameda iluminada. Baile em vinho e dourado tem monograma e uma composição clássica.",
        points: [
            "Abertura animada com flores e pétalas, controle da trilha instrumental e layout pensado para celular.",
            "Localização com acesso ao GPS, contagem regressiva e confirmação de presença pelo WhatsApp.",
            "Sugestões de presentes e QR Code personalizado para reunir fotos e vídeos da festa em uma pasta compartilhada."
        ],
        models: [
            {
                label: "Jardim Encantado",
                gallery: [
                    { image: "convite/jardim/capa.webp", video: "convite/jardim/abertura.webm", portrait: true, title: "Abertura em vídeo", description: "Transição do envelope para o jardim, com flores e pétalas em movimento. A prévia em vídeo é silenciosa." },
                    { image: "convite/jardim/capa.webp", portrait: true, title: "Capa do Jardim Encantado", description: "Um envelope com rosas, selo de 15 anos e uma alameda iluminada dá início ao convite." },
                    { image: "convite/jardim/entrada.webp", portrait: true, title: "Convite aberto", description: "Luzes e pétalas emolduram o nome da aniversariante, os detalhes da festa e o acesso à confirmação de presença." },
                    { image: "convite/jardim/contagem.webp", portrait: true, title: "Contagem e confirmação", description: "Relógio regressivo e botões para confirmar presença pelo WhatsApp ou falar com a organização. A contagem exibida é ilustrativa." },
                    { image: "convite/jardim/galeria.webp", portrait: true, title: "Memórias da noite", description: "O QR Code original direcionava os convidados à pasta de fotos e vídeos da festa. Esta prévia usa um QR Code de demonstração." }
                ]
            },
            {
                label: "Baile em vinho e dourado",
                gallery: [
                    { image: "convite/capa.webp", video: "convite/abertura.webm", portrait: true, title: "Abertura em vídeo", description: "Veja a transição da capa para o convite, com flores, borboletas e pétalas em movimento. A prévia em vídeo é silenciosa." },
                    { image: "convite/entrada.webp", portrait: true, title: "Convite aberto", description: "O monograma e a composição em vinho e dourado dão entrada aos detalhes da festa e à rota via GPS." },
                    { image: "convite/contagem.webp", title: "Contagem regressiva", description: "O relógio acompanha a chegada da festa em dias, horas, minutos e segundos. A imagem usa uma contagem de exemplo." },
                    { image: "convite/presentes.webp", portrait: true, title: "Sugestões de presentes", description: "Sugestões organizadas por categoria para os convidados." },
                    { image: "convite/galeria.webp", portrait: true, title: "Fotos e vídeos por QR Code", description: "O QR Code original levava à pasta colaborativa da festa. A imagem mostra um QR Code de demonstração." }
                ]
            }
        ]
    },
    aprendai: {
        role: "Contribuí para a construção da experiência digital e para a validação da proposta em um programa de inovação.",
        gallery: [
            { image: "aprendai/aprendai.png", title: "Tutor educacional", description: "Página de apresentação da proposta de aprendizado com IA offline." }
        ]
    }
};
