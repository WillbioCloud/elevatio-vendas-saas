import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icons } from './Icons';
import { Lead, Property } from '../types';
import { useNotification } from '../contexts/NotificationContext';
import { generateContract } from '../utils/contractGenerator';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { SALE_DOCUMENTS, ADMIN_DOCUMENTS } from '../constants/contractTypes';

interface SaleContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contractData?: any;
}

const SaleContractModal: React.FC<SaleContractModalProps> = ({ isOpen, onClose, onSuccess, contractData }) => {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [documentType, setDocumentType] = useState('sale_standard');
  
  const [contractDetails, setContractDetails] = useState({
    buyer_document: '',
    buyer_profession: '',
    buyer_marital_status: '',
    buyer_address: '',
    buyer_spouse_name: '',
    buyer_spouse_document: '',
    buyer_spouse_profession: '',
    seller_document: '',
    seller_profession: '',
    seller_marital_status: '',
    seller_address: '',
    seller_spouse_name: '',
    seller_spouse_document: '',
    seller_spouse_profession: '',
    permuta_address: '',
    permuta_description: '',
    permuta_value: ''
  });

  const [formData, setFormData] = useState({
    lead_id: '',
    property_id: '',
    broker_id: '',
    sale_date: new Date().toISOString().split('T')[0],
    sale_total_value: '',
    sale_down_payment: '',
    sale_financing_value: '',
    sale_financing_bank: '',
    has_permutation: false,
    permutation_details: '',
    permutation_value: '',
    commission_percentage: '',
    commission_value: '',
    sale_is_cash: false,
    sale_payment_method: 'Pix',
    sale_consortium_value: '',
    installments_count: '12',
    due_day: '10',
    readjustment_index: 'IPCA',
    interest_rate: '1.0',
    spouse_details: '',
  });

  // Efeito Mágico: Autofill dos dados do Proprietário quando um imóvel é selecionado
  useEffect(() => {
    if (formData.property_id && properties.length > 0) {
      const selectedProp = properties.find(p => p.id === formData.property_id);
      if (selectedProp) {
        setContractDetails(prev => ({
          ...prev,
          seller_document: selectedProp.owner_document || prev.seller_document,
          seller_profession: selectedProp.owner_profession || prev.seller_profession,
          seller_marital_status: selectedProp.owner_marital_status || prev.seller_marital_status,
          seller_address: selectedProp.owner_address || prev.seller_address,
          seller_spouse_name: selectedProp.owner_spouse_name || prev.seller_spouse_name,
          seller_spouse_document: selectedProp.owner_spouse_document || prev.seller_spouse_document,
        }));
      }
    }
  }, [formData.property_id, properties]);

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  useEffect(() => {
    const fetchLeadProperties = async () => {
      if (!formData.lead_id) {
        setProperties([]);
        return;
      }

      const selectedLead = leads.find(l => l.id === formData.lead_id);
      if (!selectedLead) return;

      const leadBroker = (selectedLead as any).assigned_to;
      if (leadBroker) setFormData(prev => ({ ...prev, broker_id: leadBroker }));

      const propIds = new Set<string>();
      if ((selectedLead as any).property_id) propIds.add((selectedLead as any).property_id);
      if ((selectedLead as any).sold_property_id) propIds.add((selectedLead as any).sold_property_id);

      const interests = (selectedLead as any).interested_properties || [];
      interests.forEach((p: any) => { if (p.id) propIds.add(p.id); });

      if (propIds.size > 0) {
        const { data } = await supabase.from('properties').select('*').in('id', Array.from(propIds)).eq('listing_type', 'sale');
        if (data && data.length > 0) {
          setProperties(data as any);
          const firstProp = data[0];
          setFormData(prev => {
            const val = String(firstProp.price || '');
            const total = Number(val) || 0;
            const pct = Number(prev.commission_percentage) || 0;
            const calcVal = (total * pct) / 100;
            return {
              ...prev,
              property_id: firstProp.id,
              sale_total_value: val,
              commission_value: calcVal ? String(calcVal) : prev.commission_value
            };
          });
        } else {
          setProperties([]);
        }
      } else {
        setProperties([]);
      }
    };
    fetchLeadProperties();
  }, [formData.lead_id, leads]);

  // MODO DE VISUALIZAÇÃO: Preenche os dados se contractData existir
  useEffect(() => {
    if (isOpen && contractData) {
      setFormData(prev => ({
        ...prev,
        lead_id: contractData.lead_id || '',
        property_id: contractData.property_id || '',
        broker_id: contractData.broker_id || '',
        sale_date: contractData.start_date || '',
        sale_total_value: String(contractData.sale_total_value || ''),
        sale_down_payment: String(contractData.sale_down_payment || ''),
        sale_financing_value: String(contractData.sale_financing_value || ''),
        sale_financing_bank: contractData.sale_financing_bank || '',
        has_permutation: contractData.has_permutation || false,
        permutation_details: contractData.permutation_details || '',
        permutation_value: String(contractData.permutation_value || ''),
        commission_percentage: String(contractData.commission_percentage || ''),
        commission_value: String(contractData.commission_total || ''),
        sale_is_cash: contractData.sale_is_cash || false,
        sale_payment_method: contractData.sale_payment_method || 'Pix',
        sale_consortium_value: String(contractData.sale_consortium_value || ''),
      }));
    }
  }, [isOpen, contractData]);

  const fetchData = async () => {
    const { data: leadsData } = await supabase.from('leads').select('*').or('funnel_step.eq.venda_ganha,status.in.(Fechado,Venda Fechada,Venda Ganha)');
    if (leadsData) setLeads(leadsData as any);
    const { data: brokersData } = await supabase.from('profiles').select('id, name').eq('active', true);
    if (brokersData) setBrokers(brokersData);
  };

  const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const propId = e.target.value;
    const selectedProp = properties.find(p => p.id === propId);

    if (selectedProp?.price) {
      const val = String(selectedProp.price);
      const total = Number(val) || 0;
      const pct = Number(formData.commission_percentage) || 0;
      const calcVal = (total * pct) / 100;

      setFormData(prev => ({
        ...prev,
        property_id: propId,
        sale_total_value: val,
        commission_value: calcVal ? String(calcVal) : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, property_id: propId }));
    }
  };

  // --- LÓGICA INTELIGENTE DE CÁLCULO DE COMISSÃO E TOTAIS ---
  const handleTotalValueChange = (val: string) => {
    const total = Number(val) || 0;
    const pct = Number(formData.commission_percentage) || 0;
    const calcVal = (total * pct) / 100;
    setFormData(prev => ({ ...prev, sale_total_value: val, commission_value: calcVal ? String(calcVal) : '' }));
  };

  const handleCommissionPctChange = (val: string) => {
    const pct = Number(val) || 0;
    const total = Number(formData.sale_total_value) || 0;
    const calcVal = (total * pct) / 100;
    setFormData(prev => ({ ...prev, commission_percentage: val, commission_value: calcVal ? String(calcVal) : '' }));
  };

  const handleCommissionValChange = (val: string) => {
    const cVal = Number(val) || 0;
    const total = Number(formData.sale_total_value) || 0;
    const calcPct = total > 0 ? (cVal / total) * 100 : 0;
    setFormData(prev => ({ ...prev, commission_value: val, commission_percentage: calcPct ? String(calcPct) : '' }));
  };

  const totalValue = Number(formData.sale_total_value) || 0;
  const downPayment = Number(formData.sale_down_payment) || 0;
  const financing = Number(formData.sale_financing_value) || 0;
  const permutation = formData.has_permutation ? (Number(formData.permutation_value) || 0) : 0;
  const consortium = Number(formData.sale_consortium_value) || 0;

  const totalCovered = downPayment + financing + consortium;
  const isFullyCovered = totalValue > 0 && totalCovered >= totalValue;

  // Efeito para auto-marcar como "À vista" se o valor já estiver 100% coberto
  useEffect(() => {
    if (isFullyCovered) {
      let bestMethod = 'Pix';

      if (financing >= consortium && financing > 0) {
        bestMethod = 'Financiamento';
      } else if (consortium > financing && consortium > 0) {
        bestMethod = 'Consórcio';
      } else if (financing > 0 || consortium > 0) {
        bestMethod = 'Misto';
      }

      setFormData(prev => {
        if (!prev.sale_is_cash || prev.sale_payment_method !== bestMethod) {
          return { ...prev, sale_is_cash: true, sale_payment_method: bestMethod };
        }
        return prev;
      });
    }
  }, [isFullyCovered, financing, consortium]);
  
  const saldoDevedor = formData.sale_is_cash ? 0 : Math.max(0, totalValue - downPayment - financing - permutation - consortium);
  const parcelasCount = Number(formData.installments_count) || 1;
  const valorParcela = parcelasCount > 0 ? saldoDevedor / parcelasCount : 0;

  const INDICES_ANUAIS: Record<string, number> = {
    'IPCA': 4.50,
    'IGPM': 3.70,
    'INCC': 5.10,
    'FIXO': 0
  };

  const handleGeneratePDF = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const selectedLead = leads.find(l => l.id === formData.lead_id);
    const selectedPropertyData = properties.find(p => p.id === formData.property_id);
    
    const contractDataObj = {
      buyer_name: selectedLead?.name || '',
      buyer_phone: selectedLead?.phone || '',
      buyer_email: selectedLead?.email || '',
      buyer_document: contractDetails.buyer_document,
      buyer_profession: contractDetails.buyer_profession,
      buyer_marital_status: contractDetails.buyer_marital_status,
      buyer_address: contractDetails.buyer_address,
      buyer_spouse_name: contractDetails.buyer_spouse_name,
      buyer_spouse_document: contractDetails.buyer_spouse_document,
      buyer_spouse_profession: contractDetails.buyer_spouse_profession,
      seller_name: selectedPropertyData?.owner_name || 'Proprietário Atual',
      seller_phone: selectedPropertyData?.owner_phone || '',
      seller_email: selectedPropertyData?.owner_email || '',
      seller_document: contractDetails.seller_document,
      seller_profession: contractDetails.seller_profession,
      seller_marital_status: contractDetails.seller_marital_status,
      seller_address: contractDetails.seller_address,
      seller_spouse_name: contractDetails.seller_spouse_name,
      seller_spouse_document: contractDetails.seller_spouse_document,
      seller_spouse_profession: contractDetails.seller_spouse_profession,
      permuta_address: contractDetails.permuta_address,
      permuta_description: contractDetails.permuta_description,
      permuta_value: contractDetails.permuta_value,
      property_address: selectedPropertyData ? `${selectedPropertyData.address}, ${selectedPropertyData.city}` : '',
      property_description: selectedPropertyData?.title || '',
      property_registration: selectedPropertyData?.property_registration || '',
      property_registry_office: selectedPropertyData?.property_registry_office || '',
      property_municipal_registration: selectedPropertyData?.property_municipal_registration || '',
      total_value: formData.sale_total_value,
      down_payment: formData.sale_down_payment || '0',
      bank_name: formData.sale_financing_bank || '',
      bank_agency: '',
      bank_account: '',
    };
    
    generateContract(documentType, contractDataObj, tenant);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalValue <= 0) return alert('O valor total da venda deve ser maior que zero.');

    setLoading(true);
    try {
      const payload = {
        type: 'sale',
        status: 'pending',
        lead_id: formData.lead_id || null,
        property_id: formData.property_id || null,
        broker_id: formData.broker_id || null,
        start_date: formData.sale_date,
        sale_total_value: totalValue,
        sale_down_payment: downPayment,
        sale_financing_value: financing,
        sale_financing_bank: formData.sale_financing_bank,
        has_permutation: formData.has_permutation,
        permutation_details: formData.permutation_details,
        permutation_value: permutation,
        sale_consortium_value: consortium,
        sale_is_cash: formData.sale_is_cash,
        sale_payment_method: formData.sale_is_cash ? formData.sale_payment_method : null,
        commission_percentage: Number(formData.commission_percentage) || 0,
        commission_total: Number(formData.commission_value) || 0,
        company_id: user?.company_id,
      };

      const { data: contract, error } = await supabase.from('contracts').insert([payload]).select().single();
      if (error) throw error;

      if (!formData.sale_is_cash && contract && saldoDevedor > 0) {
        const installments = [];
        let valorAtualParcela = valorParcela;
        const taxaAnualIndice = INDICES_ANUAIS[formData.readjustment_index] || 0;
        const jurosMensal = Number(formData.interest_rate) || 0;
        const taxaJurosAnualizada = jurosMensal * 12;

        for (let i = 1; i <= parcelasCount; i++) {
          if (i > 1 && (i - 1) % 12 === 0) {
            const reajusteTotal = (taxaAnualIndice + taxaJurosAnualizada) / 100;
            valorAtualParcela = valorAtualParcela * (1 + reajusteTotal);
          }

          const dueDate = new Date(formData.sale_date);
          dueDate.setMonth(dueDate.getMonth() + i);
          const targetDay = Number(formData.due_day);
          dueDate.setDate(targetDay);
          if (dueDate.getDate() !== targetDay) dueDate.setDate(0);

          installments.push({
            contract_id: contract.id,
            type: 'monthly',
            installment_number: i,
            amount: valorAtualParcela,
            due_date: dueDate.toISOString().split('T')[0],
            status: 'pending',
            notes: `Ano ${Math.ceil(i/12)} - Correção: ${formData.readjustment_index} + ${formData.interest_rate}% a.m.`
          });
        }
        await supabase.from('installments').insert(installments);
      }

      if (formData.sale_is_cash && formData.broker_id) {
        const { data: brokerData } = await supabase.from('profiles').select('xp').eq('id', formData.broker_id).single();
        await supabase.from('profiles').update({ xp: (brokerData?.xp || 0) + 1000 }).eq('id', formData.broker_id);
      }

      if (formData.property_id) {
        await supabase.from('properties').update({ status: 'Vendido' }).eq('id', formData.property_id);
      }

      addNotification({
        title: 'Contrato Gerado',
        message: 'Novo contrato de venda gerado com sucesso.',
        type: 'property'
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      alert('Erro ao salvar contrato: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white/95 dark:bg-[#0a0f1c]/95 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Icons.FileText size={24} className="text-brand-600" /> {contractData ? 'Visualização do Contrato' : 'Novo Contrato de Venda'}
            </h2>
            <p className="text-sm text-slate-500">Preencha os dados do negócio fechado.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"><Icons.X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="sale-form" onSubmit={handleSubmit} className="space-y-8">
            <fieldset disabled={!!contractData} className="contents">

            {/* 1. ENVOLVIDOS */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Icons.Users size={16} /> Envolvidos no Negócio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Data da Venda</label>
                  <input type="date" required value={formData.sale_date} onChange={e => setFormData({ ...formData, sale_date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 bg-white text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Cliente (Comprador)</label>
                  <select required value={formData.lead_id} onChange={e => setFormData({ ...formData, lead_id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 bg-white text-sm">
                    <option value="">Selecione um cliente...</option>
                    {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Imóvel Vendido</label>
                  <select required value={formData.property_id} onChange={handlePropertyChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 bg-white text-sm">
                    <option value="">Selecione o imóvel...</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Corretor Responsável</label>
                  <select required value={formData.broker_id} onChange={e => setFormData({ ...formData, broker_id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 bg-white text-sm">
                    <option value="">Selecione...</option>
                    {brokers.map(b => <option key={b.id} value={b.id}>{b.name.split(' ')[0]}</option>)}
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Dados do Cônjuge / Co-Comprador (Opcional)</label>
                  <input type="text" value={formData.spouse_details} onChange={e => setFormData({ ...formData, spouse_details: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 text-sm bg-white" placeholder="Nome, CPF, Estado Civil..." />
                </div>
              </div>
            </section>

            {/* 2. VALORES E COMISSÃO */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Icons.DollarSign size={16} /> Valores Principais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Valor Total da Venda (R$)</label>
                  <input type="number" required value={formData.sale_total_value} onChange={e => handleTotalValueChange(e.target.value)} className="w-full px-4 py-4 rounded-xl border-2 border-brand-300 bg-brand-50 text-brand-900 font-black text-2xl outline-none focus:border-brand-600 shadow-inner" placeholder="Ex: 850000" />
                </div>
                
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 md:col-span-2 grid grid-cols-2 gap-3">
                  <div className="col-span-2"><p className="text-[10px] font-bold text-slate-400 uppercase">Honorários / Comissão</p></div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Porcentagem (%)</label>
                    <input type="number" step="0.1" value={formData.commission_percentage} onChange={e => handleCommissionPctChange(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 text-sm font-semibold text-slate-700" placeholder="Ex: 5" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Valor (R$)</label>
                    <input type="number" value={formData.commission_value} onChange={e => handleCommissionValChange(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 text-sm font-bold text-brand-700 bg-white" placeholder="Ex: 42500" />
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Sinal / Entrada (R$)</label>
                  <input type="number" value={formData.sale_down_payment} onChange={e => setFormData({ ...formData, sale_down_payment: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 text-sm font-bold text-slate-800" placeholder="Ex: 170000" />
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, sale_down_payment: prev.commission_value }))} className="text-[10px] text-brand-600 hover:text-brand-800 font-bold mt-2 flex items-center gap-1 justify-end transition-colors" title="Preencher com o valor exato da comissão">
                    <Icons.Download size={12}/> Usar Comissão como Sinal
                  </button>
                </div>
              </div>
            </section>

            {/* TIPO DE DOCUMENTO CRECI */}
            <section className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Documento (Modelo CRECI)</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <optgroup label="Documentos de Venda">
                  {SALE_DOCUMENTS.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.title}</option>
                  ))}
                </optgroup>
                <optgroup label="Administrativos e Outros">
                  {ADMIN_DOCUMENTS.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.title}</option>
                  ))}
                </optgroup>
              </select>
            </section>

            {/* Dados Complementares - Continua aqui */}
            {documentType && documentType !== '' && (
              <div className="pt-4 border-t border-slate-100 animate-fade-in space-y-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Icons.FileText size={16} className="text-brand-500" /> Dados Complementares para o Contrato
                </h4>

                {/* Comprador */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Qualificação do Comprador</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">CPF/CNPJ</label>
                      <input type="text" value={contractDetails.buyer_document} onChange={e => setContractDetails({...contractDetails, buyer_document: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Estado Civil</label>
                      <select value={contractDetails.buyer_marital_status} onChange={e => setContractDetails({...contractDetails, buyer_marital_status: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500">
                        <option value="">Selecione...</option>
                        <option value="Solteiro(a)">Solteiro(a)</option>
                        <option value="Casado(a)">Casado(a)</option>
                        <option value="Divorciado(a)">Divorciado(a)</option>
                        <option value="Viúvo(a)">Viúvo(a)</option>
                        <option value="União Estável">União Estável</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Profissão</label>
                      <input type="text" value={contractDetails.buyer_profession} onChange={e => setContractDetails({...contractDetails, buyer_profession: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Endereço Residencial</label>
                      <input type="text" value={contractDetails.buyer_address} onChange={e => setContractDetails({...contractDetails, buyer_address: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500" />
                    </div>
                  </div>

                  {(contractDetails.buyer_marital_status === 'Casado(a)' || contractDetails.buyer_marital_status === 'União Estável') && (
                    <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Nome do Cônjuge</label>
                        <input type="text" value={contractDetails.buyer_spouse_name} onChange={e => setContractDetails({...contractDetails, buyer_spouse_name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">CPF do Cônjuge</label>
                        <input type="text" value={contractDetails.buyer_spouse_document} onChange={e => setContractDetails({...contractDetails, buyer_spouse_document: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Profissão do Cônjuge</label>
                        <input type="text" value={contractDetails.buyer_spouse_profession} onChange={e => setContractDetails({...contractDetails, buyer_spouse_profession: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Vendedor */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Qualificação do Vendedor</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">CPF/CNPJ</label>
                      <input type="text" value={contractDetails.seller_document} onChange={e => setContractDetails({...contractDetails, seller_document: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Estado Civil</label>
                      <select value={contractDetails.seller_marital_status} onChange={e => setContractDetails({...contractDetails, seller_marital_status: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500">
                        <option value="">Selecione...</option>
                        <option value="Solteiro(a)">Solteiro(a)</option>
                        <option value="Casado(a)">Casado(a)</option>
                        <option value="Divorciado(a)">Divorciado(a)</option>
                        <option value="Viúvo(a)">Viúvo(a)</option>
                        <option value="União Estável">União Estável</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Profissão</label>
                      <input type="text" value={contractDetails.seller_profession} onChange={e => setContractDetails({...contractDetails, seller_profession: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Endereço Residencial</label>
                      <input type="text" value={contractDetails.seller_address} onChange={e => setContractDetails({...contractDetails, seller_address: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500" />
                    </div>
                  </div>

                  {(contractDetails.seller_marital_status === 'Casado(a)' || contractDetails.seller_marital_status === 'União Estável') && (
                    <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Nome do Cônjuge</label>
                        <input type="text" value={contractDetails.seller_spouse_name} onChange={e => setContractDetails({...contractDetails, seller_spouse_name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">CPF do Cônjuge</label>
                        <input type="text" value={contractDetails.seller_spouse_document} onChange={e => setContractDetails({...contractDetails, seller_spouse_document: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Profissão do Cônjuge</label>
                        <input type="text" value={contractDetails.seller_spouse_profession} onChange={e => setContractDetails({...contractDetails, seller_spouse_profession: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500" />
                      </div>
                    </div>
                  )}
                </div>

                {documentType === 'permuta' && (
                  <div className="bg-brand-50 p-4 rounded-xl border border-brand-200 space-y-3 animate-fade-in">
                    <h5 className="text-xs font-bold text-brand-700 uppercase tracking-wider flex items-center gap-2">
                      <Icons.RefreshCw size={14} /> Dados do 2º Imóvel (Dado como pagamento)
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-slate-600 mb-1">Endereço Completo do 2º Imóvel</label>
                        <input type="text" value={contractDetails.permuta_address} onChange={e => setContractDetails({...contractDetails, permuta_address: e.target.value})} className="w-full bg-white border border-brand-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-slate-600 mb-1">Descrição (Tipo, área, matrícula)</label>
                        <input type="text" value={contractDetails.permuta_description} onChange={e => setContractDetails({...contractDetails, permuta_description: e.target.value})} className="w-full bg-white border border-brand-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Valor Atribuído na Permuta (R$)</label>
                        <input type="text" value={contractDetails.permuta_value} onChange={e => setContractDetails({...contractDetails, permuta_value: e.target.value})} className="w-full bg-white border border-brand-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. FORMAS DE PAGAMENTO */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Icons.CreditCard size={16} /> Formas de Pagamento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Financiamento Bancário (R$)</label>
                  <input type="number" value={formData.sale_financing_value} onChange={e => setFormData({ ...formData, sale_financing_value: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 text-sm" placeholder="Ex: 680000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Banco Financiador</label>
                  <input type="text" value={formData.sale_financing_bank} onChange={e => setFormData({ ...formData, sale_financing_bank: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 text-sm" placeholder="Ex: Caixa Econômica" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Consórcio (R$)</label>
                  <input type="number" value={formData.sale_consortium_value} onChange={e => setFormData({ ...formData, sale_consortium_value: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 text-sm" placeholder="Ex: 0" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="has_permutation" checked={formData.has_permutation} onChange={e => setFormData({ ...formData, has_permutation: e.target.checked })} className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500" />
                  <label htmlFor="has_permutation" className="text-sm font-bold text-slate-700">Possui Permuta (Troca de Imóvel)</label>
                </div>
                {formData.has_permutation && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1">Descrição do Imóvel Dado em Permuta</label>
                      <input type="text" value={formData.permutation_details} onChange={e => setFormData({ ...formData, permutation_details: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 text-sm" placeholder="Ex: Apartamento 2 quartos, Setor Central" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Valor da Permuta (R$)</label>
                      <input type="number" value={formData.permutation_value} onChange={e => setFormData({ ...formData, permutation_value: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 text-sm" placeholder="Ex: 0" />
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* 4. RESUMO E PARCELAMENTO */}
            <section className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border-2 border-slate-200">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icons.Calculator size={16} /> Resumo Financeiro
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Total Coberto</p>
                  <p className="text-lg font-bold text-slate-800">{totalCovered.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Saldo Devedor</p>
                  <p className="text-lg font-bold text-amber-600">{saldoDevedor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Parcelas</p>
                  <p className="text-lg font-bold text-slate-800">{parcelasCount}x</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Valor/Parcela</p>
                  <p className="text-lg font-bold text-brand-600">{valorParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
              </div>

              {isFullyCovered && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl mb-4 flex items-center gap-3 animate-fade-in">
                  <Icons.CheckCircle size={24} className="text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-800">Venda Quitada (À Vista)</p>
                    <p className="text-xs text-emerald-600">O valor total já está coberto. Não haverá parcelas futuras.</p>
                  </div>
                </div>
              )}

              {!formData.sale_is_cash && saldoDevedor > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Nº de Parcelas</label>
                    <input type="number" min="1" value={formData.installments_count} onChange={e => setFormData({ ...formData, installments_count: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Dia de Vencimento</label>
                    <input type="number" min="1" max="31" value={formData.due_day} onChange={e => setFormData({ ...formData, due_day: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Índice de Reajuste</label>
                    <select value={formData.readjustment_index} onChange={e => setFormData({ ...formData, readjustment_index: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 text-sm">
                      <option value="IPCA">IPCA</option>
                      <option value="IGPM">IGPM</option>
                      <option value="INCC">INCC</option>
                      <option value="FIXO">Fixo (Sem Reajuste)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Juros Mensal (%)</label>
                    <input type="number" step="0.1" value={formData.interest_rate} onChange={e => setFormData({ ...formData, interest_rate: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-brand-500 text-sm" />
                  </div>
                </div>
              )}
            </section>

            </fieldset>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
          {!contractData && (
            <button type="button" onClick={handleGeneratePDF} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm font-bold">
              <Icons.FileText size={16} /> Gerar PDF (Pré-visualização)
            </button>
          )}
          {contractData && <div></div>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm font-bold">Cancelar</button>
            {!contractData && (
              <button type="submit" form="sale-form" disabled={loading} className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-bold disabled:opacity-50 flex items-center gap-2">
                {loading ? <><Icons.Loader2 size={16} className="animate-spin" /> Salvando...</> : <><Icons.Save size={16} /> Salvar Contrato</>}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SaleContractModal;
