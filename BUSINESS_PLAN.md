# Business Plan — FitFlow (ex Luca Workout Tracker)

## Stato Attuale dell'App

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite 7
- **Styling**: Tailwind CSS 4 + design system glassmorphism custom
- **Storage**: localStorage (client-side only, nessun backend)
- **Deploy**: Vercel (static site)
- **PWA**: Service worker con offline-first, manifest standalone, notifiche, wake-lock, vibrazione

### Feature Esistenti
- Scheda settimanale configurata (3 giorni palestra + 2 ninjutsu)
- Logging workout in tempo reale (serie, ripetizioni, peso)
- Timer rest con preset, suono, vibrazione e wake-lock
- Storico allenamenti con grafici di progressione per esercizio
- Auto-save continuo della sessione
- Funziona completamente offline

### Limitazioni Attuali
- Mono-utente (nome e scheda hardcoded)
- Nessuna autenticazione
- Dati solo in localStorage (persi se si cancella il browser)
- Nessun backend/database
- Nessuna possibilità di condivisione o social

---

## 1. Vision & Mission

**Vision**: Diventare l'app di fitness tracking più intelligente in Italia, che non si limita a registrare gli allenamenti ma li guida attivamente grazie all'AI.

**Mission**: Trasformare ogni persona in un coach di sé stessa, usando l'intelligenza artificiale per generare schede personalizzate, adattare il carico progressivo e motivare con insight data-driven.

---

## 2. Killer Feature: AI Coach — Progressive Overload Intelligente

### Il Problema
Le app di workout tracking sono tutte uguali: registri serie e ripetizioni, guardi un grafico, fine. Nessuna ti dice **cosa fare domani** in base a quello che hai fatto oggi. I personal trainer costano 40-80€/sessione.

### La Soluzione: FitFlow AI Coach
Un coach AI integrato (powered by Claude API) che:

1. **Genera schede personalizzate** — L'utente inserisce obiettivi (ipertrofia, forza, dimagrimento), giorni disponibili, attrezzatura, e l'AI crea una scheda su misura con periodizzazione corretta.

2. **Adatta il carico automaticamente** — Analizza lo storico: se nelle ultime 3 sessioni hai completato tutte le serie di panca a 80kg×10, suggerisce 82.5kg×8 o 80kg×12. Se hai fallito delle serie, scala il carico o suggerisce deload.

3. **Insight post-workout** — Dopo ogni sessione, un breve recap AI: "Hai migliorato il volume totale del 4% rispetto alla scorsa settimana. Il tuo punto debole è il tricipite: considera di aggiungere una serie di pushdown."

4. **Chat con il Coach** — Possibilità di chiedere in linguaggio naturale: "Ho mal di spalla, cosa sostituisco alla military press?" e ricevere alternative basate sulla propria scheda.

### Perché è un Killer Feature
- **Nessun competitor italiano** offre un AI coach integrato con tracking granulare
- **Retention altissima**: l'utente torna perché la scheda evolve con lui
- **Monetizzazione naturale**: la feature AI è il motivo per pagare premium
- **Moat tecnologico**: i dati accumulati rendono i suggerimenti sempre più precisi

---

## 3. Analisi di Mercato

### Mercato Target
- **TAM** (Italia): 19M di italiani praticano attività fisica regolarmente (ISTAT)
- **SAM**: 5.8M frequentano palestre/home gym
- **SOM** (anno 1-2): 50.000 utenti attivi, di cui 5.000 paganti

### Competitor
| App | Tracking | AI Coach | Prezzo | Punto debole |
|-----|----------|----------|--------|-------------|
| Strong | Eccellente | No | €4.99/mese | Zero intelligenza, solo log |
| JEFIT | Buono | No | €6.99/mese | UI datata, troppo complessa |
| Hevy | Buono | Basico | €9.99/mese | AI limitata, no personalizzazione vera |
| Fitbod | Medio | Sì (rule-based) | €12.99/mese | Non è vero AI, regole statiche |
| **FitFlow** | **Eccellente** | **Sì (LLM)** | **€5.99/mese** | **Da costruire** |

### Differenziazione
- **Primo in Italia** con AI coach LLM-based
- **UX italiana** nativa (non tradotta)
- **Prezzo aggressivo** vs competitor internazionali
- **Offline-first**: funziona anche in palestre sotterranee senza segnale

---

## 4. Modello di Business

