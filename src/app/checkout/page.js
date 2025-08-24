// app/checkout/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, PlusCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import apiClient from '../../services/api';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import styles from './page.module.css';

// --- Componente de Formulário de Endereço Reutilizável ---
const AddressForm = ({ formData, onInputChange, onCepSearch, cepLoading, isSaving }) => (
  <>
    <div className={styles.inputGroup}>
      <label htmlFor="cep">CEP</label>
      <input type="text" name="cep" id="cep" value={formData.cep} onChange={onInputChange} onBlur={onCepSearch} placeholder="00000-000" required disabled={isSaving}/>
      {cepLoading && <small>Buscando endereço...</small>}
    </div>
    <div className={styles.inputGroup}>
      <label htmlFor="rua">Endereço</label>
      <input type="text" name="rua" id="rua" value={formData.rua} onChange={onInputChange} required readOnly={cepLoading} disabled={isSaving}/>
    </div>
    <div className={styles.inputRow}>
      <div className={styles.inputGroup}>
        <label htmlFor="numero">Número</label>
        <input type="text" name="numero" id="numero" value={formData.numero} onChange={onInputChange} required disabled={isSaving}/>
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="complemento">Complemento (opcional)</label>
        <input type="text" name="complemento" id="complemento" value={formData.complemento} onChange={onInputChange} disabled={isSaving}/>
      </div>
    </div>
    <div className={styles.inputGroup}>
      <label htmlFor="bairro">Bairro</label>
      <input type="text" name="bairro" id="bairro" value={formData.bairro} onChange={onInputChange} required readOnly={cepLoading} disabled={isSaving}/>
    </div>
    <div className={styles.inputRow}>
      <div className={styles.inputGroup}>
        <label htmlFor="cidade">Cidade</label>
        <input type="text" name="cidade" id="cidade" value={formData.cidade} onChange={onInputChange} required readOnly={cepLoading} disabled={isSaving}/>
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="estado">Estado</label>
        <input type="text" name="estado" id="estado" value={formData.estado} onChange={onInputChange} required readOnly={cepLoading} disabled={isSaving}/>
      </div>
    </div>
  </>
);

