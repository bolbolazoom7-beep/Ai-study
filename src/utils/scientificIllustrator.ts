/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Ultra-high-definition, vibrant, colorful scientific vector graphics engine
 * for Egyptian Thanawya Amma (3rd Secondary) Physics, Chemistry, Biology & Math.
 * Guaranteed 100% color-rich, high contrast, dark & light mode compatible.
 */

// -----------------------------------------------------------------------------
// 1. Physics: Electrical Circuit Diagram (قانون أوم وكيرشوف)
// -----------------------------------------------------------------------------
export function buildColorfulCircuitSvg(options: {
  vb?: string;
  r?: string;
  R?: string;
  vReading?: string;
  iReading?: string;
} = {}): string {
  const vb = options.vb || '12V';
  const r = options.r || '1Ω';
  const R = options.R || '5Ω';
  const v = options.vReading || '10V';
  const i = options.iReading || '2A';

  return `<svg viewBox="0 0 440 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" class="select-none font-sans">
    <defs>
      <linearGradient id="circBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0f1d" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e1b4b" />
      </linearGradient>
      <linearGradient id="wireG" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="50%" stop-color="#818cf8" />
        <stop offset="100%" stop-color="#c084fc" />
      </linearGradient>
      <linearGradient id="voltmeterG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0284c7" />
        <stop offset="100%" stop-color="#0369a1" />
      </linearGradient>
      <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#10b981" />
        <stop offset="100%" stop-color="#059669" />
      </linearGradient>
      <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Card Background -->
    <rect width="440" height="200" rx="16" fill="url(#circBg)" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.4" />

    <!-- Top Badge (Cleanly separated on top-left) -->
    <rect x="18" y="14" width="180" height="24" rx="6" fill="#38bdf8" fill-opacity="0.15" stroke="#38bdf8" stroke-width="1" />
    <text x="108" y="30" text-anchor="middle" font-size="11" font-weight="900" fill="#7dd3fc">⚡ قانون أوم للدائرة المغلقة</text>

    <!-- Voltmeter Reading Display (Cleanly separated on top-right) -->
    <rect x="310" y="14" width="112" height="26" rx="7" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1" />
    <text x="366" y="31" text-anchor="middle" font-size="11" font-weight="900" fill="#7dd3fc">قراءة V = ${v}</text>

    <!-- Circuit Main Wires -->
    <path d="M 50 115 L 115 115" stroke="url(#wireG)" stroke-width="4" stroke-linecap="round" fill="none" />
    <path d="M 160 115 L 265 115" stroke="url(#wireG)" stroke-width="4" stroke-linecap="round" fill="none" />
    <path d="M 345 115 L 390 115 L 390 175 L 50 175 Z" stroke="url(#wireG)" stroke-width="4" stroke-linejoin="round" fill="none" />

    <!-- Current Flow Arrow -->
    <polygon points="78,110 94,115 78,120" fill="#facc15" filter="url(#neonGlow)" />
    <rect x="62" y="85" width="56" height="20" rx="5" fill="#facc15" fill-opacity="0.2" stroke="#facc15" stroke-width="1" />
    <text x="90" y="99" text-anchor="middle" font-size="11" font-weight="900" fill="#fef08a">I = ${i}</text>

    <!-- Battery Source -->
    <rect x="120" y="90" width="6" height="50" rx="3" fill="url(#batteryGrad)" filter="url(#neonGlow)" />
    <text x="114" y="85" font-size="13" font-weight="900" fill="#34d399">+</text>
    <rect x="142" y="100" width="4" height="30" rx="2" fill="#f43f5e" />
    <text x="148" y="95" font-size="14" font-weight="900" fill="#fb7185">-</text>

    <!-- Battery label badge -->
    <rect x="85" y="55" width="105" height="22" rx="6" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="1" />
    <text x="137" y="70" text-anchor="middle" font-size="10.5" font-weight="bold" fill="#6ee7b7">VB=${vb} (r=${r})</text>

    <!-- Voltmeter Dial (Positioned in center without overlapping title) -->
    <path d="M 118 115 L 118 55 L 195 55" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3" fill="none" />
    <path d="M 144 115 L 144 70 L 210 70 L 210 65" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3" fill="none" />
    <circle cx="210" cy="55" r="14" fill="url(#voltmeterG)" stroke="#38bdf8" stroke-width="2" filter="url(#neonGlow)" />
    <text x="210" y="60" text-anchor="middle" font-size="12" font-weight="900" fill="#ffffff">V</text>

    <!-- Resistor R with 4-Color Bands -->
    <g transform="translate(265, 103)">
      <rect x="0" y="0" width="80" height="24" rx="6" fill="#d97706" stroke="#fbbf24" stroke-width="2" />
      <rect x="15" y="0" width="5" height="24" fill="#dc2626" />
      <rect x="30" y="0" width="5" height="24" fill="#000000" />
      <rect x="45" y="0" width="5" height="24" fill="#d97706" />
      <rect x="60" y="0" width="5" height="24" fill="#fbbf24" />
    </g>
    <rect x="270" y="75" width="70" height="22" rx="6" fill="#f59e0b" fill-opacity="0.25" stroke="#f59e0b" stroke-width="1" />
    <text x="305" y="90" text-anchor="middle" font-size="11" font-weight="bold" fill="#fde68a">R = ${R}</text>
  </svg>`;
}

