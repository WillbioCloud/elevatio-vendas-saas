import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// ============================================================
// ELEVATIO VENDAS — Landing Page SaaS
// Baseada no design do Webflow elevatiovendas
// GSAP ScrollSmoother + ScrollTrigger integrado
// ============================================================

const PLANS = [
  {
    name: 'Starter', price: 54.90, desc: 'Para corretores autônomos.',
    highlight: false,
    users: '2', properties: '50', ia: '10 descrições', images: '20 imagens/imóvel',
    erp: false, gamification: false, automation: false, support: false, dedicated: false,
    features: ['2 usuários', '50 imóveis', 'IA básica (10 descrições)', 'CRM completo', 'Site profissional'],
  },
  {
    name: 'Basic', price: 74.90, desc: 'Para pequenas equipes em crescimento.',
    highlight: false,
    users: '5', properties: '400', ia: '40 descrições', images: '35 imagens/imóvel',
    erp: false, gamification: false, automation: false, support: false, dedicated: false,
    features: ['5 usuários', '400 imóveis', '40 descrições com IA', 'Pipeline de leads', 'Site + CRM', '35 imagens/imóvel'],
  },
  {
    name: 'Profissional', price: 119.90, desc: 'Para equipes consolidadas.', highlight: true, badge: 'Mais popular',
    users: '8', properties: '1.000', ia: '100 descrições', images: '45 imagens/imóvel',
    erp: true, gamification: true, automation: false, support: false, dedicated: false,
    features: ['8 usuários', '1.000 imóveis', '100 descrições com IA', 'Contratos e Finanças (ERP)', 'Gamificação', '45 imagens/imóvel'],
  },
  {
    name: 'Business', price: 179.90, desc: 'Para imobiliárias de médio porte.',
    highlight: false,
    users: '12', properties: '2.000', ia: '250 descrições', images: '65 imagens/imóvel',
    erp: true, gamification: true, automation: false, support: false, dedicated: false,
    features: ['12 usuários', '2.000 imóveis', '250 descrições com IA', 'Leaderboard de equipe', 'Relatórios avançados', '65 imagens/imóvel'],
  },
  {
    name: 'Premium', price: 249.90, desc: 'Controle total e automação avançada.',
    highlight: false,
    users: '20', properties: '3.500', ia: 'Ilimitada', images: '75 imagens/imóvel',
    erp: true, gamification: true, automation: true, support: false, dedicated: false,
    features: ['20 usuários', '3.500 imóveis', 'IA ilimitada', 'Contratos e Finanças', 'Automação completa', '75 imagens/imóvel'],
  },
  {
    name: 'Elite', price: 349.90, desc: 'Sem limites para grandes operações.',
    highlight: false,
    users: 'Ilimitado', properties: 'Ilimitado', ia: 'Ilimitada', images: '100 imagens/imóvel',
    erp: true, gamification: true, automation: true, support: true, dedicated: true,
    features: ['Usuários ilimitados', 'Imóveis ilimitados', 'IA ilimitada', 'Suporte 24/7', 'Atendimento dedicado', '100 imagens/imóvel'],
  },
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

const COMPARE_ROWS = [
  { category: 'Capacidade', label: 'Usuários', field: 'users' },
  { category: 'Capacidade', label: 'Imóveis', field: 'properties' },
  { category: 'Capacidade', label: 'Imagens por imóvel', field: 'images' },
  { category: 'IA', label: 'Descrições com IA', field: 'ia' },
  { category: 'Módulos', label: 'Contratos e Finanças (ERP)', field: 'erp', bool: true },
  { category: 'Módulos', label: 'Gamificação e Leaderboard', field: 'gamification', bool: true },
  { category: 'Módulos', label: 'Automação avançada', field: 'automation', bool: true },
  { category: 'Suporte', label: 'Suporte 24/7', field: 'support', bool: true },
  { category: 'Suporte', label: 'Atendimento dedicado', field: 'dedicated', bool: true },
];

// ─────────────────────────────────────────────
// Hook: GSAP ScrollSmoother
// ─────────────────────────────────────────────
function useScrollSmoother() {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.4,
        effects: true,
        normalizeScroll: true,
      });
    });
    return () => ctx.revert();
  }, []);
}