export default function CheckoutPage() {
  const { cartItems, isLoggedIn, user, login, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: user?.email || '', nome: user?.nome || '', senha: '',
    cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', nome: 'Principal' // 'nome' aqui é o apelido do endereço
  });
  
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAddresses = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const response = await apiClient.get('/enderecos');
        const addresses = response.data;
        setUserAddresses(addresses);
        if (addresses.length > 0) {
          const principal = addresses.find(a => a.principal) || addresses[0];
          setSelectedAddressId(principal.id);
          setShowNewAddressForm(false);
        } else {
          setShowNewAddressForm(true); // Força abrir formulário se não houver endereços
        }
      } catch (err) { console.error("Erro ao buscar endereços", err); }
    }
  }, [isLoggedIn]);

  useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

  const calculateShipping = useCallback(async (address) => {
    if (!address?.cep || cartItems.length === 0) return;
    
    setShippingOptions([]);
    setSelectedShipping(null);
    setError('');

    try {
      const itemsPayload = cartItems.map(item => ({
        produtoId: item.id,
        variacaoId: item.variacaoId,
        quantidade: item.quantity,
      }));

      const response = await apiClient.post('/frete/calcular', {
        enderecoDestino: { cep: address.cep, cidade: address.cidade, estado: address.estado },
        itens: itemsPayload,
      });

      setShippingOptions(response.data);
      if (response.data.length > 0) {
        setSelectedShipping(response.data[0]);
      } else {
        setError("Nenhuma opção de entrega encontrada para este CEP.");
      }
    } catch (err) {
      setError("Não foi possível calcular o frete para este CEP. Verifique o valor e tente novamente.");
    }
  }, [cartItems]);

  useEffect(() => {
    if (isLoggedIn && selectedAddressId) {
      const selectedAddr = userAddresses.find(addr => addr.id === selectedAddressId);
      if (selectedAddr) {
        calculateShipping(selectedAddr);
      }
    }
  }, [selectedAddressId, userAddresses, isLoggedIn, calculateShipping]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleCepSearch = async () => {
    const cep = formData.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setCepLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`/cep/${cep}`);
      const { data } = response;
      const newAddressData = {
        ...formData,
        rua: data.rua,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
      };
      setFormData(newAddressData);
      if (!isLoggedIn) {
        calculateShipping(newAddressData);
      }
    } catch (err) {
      setError("CEP não encontrado.");
    } finally {
      setCepLoading(false);
    }
  };

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    setIsSavingAddress(true);
    setError('');
    try {
      const addressPayload = { ...formData, principal: userAddresses.length === 0 };
      await apiClient.post('/enderecos', addressPayload);
      await fetchAddresses(); // Recarrega a lista de endereços, que vai selecionar o novo e fechar o form
    } catch (err) {
      setError(err.response?.data?.erro || "Não foi possível salvar o endereço.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedShipping) {
      setError("Por favor, selecione um método de entrega.");
      return;
    }
    setIsProcessingPayment(true);
    setError('');

    try {
      let finalToken = localStorage.getItem('atelieRaisaToken');
      let finalAddress = null;

      if (!isLoggedIn) {
        const registerResponse = await apiClient.post('/auth/register', {
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
        });

        const { usuario, token } = registerResponse.data;
        finalToken = token;
        login(usuario, token);

        const addressPayload = { ...formData, principal: true };
        const addressResponse = await apiClient.post('/enderecos', addressPayload, { headers: { 'Authorization': `Bearer ${token}` } });
        finalAddress = addressResponse.data;
      
      } else {
        finalAddress = userAddresses.find(addr => addr.id === selectedAddressId);
      }

      if (!finalAddress) throw new Error("Endereço de entrega não selecionado.");

      const itemsPayload = cartItems.map(item => ({
        produtoId: item.id,
        variacaoId: item.variacaoId,
        quantidade: item.quantity,
      }));
      
      const pedidoResponse = await apiClient.post('/pedidos', {
        itens: itemsPayload,
        enderecoEntrega: finalAddress,
        freteId: selectedShipping.id,
      });

      const pedido = pedidoResponse.data;

      const checkoutResponse = await apiClient.post('/pagamentos/checkout', {
        pedidoId: pedido.id,
      });

      clearCart();
      window.location.href = checkoutResponse.data.checkoutUrl;

    } catch (err) {
      const errorMessage = err.response?.data?.erro || 'Ocorreu um erro ao finalizar o pedido. Verifique seus dados e tente novamente.';
      setError(errorMessage);
      setIsProcessingPayment(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.checkoutLayout}>
        <div className={styles.formSection}>
          <div className={styles.logoHeader}>
            <Link href="/"><span className={styles.logoPrimary}>Ateliê</span><span className={styles.logoSecondary}>Raisa</span></Link>
          </div>

          <form onSubmit={handlePayment}>
            {isLoggedIn && user ? (
              <div className={styles.formBlock}>
                <h2 className={styles.blockTitle}>Endereço de Entrega</h2>
                
                {userAddresses.length > 0 && !showNewAddressForm ? (
                    <>
                        {userAddresses.map(address => (
                            <div key={address.id} className={`${styles.addressCard} ${selectedAddressId === address.id ? styles.selected : ''}`} onClick={() => setSelectedAddressId(address.id)}>
                                <div className={styles.radioCircle}></div>
                                <div><strong>{address.nome || 'Endereço'}</strong><p>{address.rua}, {address.numero} - {address.cidade}</p></div>
                            </div>
                        ))}
                        <button type="button" onClick={() => setShowNewAddressForm(true)} className={styles.addNewButton}><PlusCircle size={18} /> Adicionar novo endereço</button>
                    </>
                ) : (
                    <div className={styles.newAddressContainer}>
                        {userAddresses.length === 0 && (
                            <p className={styles.blockSubtitle}>Você ainda não tem um endereço cadastrado. Por favor, preencha abaixo para continuar.</p>
                        )}
                        <div className={styles.inputGroup}>
                            <label htmlFor="nome">Apelido do Endereço (ex: Casa)</label>
                            <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleInputChange} required />
                        </div>
                        <AddressForm formData={formData} onInputChange={handleInputChange} onCepSearch={handleCepSearch} cepLoading={cepLoading} isSaving={isSavingAddress} />
                        <div className={styles.newAddressActions}>
                            {userAddresses.length > 0 && <button type="button" onClick={() => setShowNewAddressForm(false)} className={styles.cancelButton}>Cancelar</button>}
                            <button type="button" onClick={handleSaveNewAddress} className={styles.saveButton} disabled={isSavingAddress}>
                                {isSavingAddress ? 'Salvando...' : 'Salvar Endereço'}
                            </button>
                        </div>
                    </div>
                )}
              </div>
            ) : (
              <>
                <div className={styles.formBlock}>
                  <div className={styles.guestHeader}><h2 className={styles.blockTitle}>Crie sua conta para continuar</h2><p>Já tem uma? <Link href="/login">Faça Login</Link></p></div>
                  <div className={styles.inputGroup}><label htmlFor="nome">Nome Completo</label><input type="text" name="nome" id="nome" value={formData.nome} onChange={handleInputChange} required /></div>
                  <div className={styles.inputGroup}><label htmlFor="email">E-mail</label><input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required /></div>
                  <div className={styles.inputGroup}><label htmlFor="senha">Crie uma Senha</label><input type="password" name="senha" id="senha" value={formData.senha} onChange={handleInputChange} required /></div>
                </div>
                <div className={styles.formBlock}>
                  <h2 className={styles.blockTitle}>Endereço de Entrega</h2>
                  <AddressForm formData={formData} onInputChange={handleInputChange} onCepSearch={handleCepSearch} cepLoading={cepLoading} isSaving={isProcessingPayment}/>
                </div>
              </>
            )}
            
            <div className={styles.formBlock}>
              <h2 className={styles.blockTitle}>Método de Entrega</h2>
              {(cepLoading && !isLoggedIn) && <p>Calculando frete...</p>}
              {shippingOptions.length > 0 && shippingOptions.map(option => (
                <div key={option.id} className={`${styles.shippingOptionCard} ${selectedShipping?.id === option.id ? styles.selected : ''}`} onClick={() => setSelectedShipping(option)}>
                  <div className={styles.radioCircle}></div>
                  <div className={styles.shippingDetails}><strong>{option.name}</strong><span>{option.custom_description}</span></div>
                  <span className={styles.shippingCost}>R$ {parseFloat(option.price).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>
            
            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.paymentButtonWrapper}>
              <button type="submit" className={styles.paymentButton} disabled={!selectedShipping || isProcessingPayment || cepLoading || (isLoggedIn && showNewAddressForm)}>
                {isProcessingPayment ? 'Processando...' : 'Ir para o Pagamento'}
              </button>
              <div className={styles.secureMessage}><ShieldCheck size={16} /><span>Pagamento seguro via Mercado Pago</span></div>
            </div>
          </form>
        </div>
        <div className={styles.summarySection}>
          <SummaryCard shippingCost={selectedShipping?.price ? parseFloat(selectedShipping.price) : null} />
        </div>
      </div>
    </main>
  );
}