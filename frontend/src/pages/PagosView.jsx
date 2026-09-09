import { useState, useMemo } from "react";
import {
  CreditCard,
  ShoppingCart,
  History,
  FileText,
  Crown,
  Trash2,
  ChevronDown,
  ChevronUp,
  Download,
  Check,
  Loader2,
  BookOpen,
  Receipt,
  Zap,
  Crown as CrownIcon,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Eye,
  Printer,
} from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import Modal from "../components/Modal";
import PatternBg from "../components/PatternBg";
import FormField from "../components/FormField";
import FormButton from "../components/FormButton";
import { getInputClass } from "../utils/helpers";

const TABS = [
  { key: "carrito", label: "Carrito", icon: ShoppingCart },
  { key: "historial", label: "Historial", icon: History },
  { key: "facturas", label: "Facturas", icon: FileText },
  { key: "suscripcion", label: "Suscripción", icon: Crown },
];

const MOCK_CART = [
  { id: "lib-001", title: "Cien años de soledad", author: "Gabriel García Márquez", format: "ePub", price: 149.99, emoji: "\u{1F4DA}" },
  { id: "lib-002", title: "El principito", author: "Antoine de Saint-Exupéry", format: "PDF", price: 99.99, emoji: "\u{1F4D6}" },
];

const MOCK_HISTORY = [
  { id: "tx-001", date: "05 sep 2026", description: "Compra: Rayuela, Ficciones", amount: 279.98, status: "Completado", type: "Compra", items: [{ title: "Rayuela", format: "ePub", price: 169.99 }, { title: "Ficciones", format: "PDF", price: 109.99 }] },
  { id: "tx-002", date: "01 sep 2026", description: "Suscripción Premium - Septiembre", amount: 9.99, status: "Completado", type: "Suscripción", items: [{ title: "Plan Premium Mensual", format: "Suscripción", price: 9.99 }] },
  { id: "tx-003", date: "28 ago 2026", description: "Compra: Don Quijote de la Mancha", amount: 189.99, status: "Completado", type: "Compra", items: [{ title: "Don Quijote de la Mancha", format: "ePub", price: 189.99 }] },
  { id: "tx-004", date: "20 ago 2026", description: "Compra: La casa de los espíritus (reembolso solicitado)", amount: 159.99, status: "Reembolsado", type: "Compra", items: [{ title: "La casa de los espíritus", format: "PDF", price: 159.99 }] },
  { id: "tx-005", date: "15 ago 2026", description: "Suscripción Premium - Agosto", amount: 9.99, status: "Completado", type: "Suscripción", items: [{ title: "Plan Premium Mensual", format: "Suscripción", price: 9.99 }] },
  { id: "tx-006", date: "10 ago 2026", description: "Compra: Pedro Páramo", amount: 129.99, status: "Pendiente", type: "Compra", items: [{ title: "Pedro Páramo", format: "ePub", price: 129.99 }] },
];

const MOCK_INVOICES = [
  { id: "FAC-2026-001", date: "05 sep 2026", total: 279.98, status: "Pagada", items: [{ description: "Rayuela (ePub)", qty: 1, price: 169.99 }, { description: "Ficciones (PDF)", qty: 1, price: 109.99 }], paymentMethod: "Tarjeta terminación 4242" },
  { id: "FAC-2026-002", date: "01 sep 2026", total: 9.99, status: "Pagada", items: [{ description: "Plan Premium Mensual", qty: 1, price: 9.99 }], paymentMethod: "Tarjeta terminación 4242" },
  { id: "FAC-2026-003", date: "28 ago 2026", total: 189.99, status: "Pagada", items: [{ description: "Don Quijote de la Mancha (ePub)", qty: 1, price: 189.99 }], paymentMethod: "PayPal (juan@email.com)" },
  { id: "FAC-2026-004", date: "20 ago 2026", total: 159.99, status: "Anulada", items: [{ description: "La casa de los espíritus (PDF)", qty: 1, price: 159.99 }], paymentMethod: "Tarjeta terminación 4242" },
];