### Freemium
| Feature | Free | Premium (€5.99/mese) |
|---------|------|----------------------|
| Tracking workout | ✅ | ✅ |
| Timer rest | ✅ | ✅ |
| Storico & grafici | Ultimi 30 giorni | Illimitato |
| Schede preset | 3 template | Illimitate |
| **AI Coach** | 3 suggerimenti/mese | **Illimitato** |
| **Generazione scheda AI** | ❌ | **✅** |
| **Chat con AI Coach** | ❌ | **✅** |
| **Insight post-workout** | ❌ | **✅** |
| Export dati (CSV/PDF) | ❌ | ✅ |
| Sync multi-device | ❌ | ✅ |

### Revenue Projection (conservativa)
| Periodo | Utenti Free | Utenti Premium | MRR | ARR |
|---------|-------------|----------------|-----|-----|
| Mese 6 | 5.000 | 250 (5%) | €1.497 | €17.970 |
| Mese 12 | 20.000 | 1.500 (7.5%) | €8.985 | €107.820 |
| Mese 24 | 80.000 | 8.000 (10%) | €47.920 | €575.040 |

### Struttura Costi (mensile, a regime mese 12)
| Voce | Costo |
|------|-------|
| Claude API (AI Coach) | ~€800 (stima 1.500 utenti × 20 request/mese × ~€0.027/request) |
| Infrastruttura (Vercel Pro + Supabase) | ~€150 |
| Apple Developer Program | €8.25 (€99/anno) |
| Google Play Developer | €2.08 (€25 una tantum) |
| Marketing (social + ASO) | ~€1.500 |
| **Totale** | **~€2.460** |
| **Margine** | **€6.525 (72%)** |

---

## 5. Roadmap Tecnica — Da PWA Personale a App Store

### Fase 1 — Fondamenta (Mese 1-2)
**Obiettivo**: Backend + Auth + Multi-utente

- [ ] Setup Supabase (PostgreSQL + Auth + Row Level Security)
- [ ] Migrazione da localStorage a database remoto con sync offline
- [ ] Sistema di autenticazione (email + Google + Apple Sign-In)
- [ ] Schede workout configurabili dall'utente (non più hardcoded)
- [ ] Onboarding flow (obiettivi, esperienza, giorni disponibili)
- [ ] API layer con React Query per sync/cache

### Fase 2 — AI Coach (Mese 2-3)
**Obiettivo**: Killer feature operativa

- [ ] Integrazione Claude API (backend serverless su Vercel Edge Functions)
- [ ] Generazione scheda AI personalizzata post-onboarding
- [ ] Sistema di progressive overload automatico basato su storico
- [ ] Insight post-workout con analisi volume/intensità
- [ ] Chat AI Coach con contesto della scheda e storico dell'utente
- [ ] Rate limiting e gestione token per piano free/premium

### Fase 3 — App Store Ready (Mese 3-4)
**Obiettivo**: Presenza su iOS e Android

- [ ] Wrap con **Capacitor.js** (Ionic) per build nativi
  - Mantiene il 95% del codice React esistente
  - Accesso a API native (notifiche push, haptics, HealthKit)
- [ ] Integrazione Apple HealthKit / Google Health Connect
- [ ] Sistema di pagamento in-app (RevenueCat per gestione subscription cross-platform)
- [ ] Push notifications (reminder allenamento, streak, deload week)
- [ ] Deep link per condivisione schede
- [ ] App Store Optimization (screenshot, descrizione, keyword italiane)
- [ ] Review Apple App Store + Google Play Store

### Fase 4 — Growth & Social (Mese 5-8)
**Obiettivo**: Retention e viralità

- [ ] Profilo pubblico con statistiche
- [ ] Condivisione schede tra utenti
- [ ] Sfide settimanali (es. "chi fa più volume su panca questa settimana")
- [ ] Streak e achievement system (gamification)
- [ ] Referral program (1 mese premium gratis per ogni amico invitato)
- [ ] Widget iOS/Android (prossimo allenamento, streak)

### Fase 5 — Scaling (Mese 9-12)
- [ ] Partnership con palestre italiane (schede brandizzate)
- [ ] Marketplace di schede create da PT certificati
- [ ] Integrazione con smartwatch (Apple Watch, Wear OS)
- [ ] Localizzazione multilingua (EN, ES, DE)

---

## 6. Strategia di Pubblicazione sugli Store

