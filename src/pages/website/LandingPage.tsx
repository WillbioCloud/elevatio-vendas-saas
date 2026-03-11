import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { Check, Minus, Bot, Target, FileSignature, Headset, Kanban, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// ============================================================
// ELEVATIO VENDAS — Landing Page SaaS (Versão Fundida)
// Cards: novo design Webflow | Comparação: tabela completa
// ============================================================

// ── Dados dos planos (campos expandidos da tabela completa) ──
const PLANS = [
  {
    name: 'Starter', price: 54.90,
    desc: 'Ideal para corretores independentes que estão começando.',
    highlight: false,
    features: ['Até 2 usuários', 'Até 50 imóveis', '50 descrições com IA/mês', 'CRM Básico'],
    // Capacidade
    users: '2', properties: '50', photos: '40',
    // CRM
    funnel: true, pipeline: false, gamification: false, erp: false,
    // IA
    ia: '50/dia', aura: false,
    // Marketing
    site: true, portals: false, email_auto: false, api: false,
    // Suporte
    support: 'Email',
  },
  {
    name: 'Basic', price: 74.90,
    desc: 'Para pequenas imobiliárias com foco em crescimento.',
    highlight: false,
    features: ['Até 5 usuários', 'Até 400 imóveis', 'Pipeline de Leads', 'Gestão de Tarefas'],
    users: '5', properties: '400', photos: '60',
    funnel: true, pipeline: true, gamification: false, erp: false,
    ia: '200/dia', aura: false,
    site: true, portals: false, email_auto: false, api: false,
    support: 'Email / Chat',
  },
  {
    name: 'Profissional', price: 119.90,
    desc: 'O padrão da indústria para imobiliárias consolidadas.',
    highlight: true, badge: 'Mais popular',
    features: ['Até 8 usuários', 'Até 1.000 imóveis', 'Gamificação', 'Relatórios Avançados'],
    users: '8', properties: '1.000', photos: 'Ilimitado',
    funnel: true, pipeline: true, gamification: true, erp: false,
    ia: '600/dia', aura: false,
    site: true, portals: false, email_auto: false, api: true,
    support: 'Chat Prioritário',
  },
  {
    name: 'Business', price: 179.90,
    desc: 'Para quem precisa de controle total e automação.',
    highlight: false,
    features: ['Até 12 usuários', 'Até 2.000 imóveis', 'Contratos e Finanças', 'Automação de Marketing'],
    users: '12', properties: '2.000', photos: 'Ilimitado',
    funnel: true, pipeline: true, gamification: true, erp: true,
    ia: '1.000/dia', aura: false,
    site: true, portals: false, email_auto: true, api: true,
    support: 'WhatsApp',
  },
  {
    name: 'Premium', price: 249.90,
    desc: 'Tecnologia de ponta com IA para alta performance.',
    highlight: false,
    features: ['Até 20 usuários', 'Até 3.500 imóveis', 'Aura AI (Assistente)', 'Integração de Portais'],
    users: '20', properties: '3.500', photos: 'Ilimitado',
    funnel: true, pipeline: true, gamification: true, erp: true,
    ia: '1.450/dia', aura: 'Liberada',
    site: true, portals: false, email_auto: true, api: true,
    support: 'WhatsApp VIP',
  },
  {
    name: 'Elite', price: 349.90,
    desc: 'Sem limites. Para os maiores players do mercado.',
    highlight: false,
    features: ['Usuários Ilimitados', 'Imóveis Ilimitados', 'IA Ilimitada', 'Suporte Dedicado 24/7'],
    users: 'Ilimitado', properties: 'Ilimitado', photos: 'Ilimitado',
    funnel: true, pipeline: true, gamification: true, erp: true,
    ia: 'Ilimitado', aura: 'Prioridade VIP',
    site: true, portals: true, email_auto: true, api: true,
    support: 'VIP 24/7',
  },
];

// ── Linhas da tabela de comparação (completa do antigo) ──────
type CompareRow =
  | { category: string; label: string; field: string; bool?: false; icon?: React.ReactNode }
  | { category: string; label: string; field: string; bool: true; icon?: React.ReactNode };

const COMPARE_ROWS: CompareRow[] = [
  // Recursos Principais
  { category: 'Recursos Principais', label: 'Limite de Imóveis', field: 'properties' },
  { category: 'Recursos Principais', label: 'Fotos por Imóvel', field: 'photos' },
  { category: 'Recursos Principais', label: 'Usuários do Sistema', field: 'users' },
  // CRM & Gestão
  { category: 'CRM & Gestão Imobiliária', label: 'Funil de Vendas (Kanban)', field: 'funnel', bool: true, icon: <Kanban className="w-4 h-4 text-blue-400" /> },
  { category: 'CRM & Gestão Imobiliária', label: 'Esteira de Leads', field: 'pipeline', bool: true },
  { category: 'CRM & Gestão Imobiliária', label: 'Módulo de Gamificação', field: 'gamification', bool: true, icon: <Target className="w-4 h-4 text-yellow-400" /> },
  { category: 'CRM & Gestão Imobiliária', label: 'Módulo Contratos e Finanças', field: 'erp', bool: true, icon: <FileSignature className="w-4 h-4 text-green-400" /> },
  // IA
  { category: 'Inteligência Artificial', label: 'Gerador de Descrições (IA)', field: 'ia' },
  { category: 'Inteligência Artificial', label: 'Assistente Virtual Aura 24/7', field: 'aura', icon: <Bot className="w-4 h-4 text-purple-400" /> },
  // Marketing & Integrações
  { category: 'Marketing & Integrações', label: 'Site Premium Exclusivo', field: 'site', bool: true },
  { category: 'Marketing & Integrações', label: 'Integração Portais', field: 'portals', bool: true },
  { category: 'Marketing & Integrações', label: 'Automação de E-mail/WhatsApp', field: 'email_auto', bool: true },
  { category: 'Marketing & Integrações', label: 'API de Integração', field: 'api', bool: true },
  // Suporte
  { category: 'Atendimento ao Cliente', label: 'Canal de Suporte', field: 'support', icon: <Headset className="w-4 h-4 text-sky-400" /> },
];

const TESTIMONIALS = [
  { name: 'Rafael Duarte', company: 'Horizonte Imóveis', role: 'Diretor Comercial', quote: 'O sistema otimizou nosso fluxo de trabalho e facilitou a gestão dos leads. A integração com o site foi rápida e prática.', avatar: 'RD' },
  { name: 'Camila Torres', company: 'Nova Casa Group', role: 'Gestora Imobiliária', quote: 'A plataforma é fácil de usar e o suporte sempre eficiente. Centralizamos todos os imóveis e contatos em um só lugar.', avatar: 'CT' },
  { name: 'Lucas Prado', company: 'Prime Brokers', role: 'CEO', quote: 'A automação de tarefas e relatórios detalhados trouxeram mais controle e agilidade para nossa equipe.', avatar: 'LP' },
  { name: 'Fernanda Reis', company: 'Elite Realty', role: 'Coordenadora de Vendas', quote: 'A variedade de planos e templates personalizáveis atendeu exatamente às nossas necessidades de negócio.', avatar: 'FR' },
];

const FAQS = [
  { q: 'Como funciona o funil de leads?', a: 'Gerencie e acompanhe leads facilmente pelo Kanban visual, otimizando oportunidades e automatizando tarefas diárias.' },
  { q: 'Posso trocar de plano quando quiser?', a: 'Sim, a alteração de plano é simples e pode ser feita a qualquer momento pelo painel. O ajuste de valor é feito na próxima cobrança.' },
  { q: 'Quais integrações a plataforma oferece?', a: 'Integração com portais imobiliários, marketing digital, pagamentos via Asaas e assistente de IA para automação de descrições.' },
  { q: 'Há limite de usuários ou imóveis?', a: 'Cada plano tem limites próprios. O plano Elite oferece usuários e imóveis ilimitados para grandes operações.' },
  { q: 'Como é feita a cobrança dos planos?', a: 'A cobrança é mensal, feita automaticamente. Cancelamentos são processados pelo painel e o acesso continua até o fim do período pago.' },
];

const STATS = [
  { value: '1K+', label: 'Sites criados para imobiliárias' },
  { value: '100%', label: 'Disponibilidade garantida' },
  { value: '1.600', label: 'Leads gerenciados por mês' },
  { value: '+3M', label: 'Imóveis cadastrados' },
];

const FEATURES_LIST = [
  { step: '01', title: 'Escolha seu template', desc: '4 templates premium: Classic, Minimalist, Luxury e Modern. Personalize cores, logo e conteúdo pelo painel.' },
  { step: '02', title: 'Gerencie com CRM Kanban', desc: 'Pipeline visual de leads, automação de tarefas e distribuição inteligente para sua equipe de corretores.' },
  { step: '03', title: 'Publique e acompanhe ao vivo', desc: 'Site no ar em minutos. Edite, publique e acompanhe visitas, leads e conversões em tempo real.' },
];

// ── Hooks ─────────────────────────────────────────────────────
function useScrollSmoother() {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.2,
        effects: true,
        normalizeScroll: true,
      });
    });
    return () => ctx.revert();
  }, []);
}