// -----------------------------------------------------------------------------
// 2. Physics: Magnetic Field & Lorentz Force (المجال المغناطيسي والقوة المغناطيسية)
// -----------------------------------------------------------------------------
export function buildColorfulMagneticFieldSvg(options: {
  bField?: string;
  current?: string;
  length?: string;
  force?: string;
} = {}): string {
  const B = options.bField || '0.5 T';
  const I = options.current || '4 A';
  const L = options.length || '0.5 m';
  const F = options.force || '1 N';

  return `<svg viewBox="0 0 420 180" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" class="select-none font-sans">
    <defs>
      <linearGradient id="magBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0b1329" />
        <stop offset="100%" stop-color="#1e1035" />
      </linearGradient>
      <linearGradient id="wireGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="50%" stop-color="#fbbf24" />
        <stop offset="100%" stop-color="#d97706" />
      </linearGradient>
      <filter id="rubyGlow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <rect width="420" height="180" rx="16" fill="url(#magBg)" stroke="#818cf8" stroke-width="1.5" stroke-opacity="0.4" />

    <!-- Magnetic Field Region (Inward perpendicular ⊗) in Neon Violet -->
    <g fill="#c084fc" opacity="0.55">
      <text x="45" y="45" font-size="16" font-weight="bold">⊗</text>
      <text x="115" y="45" font-size="16" font-weight="bold">⊗</text>
      <text x="185" y="45" font-size="16" font-weight="bold">⊗</text>
      <text x="255" y="45" font-size="16" font-weight="bold">⊗</text>
      <text x="325" y="45" font-size="16" font-weight="bold">⊗</text>

      <text x="45" y="105" font-size="16" font-weight="bold">⊗</text>
      <text x="115" y="105" font-size="16" font-weight="bold">⊗</text>
      <text x="185" y="105" font-size="16" font-weight="bold">⊗</text>
      <text x="255" y="105" font-size="16" font-weight="bold">⊗</text>
      <text x="325" y="105" font-size="16" font-weight="bold">⊗</text>

      <text x="45" y="155" font-size="16" font-weight="bold">⊗</text>
      <text x="115" y="155" font-size="16" font-weight="bold">⊗</text>
      <text x="185" y="155" font-size="16" font-weight="bold">⊗</text>
      <text x="255" y="155" font-size="16" font-weight="bold">⊗</text>
      <text x="325" y="155" font-size="16" font-weight="bold">⊗</text>
    </g>

    <!-- Conductor Wire with Current -->
    <line x1="50" y1="85" x2="350" y2="85" stroke="url(#wireGold)" stroke-width="8" stroke-linecap="round" />
    <polygon points="210,77 235,85 210,93" fill="#ffffff" />

    <!-- Force Vector (Upward in Red) -->
    <line x1="200" y1="85" x2="200" y2="25" stroke="#f43f5e" stroke-width="4" stroke-linecap="round" filter="url(#rubyGlow)" />
    <polygon points="193,30 200,15 207,30" fill="#f43f5e" />
    <rect x="210" y="20" width="85" height="22" rx="6" fill="#f43f5e" fill-opacity="0.25" stroke="#f43f5e" stroke-width="1" />
    <text x="252" y="35" text-anchor="middle" font-size="11" font-weight="900" fill="#fda4af">القوة F = ${F}</text>

    <!-- Badges -->
    <rect x="20" y="12" width="140" height="22" rx="6" fill="#818cf8" fill-opacity="0.2" stroke="#818cf8" stroke-width="1" />
    <text x="90" y="27" text-anchor="middle" font-size="10" font-weight="bold" fill="#c7d2fe">مجال B = ${B} (عمودي للداخل)</text>

    <rect x="50" y="145" width="310" height="24" rx="7" fill="#1e1b4b" stroke="#6366f1" stroke-width="1" />
    <text x="205" y="161" text-anchor="middle" font-size="11" font-weight="900" fill="#a5b4fc">
      قاعدة فليمنج لليد اليسرى: F = B × I × L = (${B} × ${I} × ${L}) = ${F}
    </text>
  </svg>`;
}