### Approccio Tecnico: Capacitor.js
Capacitor è la scelta ottimale perché:
- **Riusa il 95% del codice React/TypeScript esistente**
- Genera build nativi iOS (Xcode) e Android (Android Studio)
- Accesso a plugin nativi (Camera, Push, HealthKit, In-App Purchase)
- Mantenuto da Ionic, ecosistema maturo
- Alternativa: React Native (richiederebbe riscrittura completa)

### Requisiti Apple App Store
- Apple Developer Account (€99/anno)
- App Review Guidelines compliance
- Privacy Policy e Terms of Service
- App Privacy "nutrition labels"
- In-App Purchase via StoreKit 2
- Supporto iPhone SE (min 375px) → già compatibile
- iOS 16+ target

### Requisiti Google Play Store
- Google Play Developer Account (€25 una tantum)
- Data Safety section
- Target API level aggiornato
- Google Play Billing Library per subscription
- Android 8+ (API 26) target

---

## 7. Strategia Go-to-Market

### Pre-lancio (2 mesi prima)
- Landing page con waitlist (email collection)
- Contenuti su Instagram/TikTok: "Ho costruito un AI Coach per la palestra"
- Beta testing con 100 utenti da community fitness italiane
- Raccolta feedback e iterazione

### Lancio
- Product Hunt launch (versione internazionale)
- Post su Reddit r/fitness, r/bodybuilding, r/Italia
- Micro-influencer fitness italiani (10-50k follower) — barter: premium lifetime
- ASO aggressiva per keyword italiane ("scheda palestra", "workout tracker", "coach AI palestra")

### Post-lancio
- Content marketing: blog SEO su workout, progressione, nutrizione
- Referral loop virale (invita amico → mese gratis)
- Iterazione rapida basata su review degli store
- Community Discord/Telegram per utenti premium

---

## 8. Metriche Chiave (KPI)

| Metrica | Target Mese 6 | Target Mese 12 |
|---------|---------------|-----------------|
| Download totali | 8.000 | 35.000 |
| MAU (Monthly Active Users) | 5.000 | 20.000 |
| Conversion rate Free→Premium | 5% | 7.5% |
| Churn rate mensile | <8% | <5% |
| Average session duration | >5 min | >7 min |
| Workout logged/utente/mese | >8 | >10 |
| App Store rating | >4.5 | >4.6 |
| NPS | >40 | >50 |
| CAC (Cost per Acquisition) | <€2 | <€1.5 |
| LTV (Lifetime Value) | >€25 | >€40 |

---

## 9. Rischi e Mitigazioni

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Costi API AI troppo alti | Media | Alto | Cache aggressiva dei suggerimenti, rate limiting, modello Haiku per task semplici |
| Rejection Apple Store | Bassa | Alto | Compliance rigorosa delle guidelines, beta TestFlight prima del submit |
| Competitor copia la feature | Media | Medio | First-mover advantage, dati utente come moat, iterazione veloce |
| Bassa conversion free→premium | Media | Alto | A/B testing paywall, trial 7 giorni, feature gating graduale |
| Privacy/GDPR compliance | Bassa | Alto | Supabase EU region, DPA, privacy by design, consenso esplicito |

---

## 10. Team Necessario (Fase Iniziale)

| Ruolo | Note |
|-------|------|
| **Founder/Dev** (Luca) | Sviluppo full-stack, product, design |
| **AI/Prompt Engineer** (part-time) | Ottimizzazione prompt Coach AI, fine-tuning |
| **Marketing/Growth** (part-time) | Social media, ASO, influencer outreach |

Budget team iniziale: €0 (bootstrapped) → reinvestimento dei primi ricavi.

---

## Conclusione

FitFlow parte da una base tecnica solida (PWA offline-first, React/TypeScript, deploy Vercel) e ha un percorso chiaro verso gli store tramite Capacitor.js. La killer feature — **AI Coach con progressive overload intelligente** — risolve un problema reale (nessuno sa come progredire in palestra senza un PT) a una frazione del costo, posizionando l'app in un segmento di mercato non ancora presidiato in Italia.

L'investimento iniziale richiesto è minimo (€124 per gli account developer), la monetizzazione è naturale (AI = valore percepito = willingness to pay), e il margine a regime è >70%.

**Prossimo passo**: implementare Fase 1 (backend + auth) mantenendo l'esperienza offline-first che già funziona.