function useFadeIn(ref: React.RefObject<HTMLElement>, opts?: { y?: number; stagger?: number; selector?: string }) {
  useLayoutEffect(() => {
    if (!ref.current) return;
    const targets = opts?.selector ? ref.current.querySelectorAll(opts.selector) : [ref.current];
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0, y: opts?.y ?? 30, duration: 0.6, ease: 'power2.out',
        stagger: opts?.stagger ?? 0,
        scrollTrigger: { trigger: ref.current!, start: 'top 92%', once: true },
      });
    });
    return () => ctx.revert();
  }, []);
}

// ── NAVBAR ────────────────────────────────────────────────────
const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, { opacity: 0, y: -20, duration: 0.5, ease: 'power2.out' });
    });
    return () => ctx.revert();
  }, []);

  return (
    <header ref={ref} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, transition: 'all 0.35s ease', background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent', boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.05)' : 'none' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1a56db, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px', color: scrolled ? '#0f172a' : '#ffffff' }}>Elevatio<span style={{ color: '#0ea5e9' }}>Vendas</span></span>
        </a>
        <nav style={{ display: 'flex', gap: 32 }} className="ev-nav-desktop">
          {[['Início','#hero'],['Recursos','#recursos'],['Planos','#planos'],['Comparar','#comparar'],['FAQ','#faq']].map(([l,h]) => (
            <a key={l} href={h} className="ev-nav-link" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, textDecoration: 'none', color: scrolled ? '#1e293b' : '#ffffff', transition: 'color 0.2s' }}>{l}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/admin/login" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, textDecoration: 'none', color: scrolled ? '#374151' : '#ffffff', padding: '8px 16px', transition: 'opacity 0.2s' }}>Entrar</a>
          <a href="#planos" className="ev-btn-primary" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, textDecoration: 'none', padding: '10px 22px', borderRadius: 10 }}>Teste grátis</a>
        </div>
      </div>
    </header>
  );
};