const PLANS = [
  { key: "basico", name: "Básico", price: 0, period: "", features: ["5 libros digitales al mes", "Acceso a clubes de lectura", "Anuncios incluidos", "Soporte por email"], highlighted: false, icon: BookOpen },
  { key: "premium", name: "Premium", price: 9.99, period: "/mes", features: ["Libros ilimitados", "Sin anuncios", "Lectura offline", "Acceso anticipado a novedades", "Soporte prioritario"], highlighted: true, icon: Zap },
  { key: "bibliotecario", name: "Bibliotecario", price: 19.99, period: "/mes", features: ["Todo lo de Premium", "Eventos exclusivos", "Descuentos en imprenta", "Club privado", "Gestor de cuenta dedicado", "API de integración"], highlighted: false, icon: Crown },
];

const STEPS = ["Método", "Datos", "Resumen", "Pago", "Listo"];

export default function PagosView({ user, addToast }) {
  const [activeTab, setActiveTab] = useState("carrito");
  const [cart, setCart] = useState(MOCK_CART);
  const [historyFilter, setHistoryFilter] = useState("Todas");
  const [expandedTx, setExpandedTx] = useState(null);
  const [invoiceFilter, setInvoiceFilter] = useState("Todas");

  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart]);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const filteredHistory = useMemo(() => {
    if (historyFilter === "Todas") return MOCK_HISTORY;
    if (historyFilter === "Compras") return MOCK_HISTORY.filter((tx) => tx.type === "Compra");
    if (historyFilter === "Suscripciones") return MOCK_HISTORY.filter((tx) => tx.type === "Suscripción");
    if (historyFilter === "Completado") return MOCK_HISTORY.filter((tx) => tx.status === "Completado");
    if (historyFilter === "Pendiente") return MOCK_HISTORY.filter((tx) => tx.status === "Pendiente");
    if (historyFilter === "Reembolsado") return MOCK_HISTORY.filter((tx) => tx.status === "Reembolsado");
    return MOCK_HISTORY;
  }, [historyFilter]);

  const filteredInvoices = useMemo(() => {
    if (invoiceFilter === "Todas") return MOCK_INVOICES;
    return MOCK_INVOICES.filter((inv) => inv.status === invoiceFilter);
  }, [invoiceFilter]);

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    addToast({ type: "info", message: "Libro removido del carrito" });
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) return;
    setCheckoutStep(0);
    setPaymentMethod("tarjeta");
    setCardNumber("");
    setCardName("");
    setCardExpiry("");
    setCardCvv("");
    setProcessing(false);
    setOrderNumber("");
    setShowCheckout(true);
  };

  const handleNextStep = () => {
    if (checkoutStep === 3) {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setOrderNumber(`ORD-${Date.now().toString().slice(-8)}`);
        setCheckoutStep(4);
        setCart([]);
        addToast({ type: "success", message: "¡Pago procesado exitosamente!" });
      }, 2500);
      return;
    }
    setCheckoutStep((prev) => prev + 1);
  };

  const handlePrevStep = () => setCheckoutStep((prev) => Math.max(0, prev - 1));

  const handleDownloadInvoice = (invId) => {
    addToast({ type: "info", message: `Descargando factura ${invId}...` });
  };

  const handlePrintInvoice = () => {
    addToast({ type: "info", message: "Preparando impresión..." });
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  const handleConfirmPlan = () => {
    if (selectedPlan) {
      setCurrentPlan(selectedPlan);
      setShowPlanModal(false);
      addToast({ type: "success", message: `¡Ahora tienes el plan ${selectedPlan.name}!` });
    }
  };

  const handleChangePlan = () => {
    setSelectedPlan(null);
    setShowPlanModal(false);
    setCurrentPlan(null);
    addToast({ type: "info", message: "Plan cancelado. Puedes elegir uno nuevo." });
  };

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const statusColor = (status) => {
    if (status === "Completado" || status === "Pagada") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "Pendiente") return "bg-amber-100 text-amber-700 border-amber-200";
    if (status === "Reembolsado" || status === "Anulada") return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="relative animate-fadeIn">
      <PatternBg />
      <SectionHeader
        eyebrow="Tienda digital"
        title="Sistema de Pagos"
        subtitle="Carrito, historial, facturas y suscripciones"
        icon={CreditCard}
      />

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-[#C9A97E]/60 pb-px mb-6">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === key ? "bg-gradient-to-r from-emerald-700 to-green-800 text-white shadow-md" : "text-[#6f6a55] hover:bg-amber-50"}`}
          >
            <Icon size={15} />
            {label}
            {key === "carrito" && cart.length > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-amber-400 text-[#2B2118] text-[10px] font-bold flex items-center justify-center">{cart.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ================= CARRITO TAB ================= */}
      {activeTab === "carrito" && (
        <div className="animate-fadeIn">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <BookOpen size={36} className="text-amber-400/50" />
              </div>
              <p className="text-[#2B2118] text-lg font-serif">Tu carrito está vacío</p>
              <p className="text-[#8a8368] text-sm mt-1">Explora nuestro catálogo para agregar libros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-3">
                {cart.map((item, i) => (
                  <div
                    key={item.id}
                    className="relative flex items-center gap-4 bg-white rounded-2xl border border-amber-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group animate-fadeIn"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-600 to-green-700" />
                    <div className="w-16 h-20 rounded-xl bg-gradient-to-br from-[#f5f0e4] to-[#ebe4d0] flex items-center justify-center text-3xl shadow-inner shrink-0 border border-[#C9A97E]/40">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-base text-[#2B2118] truncate">{item.title}</h3>
                      <p className="text-xs text-[#8a8368] mt-0.5">{item.author}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">{item.format}</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">Digital</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-serif text-lg text-[#2B2118]">${item.price.toFixed(2)}</p>
                      <p className="text-[10px] text-[#8a8368] uppercase tracking-wider">Qty: 1</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-transparent transition-all duration-200 cursor-pointer group-hover:opacity-100 opacity-60"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-amber-100/60 p-6 shadow-sm sticky top-6">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
                      <Receipt size={15} className="text-white" />
                    </div>
                    <h3 className="font-serif text-base text-[#2B2118]">Resumen del pedido</h3>
                  </div>
                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm text-[#6f6a55]">
                      <span>Subtotal ({cart.length} {cart.length === 1 ? "artículo" : "artículos"})</span>
                      <span className="font-semibold text-[#2B2118]">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#6f6a55]">
                      <span>IVA (16%)</span>
                      <span className="font-semibold text-[#2B2118]">${iva.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-[#C9A97E]/60 pt-3 flex justify-between">
                      <span className="font-serif text-lg text-[#2B2118]">Total</span>
                      <span className="font-serif text-lg text-[#2B2118]">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <FormButton variant="primary" onClick={handleProceedToPayment}>
                    <span className="flex items-center gap-2 justify-center">
                      Proceder al pago <ArrowRight size={15} />
                    </span>
                  </FormButton>
                  <p className="text-[10px] text-[#a89f81] text-center mt-3">Pago seguro · Los libros digitales se entregan al instante</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= HISTORIAL TAB ================= */}
      {activeTab === "historial" && (
        <div className="animate-fadeIn space-y-4">
          <div className="flex gap-2 flex-wrap">
            {["Todas", "Compras", "Suscripciones", "Completado", "Pendiente", "Reembolsado"].map((f) => (
              <button
                key={f}
                onClick={() => setHistoryFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${historyFilter === f ? "bg-gradient-to-r from-emerald-700 to-green-800 text-white shadow-md" : "bg-white border border-[#C9A97E] text-[#6f6a55] hover:bg-amber-50"}`}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <History size={36} className="text-amber-400/50" />
              </div>
              <p className="text-[#2B2118] text-lg font-serif">Sin transacciones</p>
              <p className="text-[#8a8368] text-sm mt-1">No hay transacciones que coincidan con el filtro</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((tx, i) => {
                const expanded = expandedTx === tx.id;
                return (
                  <div
                    key={tx.id}
                    className="bg-white rounded-2xl border border-amber-100/60 shadow-sm overflow-hidden transition-all duration-300 animate-fadeIn"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <button
                      onClick={() => setExpandedTx(expanded ? null : tx.id)}
                      className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-amber-50/50 transition-colors cursor-pointer"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${tx.type === "Compra" ? "bg-gradient-to-br from-emerald-500 to-green-700" : "bg-gradient-to-br from-amber-500 to-orange-600"}`}>
                        {tx.type === "Compra" ? <BookOpen size={17} className="text-white" /> : <Crown size={17} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#2B2118] truncate">{tx.description}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[#8a8368]">
                          <span>{tx.date}</span>
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border ${tx.type === "Compra" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{tx.type}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-serif text-lg text-[#2B2118]">${tx.amount.toFixed(2)}</p>
                        <span className={`inline-block text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border mt-1 ${statusColor(tx.status)}`}>{tx.status}</span>
                      </div>
                      <div className="shrink-0 ml-2">
                        {expanded ? <ChevronUp size={16} className="text-[#8a8368]" /> : <ChevronDown size={16} className="text-[#8a8368]" />}
                      </div>
                    </button>
                    {expanded && (
                      <div className="px-5 py-4 border-t border-[#C9A97E]/40 bg-gradient-to-b from-[#faf8f0] to-[#f5f0e4] space-y-2 animate-fadeIn">
                        <p className="text-[10px] uppercase tracking-widest text-[#8a8368] font-semibold mb-2">Detalles de la transacción</p>
                        {tx.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm py-1.5 border-b border-[#C9A97E]/30 last:border-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-[#a89f81] font-bold w-5">{idx + 1}.</span>
                              <span className="text-[#2B2118] font-medium">{item.title}</span>
                              <span className="text-[10px] uppercase tracking-wider text-[#8a8368] bg-[#f5f0e4] px-2 py-0.5 rounded-full">{item.format}</span>
                            </div>
                            <span className="font-semibold text-[#2B2118]">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= FACTURAS TAB ================= */}
      {activeTab === "facturas" && (
        <div className="animate-fadeIn space-y-4">
          <div className="flex gap-2 flex-wrap">
            {["Todas", "Pagada", "Anulada"].map((f) => (
              <button
                key={f}
                onClick={() => setInvoiceFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${invoiceFilter === f ? "bg-gradient-to-r from-emerald-700 to-green-800 text-white shadow-md" : "bg-white border border-[#C9A97E] text-[#6f6a55] hover:bg-amber-50"}`}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <FileText size={36} className="text-amber-400/50" />
              </div>
              <p className="text-[#2B2118] text-lg font-serif">Sin facturas</p>
              <p className="text-[#8a8368] text-sm mt-1">No hay facturas que mostrar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInvoices.map((inv, i) => (
                <div
                  key={inv.id}
                  className="relative flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-2xl border border-amber-100/60 p-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-fadeIn"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-600" />
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm shrink-0">
                    <FileText size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-base text-[#2B2118]">{inv.id}</h3>
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border ${statusColor(inv.status)}`}>{inv.status}</span>
                    </div>
                    <p className="text-xs text-[#8a8368] mt-1">{inv.date}</p>
                  </div>
                  <div className="font-serif text-lg text-[#2B2118] shrink-0">${inv.total.toFixed(2)}</div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleDownloadInvoice(inv.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-700 to-green-800 text-white hover:from-emerald-600 hover:to-green-700 active:scale-[0.97] transition-all duration-200 shadow-sm cursor-pointer"
                    >
                      <Download size={13} /> Descargar
                    </button>
                    <button
                      onClick={() => { setSelectedInvoice(inv); setShowInvoiceModal(true); }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-[#C9A97E] text-[#6f6a55] hover:bg-amber-50 active:scale-[0.97] transition-all duration-200 shadow-sm cursor-pointer"
                    >
                      <Eye size={13} /> Ver detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= SUSCRIPCIÓN TAB ================= */}
      {activeTab === "suscripcion" && (
        <div className="animate-fadeIn space-y-6">
          {currentPlan && (
            <div className="bg-white rounded-2xl border border-amber-100/60 p-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C49A55] via-amber-400 to-[#C49A55]" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
                  <Crown size={26} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-xl text-[#2B2118]">Plan {currentPlan.name}</h3>
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Activo</span>
                  </div>
                  <p className="text-sm text-[#8a8368] mt-1">
                    {currentPlan.price === 0 ? "Gratis" : `$${currentPlan.price.toFixed(2)}${currentPlan.period}`} · Renovación: 01 oct 2026
                  </p>
                </div>
                <button
                  onClick={handleChangePlan}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-[#C9A97E] text-[#6f6a55] hover:bg-amber-50 active:scale-[0.97] transition-all duration-200 shadow-sm cursor-pointer"
                >
                  Cambiar plan
                </button>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-serif text-lg text-[#2B2118] mb-1">{currentPlan ? "Cambiar de plan" : "Elige tu plan"}</h3>
            <p className="text-sm text-[#8a8368] mb-5">Compara las opciones y selecciona la que mejor se adapte a ti</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan, i) => {
              const Icon = plan.icon;
              const isCurrent = currentPlan?.key === plan.key;
              return (
                <div
                  key={plan.key}
                  className={`relative rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg animate-fadeIn ${plan.highlighted ? "border-[#C49A55] shadow-amber-500/10 ring-1 ring-[#C49A55]/30" : "border-amber-100/60"} ${isCurrent ? "ring-2 ring-emerald-500/40" : ""}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-bl-xl">Popular</div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md mb-4 ${plan.highlighted ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-gradient-to-br from-[#3A2618] to-[#2B2118]"}`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <h4 className="font-serif text-lg text-[#2B2118]">{plan.name}</h4>
                    <div className="flex items-baseline gap-1 mt-2 mb-4">
                      {plan.price === 0 ? (
                        <span className="font-serif text-2xl text-[#2B2118]">Gratis</span>
                      ) : (
                        <>
                          <span className="text-sm text-[#8a8368]">$</span>
                          <span className="font-serif text-2xl text-[#2B2118]">{plan.price.toFixed(2)}</span>
                          <span className="text-sm text-[#8a8368]">{plan.period}</span>
                        </>
                      )}
                    </div>
                    <ul className="space-y-2.5 mb-6">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-sm text-[#6f6a55]">
                          <Check size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    {isCurrent ? (
                      <div className="w-full py-2.5 rounded-xl text-sm font-semibold text-center bg-emerald-100 text-emerald-700 border border-emerald-200">Plan actual</div>
                    ) : (
                      <FormButton variant={plan.highlighted ? "primary" : "secondary"} onClick={() => handleSelectPlan(plan)}>
                        {currentPlan ? "Cambiar a este plan" : "Suscribirse"}
                      </FormButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= CHECKOUT MODAL ================= */}
      <Modal isOpen={showCheckout} onClose={() => { if (checkoutStep < 4) { setShowCheckout(false); } }} title="Proceder al pago" icon={CreditCard}>
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {STEPS.map((step, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${idx < checkoutStep ? "bg-emerald-600 text-white" : idx === checkoutStep ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25" : "bg-[#f5f0e4] text-[#a89f81] border border-[#C9A97E]"}`}>
                {idx < checkoutStep ? <Check size={14} /> : idx + 1}
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-6 h-0.5 rounded-full transition-all duration-300 ${idx < checkoutStep ? "bg-emerald-600" : "bg-[#C9A97E]"}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-[#8a8368] font-semibold uppercase tracking-wider mb-5">{STEPS[checkoutStep]}</p>

        {/* Step 0: Payment method */}
        {checkoutStep === 0 && (
          <div className="space-y-3 animate-fadeIn">
            {[
              { key: "tarjeta", label: "Tarjeta de crédito/débito", icon: CreditCard, desc: "Visa, Mastercard, AMEX" },
              { key: "paypal", label: "PayPal", icon: ExternalLink, desc: "Paga con tu cuenta PayPal" },
              { key: "transferencia", label: "Transferencia bancaria", icon: FileText, desc: "Transferencia SPEI/TEF" },
            ].map((pm) => (
              <button
                key={pm.key}
                onClick={() => setPaymentMethod(pm.key)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${paymentMethod === pm.key ? "border-[#C49A55] bg-amber-50/50 shadow-md shadow-amber-500/10" : "border-[#C9A97E]/40 bg-white hover:border-[#C49A55]/50"}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${paymentMethod === pm.key ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-[#f5f0e4]"}`}>
                  <pm.icon size={18} className={paymentMethod === pm.key ? "text-white" : "text-[#8a8368]"} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#2B2118]">{pm.label}</p>
                  <p className="text-xs text-[#8a8368]">{pm.desc}</p>
                </div>
                {paymentMethod === pm.key && <Check size={18} className="text-amber-600 shrink-0" />}
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Card form */}
        {checkoutStep === 1 && paymentMethod === "tarjeta" && (
          <div className="space-y-1 animate-fadeIn">
            <FormField label="Número de tarjeta" icon={CreditCard} required>
              <input type="text" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} maxLength={19} className={getInputClass(false)} />
            </FormField>
            <FormField label="Nombre del titular" icon={CreditCard} required>
              <input type="text" placeholder="Como aparece en la tarjeta" value={cardName} onChange={(e) => setCardName(e.target.value)} className={getInputClass(false)} />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Vencimiento" icon={CreditCard} required>
                <input type="text" placeholder="MM/AA" value={cardExpiry} onChange={(e) => { let v = e.target.value.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); setCardExpiry(v); }} maxLength={5} className={getInputClass(false)} />
              </FormField>
              <FormField label="CVV" icon={CreditCard} required>
                <input type="text" placeholder="123" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} maxLength={4} className={getInputClass(false)} />
              </FormField>
            </div>
            <div className="mt-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-center gap-2">
              <Check size={15} className="text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-700">Tus datos están protegidos con encriptación SSL de 256 bits</p>
            </div>
          </div>
        )}

        {checkoutStep === 1 && paymentMethod === "paypal" && (
          <div className="text-center py-8 space-y-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
              <ExternalLink size={28} className="text-white" />
            </div>
            <p className="font-serif text-base text-[#2B2118]">Serás redirigido a PayPal</p>
            <p className="text-xs text-[#8a8368]">Completa el pago de forma segura desde tu cuenta PayPal</p>
          </div>
        )}

        {checkoutStep === 1 && paymentMethod === "transferencia" && (
          <div className="space-y-3 animate-fadeIn">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-2">
              <p className="text-xs uppercase tracking-wider text-[#8a8368] font-semibold">Datos de transferencia</p>
              <div className="text-sm text-[#2B2118] space-y-1">
                <p><span className="font-semibold">Banco:</span> Banorte</p>
                <p><span className="font-semibold">Cuenta:</span> 012 345 6789</p>
                <p><span className="font-semibold">CLABE:</span> 072 123 4567 8901 2345</p>
                <p><span className="font-semibold">Beneficiario:</span> Librería Digital SA de CV</p>
              </div>
            </div>
            <p className="text-xs text-[#8a8368]">Realiza la transferencia y envía el comprobante a pagos@libreria.com</p>
          </div>
        )}

        {/* Step 2: Order summary */}
        {checkoutStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#C9A97E]/40">
                  <span className="text-xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#2B2118] truncate">{item.title}</p>
                    <p className="text-xs text-[#8a8368]">{item.format}</p>
                  </div>
                  <span className="font-semibold text-sm text-[#2B2118]">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#C9A97E]/60 pt-3 space-y-2">
              <div className="flex justify-between text-sm text-[#6f6a55]">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#6f6a55]">
                <span>IVA (16%)</span>
                <span>${iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-serif text-lg text-[#2B2118] pt-2 border-t border-[#C9A97E]/40">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#f5f0e4]/60 border border-[#C9A97E]/60 flex items-center gap-2 text-xs text-[#6f6a55]">
              <CreditCard size={14} className="text-amber-600 shrink-0" />
              <span>Método: {paymentMethod === "tarjeta" ? "Tarjeta terminación " + (cardNumber.slice(-4) || "****") : paymentMethod === "paypal" ? "PayPal" : "Transferencia"}</span>
            </div>
          </div>
        )}

        {/* Step 3: Processing */}
        {checkoutStep === 3 && processing && (
          <div className="text-center py-10 space-y-4 animate-fadeIn">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-[#C9A97E]/30" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C49A55] animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={24} className="text-[#C49A55] animate-spin" />
              </div>
            </div>
            <p className="font-serif text-lg text-[#2B2118]">Procesando pago...</p>
            <p className="text-xs text-[#8a8368]">Por favor no cierres esta ventana</p>
          </div>
        )}

        {/* Step 4: Success */}
        {checkoutStep === 4 && (
          <div className="text-center py-8 space-y-4 animate-fadeIn">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce" style={{ animationDuration: "1s" }}>
                <Check size={36} className="text-white" strokeWidth={3} />
              </div>
            </div>
            <p className="font-serif text-xl text-[#2B2118]">¡Pago exitoso!</p>
            <p className="text-sm text-[#8a8368]">Tu pedido ha sido procesado correctamente</p>
            <div className="p-3 rounded-xl bg-[#f5f0e4]/60 border border-[#C9A97E]/60 space-y-1">
              <p className="text-xs text-[#8a8368]">Número de orden</p>
              <p className="font-mono text-sm font-bold text-[#2B2118]">{orderNumber}</p>
            </div>
            <p className="text-xs text-[#8a8368]">Los libros digitales están disponibles en tu biblioteca</p>
            <FormButton variant="secondary" onClick={() => { setShowCheckout(false); addToast({ type: "info", message: "Mostrando comprobante..." }); }}>
              <span className="flex items-center gap-2 justify-center">
                <Receipt size={14} /> Ver comprobante
              </span>
            </FormButton>
          </div>
        )}

        {/* Navigation buttons */}
        {checkoutStep < 3 && (
          <div className="flex justify-between gap-3 mt-6">
            {checkoutStep > 0 ? (
              <button onClick={handlePrevStep} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-[#C9A97E] text-[#6f6a55] hover:bg-amber-50 active:scale-[0.97] transition-all duration-200 cursor-pointer">
                <ArrowLeft size={14} /> Atrás
              </button>
            ) : <div />}
            <FormButton variant="primary" onClick={handleNextStep}>
              <span className="flex items-center gap-2 justify-center">
                {checkoutStep === 2 ? (
                  <>Confirmar y pagar ${total.toFixed(2)}</>
                ) : (
                  <>Siguiente <ArrowRight size={14} /></>
                )}
              </span>
            </FormButton>
          </div>
        )}

        {checkoutStep === 3 && processing && <div className="mt-6" />}
        {checkoutStep === 4 && <div className="mt-6" />}
      </Modal>

      {/* ================= PLAN MODAL ================= */}
      <Modal isOpen={showPlanModal} onClose={() => setShowPlanModal(false)} title={currentPlan ? "Cambiar plan" : "Suscribirse"} icon={Crown}>
        {selectedPlan && (
          <div className="space-y-4 animate-fadeIn">
            <div className={`p-5 rounded-xl border-2 ${selectedPlan.highlighted ? "border-[#C49A55] bg-amber-50/50" : "border-[#C9A97E]/40 bg-white"}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${selectedPlan.highlighted ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-gradient-to-br from-[#3A2618] to-[#2B2118]"}`}>
                  {selectedPlan.highlighted ? <Zap size={18} className="text-white" /> : selectedPlan.key === "bibliotecario" ? <CrownIcon size={18} className="text-white" /> : <BookOpen size={18} className="text-white" />}
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[#2B2118]">Plan {selectedPlan.name}</h4>
                  <p className="text-sm text-[#8a8368]">{selectedPlan.price === 0 ? "Gratis" : `$${selectedPlan.price.toFixed(2)}${selectedPlan.period}`}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {selectedPlan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2 text-sm text-[#6f6a55]">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-[#8a8368] text-center">
              {currentPlan ? "Se cambiará tu plan al final del periodo de facturación actual" : "Se realizará el cargo inmediatamente. Cancela en cualquier momento."}
            </p>
            <div className="flex justify-end gap-2">
              <FormButton variant="secondary" onClick={() => setShowPlanModal(false)}>Cancelar</FormButton>
              {currentPlan ? (
                <FormButton variant="danger" onClick={handleChangePlan}>Cancelar suscripción</FormButton>
              ) : (
                <FormButton variant="primary" onClick={handleConfirmPlan}>Suscribirse</FormButton>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ================= INVOICE DETAIL MODAL ================= */}
      <Modal isOpen={showInvoiceModal} onClose={() => { setShowInvoiceModal(false); setSelectedInvoice(null); }} title="Detalle de factura" icon={FileText}>
        {selectedInvoice && (
          <div className="space-y-5 animate-fadeIn">
            {/* Header */}
            <div className="text-center pb-4 border-b border-[#C9A97E]/60">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-700 to-green-800 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-700/25">
                <BookOpen size={28} className="text-white" />
              </div>
              <h3 className="font-serif text-lg text-[#2B2118]">Librería Digital</h3>
              <p className="text-xs text-[#8a8368]">Tu tienda de libros digitales</p>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#8a8368] font-semibold">Factura</p>
                <p className="font-mono text-sm font-bold text-[#2B2118]">{selectedInvoice.id}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-[#8a8368] font-semibold">Fecha</p>
                <p className="text-sm font-semibold text-[#2B2118]">{selectedInvoice.date}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#f5f0e4]/60 border border-[#C9A97E]/40">
              <p className="text-[10px] uppercase tracking-widest text-[#8a8368] font-semibold mb-1">Cliente</p>
              <p className="text-sm font-semibold text-[#2B2118]">{user?.nombre || "Juan Pérez"}</p>
              <p className="text-xs text-[#8a8368]">{user?.email || "juan@email.com"}</p>
            </div>

            {/* Line items */}
            <div className="rounded-xl border border-[#C9A97E]/40 overflow-hidden">
              <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3A2618] to-[#2B2118] text-white text-[10px] uppercase tracking-widest font-bold">
                <div className="col-span-6">Descripción</div>
                <div className="col-span-2 text-center">Cant.</div>
                <div className="col-span-2 text-right">Precio</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              {selectedInvoice.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 px-4 py-3 text-sm border-b border-[#C9A97E]/30 last:border-0">
                  <div className="col-span-6 text-[#2B2118] font-medium truncate">{item.description}</div>
                  <div className="col-span-2 text-center text-[#6f6a55]">{item.qty}</div>
                  <div className="col-span-2 text-right text-[#6f6a55]">${item.price.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-semibold text-[#2B2118]">${(item.qty * item.price).toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#6f6a55]">
                <span>Subtotal</span>
                <span>${(selectedInvoice.total / 1.16).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#6f6a55]">
                <span>IVA (16%)</span>
                <span>${(selectedInvoice.total - selectedInvoice.total / 1.16).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-serif text-lg text-[#2B2118] pt-2 border-t border-[#C9A97E]/40">
                <span>Total</span>
                <span>${selectedInvoice.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#f5f0e4]/60 border border-[#C9A97E]/40 flex items-center gap-2 text-xs text-[#6f6a55]">
              <CreditCard size={14} className="text-amber-600 shrink-0" />
              <span>Método de pago: {selectedInvoice.paymentMethod}</span>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={handlePrintInvoice} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-[#C9A97E] text-[#6f6a55] hover:bg-amber-50 active:scale-[0.97] transition-all duration-200 cursor-pointer">
                <Printer size={14} /> Imprimir
              </button>
              <button onClick={() => handleDownloadInvoice(selectedInvoice.id)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-700 to-green-800 text-white hover:from-emerald-600 hover:to-green-700 active:scale-[0.97] transition-all duration-200 shadow-md shadow-emerald-700/25 cursor-pointer">
                <Download size={14} /> Descargar PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