// -----------------------------------------------------------------------------
// 3. Chemistry: Galvanic Daniel Cell (خلية دانيال الجلفانية)
// -----------------------------------------------------------------------------
export function buildColorfulGalvanicCellSvg(): string {
  return `<svg viewBox="0 0 420 185" width="100%" height="185" xmlns="http://www.w3.org/2000/svg" class="select-none font-sans">
    <defs>
      <linearGradient id="galvBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a1020" />
        <stop offset="100%" stop-color="#141830" />
      </linearGradient>
      <linearGradient id="znSol" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#94a3b8" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#64748b" stop-opacity="0.6" />
      </linearGradient>
      <linearGradient id="cuSol" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#0284c7" stop-opacity="0.85" />
      </linearGradient>
      <linearGradient id="saltBridge" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#10b981" />
        <stop offset="50%" stop-color="#34d399" />
        <stop offset="100%" stop-color="#10b981" />
      </linearGradient>
    </defs>

    <rect width="420" height="185" rx="16" fill="url(#galvBg)" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.3" />

    <!-- Left Beaker: Zinc Anode -->
    <rect x="40" y="75" width="120" height="75" rx="6" fill="url(#znSol)" stroke="#64748b" stroke-width="2" />
    <rect x="75" y="45" width="20" height="95" rx="4" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5" />
    <text x="85" y="40" text-anchor="middle" font-size="11" font-weight="900" fill="#cbd5e1">Zn (أنود -)</text>
    <text x="100" y="130" text-anchor="middle" font-size="10" font-weight="bold" fill="#94a3b8">محلول ZnSO₄</text>

    <!-- Right Beaker: Copper Cathode -->
    <rect x="260" y="75" width="120" height="75" rx="6" fill="url(#cuSol)" stroke="#0284c7" stroke-width="2" />
    <rect x="325" y="45" width="20" height="95" rx="4" fill="#f97316" stroke="#ea580c" stroke-width="1.5" />
    <text x="335" y="40" text-anchor="middle" font-size="11" font-weight="900" fill="#fb923c">Cu (كاثود +)</text>
    <text x="320" y="130" text-anchor="middle" font-size="10" font-weight="bold" fill="#7dd3fc">محلول CuSO₄ أزرق</text>

    <!-- U-Shaped Salt Bridge (القنطرة الملحية) -->
    <path d="M 125 100 L 125 65 Q 125 55 135 55 L 285 55 Q 295 55 295 65 L 295 100" stroke="url(#saltBridge)" stroke-width="14" fill="none" stroke-linecap="round" />
    <rect x="160" y="32" width="100" height="20" rx="5" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="1" />
    <text x="210" y="46" text-anchor="middle" font-size="10" font-weight="900" fill="#6ee7b7">قنطرة ملحية Na₂SO₄</text>

    <!-- External Wire & Voltmeter -->
    <path d="M 85 45 L 85 18 L 195 18" stroke="#facc15" stroke-width="2.5" fill="none" />
    <path d="M 335 45 L 335 18 L 225 18" stroke="#facc15" stroke-width="2.5" fill="none" />
    <!-- Electron flow arrow e- -->
    <polygon points="140,14 152,18 140,22" fill="#38bdf8" />
    <text x="146" y="12" font-size="9" font-weight="bold" fill="#38bdf8">تدفق e⁻</text>

    <circle cx="210" cy="18" r="14" fill="#0284c7" stroke="#38bdf8" stroke-width="2" />
    <text x="210" y="23" text-anchor="middle" font-size="10" font-weight="900" fill="#ffffff">1.10V</text>

    <!-- Bottom Legend -->
    <rect x="40" y="156" width="340" height="22" rx="6" fill="#1e1b4b" stroke="#4f46e5" stroke-width="1" />
    <text x="210" y="171" text-anchor="middle" font-size="10" font-weight="bold" fill="#c7d2fe">
      خلية دانيال: Zn(s) + Cu²⁺(aq) ⟶ Zn²⁺(aq) + Cu(s) | E°cell = +1.10V
    </text>
  </svg>`;
}