// ── HERO ──────────────────────────────────────────────────────
const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.from(eyebrowRef.current, { opacity: 0, y: 15, duration: 0.5, delay: 0.1 })
        .from(h1Ref.current,   { opacity: 0, y: 25, duration: 0.6 }, '-=0.3')
        .from(subRef.current,  { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from(ctaRef.current,  { opacity: 0, y: 15, duration: 0.5 }, '-=0.4')
        .from(proofRef.current,{ opacity: 0, y: 15, duration: 0.5 }, '-=0.3');
      gsap.to('.ev-orb-1', { y: -120, ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 }});
      gsap.to('.ev-orb-2', { y: -60,  ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 }});
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRef} style={{ minHeight: '100vh', background: 'linear-gradient(150deg, #0c1445 0%, #0f2460 35%, #1a3a7a 65%, #0c2d6e 100%)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 72 }}>
      <div className="ev-orb-1" style={{ position: 'absolute', top: '10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div className="ev-orb-2" style={{ position: 'absolute', bottom: '5%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,86,219,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px', width: '100%', position: 'relative' }}>
        <div style={{ maxWidth: 700 }}>
          <div ref={eyebrowRef} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0ea5e9', animation: 'ev-pulse 2s infinite' }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, color: '#bae6fd', letterSpacing: '0.05em' }}>Tudo para sua imobiliária crescer</span>
          </div>
          <h1 ref={h1Ref} style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(42px,6vw,72px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-2px', color: '#ffffff', marginBottom: 24 }}>
            Site e CRM<br />
            <span style={{ background: 'linear-gradient(90deg, #38bdf8, #7dd3fc, #e0f2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>em um só lugar</span>
          </h1>
          <p ref={subRef} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 20, lineHeight: 1.65, color: 'rgba(255,255,255,0.8)', marginBottom: 44, maxWidth: 560 }}>
            Gerencie imóveis, leads e equipe com automação, Kanban e templates exclusivos. Escolha o plano ideal e simplifique sua rotina.
          </p>
          <div ref={ctaRef} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="#planos" className="ev-btn-primary" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 700, textDecoration: 'none', padding: '16px 36px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Ver planos <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#recursos" className="ev-btn-secondary" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, textDecoration: 'none', padding: '16px 36px', borderRadius: 12 }}>Demonstração</a>
          </div>
          <div ref={proofRef} style={{ marginTop: 56, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex' }}>
              {['RD','CT','LP','FR'].map((ini,i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: `hsl(${210+i*20},70%,55%)`, border: '2px solid rgba(12,20,69,0.8)', marginLeft: i>0?-10:0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: "'DM Sans',sans-serif" }}>{ini}</div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>{[1,2,3,4,5].map(s=><svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}</div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>+1.000 imobiliárias já usam</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── STATS ─────────────────────────────────────────────────────
const Stats: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref, { selector: '.ev-stat', stagger: 0.1, y: 24 });
  return (
    <section ref={ref} style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
          {STATS.map((s, i) => (
            <div key={i} className="ev-stat" style={{ padding: '32px 24px', textAlign: 'center', borderRight: i < STATS.length-1 ? '1px solid #f1f5f9' : 'none' }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(36px,4vw,52px)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1, background: 'linear-gradient(135deg, #1a56db, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── FEATURES ──────────────────────────────────────────────────
const Features: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref, { selector: '.ev-feat', stagger: 0.1, y: 30 });

  const featureIcons = [
    <Kanban className="w-6 h-6 text-blue-500" />,
    <Target className="w-6 h-6 text-blue-500" />,
    <Zap className="w-6 h-6 text-blue-500" />,
  ];

  return (
    <section id="recursos" ref={ref} style={{ background: '#f8fafc', padding: '96px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#1a56db', textTransform: 'uppercase' as const, display: 'block', marginBottom: 16 }}>Como funciona</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(32px,4vw,48px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0f172a', marginBottom: 16 }}>Seu site e CRM em minutos</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: '#64748b', maxWidth: 500, margin: '0 auto' }}>4 templates: Minimalista, Luxuoso, Classic ou sob demanda.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {FEATURES_LIST.map((f, i) => (
            <div key={i} className="ev-feat ev-card-hover" style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -10, fontFamily: "'Sora',sans-serif", fontSize: 80, fontWeight: 900, color: 'rgba(26,86,219,0.04)', lineHeight: 1, userSelect: 'none' as const }}>{f.step}</div>
              <div style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 20, background: 'linear-gradient(135deg, rgba(26,86,219,0.1), rgba(14,165,233,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {featureIcons[i]}
              </div>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>{f.title}</h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#64748b', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── PRICING CARDS (novo design Webflow) ───────────────────────
const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref, { selector: '.ev-plan', stagger: 0.08, y: 30 });

  return (
    <section id="planos" ref={ref} style={{ background: '#fff', padding: '96px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#1a56db', textTransform: 'uppercase' as const, display: 'block', marginBottom: 16 }}>Planos e preços</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(32px,4vw,48px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0f172a', marginBottom: 16 }}>Planos flexíveis para todo porte</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: '#64748b', marginBottom: 32 }}>Compare recursos e escolha o plano ideal. Teste por 7 dias grátis.</p>

          {/* Toggle mensal/anual */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#f1f5f9', borderRadius: 100, padding: '4px 4px 4px 16px' }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: annual ? '#94a3b8' : '#0f172a' }}>Mensal</span>
            <button onClick={() => setAnnual(!annual)} style={{ width: 44, height: 24, borderRadius: 100, border: 'none', cursor: 'pointer', background: annual ? '#1a56db' : '#cbd5e1', position: 'relative', transition: 'background 0.25s' }}>
              <div style={{ position: 'absolute', top: 2, left: annual ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
            </button>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: annual ? '#0f172a' : '#94a3b8' }}>
              Anual <span style={{ color: '#16a34a', fontSize: 12 }}>−15%</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {PLANS.map((plan, i) => {
            const price = annual ? plan.price * 0.85 : plan.price;
            return (
              <div key={i} className={`ev-plan ${!plan.highlight ? 'ev-card-hover' : ''}`} style={{
                borderRadius: 20, padding: '32px 28px', position: 'relative', overflow: 'hidden',
                background: plan.highlight ? 'linear-gradient(150deg, #1a3a7a, #0f2460)' : '#fff',
                border: plan.highlight ? '1px solid rgba(14,165,233,0.4)' : '1px solid #e2e8f0',
                boxShadow: plan.highlight ? '0 24px 64px rgba(26,86,219,0.25)' : '0 2px 12px rgba(0,0,0,0.04)',
                transform: plan.highlight ? 'scale(1.03)' : 'scale(1)',
                zIndex: plan.highlight ? 10 : 1,
              }}>
                {plan.badge && (
                  <div style={{ position: 'absolute', top: 16, right: 16, background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", padding: '4px 12px', borderRadius: 100 }}>{plan.badge}</div>
                )}
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: plan.highlight ? '#fff' : '#0f172a', marginBottom: 8 }}>{plan.name}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.7)' : '#64748b', marginBottom: 20 }}>{plan.desc}</p>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 36, fontWeight: 900, letterSpacing: '-1.5px', color: plan.highlight ? '#7dd3fc' : '#1a56db' }}>R${price.toFixed(2).replace('.',',')}</span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: plan.highlight ? 'rgba(255,255,255,0.6)' : '#94a3b8' }}>/mês</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                  {plan.features.map((feat, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" fill={plan.highlight ? 'rgba(14,165,233,0.2)' : 'rgba(26,86,219,0.08)'}/>
                        <path d="M8 12l3 3 5-6" stroke={plan.highlight ? '#7dd3fc' : '#1a56db'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: plan.highlight ? 'rgba(255,255,255,0.9)' : '#475569' }}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(`/admin/login?mode=signup&plan=${plan.name.toLowerCase()}`)}
                  className={plan.highlight ? 'ev-btn-primary' : 'ev-btn-light'}
                  style={{ display: 'block', width: '100%', textAlign: 'center', fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, padding: '13px 0', borderRadius: 12, border: 'none', cursor: 'pointer' }}
                >
                  Testar grátis
                </button>
              </div>
            );
          })}
        </div>

        {/* CTA para ir à comparação */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <a href="#comparar" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#1a56db'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h18M3 14h18M10 3v18M14 3v18" strokeLinecap="round"/></svg>
            Comparar todos os recursos em detalhe
          </a>
        </div>
      </div>
    </section>
  );
};

// ── COMPARAÇÃO DE PLANOS (tabela completa do antigo, visual novo) ──
const PlanComparison: React.FC = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const [annual, setAnnual] = useState(false);
  useFadeIn(ref, { y: 30 });

  let lastCat = '';

  // Helper: renderiza célula de valor
  const renderCell = (val: any, isProCol: boolean) => {
    if (val === true)  return <Check className={`w-5 h-5 mx-auto ${isProCol ? 'text-blue-400' : 'text-green-400'}`} strokeWidth={2.5} />;
    if (val === false) return <Minus className="w-5 h-5 mx-auto text-gray-600" />;
    if (typeof val === 'string' && val.length > 0) {
      const isIlimitado = val.toLowerCase().includes('ilimitado') || val.toLowerCase().includes('prioridade');
      const isSpecial   = val.toLowerCase().includes('vip') || val.toLowerCase().includes('liberada');
      return (
        <span style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
          color: isIlimitado ? '#38bdf8' : isSpecial ? '#c084fc' : 'rgba(255,255,255,0.85)',
        }}>{val}</span>
      );
    }
    return <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{val}</span>;
  };

  return (
    <section id="comparar" ref={ref} style={{ background: '#070d1f', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '96px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#0ea5e9', textTransform: 'uppercase' as const, display: 'block', marginBottom: 16 }}>Detalhes Completos</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#fff', marginBottom: 12 }}>Compare os Planos</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: '#94a3b8', maxWidth: 560, margin: '0 auto 28px' }}>
            Visão detalhada de todos os recursos para ajudar você a tomar a melhor decisão para o seu negócio.
          </p>
          {/* Toggle mensal/anual (sincronizado com os cards) */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '4px 4px 4px 16px' }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: annual ? '#475569' : '#e2e8f0' }}>Mensal</span>
            <button onClick={() => setAnnual(!annual)} style={{ width: 40, height: 22, borderRadius: 100, border: 'none', cursor: 'pointer', background: annual ? '#1a56db' : 'rgba(255,255,255,0.2)', position: 'relative', transition: 'background 0.25s' }}>
              <div style={{ position: 'absolute', top: 1, left: annual ? 19 : 1, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
            </button>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: annual ? '#e2e8f0' : '#475569' }}>
              Anual <span style={{ color: '#4ade80', fontSize: 11 }}>−15%</span>
            </span>
          </div>
        </div>

        {/* Tabela */}
        <div className="ev-custom-scrollbar" style={{ overflowX: 'auto', paddingBottom: 8 }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: 1020 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {/* Coluna fixa: recurso */}
                <th style={{ padding: '16px 20px', background: '#070d1f', position: 'sticky', left: 0, zIndex: 20, minWidth: 230, fontFamily: "'Sora',sans-serif", color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
                  Recurso
                </th>
                {PLANS.map((plan, i) => {
                  const price = annual ? plan.price * 0.85 : plan.price;
                  const isPro = plan.highlight;
                  return (
                    <th key={i} style={{ padding: '12px 16px', textAlign: 'center', minWidth: 130, background: isPro ? 'rgba(14,165,233,0.08)' : '#070d1f', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                      {isPro && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 4 }}>⭐ Popular</div>}
                      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 800, color: isPro ? '#7dd3fc' : '#fff', marginBottom: 2 }}>{plan.name}</div>
                      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: isPro ? '#93c5fd' : '#0ea5e9' }}>
                        R${price.toFixed(2).replace('.',',')}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody style={{ fontSize: 14, color: '#cbd5e1' }}>
              {COMPARE_ROWS.map((row, ri) => {
                const newCat = row.category !== lastCat;
                lastCat = row.category;
                return (
                  <React.Fragment key={ri}>
                    {/* Linha de categoria */}
                    {newCat && (
                      <tr>
                        <td colSpan={PLANS.length + 1} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.03)', borderTop: ri > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.1em', textTransform: 'uppercase' as const, position: 'sticky', left: 0 }}>
                          {row.category}
                        </td>
                      </tr>
                    )}
                    {/* Linha de recurso */}
                    <tr className="ev-row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 20px', background: '#070d1f', position: 'sticky', left: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '4px 0 20px -8px rgba(0,0,0,0.6)' }}>
                        {row.icon && <span style={{ display: 'inline-flex', flexShrink: 0 }}>{row.icon}</span>}
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, color: '#cbd5e1' }}>{row.label}</span>
                      </td>
                      {PLANS.map((plan, pi) => {
                        const val = (plan as any)[row.field];
                        const isPro = plan.highlight;
                        return (
                          <td key={pi} style={{ padding: '14px 16px', textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.04)', background: isPro ? 'rgba(14,165,233,0.03)' : 'transparent' }}>
                            {renderCell(val, isPro)}
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                );
              })}

              {/* Linha de botões CTA */}
              <tr style={{ borderTop: '2px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '20px', background: '#070d1f', position: 'sticky', left: 0, zIndex: 10 }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Começar</span>
                </td>
                {PLANS.map((plan, i) => (
                  <td key={i} style={{ padding: '20px 12px', textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.04)', background: plan.highlight ? 'rgba(14,165,233,0.04)' : 'transparent' }}>
                    <button
                      onClick={() => navigate(`/admin/login?mode=signup&plan=${plan.name.toLowerCase()}`)}
                      style={{
                        fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        padding: '9px 18px', borderRadius: 10, border: 'none', width: '100%', transition: 'all 0.2s',
                        background: plan.highlight ? 'linear-gradient(135deg, #1a56db, #0ea5e9)' : 'rgba(255,255,255,0.07)',
                        color: plan.highlight ? '#fff' : 'rgba(255,255,255,0.7)',
                        boxShadow: plan.highlight ? '0 4px 14px rgba(14,165,233,0.35)' : 'none',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                    >
                      Assinar
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#334155', textAlign: 'center', marginTop: 16 }}>
          Role horizontalmente para ver todos os planos em telas menores.
        </p>
      </div>
    </section>
  );
};

// ── TESTIMONIALS ──────────────────────────────────────────────
const Testimonials: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref, { selector: '.ev-test', stagger: 0.1, y: 30 });
  return (
    <section ref={ref} style={{ background: '#fff', padding: '96px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#1a56db', textTransform: 'uppercase' as const, display: 'block', marginBottom: 16 }}>Depoimentos de clientes</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0f172a' }}>Resultados que transformam negócios</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="ev-test ev-card-hover" style={{ background: '#fff', borderRadius: 20, padding: '32px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 20 }}>{[1,2,3,4,5].map(s=><svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}</div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.7, color: '#374151', fontStyle: 'italic', marginBottom: 24 }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, hsl(${210+i*20},70%,55%), hsl(${210+i*20+20},70%,65%))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: "'DM Sans',sans-serif" }}>{t.avatar}</div>
                <div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{t.name}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#94a3b8' }}>{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── FAQ ───────────────────────────────────────────────────────
const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref, { selector: '.ev-faq', stagger: 0.05, y: 20 });
  return (
    <section id="faq" ref={ref} style={{ background: '#f8fafc', padding: '96px 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0f172a', marginBottom: 12 }}>Perguntas frequentes respondidas</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: '#64748b' }}>Tire dúvidas sobre planos, recursos e integrações.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {FAQS.map((faq, i) => (
            <div key={i} className="ev-faq" style={{ border: '1px solid', borderColor: open===i ? '#bfdbfe' : '#e2e8f0', borderRadius: 16, overflow: 'hidden', background: open===i ? '#fafbff' : '#fff', transition: 'all 0.3s ease' }}>
              <button onClick={() => setOpen(open===i ? null : i)} style={{ width: '100%', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' as const }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, color: '#0f172a' }}>{faq.q}</span>
                <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: open===i ? '#1a56db' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={open===i ? '#fff' : '#64748b'} strokeWidth="2.5" style={{ transform: open===i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s' }}><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </button>
              {open===i && <div style={{ padding: '0 24px 20px 24px' }}><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{faq.a}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── FINAL CTA ─────────────────────────────────────────────────
const FinalCTA: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref, { y: 30 });
  return (
    <section ref={ref} style={{ background: 'linear-gradient(150deg, #0c1445 0%, #1a3a7a 100%)', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 32px', textAlign: 'center', position: 'relative' }}>
        <span style={{ display: 'inline-block', fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#0ea5e9', textTransform: 'uppercase' as const, marginBottom: 20 }}>Escolha o plano certo para você</span>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, letterSpacing: '-2px', color: '#fff', marginBottom: 20, lineHeight: 1.1 }}>Impulsione sua imobiliária hoje</h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: 'rgba(255,255,255,0.7)', marginBottom: 44 }}>Comece grátis por 7 dias. Sem cartão de crédito.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#planos" className="ev-btn-primary" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 700, textDecoration: 'none', padding: '16px 40px', borderRadius: 12 }}>Começar agora</a>
          <a href="mailto:contato@elevatiovendas.com" className="ev-btn-secondary" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, textDecoration: 'none', padding: '16px 40px', borderRadius: 12 }}>Falar com equipe</a>
        </div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 28 }}>contato@elevatiovendas.com · +55 (64) 99923-2217</p>
      </div>
    </section>
  );
};

// ── FOOTER ────────────────────────────────────────────────────
const Footer: React.FC = () => (
  <footer style={{ background: '#070d1f', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '56px 0 32px' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #1a56db, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: '#fff' }}>Elevatio<span style={{ color: '#0ea5e9' }}>Vendas</span></span>
          </div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 280 }}>A plataforma completa de site e CRM para imobiliárias que querem crescer com tecnologia.</p>
        </div>
        {[{ title: 'Produto', items: ['Recursos','Planos','Templates','Integrações'] }, { title: 'Empresa', items: ['Sobre','Blog','Parceiros','Contato'] }].map(col => (
          <div key={col.title}>
            <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 16 }}>{col.title}</h4>
            {col.items.map(item => <div key={item} style={{ marginBottom: 10 }}><a href="#" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}>{item}</a></div>)}
          </div>
        ))}
        <div>
          <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 16 }}>Contato</h4>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
            <p>contato@elevatiovendas.com</p>
            <p>+55 (64) 99923-2217</p>
            <p style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Seg–Sex, 8h às 17h</p>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>© {new Date().getFullYear()} Elevatio Vendas. Todos os direitos reservados.</p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacidade','Termos'].map(item => <a key={item} href="#" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>{item}</a>)}
        </div>
      </div>
    </div>
  </footer>
);

// ── ROOT ──────────────────────────────────────────────────────
export default function LandingPage() {
  useScrollSmoother();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        #smooth-wrapper { overflow: hidden; position: fixed; top: 0; left: 0; width: 100%; height: 100%; }
        #smooth-content { will-change: transform; }
        @keyframes ev-pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .ev-nav-desktop { display: flex; }

        .ev-btn-primary {
          background: linear-gradient(135deg, #1a56db, #0ea5e9);
          color: #fff;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(14,165,233,0.35);
        }
        .ev-btn-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 24px rgba(14,165,233,0.5);
        }
        .ev-btn-secondary {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
          transition: all 0.3s ease;
        }
        .ev-btn-secondary:hover {
          background: rgba(255,255,255,0.15);
          transform: translateY(-2px);
        }
        .ev-btn-light {
          background: rgba(26,86,219,0.07);
          color: #1a56db;
          transition: all 0.3s ease;
        }
        .ev-btn-light:hover {
          background: rgba(26,86,219,0.15);
          transform: translateY(-2px);
        }
        .ev-card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .ev-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.08) !important;
        }
        .ev-row-hover { transition: background 0.2s ease; }
        .ev-row-hover:hover { background: rgba(255,255,255,0.03) !important; }
        .ev-nav-link:hover { color: #0ea5e9 !important; }

        .ev-custom-scrollbar::-webkit-scrollbar { height: 5px; }
        .ev-custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
        .ev-custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 10px; }
        .ev-custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }

        @media (max-width: 768px) {
          .ev-nav-desktop { display: none !important; }
          #smooth-wrapper { position: static !important; height: auto !important; overflow: visible !important; }
          #smooth-content { will-change: auto !important; }
        }
      `}</style>

      <Navbar />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Hero />
          <Stats />
          <Features />
          <Pricing />
          <PlanComparison />
          <Testimonials />
          <FAQ />
          <FinalCTA />
          <Footer />
        </div>
      </div>
    </>
  );
}