// ─────────────────────────────────────────────
// Hook: ScrollTrigger fade-in genérico
// ─────────────────────────────────────────────
function useFadeIn(ref: React.RefObject<HTMLElement>, opts?: { y?: number; stagger?: number; selector?: string }) {
  useLayoutEffect(() => {
    if (!ref.current) return;
    const targets = opts?.selector ? ref.current.querySelectorAll(opts.selector) : [ref.current];
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0, y: opts?.y ?? 40, duration: 0.85, ease: 'power3.out',
        stagger: opts?.stagger ?? 0,
        scrollTrigger: { trigger: ref.current!, start: 'top 82%', once: true },
      });
    });
    return () => ctx.revert();
  }, []);
}

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
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
      gsap.from(ref.current, { opacity: 0, y: -24, duration: 0.8, ease: 'power3.out', delay: 0.2 });
    });
    return () => ctx.revert();
  }, []);

  const linkColor = scrolled ? '#374151' : 'rgba(255,255,255,0.85)';
  return (
    <header ref={ref} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, transition: 'all 0.35s', background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : 'none', boxShadow: scrolled ? '0 2px 32px rgba(0,0,0,0.06)' : 'none' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1a56db, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px', color: scrolled ? '#0f172a' : '#fff' }}>Elevatio<span style={{ color: '#0ea5e9' }}>Vendas</span></span>
        </a>
        <nav style={{ display: 'flex', gap: 36 }} className="ev-nav-desktop">
          {[['Início','#hero'],['Planos','#planos'],['Recursos','#recursos'],['FAQ','#faq']].map(([l,h]) => (
            <a key={l} href={h} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 500, textDecoration: 'none', color: linkColor, transition: 'color 0.2s' }}>{l}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/admin/login" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, textDecoration: 'none', color: scrolled ? '#374151' : 'rgba(255,255,255,0.9)', padding: '8px 16px' }}>Entrar</a>
          <a href="#planos" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, textDecoration: 'none', background: 'linear-gradient(135deg, #1a56db, #0ea5e9)', color: '#fff', padding: '10px 22px', borderRadius: 10, boxShadow: '0 4px 14px rgba(26,86,219,0.35)', transition: 'transform 0.2s, opacity 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity='0.9'; (e.currentTarget as HTMLElement).style.transform='translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity='1'; (e.currentTarget as HTMLElement).style.transform='translateY(0)'; }}
          >Teste grátis</a>
        </div>
      </div>
    </header>
  );
};

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from(eyebrowRef.current, { opacity: 0, y: 20, duration: 0.7, delay: 0.4 })
        .from(h1Ref.current, { opacity: 0, y: 40, duration: 0.9 }, '-=0.3')
        .from(subRef.current, { opacity: 0, y: 24, duration: 0.8 }, '-=0.5')
        .from(ctaRef.current, { opacity: 0, y: 20, duration: 0.7 }, '-=0.4')
        .from(proofRef.current, { opacity: 0, y: 16, duration: 0.6 }, '-=0.3');
      gsap.to('.ev-orb-1', { y: -120, ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 } });
      gsap.to('.ev-orb-2', { y: -60, ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 2.2 } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRef} style={{ minHeight: '100vh', background: 'linear-gradient(150deg, #0c1445 0%, #0f2460 35%, #1a3a7a 65%, #0c2d6e 100%)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 72 }}>
      <div className="ev-orb-1" style={{ position: 'absolute', top: '10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div className="ev-orb-2" style={{ position: 'absolute', bottom: '5%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,86,219,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px', width: '100%', position: 'relative' }}>
        <div style={{ maxWidth: 680 }}>
          <div ref={eyebrowRef} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0ea5e9', animation: 'ev-pulse 2s infinite' }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: '#7dd3fc', letterSpacing: '0.05em' }}>Tudo para sua imobiliária crescer</span>
          </div>
          <h1 ref={h1Ref} style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(42px,6vw,72px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-2px', color: '#fff', marginBottom: 24 }}>
            Site e CRM<br />
            <span style={{ background: 'linear-gradient(90deg, #0ea5e9, #38bdf8, #7dd3fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>em um só lugar</span>
          </h1>
          <p ref={subRef} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 20, lineHeight: 1.65, color: 'rgba(255,255,255,0.65)', marginBottom: 44, maxWidth: 560 }}>
            Gerencie imóveis, leads e equipe com automação, Kanban e templates exclusivos. Escolha o plano ideal e simplifique sua rotina.
          </p>
          <div ref={ctaRef} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="#planos" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 700, textDecoration: 'none', background: 'linear-gradient(135deg, #1a56db, #0ea5e9)', color: '#fff', padding: '16px 36px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 32px rgba(14,165,233,0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 12px 40px rgba(14,165,233,0.5)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow='0 8px 32px rgba(14,165,233,0.4)'; }}
            >Ver planos <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
            <a href="#recursos" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '16px 36px', borderRadius: 12, transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.14)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.08)'}
            >Demonstração</a>
          </div>
          <div ref={proofRef} style={{ marginTop: 56, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex' }}>
              {['RD','CT','LP','FR'].map((ini,i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: `hsl(${210+i*20},70%,55%)`, border: '2px solid rgba(12,20,69,0.8)', marginLeft: i>0?-10:0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: "'DM Sans',sans-serif" }}>{ini}</div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>{[1,2,3,4,5].map(s=><svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}</div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>+1.000 imobiliárias já usam</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────
const Stats: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref, { selector: '.ev-stat', stagger: 0.12, y: 32 });
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

// ─────────────────────────────────────────────
// FEATURES
// ─────────────────────────────────────────────
const Features: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref, { selector: '.ev-feat', stagger: 0.15, y: 40 });
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
            <div key={i} className="ev-feat" style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden', transition: 'transform 0.25s, box-shadow 0.25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 20px 48px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow='none'; }}
            >
              <div style={{ position: 'absolute', top: -20, right: -10, fontFamily: "'Sora',sans-serif", fontSize: 80, fontWeight: 900, color: 'rgba(26,86,219,0.04)', lineHeight: 1, userSelect: 'none' as const }}>{f.step}</div>
              <div style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 20, background: 'linear-gradient(135deg, rgba(26,86,219,0.1), rgba(14,165,233,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: '#1a56db' }}>{f.step}</span>
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

// ─────────────────────────────────────────────
// PRICING CARDS
// ─────────────────────────────────────────────
const Pricing: React.FC = () => {
  const [annual, setAnnual] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref, { selector: '.ev-plan', stagger: 0.1, y: 40 });

  return (
    <section id="planos" ref={ref} style={{ background: '#fff', padding: '96px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#1a56db', textTransform: 'uppercase' as const, display: 'block', marginBottom: 16 }}>Planos e preços</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(32px,4vw,48px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0f172a', marginBottom: 16 }}>Planos flexíveis para todo porte</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: '#64748b', marginBottom: 32 }}>Compare recursos e escolha o plano ideal. Teste por 7 dias grátis.</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#f1f5f9', borderRadius: 100, padding: '4px 4px 4px 16px' }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: annual ? '#94a3b8' : '#0f172a' }}>Mensal</span>
            <button onClick={() => setAnnual(!annual)} style={{ width: 44, height: 24, borderRadius: 100, border: 'none', cursor: 'pointer', background: annual ? '#1a56db' : '#cbd5e1', position: 'relative', transition: 'background 0.25s' }}>
              <div style={{ position: 'absolute', top: 2, left: annual ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
            </button>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: annual ? '#0f172a' : '#94a3b8' }}>Anual <span style={{ color: '#16a34a', fontSize: 12 }}>−20%</span></span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {PLANS.map((plan, i) => {
            const price = annual ? plan.price * 0.8 : plan.price;
            return (
              <div key={i} className="ev-plan" style={{ borderRadius: 20, padding: '32px 28px', position: 'relative', overflow: 'hidden', background: plan.highlight ? 'linear-gradient(150deg, #1a3a7a, #0f2460)' : '#fff', border: plan.highlight ? '1px solid rgba(14,165,233,0.4)' : '1px solid #e2e8f0', boxShadow: plan.highlight ? '0 24px 64px rgba(26,86,219,0.25)' : '0 2px 12px rgba(0,0,0,0.04)', transform: plan.highlight ? 'scale(1.02)' : 'scale(1)', transition: 'transform 0.25s, box-shadow 0.25s' }}
                onMouseEnter={e => { if (!plan.highlight) { (e.currentTarget as HTMLElement).style.transform='translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 16px 40px rgba(0,0,0,0.08)'; } }}
                onMouseLeave={e => { if (!plan.highlight) { (e.currentTarget as HTMLElement).style.transform='scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow='0 2px 12px rgba(0,0,0,0.04)'; } }}
              >
                {plan.badge && <div style={{ position: 'absolute', top: 16, right: 16, background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", padding: '4px 12px', borderRadius: 100 }}>{plan.badge}</div>}
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: plan.highlight ? '#fff' : '#0f172a', marginBottom: 8 }}>{plan.name}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.6)' : '#94a3b8', marginBottom: 20 }}>{plan.desc}</p>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 36, fontWeight: 900, letterSpacing: '-1.5px', color: plan.highlight ? '#7dd3fc' : '#1a56db' }}>R${price.toFixed(2).replace('.',',')}</span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: plan.highlight ? 'rgba(255,255,255,0.5)' : '#94a3b8' }}>/mês</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                  {plan.features.map((feat, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill={plan.highlight ? 'rgba(14,165,233,0.2)' : 'rgba(26,86,219,0.08)'}/><path d="M8 12l3 3 5-6" stroke={plan.highlight ? '#7dd3fc' : '#1a56db'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: plan.highlight ? 'rgba(255,255,255,0.8)' : '#475569' }}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <a href="#" style={{ display: 'block', textAlign: 'center', fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, textDecoration: 'none', padding: '13px 0', borderRadius: 12, background: plan.highlight ? 'linear-gradient(135deg, #0ea5e9, #38bdf8)' : 'rgba(26,86,219,0.07)', color: plan.highlight ? '#fff' : '#1a56db', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity='0.85'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity='1'}
                >Testar grátis</a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// COMPARAÇÃO DE PLANOS
// ─────────────────────────────────────────────
const PlanComparison: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  useFadeIn(ref, { y: 48 });

  useLayoutEffect(() => {
    if (!tableRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(tableRef.current!.querySelectorAll('.ev-cmp-row'), {
        opacity: 0, x: -20, duration: 0.45, stagger: 0.035, ease: 'power2.out',
        scrollTrigger: { trigger: tableRef.current, start: 'top 75%', once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  const CheckIcon = ({ ok }: { ok: boolean }) => ok ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="rgba(26,86,219,0.1)"/><path d="M8 12l3 3 5-6" stroke="#1a56db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#f1f5f9"/><path d="M15 9l-6 6M9 9l6 6" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/></svg>
  );

  let lastCat = '';

  return (
    <section ref={ref} style={{ background: '#f8fafc', padding: '96px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#1a56db', textTransform: 'uppercase' as const, display: 'block', marginBottom: 16 }}>Detalhes completos</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0f172a', marginBottom: 12 }}>Comparação dos planos</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: '#64748b' }}>Veja exatamente o que cada plano inclui antes de decidir.</p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div ref={tableRef} style={{ background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', minWidth: 900 }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '220px repeat(6, 1fr)', background: 'linear-gradient(135deg, #0f2460, #1a3a7a)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ padding: '20px 24px' }}>
                <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>Recurso</span>
              </div>
              {PLANS.map((plan, i) => (
                <div key={i} style={{ padding: '16px 12px', textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)', background: plan.highlight ? 'rgba(14,165,233,0.12)' : 'transparent' }}>
                  {plan.highlight && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, color: '#7dd3fc', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 4 }}>⭐ Popular</div>}
                  <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 800, color: plan.highlight ? '#7dd3fc' : '#fff' }}>{plan.name}</div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: plan.highlight ? '#93c5fd' : 'rgba(255,255,255,0.5)', marginTop: 2 }}>R${plan.price.toFixed(2).replace('.',',')}</div>
                </div>
              ))}
            </div>

            {/* Rows */}
            {COMPARE_ROWS.map((row, ri) => {
              const newCat = row.category !== lastCat;
              lastCat = row.category;
              return (
                <React.Fragment key={ri}>
                  {newCat && (
                    <div style={{ padding: '12px 24px', background: '#f8fafc', borderTop: ri > 0 ? '2px solid #e2e8f0' : 'none' }}>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{row.category}</span>
                    </div>
                  )}
                  <div className="ev-cmp-row" style={{ display: 'grid', gridTemplateColumns: '220px repeat(6, 1fr)', borderTop: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='#fafbff'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='transparent'}
                  >
                    <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, color: '#374151' }}>{row.label}</span>
                    </div>
                    {PLANS.map((plan, pi) => {
                      const val = (plan as any)[row.field];
                      return (
                        <div key={pi} style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #f1f5f9', background: plan.highlight ? 'rgba(26,86,219,0.02)' : 'transparent' }}>
                          {row.bool
                            ? <CheckIcon ok={val} />
                            : <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: '#374151', textAlign: 'center' as const }}>{val}</span>
                          }
                        </div>
                      );
                    })}
                  </div>
                </React.Fragment>
              );
            })}

            {/* Footer CTAs */}
            <div style={{ display: 'grid', gridTemplateColumns: '220px repeat(6, 1fr)', borderTop: '2px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Escolher</span>
              </div>
              {PLANS.map((plan, i) => (
                <div key={i} style={{ padding: '16px 8px', borderLeft: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: plan.highlight ? 'rgba(26,86,219,0.03)' : 'transparent' }}>
                  <a href="#" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, textDecoration: 'none', padding: '9px 16px', borderRadius: 10, background: plan.highlight ? 'linear-gradient(135deg, #1a56db, #0ea5e9)' : 'rgba(26,86,219,0.08)', color: plan.highlight ? '#fff' : '#1a56db', transition: 'opacity 0.2s', whiteSpace: 'nowrap' as const }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity='0.82'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity='1'}
                  >Testar</a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 12 }}>Role horizontalmente para ver todos os planos em telas menores.</p>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────
const Testimonials: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref, { selector: '.ev-test', stagger: 0.12, y: 36 });
  return (
    <section ref={ref} style={{ background: '#fff', padding: '96px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#1a56db', textTransform: 'uppercase' as const, display: 'block', marginBottom: 16 }}>Depoimentos de clientes</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0f172a' }}>Resultados que transformam negócios</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="ev-test" style={{ background: '#fff', borderRadius: 20, padding: '32px', border: '1px solid #e2e8f0', transition: 'transform 0.25s, box-shadow 0.25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 16px 40px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow='none'; }}
            >
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

// ─────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────
const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref, { selector: '.ev-faq', stagger: 0.08, y: 24 });
  return (
    <section id="faq" ref={ref} style={{ background: '#f8fafc', padding: '96px 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0f172a', marginBottom: 12 }}>Perguntas frequentes respondidas</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: '#64748b' }}>Tire dúvidas sobre planos, recursos e integrações.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {FAQS.map((faq, i) => (
            <div key={i} className="ev-faq" style={{ border: '1px solid', borderColor: open===i ? '#bfdbfe' : '#e2e8f0', borderRadius: 16, overflow: 'hidden', background: open===i ? '#fafbff' : '#fff' }}>
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

// ─────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────
const FinalCTA: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref, { y: 48 });
  return (
    <section ref={ref} style={{ background: 'linear-gradient(150deg, #0c1445 0%, #1a3a7a 100%)', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 32px', textAlign: 'center', position: 'relative' }}>
        <span style={{ display: 'inline-block', fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#0ea5e9', textTransform: 'uppercase' as const, marginBottom: 20 }}>Escolha o plano certo para você</span>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, letterSpacing: '-2px', color: '#fff', marginBottom: 20, lineHeight: 1.1 }}>Impulsione sua imobiliária hoje</h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: 'rgba(255,255,255,0.6)', marginBottom: 44 }}>Comece grátis por 7 dias. Sem cartão de crédito.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#planos" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 700, textDecoration: 'none', background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#fff', padding: '16px 40px', borderRadius: 12, boxShadow: '0 8px 32px rgba(14,165,233,0.4)', transition: 'transform 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform='translateY(0)'}
          >Começar agora</a>
          <a href="mailto:contato@elevatiovendas.com" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '16px 40px', borderRadius: 12 }}>Falar com equipe</a>
        </div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 28 }}>contato@elevatiovendas.com · +55 (64) 99923-2217</p>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
const Footer: React.FC = () => (
  <footer style={{ background: '#070d1f', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '56px 0 32px' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #1a56db, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: '#fff' }}>Elevatio<span style={{ color: '#0ea5e9' }}>Vendas</span></span>
          </div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 280 }}>A plataforma completa de site e CRM para imobiliárias que querem crescer com tecnologia.</p>
        </div>
        {[{ title: 'Produto', items: ['Recursos','Planos','Templates','Integrações'] }, { title: 'Empresa', items: ['Sobre','Blog','Parceiros','Contato'] }].map(col => (
          <div key={col.title}>
            <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 16 }}>{col.title}</h4>
            {col.items.map(item => <div key={item} style={{ marginBottom: 10 }}><a href="#" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>{item}</a></div>)}
          </div>
        ))}
        <div>
          <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 16 }}>Contato</h4>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
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

// ─────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────
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