// -----------------------------------------------------------------------------
// 4. Chemistry: Colorful Reaction Apparatus & Equations (تفاعلات الكيمياء والحرارة)
// -----------------------------------------------------------------------------
export function buildColorfulChemistrySvg(options: {
  equation?: string;
  temperature?: string;
} = {}): string {
  const eq = options.equation || '2FeSO₄(s) ⟶ Fe₂O₃(s) + SO₂(g) + SO₃(g)';
  const temp = options.temperature || 'تسخين للاحمرار (Δ)';

  return `<svg viewBox="0 0 420 180" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" class="select-none font-sans">
    <defs>
      <linearGradient id="chemBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a101f" />
        <stop offset="100%" stop-color="#1f122e" />
      </linearGradient>
      <linearGradient id="flame" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#ef4444" />
        <stop offset="50%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#38bdf8" />
      </linearGradient>
      <linearGradient id="liquid" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.8" />
        <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.95" />
      </linearGradient>
    </defs>

    <rect width="420" height="180" rx="16" fill="url(#chemBg)" stroke="#6366f1" stroke-width="1.5" stroke-opacity="0.4" />

    <!-- Laboratory Beaker & Bunsen Burner -->
    <g transform="translate(30, 20)">
      <path d="M 15 20 L 15 90 Q 15 100 25 100 L 70 100 Q 80 100 80 90 L 80 20" stroke="#94a3b8" stroke-width="2.5" fill="none" />
      <path d="M 17 50 Q 47 48 78 50 L 78 90 Q 78 98 70 98 L 25 98 Q 17 98 17 90 Z" fill="url(#liquid)" />
      <circle cx="35" cy="65" r="3.5" fill="#ffffff" opacity="0.7" />
      <circle cx="55" cy="58" r="4.5" fill="#ffffff" opacity="0.8" />
      <circle cx="45" cy="80" r="3" fill="#ffffff" opacity="0.6" />

      <!-- Bunsen Burner & Multi-color flame -->
      <path d="M 38 128 Q 48 102 48 110 Q 48 102 58 128 Z" fill="url(#flame)" />
      <ellipse cx="48" cy="130" rx="16" ry="4" fill="#64748b" />
    </g>

    <!-- Equation and Details Box -->
    <g transform="translate(135, 18)">
      <rect x="0" y="0" width="265" height="34" rx="8" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.5" />
      <text x="132" y="22" text-anchor="middle" font-size="11" font-weight="900" fill="#c7d2fe" font-family="monospace">${eq}</text>

      <rect x="0" y="44" width="125" height="26" rx="6" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="1" />
      <text x="62" y="61" text-anchor="middle" font-size="10" font-weight="bold" fill="#fca5a5">شرط: ${temp}</text>

      <rect x="135" y="44" width="130" height="26" rx="6" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="1" />
      <text x="200" y="61" text-anchor="middle" font-size="10" font-weight="bold" fill="#6ee7b7">نوع: انحلال حراري وأكسدة</text>

      <rect x="0" y="80" width="265" height="26" rx="6" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1" />
      <text x="132" y="97" text-anchor="middle" font-size="10" font-weight="bold" fill="#7dd3fc">الناتج: Fe₂O₃ أحمر + غازات SO₂ و SO₃</text>

      <rect x="0" y="116" width="265" height="26" rx="6" fill="#f59e0b" fill-opacity="0.2" stroke="#f59e0b" stroke-width="1" />
      <text x="132" y="133" text-anchor="middle" font-size="10" font-weight="bold" fill="#fde68a">💡 تكة امتحان: SO₃ يعمل كعامل مؤكسد</text>
    </g>
  </svg>`;
}

// -----------------------------------------------------------------------------
// 5. Chemistry: Organic Benzene Ring (حلقة البنزين والمركبات العطرية)
// -----------------------------------------------------------------------------
export function buildColorfulBenzeneSvg(): string {
  return `<svg viewBox="0 0 420 180" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" class="select-none font-sans">
    <defs>
      <linearGradient id="orgBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#08141e" />
        <stop offset="100%" stop-color="#162936" />
      </linearGradient>
    </defs>

    <rect width="420" height="180" rx="16" fill="url(#orgBg)" stroke="#10b981" stroke-width="1.5" stroke-opacity="0.4" />

    <!-- Benzene Ring (Toluene / Phenol / Benzene) -->
    <g transform="translate(75, 90)">
      <!-- Hexagon outer -->
      <polygon points="0,-45 39,-22.5 39,22.5 0,45 -39,22.5 -39,-22.5" stroke="#34d399" stroke-width="3.5" fill="#064e3b" fill-opacity="0.3" />
      <!-- Delocalized electron circle -->
      <circle cx="0" cy="0" r="22" stroke="#6ee7b7" stroke-width="2.5" stroke-dasharray="5,4" fill="none" />
      <!-- Top radical CH3 -->
      <line x1="0" y1="-45" x2="0" y2="-72" stroke="#fbbf24" stroke-width="3" />
      <rect x="-24" y="-84" width="48" height="20" rx="5" fill="#f59e0b" fill-opacity="0.25" stroke="#fbbf24" stroke-width="1" />
      <text x="0" y="-70" text-anchor="middle" font-size="11" font-weight="900" fill="#fde68a">CH₃</text>
    </g>

    <!-- Details Box -->
    <g transform="translate(170, 20)">
      <rect x="0" y="0" width="230" height="30" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="1.5" />
      <text x="115" y="19" text-anchor="middle" font-size="12" font-weight="900" fill="#6ee7b7">مركب الطولوين (ميثيل بنزين C₇H₈)</text>

      <rect x="0" y="38" width="230" height="24" rx="6" fill="#10b981" fill-opacity="0.2" stroke="#34d399" stroke-width="1" />
      <text x="115" y="54" text-anchor="middle" font-size="10" font-weight="bold" fill="#a7f3d0">التحضير: إعادة تشكيل محفزة للهبتان العادي</text>

      <rect x="0" y="68" width="230" height="24" rx="6" fill="#ef4444" fill-opacity="0.2" stroke="#f87171" stroke-width="1" />
      <text x="115" y="84" text-anchor="middle" font-size="10" font-weight="bold" fill="#fca5a5">الأكسدة: يعطي حمض البنزويك بواسطة V₂O₅</text>

      <rect x="0" y="98" width="230" height="24" rx="6" fill="#f59e0b" fill-opacity="0.2" stroke="#fbbf24" stroke-width="1" />
      <text x="115" y="114" text-anchor="middle" font-size="10" font-weight="bold" fill="#fde68a">النيترة: نيترة الطولوين تعطي مادة TNT المتفجرة</text>
    </g>
  </svg>`;
}

// -----------------------------------------------------------------------------
// 6. Biology: DNA Double Helix (تركيب DNA وتكامل القواعد)
// -----------------------------------------------------------------------------
export function buildColorfulDnaSvg(options: {
  adenine?: string;
  thymine?: string;
  guanine?: string;
  cytosine?: string;
} = {}): string {
  const a = options.adenine || '20%';
  const t = options.thymine || '20%';
  const g = options.guanine || '30%';
  const c = options.cytosine || '30%';

  return `<svg viewBox="0 0 420 180" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" class="select-none font-sans">
    <defs>
      <linearGradient id="dnaBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a1024" />
        <stop offset="100%" stop-color="#171e3b" />
      </linearGradient>
    </defs>

    <rect width="420" height="180" rx="16" fill="url(#dnaBg)" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.4" />

    <rect x="20" y="12" width="210" height="24" rx="6" fill="#38bdf8" fill-opacity="0.2" stroke="#38bdf8" stroke-width="1" />
    <text x="125" y="28" text-anchor="middle" font-size="11" font-weight="900" fill="#7dd3fc">🧬 تكامل قواعد جزيء DNA المزدوج</text>

    <!-- Color-coded Base Pairs with Hydrogen Bonds -->
    <g transform="translate(30, 52)">
      <!-- A - T pair -->
      <rect x="0" y="0" width="75" height="34" rx="8" fill="#10b981" />
      <text x="37" y="22" text-anchor="middle" font-size="12" font-weight="900" fill="#ffffff">A (${a})</text>

      <!-- 2 Hydrogen bonds -->
      <line x1="82" y1="12" x2="108" y2="12" stroke="#c084fc" stroke-width="3.5" stroke-dasharray="3,3" />
      <line x1="82" y1="22" x2="108" y2="22" stroke="#c084fc" stroke-width="3.5" stroke-dasharray="3,3" />

      <rect x="115" y="0" width="75" height="34" rx="8" fill="#ef4444" />
      <text x="152" y="22" text-anchor="middle" font-size="12" font-weight="900" fill="#ffffff">T (${t})</text>

      <!-- G - C pair -->
      <rect x="210" y="0" width="75" height="34" rx="8" fill="#0284c7" />
      <text x="247" y="22" text-anchor="middle" font-size="12" font-weight="900" fill="#ffffff">G (${g})</text>

      <!-- 3 Hydrogen bonds -->
      <line x1="292" y1="9" x2="318" y2="9" stroke="#c084fc" stroke-width="3.5" stroke-dasharray="3,3" />
      <line x1="292" y1="17" x2="318" y2="17" stroke="#c084fc" stroke-width="3.5" stroke-dasharray="3,3" />
      <line x1="292" y1="25" x2="318" y2="25" stroke="#c084fc" stroke-width="3.5" stroke-dasharray="3,3" />

      <rect x="325" y="0" width="75" height="34" rx="8" fill="#f59e0b" />
      <text x="362" y="22" text-anchor="middle" font-size="12" font-weight="900" fill="#ffffff">C (${c})</text>
    </g>

    <!-- Legend & Rules -->
    <rect x="25" y="105" width="370" height="28" rx="8" fill="#1e1b4b" stroke="#818cf8" stroke-width="1" />
    <text x="210" y="123" text-anchor="middle" font-size="11" font-weight="900" fill="#c7d2fe">
      قاعدة شارجاف: [A = T = ${a}] (رابطتان) | [G = C = ${g}] (3 روابط هيدروجينية)
    </text>

    <rect x="25" y="142" width="370" height="24" rx="6" fill="#0284c7" fill-opacity="0.2" stroke="#38bdf8" stroke-width="1" />
    <text x="210" y="158" text-anchor="middle" font-size="10" font-weight="bold" fill="#7dd3fc">
      💡 مجموع القواعد البيورينية (A + G) = 50% = مجموع البريميدينية (T + C)
    </text>
  </svg>`;
}

// -----------------------------------------------------------------------------
// 7. Biology: Sarcomere & Muscle Contraction (القطعة العضلية والانقباض)
// -----------------------------------------------------------------------------
export function buildColorfulSarcomereSvg(): string {
  return `<svg viewBox="0 0 420 180" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" class="select-none font-sans">
    <defs>
      <linearGradient id="muscBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#14081c" />
        <stop offset="100%" stop-color="#241033" />
      </linearGradient>
    </defs>

    <rect width="420" height="180" rx="16" fill="url(#muscBg)" stroke="#c084fc" stroke-width="1.5" stroke-opacity="0.4" />

    <text x="210" y="25" text-anchor="middle" font-size="12" font-weight="900" fill="#e9d5ff">القطعة العضلية (Sarcomere) ونظرية الخيوط المنزلقة</text>

    <!-- Z-Lines in Green -->
    <line x1="40" y1="45" x2="40" y2="125" stroke="#10b981" stroke-width="5" stroke-linecap="round" />
    <text x="40" y="140" text-anchor="middle" font-size="11" font-weight="900" fill="#34d399">خط Z</text>

    <line x1="380" y1="45" x2="380" y2="125" stroke="#10b981" stroke-width="5" stroke-linecap="round" />
    <text x="380" y="140" text-anchor="middle" font-size="11" font-weight="900" fill="#34d399">خط Z</text>

    <!-- Thin Actin Filaments in Rose Red -->
    <line x1="40" y1="65" x2="175" y2="65" stroke="#f43f5e" stroke-width="3" />
    <line x1="40" y1="105" x2="175" y2="105" stroke="#f43f5e" stroke-width="3" />

    <line x1="245" y1="65" x2="380" y2="65" stroke="#f43f5e" stroke-width="3" />
    <line x1="245" y1="105" x2="380" y2="105" stroke="#f43f5e" stroke-width="3" />

    <!-- Thick Myosin Filaments in Royal Blue with cross-bridges -->
    <line x1="130" y1="85" x2="290" y2="85" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" />
    <!-- Cross bridges to Actin -->
    <line x1="150" y1="85" x2="155" y2="65" stroke="#facc15" stroke-width="2.5" />
    <line x1="180" y1="85" x2="185" y2="65" stroke="#facc15" stroke-width="2.5" />
    <line x1="235" y1="85" x2="230" y2="65" stroke="#facc15" stroke-width="2.5" />
    <line x1="265" y1="85" x2="260" y2="65" stroke="#facc15" stroke-width="2.5" />

    <rect x="180" y="130" width="60" height="20" rx="5" fill="#f43f5e" fill-opacity="0.25" stroke="#f43f5e" stroke-width="1" />
    <text x="210" y="144" text-anchor="middle" font-size="10" font-weight="900" fill="#fda4af">منطقة H</text>

    <rect x="40" y="152" width="340" height="20" rx="5" fill="#1e1b4b" stroke="#818cf8" stroke-width="1" />
    <text x="210" y="166" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#c7d2fe">
      عند الانقباض التام: تنعدم المنطقة (H)، يقل طول المنطقة (I)، وتظل المنطقة (A) ثابتة
    </text>
  </svg>`;
}

// -----------------------------------------------------------------------------
// 8. Mathematics: Calculus Curve, Vertex & Tangent (التفاضل والتكامل)
// -----------------------------------------------------------------------------
export function buildColorfulCalculusSvg(options: {
  equation?: string;
  slope?: string;
} = {}): string {
  const eq = options.equation || 'y = x² - 4x + 5';
  const slope = options.slope || 'dy/dx = 0 عند (2, 1)';

  return `<svg viewBox="0 0 420 180" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" class="select-none font-sans">
    <defs>
      <linearGradient id="calcBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a121e" />
        <stop offset="100%" stop-color="#141c2b" />
      </linearGradient>
      <linearGradient id="areaShade" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.45" />
        <stop offset="100%" stop-color="#10b981" stop-opacity="0.05" />
      </linearGradient>
    </defs>

    <rect width="420" height="180" rx="16" fill="url(#calcBg)" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.4" />

    <!-- Coordinate Axes -->
    <line x1="40" y1="140" x2="380" y2="140" stroke="#64748b" stroke-width="2" />
    <polygon points="380,136 390,140 380,144" fill="#94a3b8" />
    <text x="395" y="144" font-size="12" font-weight="bold" fill="#94a3b8">X</text>

    <line x1="80" y1="160" x2="80" y2="20" stroke="#64748b" stroke-width="2" />
    <polygon points="76,20 80,10 84,20" fill="#94a3b8" />
    <text x="75" y="15" font-size="12" font-weight="bold" fill="#94a3b8">Y</text>

    <!-- Shaded Integral Area -->
    <path d="M 120 140 Q 200 45 280 140 Z" fill="url(#areaShade)" />

    <!-- Parabola Curve -->
    <path d="M 105 145 Q 200 35 295 145" stroke="#38bdf8" stroke-width="3.5" fill="none" stroke-linecap="round" />

    <!-- Tangent Line at Vertex -->
    <line x1="140" y1="85" x2="260" y2="85" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4,3" />
    <circle cx="200" cy="85" r="5" fill="#ef4444" stroke="#ffffff" stroke-width="2" />

    <!-- Badges -->
    <rect x="270" y="25" width="135" height="24" rx="6" fill="#38bdf8" fill-opacity="0.2" stroke="#38bdf8" stroke-width="1" />
    <text x="337" y="41" text-anchor="middle" font-size="11" font-weight="bold" fill="#7dd3fc">${eq}</text>

    <rect x="270" y="58" width="135" height="24" rx="6" fill="#f59e0b" fill-opacity="0.2" stroke="#f59e0b" stroke-width="1" />
    <text x="337" y="74" text-anchor="middle" font-size="10" font-weight="bold" fill="#fde68a">${slope}</text>

    <rect x="270" y="91" width="135" height="24" rx="6" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="1" />
    <text x="337" y="107" text-anchor="middle" font-size="10" font-weight="bold" fill="#6ee7b7">نهاية صغرى محلية</text>
  </svg>`;
}

// -----------------------------------------------------------------------------
// 9. Master Dispatcher: Generate rich colorful diagram based on topic & parameters
// -----------------------------------------------------------------------------
export function generateColorfulDiagram(
  type?: string,
  params: Record<string, any> = {},
  subject?: string,
  contextText: string = ''
): string {
  const normType = (type || '').toLowerCase();
  const normContext = (contextText || '').toLowerCase();
  const normSubject = (subject || '').toLowerCase();

  // 1. Explicit or inferred circuit
  if (
    normType.includes('circuit') ||
    normType.includes('ohm') ||
    normContext.includes('دائرة') ||
    normContext.includes('أوم') ||
    normContext.includes('كيرشوف') ||
    normContext.includes('مقاوم') ||
    normContext.includes('فولتميتر')
  ) {
    return buildColorfulCircuitSvg({
      vb: params.vb || '12V',
      r: params.r || '1Ω',
      R: params.R || '5Ω',
      vReading: params.vReading || '10V',
      iReading: params.iReading || '2A',
    });
  }

  // 2. Magnetic field and forces
  if (
    normType.includes('magnetic') ||
    normType.includes('lorentz') ||
    normContext.includes('مغناطيس') ||
    normContext.includes('فيض') ||
    normContext.includes('تسلا') ||
    normContext.includes('فليمنج') ||
    normContext.includes('سلك مستقيم يمر به تيار')
  ) {
    return buildColorfulMagneticFieldSvg({
      bField: params.bField || '0.5 T',
      current: params.current || '4 A',
      length: params.length || '0.5 m',
      force: params.force || '1 N',
    });
  }

  // 3. Galvanic / Voltaic Daniel Cell
  if (
    normType.includes('galvanic') ||
    normType.includes('daniel') ||
    normContext.includes('دانيال') ||
    normContext.includes('جلفاني') ||
    normContext.includes('أنود') ||
    normContext.includes('كاثود') ||
    normContext.includes('قنطرة')
  ) {
    return buildColorfulGalvanicCellSvg();
  }

  // 4. Organic chemistry / Benzene
  if (
    normType.includes('benzene') ||
    normType.includes('organic') ||
    normContext.includes('بنزين') ||
    normContext.includes('طولوين') ||
    normContext.includes('عضوي') ||
    normContext.includes('هيدروكربون') ||
    normContext.includes('ألكين') ||
    normContext.includes('إيثين')
  ) {
    return buildColorfulBenzeneSvg();
  }

  // 5. General chemical reaction & heating
  if (
    normType.includes('chem') ||
    normSubject.includes('كيميا') ||
    normContext.includes('تفاعل') ||
    normContext.includes('حديد') ||
    normContext.includes('تسخين') ||
    normContext.includes('كبريتات')
  ) {
    return buildColorfulChemistrySvg({
      equation: params.equation,
      temperature: params.temperature,
    });
  }

  // 6. Biology DNA
  if (
    normType.includes('dna') ||
    normContext.includes('dna') ||
    normContext.includes('قواعد نيتروجين') ||
    normContext.includes('شارجاف') ||
    normContext.includes('ثايمين') ||
    normContext.includes('جوانين')
  ) {
    return buildColorfulDnaSvg({
      adenine: params.adenine,
      thymine: params.thymine,
      guanine: params.guanine,
      cytosine: params.cytosine,
    });
  }

  // 7. Biology Muscle / Sarcomere
  if (
    normType.includes('muscle') ||
    normType.includes('sarcomere') ||
    normContext.includes('عضل') ||
    normContext.includes('قطعة عضلية') ||
    normContext.includes('ميوسين') ||
    normContext.includes('أكتين')
  ) {
    return buildColorfulSarcomereSvg();
  }

  // 8. Math Calculus
  if (
    normType.includes('calc') ||
    normType.includes('graph') ||
    normSubject.includes('رياض') ||
    normContext.includes('تفاضل') ||
    normContext.includes('تكامل') ||
    normContext.includes('مماس') ||
    normContext.includes('منحنى')
  ) {
    return buildColorfulCalculusSvg({
      equation: params.equation,
      slope: params.slope,
    });
  }

  // Default fallback based on subject
  if (normSubject.includes('كيميا')) return buildColorfulChemistrySvg();
  if (normSubject.includes('أحياء')) return buildColorfulDnaSvg();
  if (normSubject.includes('رياض')) return buildColorfulCalculusSvg();
  return buildColorfulCircuitSvg();
}

// -----------------------------------------------------------------------------
// 10. SVG Colorizer: Injects high contrast, vibrant gradients & dark-mode styling
// -----------------------------------------------------------------------------
export function enhanceAndColorizeSvg(svgString: string, subject?: string): string {
  if (!svgString || typeof svgString !== 'string') return '';

  let cleaned = svgString.trim();
  if (!cleaned.startsWith('<svg')) {
    const match = cleaned.match(/<svg[\s\S]*?<\/svg>/i);
    if (match) cleaned = match[0];
    else return '';
  }

  // Ensure viewBox exists
  if (!cleaned.includes('viewBox')) {
    cleaned = cleaned.replace('<svg', '<svg viewBox="0 0 420 180"');
  }

  // Make width and height 100% responsive
  cleaned = cleaned.replace(/width="[^"]*"/i, 'width="100%"');
  cleaned = cleaned.replace(/height="[^"]*"/i, 'height="100%"');

  // Replace dull monotone black / grey strokes and fills with radiant neon palette
  cleaned = cleaned
    .replace(/stroke="(#000|#000000|black|#111|#222|#333|#444)"/gi, 'stroke="#38bdf8"')
    .replace(/stroke="(#fff|#ffffff|white)"/gi, 'stroke="#e0e7ff"')
    .replace(/fill="(#000|#000000|black)"/gi, 'fill="#1e1b4b"')
    .replace(/fill="(#fff|#ffffff|white)"/gi, 'fill="#ffffff"');

  // Enhance lines with stroke-width if too thin
  cleaned = cleaned.replace(/stroke-width="1"/g, 'stroke-width="2.5"');

  return cleaned;
}
