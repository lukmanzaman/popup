/* ============================================================================
   The Folded Atlas — Hand-Crafted Paper-Cut SVG Art & Chapter Definitions
   ============================================================================ */

(function () {
  let _svgUid = 0;
  function uid(prefix) {
    _svgUid += 1;
    return `${prefix}_${_svgUid}`;
  }

  // ---------- Reusable Paper-Cut Scenic & Character SVGs ----------

  function svgSun(isDusk) {
    if (isDusk) {
      return `
      <svg viewBox="0 0 140 200" fill="none">
        <!-- Thin paper support stem -->
        <rect x="67" y="106" width="6" height="94" rx="2" fill="#d9cbb0" opacity="0.55"/>
        <!-- Crescent Moon with cream cardstock border -->
        <g>
          <path d="M84 30C62 32 45 50 45 73C45 97 65 117 89 117C101 117 112 112 120 104C100 108 82 93 80 73C78 55 88 39 102 33C96 30 90 29 84 30Z"
                fill="#f6e3a1" stroke="#f7f0de" stroke-width="5" stroke-linejoin="round"/>
          <path d="M84 30C62 32 45 50 45 73C45 97 65 117 89 117C101 117 112 112 120 104C100 108 82 93 80 73C78 55 88 39 102 33C96 30 90 29 84 30Z"
                fill="#f6db85"/>
        </g>
        <!-- Paper Stars -->
        <g class="anim-twinkle">
          <path d="M28 46L31 54L39 57L31 60L28 68L25 60L17 57L25 54Z" fill="#ffe7a3" stroke="#f7f0de" stroke-width="2" stroke-linejoin="round"/>
        </g>
        <g class="anim-twinkle" style="animation-delay: 0.9s">
          <path d="M114 48L116 53L121 55L116 57L114 62L112 57L107 55L112 53Z" fill="#ffe7a3"/>
        </g>
        <g class="anim-twinkle" style="animation-delay: 1.6s">
          <circle cx="38" cy="108" r="3.5" fill="#ffe7a3"/>
        </g>
      </svg>`;
    }
    return `
    <svg viewBox="0 0 140 190" fill="none">
      <rect x="67" y="102" width="6" height="88" rx="2" fill="#dfd2b4" opacity="0.5"/>
      <g class="anim-sun-rays">
        ${Array.from({ length: 12 }, (_, i) => {
          const a = i * 30;
          return `<line x1="70" y1="16" x2="70" y2="27" stroke="#f6cf6b" stroke-width="4" stroke-linecap="round" transform="rotate(${a} 70 64)"/>`;
        }).join('')}
      </g>
      <circle cx="70" cy="64" r="31" fill="#f2bd4e" stroke="#f7efd9" stroke-width="4.5"/>
      <circle cx="64" cy="58" r="22" fill="#f7ce68" opacity="0.7"/>
    </svg>`;
  }

  function svgCloud(scale = 1, dusk = false) {
    const fill = dusk ? '#dce2dd' : '#f4ecd8';
    const shade = dusk ? '#bcc7c4' : '#e2d6ba';
    return `
    <svg viewBox="0 0 130 130" fill="none">
      <rect x="63" y="64" width="4" height="66" rx="2" fill="#d9cbb0" opacity="0.4"/>
      <g class="anim-cloud" transform="scale(${scale})">
        <path d="M26 68H102C111 68 117 61 117 53C117 45 111 39 102 39C100 39 98 39 96 40C93 29 83 22 70 22C56 22 45 31 42 44C39 42 36 41 32 41C22 41 14 48 14 56C14 63 19 68 26 68Z"
              fill="${fill}" stroke="#faf4e4" stroke-width="3" stroke-linejoin="round"/>
        <path d="M24 66H103C109 66 114 62 115 57C108 61 95 62 72 62C46 62 29 61 20 58C20 63 22 66 24 66Z" fill="${shade}" opacity="0.7"/>
      </g>
    </svg>`;
  }

  function svgPineCluster(variant = 'green') {
    const c1 = variant === 'autumn' ? '#b86335' : variant === 'dusk' ? '#254a42' : '#2d5942';
    const c2 = variant === 'autumn' ? '#d4843d' : variant === 'dusk' ? '#336358' : '#3f7354';
    const c3 = variant === 'autumn' ? '#4d774c' : variant === 'dusk' ? '#1e3c36' : '#588c65';
    return `
    <svg viewBox="0 0 170 155" fill="none">
      <!-- Back Hill Silhouette -->
      <path d="M8 152C22 104 54 90 88 94C122 98 146 114 162 152Z" fill="${c3}" opacity="0.88" stroke="#f2e8d0" stroke-width="2.5"/>
      <!-- Left Pine -->
      <g>
        <rect x="38" y="122" width="10" height="30" rx="2" fill="#6b472d"/>
        <polygon points="43,46 14,102 72,102" fill="${c1}" stroke="#f2e8d0" stroke-width="2.5" stroke-linejoin="round"/>
        <polygon points="43,72 10,126 76,126" fill="${c2}" stroke="#f2e8d0" stroke-width="2.5" stroke-linejoin="round"/>
        <polygon points="43,46 43,126 76,126" fill="#000" opacity="0.08"/>
      </g>
      <!-- Center Tall Pine -->
      <g>
        <rect x="86" y="116" width="12" height="36" rx="2" fill="#5e3e27"/>
        <polygon points="92,20 60,78 124,78" fill="${c2}" stroke="#f2e8d0" stroke-width="2.5" stroke-linejoin="round"/>
        <polygon points="92,48 54,104 130,104" fill="${c1}" stroke="#f2e8d0" stroke-width="2.5" stroke-linejoin="round"/>
        <polygon points="92,76 48,128 136,128" fill="${c2}" stroke="#f2e8d0" stroke-width="2.5" stroke-linejoin="round"/>
      </g>
      <!-- Right Small Pine -->
      <g>
        <rect x="132" y="126" width="8" height="26" rx="2" fill="#6b472d"/>
        <polygon points="136,68 112,118 160,118" fill="${c3}" stroke="#f2e8d0" stroke-width="2.2" stroke-linejoin="round"/>
        <polygon points="136,92 108,136 164,136" fill="${c1}" stroke="#f2e8d0" stroke-width="2.2" stroke-linejoin="round"/>
      </g>
    </svg>`;
  }

  function svgSignpost(label, flip = false) {
    const dir = flip ? -1 : 1;
    return `
    <svg viewBox="0 0 110 88" fill="none">
      <rect x="51" y="24" width="8" height="62" rx="2" fill="#7a5234" stroke="#f5ebd4" stroke-width="2.2"/>
      <g transform="translate(55,0) scale(${dir},1) translate(-55,0)">
        <path d="M16 26H86L98 38L86 50H16V26Z" fill="#d9a55b" stroke="#f5ebd4" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M18 45H85L94 38L85 48H18Z" fill="#b88440" opacity="0.45"/>
        <circle cx="55" cy="38" r="2.2" fill="#6b472d"/>
      </g>
      <text x="54" y="41" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" font-weight="700" fill="#3a2614">${label}</text>
      <!-- Grass tuft at base -->
      <path d="M40 86C42 78 46 77 48 86M56 86C58 76 64 77 66 86" stroke="#4f8059" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  }

  function svgPipFox(pose = 'default') {
    const holdRibbon = pose === 'ribbon';
    const holdLantern = pose === 'lantern';
    return `
    <svg viewBox="0 0 120 132" fill="none" class="pip-fox is-walking" data-facing="right">
      <g class="pip-flip-wrap">
        <!-- Animated Bushy Tail -->
        <g class="pip-tail">
          <path d="M20 96C8 90 10 70 28 69C37 68 44 79 42 96C34 100 26 99 20 96Z" fill="#d96b34" stroke="#f7efd9" stroke-width="5" stroke-linejoin="round"/>
          <path d="M20 96C8 90 10 70 28 69C37 68 44 79 42 96C34 100 26 99 20 96Z" fill="#d96b34"/>
          <path d="M12 83C12 74 20 69 28 69C24 76 23 82 24 88C17 88 13 86 12 83Z" fill="#f7ebd2"/>
        </g>

        <!-- Articulated Walking Legs -->
        <g class="pip-leg-l">
          <rect x="47" y="104" width="10" height="22" rx="4.5" fill="#442d1e" stroke="#f7efd9" stroke-width="2.5"/>
          <ellipse cx="54" cy="124" rx="6" ry="3.2" fill="#2f1e14"/>
        </g>
        <g class="pip-leg-r">
          <rect x="67" y="104" width="10" height="22" rx="4.5" fill="#442d1e" stroke="#f7efd9" stroke-width="2.5"/>
          <ellipse cx="74" cy="124" rx="6" ry="3.2" fill="#2f1e14"/>
        </g>

        <!-- Bouncing Torso & Head Assembly -->
        <g class="pip-torso">
          <!-- Die-cut cream paper halo for torso -->
          <path d="M42 78C42 70 84 70 84 78L88 112H38L42 78Z" fill="#d96b34" stroke="#f7efd9" stroke-width="5.5" stroke-linejoin="round"/>
          <!-- Body & Adventurer Tunic -->
          <path d="M42 78C42 70 84 70 84 78L88 112H38L42 78Z" fill="#d96b34"/>
          <path d="M46 79H80L83 108H43L46 79Z" fill="#3a634b"/>
          <path d="M56 79H70L68 98H58L56 79Z" fill="#f7ebd2"/>
          <!-- Satchel strap & Leather Bag -->
          <path d="M48 78L82 104" stroke="#7c4f2b" stroke-width="3.5"/>
          <rect x="74" y="94" width="16" height="14" rx="3" fill="#9a6437" stroke="#5c3a1e" stroke-width="1.5"/>
          <rect x="80" y="98" width="4" height="4" rx="1" fill="#f2c45a"/>
          <!-- Scarf -->
          <path d="M44 74C54 81 74 81 84 74C84 82 74 86 64 86C52 86 44 82 44 74Z" fill="#c24b3a"/>
          <path d="M74 80L86 92L79 95L69 83Z" fill="#a83b2c"/>

          <!-- Articulated Head -->
          <g class="pip-head">
            <path d="M36 52L43 18L59 38H69L85 18L92 52C95 66 82 78 64 78C46 78 33 66 36 52Z" fill="#e5783d" stroke="#f7efd9" stroke-width="5.5" stroke-linejoin="round"/>
            <polygon points="38,48 43,17 59,37" fill="#d96b34"/>
            <polygon points="43,43 45,25 54,37" fill="#f7ebd2"/>
            <polygon points="90,48 85,17 69,37" fill="#d96b34"/>
            <polygon points="85,43 83,25 74,37" fill="#f7ebd2"/>
            <path d="M35 53C35 38 48 31 64 31C80 31 93 38 93 53C93 67 80 76 64 76C48 76 35 67 35 53Z" fill="#e5783d"/>
            <!-- Cream Cheeks -->
            <path d="M36 55C44 55 51 61 55 74C43 72 36 65 36 55Z" fill="#f7ebd2"/>
            <path d="M92 55C84 55 77 61 73 74C85 72 92 65 92 55Z" fill="#f7ebd2"/>
            <ellipse cx="64" cy="65" rx="11" ry="8" fill="#f7ebd2"/>
            <!-- Blinking Eyes & Nose -->
            <g class="char-eyes">
              <circle cx="52" cy="53" r="3.4" fill="#271c15"/>
              <circle cx="53.2" cy="51.8" r="1.1" fill="#fff"/>
              <circle cx="76" cy="53" r="3.4" fill="#271c15"/>
              <circle cx="77.2" cy="51.8" r="1.1" fill="#fff"/>
            </g>
            <polygon points="60,61 68,61 64,66" fill="#2b1e16"/>
            <path d="M60 68Q64 71 68 68" stroke="#5a3b27" stroke-width="1.5" stroke-linecap="round"/>
          </g>

          ${holdRibbon ? `<circle cx="94" cy="90" r="8" fill="#c24b3a" stroke="#f7ebd2" stroke-width="2"/><path d="M94 90C102 88 108 94 114 90" stroke="#e05643" stroke-width="3.5" stroke-linecap="round"/>` : ''}
          ${holdLantern ? `
            <g transform="translate(86,74)">
              <line x1="10" y1="6" x2="10" y2="14" stroke="#5e3e27" stroke-width="2"/>
              <rect x="4" y="14" width="12" height="16" rx="3" fill="#ffdf7d" stroke="#855a2c" stroke-width="2"/>
              <circle cx="10" cy="22" r="10" fill="#ffd966" opacity="0.4"/>
            </g>` : ''}
        </g>
      </g>
    </svg>`;
  }

  function svgCompanion(type) {
    if (type === 'bear') {
      return `
      <svg viewBox="0 0 110 120" fill="none" class="anim-char companion-char comp-bear">
        <g stroke="#f7efd9" stroke-width="5.5" stroke-linejoin="round">
          <circle cx="36" cy="34" r="10"/>
          <circle cx="74" cy="34" r="10"/>
          <circle cx="55" cy="52" r="24"/>
          <rect x="34" y="72" width="42" height="38" rx="14"/>
        </g>
        <rect x="41" y="102" width="10" height="14" rx="4" fill="#6b4a30"/>
        <rect x="59" y="102" width="10" height="14" rx="4" fill="#6b4a30"/>
        <!-- Waving Paw -->
        <g class="comp-arm-wave">
          <ellipse cx="26" cy="76" rx="9" ry="6" transform="rotate(-32 26 76)" fill="#c7975c" stroke="#f7efd9" stroke-width="2.5"/>
        </g>
        <!-- Body -->
        <rect x="34" y="70" width="42" height="38" rx="14" fill="#c7975c"/>
        <path d="M36 78H74V104H36Z" fill="#466973" rx="6"/>
        <path d="M40 72C48 79 62 79 70 72" stroke="#e8b44c" stroke-width="6" stroke-linecap="round"/>
        <!-- Head -->
        <circle cx="36" cy="34" r="9" fill="#b8844c"/>
        <circle cx="74" cy="34" r="9" fill="#b8844c"/>
        <circle cx="55" cy="52" r="23" fill="#c7975c"/>
        <ellipse cx="55" cy="59" rx="12" ry="9" fill="#f3e5c7"/>
        <!-- Gatekeeper Cap -->
        <path d="M33 42C36 25 74 25 77 42Z" fill="#3a5948"/>
        <rect x="31" y="38" width="48" height="6" rx="3" fill="#e8b44c"/>
        <!-- Face -->
        <g class="char-eyes">
          <circle cx="46" cy="51" r="2.8" fill="#2a1d15"/>
          <circle cx="64" cy="51" r="2.8" fill="#2a1d15"/>
        </g>
        <ellipse cx="55" cy="56" rx="4" ry="2.8" fill="#3a2417"/>
        <path d="M51 62Q55 65 59 62" stroke="#5a3b27" stroke-width="1.6" stroke-linecap="round"/>
      </svg>`;
    }
    if (type === 'frog') {
      return `
      <svg viewBox="0 0 110 118" fill="none" class="companion-char">
        <g class="comp-frog-body">
          <g stroke="#f7efd9" stroke-width="5.5" stroke-linejoin="round">
            <circle cx="40" cy="34" r="11"/>
            <circle cx="70" cy="34" r="11"/>
            <ellipse cx="55" cy="55" rx="26" ry="20"/>
            <ellipse cx="55" cy="88" rx="22" ry="22"/>
          </g>
          <ellipse cx="42" cy="108" rx="10" ry="5" fill="#4f7c46"/>
          <ellipse cx="68" cy="108" rx="10" ry="5" fill="#4f7c46"/>
          <!-- Waving Frog Hand -->
          <g class="comp-arm-wave">
            <ellipse cx="26" cy="78" rx="8" ry="5.5" transform="rotate(-35 26 78)" fill="#6b9e56" stroke="#f7efd9" stroke-width="2.2"/>
          </g>
          <ellipse cx="55" cy="87" rx="22" ry="22" fill="#6b9e56"/>
          <ellipse cx="55" cy="90" rx="14" ry="15" fill="#e7dfb6"/>
          <!-- Red Ferry Neckerchief -->
          <path d="M38 72C48 79 62 79 72 72L55 86Z" fill="#c24b3a"/>
          <!-- Head & Big Frog Eyes -->
          <ellipse cx="55" cy="55" rx="26" ry="19" fill="#77ad5f"/>
          <circle cx="40" cy="35" r="10.5" fill="#77ad5f"/>
          <circle cx="70" cy="35" r="10.5" fill="#77ad5f"/>
          <circle cx="40" cy="35" r="6.2" fill="#fbf6e6"/>
          <circle cx="70" cy="35" r="6.2" fill="#fbf6e6"/>
          <g class="char-eyes">
            <circle cx="41" cy="35" r="3" fill="#231c15"/>
            <circle cx="69" cy="35" r="3" fill="#231c15"/>
          </g>
          <circle cx="38" cy="57" r="4" fill="#df8871" opacity="0.65"/>
          <circle cx="72" cy="57" r="4" fill="#df8871" opacity="0.65"/>
          <path d="M43 58Q55 66 67 58" stroke="#2c4a26" stroke-width="2" stroke-linecap="round"/>
        </g>
      </svg>`;
    }
    if (type === 'owl') {
      return `
      <svg viewBox="0 0 110 122" fill="none" class="anim-char companion-char">
        <g stroke="#f7efd9" stroke-width="5.5" stroke-linejoin="round">
          <path d="M34 36L28 20L46 29H64L82 20L76 36C84 48 86 92 74 106H36C24 92 26 48 34 36Z"/>
        </g>
        <!-- Feet -->
        <path d="M44 106L40 115M46 106L46 115M64 106L64 115M66 106L70 115" stroke="#d9963b" stroke-width="3" stroke-linecap="round"/>
        <!-- Flapping Wings -->
        <path class="comp-owl-wing-l" d="M29 58C19 68 20 86 32 92Z" fill="#7d5330" stroke="#f7efd9" stroke-width="2"/>
        <path class="comp-owl-wing-r" d="M81 58C91 68 90 86 78 92Z" fill="#7d5330" stroke="#f7efd9" stroke-width="2"/>
        <!-- Body -->
        <path d="M31 44C31 28 79 28 79 44L82 90C82 104 68 108 55 108C42 108 28 104 28 90L31 44Z" fill="#9c6e44"/>
        <!-- Ear tufts -->
        <polygon points="32,36 28,19 44,29" fill="#825834"/>
        <polygon points="78,36 82,19 66,29" fill="#825834"/>
        <!-- Cream Belly Feathers -->
        <ellipse cx="55" cy="84" rx="18" ry="20" fill="#efe2c4"/>
        <path d="M45 78Q48 82 51 78M59 78Q62 82 65 78M52 88Q55 92 58 88" stroke="#b59469" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Spectacles & Blinking Eyes -->
        <circle cx="44" cy="49" r="10.5" fill="#faf2dc" stroke="#5b3d22" stroke-width="2.2"/>
        <circle cx="66" cy="49" r="10.5" fill="#faf2dc" stroke="#5b3d22" stroke-width="2.2"/>
        <line x1="54.5" y1="49" x2="55.5" y2="49" stroke="#5b3d22" stroke-width="2.2"/>
        <g class="char-eyes">
          <circle cx="44" cy="49" r="3.6" fill="#231a13"/>
          <circle cx="66" cy="49" r="3.6" fill="#231a13"/>
        </g>
        <polygon points="51,55 59,55 55,63" fill="#e59d36"/>
        <!-- Bowtie -->
        <polygon points="46,66 55,70 46,74" fill="#b84a39"/>
        <polygon points="64,66 55,70 64,74" fill="#b84a39"/>
        <circle cx="55" cy="70" r="2.2" fill="#e8b44c"/>
      </svg>`;
    }
    if (type === 'mouse') {
      return `
      <svg viewBox="0 0 110 118" fill="none" class="companion-char">
        <g class="comp-mouse-body">
          <g stroke="#f7efd9" stroke-width="5.5" stroke-linejoin="round">
            <circle cx="34" cy="36" r="15"/>
            <circle cx="76" cy="36" r="15"/>
            <circle cx="55" cy="54" r="21"/>
            <rect x="35" y="72" width="40" height="36" rx="14"/>
          </g>
          <rect x="43" y="102" width="8" height="12" rx="4" fill="#9c8f7d"/>
          <rect x="59" y="102" width="8" height="12" rx="4" fill="#9c8f7d"/>
          <g class="comp-arm-wave">
            <ellipse cx="28" cy="80" rx="8" ry="5" transform="rotate(-25 28 80)" fill="#c7bcab" stroke="#f7efd9" stroke-width="2"/>
          </g>
          <!-- Body & Miller Apron -->
          <rect x="35" y="72" width="40" height="36" rx="14" fill="#b9ae9c"/>
          <path d="M40 76H70V106H40Z" fill="#f5ecd6"/>
          <path d="M44 72V82M66 72V82" stroke="#7d5c3b" stroke-width="3"/>
          <!-- Ears & Head -->
          <circle cx="34" cy="36" r="14" fill="#c7bcab"/>
          <circle cx="34" cy="36" r="8.5" fill="#e8b2a0"/>
          <circle cx="76" cy="36" r="14" fill="#c7bcab"/>
          <circle cx="76" cy="36" r="8.5" fill="#e8b2a0"/>
          <circle cx="55" cy="54" r="21" fill="#d3c9b8"/>
          <g class="char-eyes">
            <circle cx="46" cy="52" r="2.8" fill="#2a221c"/>
            <circle cx="64" cy="52" r="2.8" fill="#2a221c"/>
          </g>
          <circle cx="55" cy="59" r="3.4" fill="#d88272"/>
          <path d="M36 59H46M64 59H74M37 63H46M64 63H73" stroke="#7c7264" stroke-width="1.3" stroke-linecap="round"/>
        </g>
      </svg>`;
    }
    // Sailor Cat (Chapter 5)
    return `
    <svg viewBox="0 0 110 122" fill="none" class="companion-char">
      <g class="comp-sailor-body">
        <g stroke="#f7efd9" stroke-width="5.5" stroke-linejoin="round">
          <path d="M35 38L55 18L75 38Z"/>
          <circle cx="55" cy="54" r="22"/>
          <rect x="34" y="72" width="42" height="38" rx="13"/>
        </g>
        <rect x="42" y="104" width="9" height="14" rx="4" fill="#2d3b46"/>
        <rect x="59" y="104" width="9" height="14" rx="4" fill="#2d3b46"/>
        <g class="comp-arm-wave">
          <ellipse cx="26" cy="78" rx="8.5" ry="5.5" transform="rotate(-32 26 78)" fill="#324b5c" stroke="#f7efd9" stroke-width="2.2"/>
        </g>
        <!-- Sailor Sweater -->
        <rect x="34" y="72" width="42" height="36" rx="12" fill="#324b5c"/>
        <line x1="36" y1="84" x2="74" y2="84" stroke="#f2e7cf" stroke-width="3.5"/>
        <line x1="36" y1="94" x2="74" y2="94" stroke="#f2e7cf" stroke-width="3.5"/>
        <!-- Scarf -->
        <path d="M38 72C48 79 62 79 72 72" stroke="#c24b3a" stroke-width="5.5" stroke-linecap="round"/>
        <!-- Face -->
        <circle cx="55" cy="54" r="21" fill="#e6d3b3"/>
        <!-- Sailor Beanie -->
        <path d="M34 45C36 27 74 27 76 45Z" fill="#c24b3a"/>
        <rect x="32" y="42" width="46" height="6.5" rx="3" fill="#f5ecd6"/>
        <circle cx="55" cy="24" r="5" fill="#f5ecd6"/>
        <!-- Eyes & Whiskers -->
        <g class="char-eyes">
          <circle cx="46" cy="54" r="2.8" fill="#221b15"/>
          <circle cx="64" cy="54" r="2.8" fill="#221b15"/>
        </g>
        <polygon points="52,59 58,59 55,63" fill="#d97b66"/>
        <path d="M34 58H44M66 58H76M35 63H44M66 63H75" stroke="#6c5943" stroke-width="1.3" stroke-linecap="round"/>
      </g>
    </svg>`;
  }

  function svgSeagull(scale = 1, delay = 0) {
    return `
    <svg viewBox="0 0 84 64" fill="none">
      <g transform="scale(${scale})">
        <path class="gull-wing-l" style="animation-delay:${delay}s" d="M40 34C28 16 14 14 4 22C16 24 26 28 38 38Z" fill="#f8f2e2" stroke="#d8ccb2" stroke-width="2" stroke-linejoin="round"/>
        <path class="gull-wing-r" style="animation-delay:${delay}s" d="M44 34C56 16 70 14 80 22C68 24 58 28 46 38Z" fill="#f8f2e2" stroke="#d8ccb2" stroke-width="2" stroke-linejoin="round"/>
        <ellipse cx="42" cy="36" rx="8" ry="4.2" fill="#f5ecd6" stroke="#c8ba9d" stroke-width="1.5"/>
        <polygon points="48,35 55,37 48,39" fill="#e89d3e"/>
      </g>
    </svg>`;
  }

  function svgSmallSailboat() {
    return `
    <svg viewBox="0 0 96 86" fill="none" class="anim-boat boat-small">
      <line x1="48" y1="14" x2="48" y2="58" stroke="#6b472d" stroke-width="3"/>
      <polygon points="48,16 78,50 48,54" fill="#f6eed8" stroke="#d5c6a3" stroke-width="2" stroke-linejoin="round"/>
      <polygon points="45,24 24,52 45,52" fill="#e8b44c" stroke="#f6eed8" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M16 58H80L70 72H26Z" fill="#3a5d66" stroke="#f6eed8" stroke-width="2.5" stroke-linejoin="round"/>
      <circle class="boat-answer-light" cx="22" cy="54" r="6" fill="#ffe184"/>
      <path d="M10 75Q26 69 42 75T74 75T88 75" stroke="#85c4c7" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  }

  function svgAutumnLeaves() {
    return `
    <svg viewBox="0 0 140 120" fill="none">
      <ellipse class="falling-leaf" cx="28" cy="24" rx="7" ry="4" fill="#d97b38" stroke="#f6edd7" stroke-width="1.4"/>
      <ellipse class="falling-leaf" style="animation-delay:1.6s" cx="76" cy="18" rx="6.5" ry="3.8" fill="#c24b3a" stroke="#f6edd7" stroke-width="1.4"/>
      <ellipse class="falling-leaf" style="animation-delay:3.1s" cx="112" cy="28" rx="7" ry="4" fill="#e5ad43" stroke="#f6edd7" stroke-width="1.4"/>
    </svg>`;
  }

  function svgStreetLantern() {
    return `
    <svg viewBox="0 0 70 118" fill="none">
      <rect x="31" y="44" width="8" height="72" rx="2" fill="#46382b" stroke="#f3e9d2" stroke-width="2"/>
      <rect x="24" y="108" width="22" height="8" rx="2" fill="#5e4b38"/>
      <path d="M22 46L35 20L48 46Z" fill="#543828" stroke="#f3e9d2" stroke-width="2" stroke-linejoin="round"/>
      <rect x="24" y="44" width="22" height="22" rx="3" fill="#ffe182" stroke="#543828" stroke-width="2.5"/>
      <circle cx="35" cy="55" r="18" fill="#ffd86b" opacity="0.28"/>
    </svg>`;
  }

  // ---------- Hero Pop-Up Monument SVGs ----------

  function svgLanternGate() {
    const glowId = uid('gateGlowGrad');
    return `
    <svg viewBox="0 0 240 245" fill="none" class="gate-root interactive-glow">
      <!-- Pennant Flag on Peak -->
      <line x1="120" y1="8" x2="120" y2="42" stroke="#5c3d27" stroke-width="3.5" stroke-linecap="round"/>
      <polygon class="anim-flag" points="120,10 154,18 120,27" fill="#c24b3a" stroke="#f5ebd4" stroke-width="1.5" stroke-linejoin="round"/>

      <!-- Main Gatehouse Walls -->
      <rect x="34" y="88" width="172" height="150" rx="4" fill="#d9c6a0" stroke="#f6edd7" stroke-width="3.5"/>
      <!-- Timber Beams -->
      <rect x="34" y="88" width="16" height="150" fill="#7a5337"/>
      <rect x="190" y="88" width="16" height="150" fill="#7a5337"/>
      <rect x="34" y="138" width="172" height="10" fill="#8b6040" opacity="0.45"/>

      <!-- Peaked Shingled Roof -->
      <polygon points="12,96 120,26 228,96" fill="#b84a39" stroke="#f6edd7" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="26,96 120,38 214,96" fill="#9c3a2b" opacity="0.35"/>
      <!-- Roof trim & dormer diamond -->
      <polyline points="16,96 120,30 224,96" stroke="#f4e7ca" stroke-width="4.5" fill="none" stroke-linejoin="round"/>
      <polygon points="120,52 133,66 120,80 107,66" fill="#e8b44c" stroke="#f6edd7" stroke-width="2.5"/>

      <!-- Arched Wooden Gate Doors -->
      <path d="M68 238V146C68 112 172 112 172 146V238Z" fill="#593a24" stroke="#f6edd7" stroke-width="3"/>
      <!-- Warm Inner Glow (lights up when bell rings!) -->
      <path class="gate-door-glow" d="M74 238V148C74 118 166 118 166 148V238Z" fill="url(#${glowId})"/>
      <!-- Wooden Doors with Studs -->
      <path d="M74 238V148C74 120 119 118 119 148V238Z" fill="#754c30" stroke="#452b19" stroke-width="2"/>
      <path d="M121 238V148C121 118 166 120 166 148V238Z" fill="#6b442a" stroke="#452b19" stroke-width="2"/>
      <!-- Door Studs -->
      ${[162, 188, 214].map(y => `
        <circle cx="88" cy="${y}" r="2.6" fill="#d9a64c"/>
        <circle cx="107" cy="${y}" r="2.6" fill="#d9a64c"/>
        <circle cx="133" cy="${y}" r="2.6" fill="#d9a64c"/>
        <circle cx="152" cy="${y}" r="2.6" fill="#d9a64c"/>
      `).join('')}

      <!-- Side Lanterns -->
      <rect x="44" y="148" width="14" height="18" rx="3" fill="#ffdf7d" stroke="#543824" stroke-width="2"/>
      <rect x="182" y="148" width="14" height="18" rx="3" fill="#ffdf7d" stroke="#543824" stroke-width="2"/>

      <!-- Sound Chime Ripple Rings -->
      <circle class="bell-ripple" cx="120" cy="128" r="24" stroke="#ffe184" stroke-width="3.5" fill="none"/>
      <circle class="bell-ripple" style="animation-delay:0.25s" cx="120" cy="128" r="34" stroke="#f6c453" stroke-width="2.2" fill="none"/>

      <!-- Interactive Hanging Brass Bell -->
      <g class="bell-assembly" data-action="ring-bell">
        <line x1="120" y1="96" x2="120" y2="112" stroke="#4a311e" stroke-width="4"/>
        <path d="M104 142C104 120 109 111 120 111C131 111 136 120 136 142L143 149H97L104 142Z"
              fill="#eab446" stroke="#f7efd9" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M111 116C114 114 118 114 121 116L117 143H108Z" fill="#fce08b" opacity="0.65"/>
        <circle cx="120" cy="151" r="5" fill="#9e6d21"/>
        <!-- Generous Invisible Hit Target -->
        <circle cx="120" cy="132" r="34" fill="transparent"/>
      </g>

      <defs>
        <radialGradient id="${glowId}" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffe896"/>
          <stop offset="100%" stop-color="#d97b34" stop-opacity="0.2"/>
        </radialGradient>
      </defs>
    </svg>`;
  }

  function svgRibbonBridge() {
    const planks = [126, 158, 190, 222, 254];
    const flags = [
      { x: 96, c: '#c24b3a' },
      { x: 132, c: '#e8b44c' },
      { x: 168, c: '#487a5b' },
      { x: 204, c: '#c24b3a' },
      { x: 240, c: '#e8b44c' },
      { x: 276, c: '#5c999c' },
      { x: 310, c: '#c24b3a' }
    ];
    return `
    <svg viewBox="0 0 420 205" fill="none" class="bridge-root">
      <!-- Bunting String Across Top -->
      <g class="bunting-sway">
        <path d="M74 42 Q 210 82 346 42" stroke="#5a3b25" stroke-width="2.5" fill="none"/>
        ${flags.map((f, i) => {
          const yOff = 49 + Math.sin((i + 1) / (flags.length + 1) * Math.PI) * 19;
          return `<polygon points="${f.x},${yOff} ${f.x + 24},${yOff + 1} ${f.x + 12},${yOff + 22}" fill="${f.c}" stroke="#f5ebd4" stroke-width="1.3" stroke-linejoin="round"/>`;
        }).join('')}
      </g>

      <!-- Suspension Ropes -->
      <path d="M74 90 Q 210 132 346 90" stroke="#966c44" stroke-width="3.5" fill="none"/>
      <path d="M74 128 Q 210 156 346 128" stroke="#7c5533" stroke-width="4" fill="none"/>
      <!-- Vertical Rope Hangers -->
      ${planks.map(x => `<line x1="${x + 12}" y1="108" x2="${x + 12}" y2="145" stroke="#a67c52" stroke-width="2"/>`).join('')}

      <!-- Left & Right Bridge Posts -->
      <g>
        <rect x="58" y="34" width="24" height="154" rx="4" fill="#8b5d38" stroke="#f5ebd4" stroke-width="3"/>
        <rect x="52" y="28" width="36" height="14" rx="4" fill="#a87447" stroke="#f5ebd4" stroke-width="2.2"/>
        <circle cx="70" cy="112" r="5" fill="#e8b44c"/>
      </g>
      <g data-action="snap-ribbon-post" style="cursor:pointer">
        <rect x="338" y="34" width="24" height="154" rx="4" fill="#8b5d38" stroke="#f5ebd4" stroke-width="3"/>
        <rect x="332" y="28" width="36" height="14" rx="4" fill="#a87447" stroke="#f5ebd4" stroke-width="2.2"/>
        <circle cx="350" cy="112" r="7" fill="#e8b44c" stroke="#5a3820" stroke-width="2"/>
        <circle cx="350" cy="112" r="22" fill="transparent"/>
      </g>

      <!-- Bridge End Planks (already intact) -->
      <rect x="86" y="136" width="28" height="14" rx="3" fill="#b98754" stroke="#5c3b22" stroke-width="1.8"/>
      <rect x="306" y="136" width="28" height="14" rx="3" fill="#b98754" stroke="#5c3b22" stroke-width="1.8"/>

      <!-- 5 Missing Planks (Pop into place when ribbon is pulled!) -->
      ${planks.map((x, idx) => `
        <g class="bridge-plank" data-plank-idx="${idx}">
          <rect x="${x}" y="139" width="26" height="15" rx="3" fill="#cfa068" stroke="#5c3b22" stroke-width="1.8"/>
          <line x1="${x + 5}" y1="145" x2="${x + 21}" y2="145" stroke="#8a5e35" stroke-width="1.3"/>
        </g>
      `).join('')}

      <!-- Surviving Words Banner (Revealed on repair!) -->
      <g class="bridge-words-banner">
        <rect x="136" y="88" width="148" height="28" rx="6" fill="#faf2dc" stroke="#b84a39" stroke-width="2"/>
        <text x="210" y="106" text-anchor="middle" font-family="'Fraunces', serif" font-weight="700" font-size="12.5" fill="#7c2f22">"TWO FLASHES"</text>
      </g>

      <!-- Interactive Red Ribbon (Draggable from left post to right post) -->
      <path class="ribbon-line" d="M 76 112 Q 94 128 112 118" stroke="#d14938" stroke-width="6.5" stroke-linecap="round" fill="none"/>
      <g class="ribbon-handle interactive-glow" data-action="drag-ribbon" transform="translate(112, 118)">
        <circle cx="0" cy="0" r="15" fill="#d14938" stroke="#fbf4e2" stroke-width="3"/>
        <path d="M-4 -4L4 0L-4 4" stroke="#fbf4e2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="0" cy="0" r="28" fill="transparent"/>
      </g>
    </svg>`;
  }

  function svgFoldedLibrary() {
    const bookColors = ['#c24b3a', '#487a5b', '#e8b44c', '#5c999c', '#8a556e', '#d67c3c', '#3c5a73'];
    let booksMarkup = '';
    for (let row = 0; row < 3; row++) {
      const y = 122 + row * 28;
      for (let col = 0; col < 6; col++) {
        const x = 136 + col * 14;
        const h = 20 + ((row + col) % 3) * 2;
        const c = bookColors[(row * 5 + col) % bookColors.length];
        booksMarkup += `<rect x="${x}" y="${y + (24 - h)}" width="11" height="${h}" rx="1.5" fill="${c}" stroke="#442d1e" stroke-width="1"/>`;
      }
    }
    return `
    <svg viewBox="0 0 265 245" fill="none">
      <!-- Wooden Library Cabin -->
      <rect x="28" y="96" width="208" height="142" rx="4" fill="#b98b59" stroke="#f6edd7" stroke-width="3.5"/>
      <!-- Vertical Timber Planks -->
      ${[50, 74, 98, 122].map(x => `<line x1="${x}" y1="100" x2="${x}" y2="236" stroke="#8a6037" stroke-width="1.5" opacity="0.55"/>`).join('')}

      <!-- Red Library Front Door -->
      <rect x="52" y="138" width="54" height="100" rx="4" fill="#b84a39" stroke="#f6edd7" stroke-width="2.5"/>
      <rect x="61" y="148" width="36" height="36" rx="2" fill="#ffe18c" stroke="#6b2b20" stroke-width="2"/>
      <line x1="79" y1="148" x2="79" y2="184" stroke="#6b2b20" stroke-width="2"/>
      <line x1="61" y1="166" x2="97" y2="166" stroke="#6b2b20" stroke-width="2"/>
      <circle cx="96" cy="196" r="3.5" fill="#f2c45a"/>

      <!-- Recessed Bookshelves Window -->
      <rect x="128" y="114" width="96" height="96" rx="3" fill="#4f3522" stroke="#f6edd7" stroke-width="2.5"/>
      <line x1="128" y1="146" x2="224" y2="146" stroke="#8c6239" stroke-width="4"/>
      <line x1="128" y1="174" x2="224" y2="174" stroke="#8c6239" stroke-width="4"/>
      <line x1="128" y1="202" x2="224" y2="202" stroke="#8c6239" stroke-width="4"/>
      ${booksMarkup}

      <!-- GIANT OPEN-BOOK ROOF -->
      <g>
        <!-- Red Book Cover Underside -->
        <path d="M8 96L132 108L256 96L242 42L132 58L22 42Z" fill="#a83d2e" stroke="#f6edd7" stroke-width="3.5" stroke-linejoin="round"/>
        <!-- Cream Open Pages -->
        <path d="M18 86C52 72 96 76 132 94C168 76 212 72 246 86L234 32C202 22 162 28 132 50C102 28 62 22 30 32Z"
              fill="#f7eed8" stroke="#d4c198" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- Page Lines & Spine -->
        <line x1="132" y1="50" x2="132" y2="95" stroke="#bfa77c" stroke-width="3"/>
        <path d="M40 44C68 38 96 42 122 56M38 56C66 50 96 54 122 68M36 68C64 62 96 66 122 80" stroke="#c8b691" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M224 44C196 38 168 42 142 56M226 56C198 50 168 54 142 68M228 68C200 62 168 66 142 80" stroke="#c8b691" stroke-width="1.6" stroke-linecap="round"/>
        <!-- Red Bookmark Ribbon -->
        <path d="M132 94V128L125 122L118 128V94Z" fill="#c24b3a"/>
      </g>
    </svg>`;
  }

  function svgWaxEnvelope() {
    return `
    <div class="envelope-wrapper" data-envelope-root>
      <!-- Route Note Card that slides out -->
      <div class="envelope-card">
        <span class="route-card-label">PIP'S ROUTE</span>
        <button type="button" class="route-link-btn" data-action="touch-gull-point">[[Gull Point]]</button>
      </div>
      <!-- Envelope on Post SVG -->
      <svg viewBox="0 0 140 132" fill="none" class="interactive-glow" data-action="open-envelope" style="cursor:pointer">
        <!-- Wooden Stand Post -->
        <rect x="65" y="92" width="10" height="38" rx="2" fill="#7a5337" stroke="#f5ebd4" stroke-width="2"/>
        <!-- Envelope Body -->
        <rect x="16" y="28" width="108" height="72" rx="6" fill="#e8d6b2" stroke="#f7efd9" stroke-width="3.5"/>
        <path d="M18 98L58 64M122 98L82 64" stroke="#c6b084" stroke-width="2"/>
        <!-- Hinged Top Flap -->
        <polygon class="envelope-flap-svg" points="16,30 124,30 70,68" fill="#f2e5c7" stroke="#c6b084" stroke-width="2" stroke-linejoin="round"/>
        <!-- Red Wax Seal -->
        <g class="wax-seal-svg">
          <circle cx="70" cy="63" r="13" fill="#b84232" stroke="#f5ebd4" stroke-width="2"/>
          <circle cx="70" cy="63" r="8.5" fill="#d15240"/>
          <path d="M70 57L72 61L76 63L72 65L70 69L68 65L64 63L68 61Z" fill="#fce4a6"/>
        </g>
      </svg>
    </div>`;
  }

  function svgBookStack() {
    return `
    <svg viewBox="0 0 125 95" fill="none">
      <!-- Bottom Green Book -->
      <rect x="10" y="64" width="96" height="24" rx="4" fill="#3d7052" stroke="#f5ebd4" stroke-width="2.5"/>
      <rect x="18" y="69" width="76" height="14" rx="2" fill="#f3e8ce"/>
      <!-- Middle Red Book -->
      <rect x="20" y="40" width="88" height="24" rx="4" fill="#b84a39" stroke="#f5ebd4" stroke-width="2.5"/>
      <rect x="28" y="45" width="70" height="14" rx="2" fill="#f3e8ce"/>
      <!-- Top Gold Book -->
      <rect x="16" y="18" width="80" height="22" rx="4" fill="#d9a145" stroke="#f5ebd4" stroke-width="2.5"/>
      <rect x="24" y="23" width="64" height="12" rx="2" fill="#f6edd7"/>
    </svg>`;
  }

  function svgSignalMill() {
    return `
    <svg viewBox="0 0 240 270" fill="none" class="mill-root">
      <!-- Pennant Flag -->
      <line x1="120" y1="10" x2="120" y2="42" stroke="#5c3d27" stroke-width="3.2"/>
      <polygon class="anim-flag" points="120,12 150,20 120,28" fill="#c24b3a" stroke="#f5ebd4" stroke-width="1.5"/>

      <!-- Tapered Windmill Tower -->
      <polygon points="78,94 162,94 184,262 56,262" fill="#e8d9b8" stroke="#f7efd9" stroke-width="3.5" stroke-linejoin="round"/>
      <!-- Timber Bracing & Shading -->
      <polygon points="120,94 162,94 184,262 120,262" fill="#d8c59d" opacity="0.5"/>
      <line x1="68" y1="168" x2="172" y2="168" stroke="#a68153" stroke-width="3"/>
      <line x1="62" y1="216" x2="178" y2="216" stroke="#a68153" stroke-width="3"/>

      <!-- Red Conical Roof Cap -->
      <polygon points="66,98 120,34 174,98" fill="#b84a39" stroke="#f7efd9" stroke-width="3.5" stroke-linejoin="round"/>
      <polygon points="120,34 174,98 120,98" fill="#8f3428" opacity="0.3"/>

      <!-- Small Warm Window -->
      <rect x="108" y="138" width="24" height="24" rx="12" fill="#ffe188" stroke="#6b472d" stroke-width="2.5"/>

      <!-- Arched Mill Door & Brass Printer Slot -->
      <path d="M98 262V214C98 198 142 198 142 214V262Z" fill="#6b472d" stroke="#f5ebd4" stroke-width="2.2"/>
      <rect x="148" y="218" width="24" height="12" rx="3" fill="#4f3522" stroke="#e8b44c" stroke-width="2"/>

      <!-- Printed Signal Strip (Slides down when mill completes a turn!) -->
      <g class="signal-strip-paper">
        <path d="M150 228H170V262L165 258L160 262L155 258L150 262Z" fill="#fbf4e2" stroke="#b59e72" stroke-width="1.6"/>
        <text x="160" y="244" text-anchor="middle" font-size="9" fill="#c24b3a" font-weight="700">✦</text>
        <text x="160" y="255" text-anchor="middle" font-size="9" fill="#c24b3a" font-weight="700">✦</text>
      </g>

      <!-- 4 Interactive Rotating Windmill Sails -->
      <g class="mill-sails-group interactive-glow" data-action="spin-mill">
        ${[0, 90, 180, 270].map(angle => `
          <g transform="rotate(${angle} 120 108)">
            <rect x="116" y="14" width="8" height="94" rx="2" fill="#7a5233" stroke="#f5ebd4" stroke-width="1.5"/>
            <rect x="124" y="20" width="28" height="72" rx="3" fill="#d9aa66" fill-opacity="0.88" stroke="#7a5233" stroke-width="2.4"/>
            <line x1="124" y1="38" x2="152" y2="38" stroke="#7a5233" stroke-width="1.8"/>
            <line x1="124" y1="56" x2="152" y2="56" stroke="#7a5233" stroke-width="1.8"/>
            <line x1="124" y1="74" x2="152" y2="74" stroke="#7a5233" stroke-width="1.8"/>
            <line x1="138" y1="20" x2="138" y2="92" stroke="#7a5233" stroke-width="1.5"/>
          </g>
        `).join('')}
        <!-- Brass Hub -->
        <circle cx="120" cy="108" r="14" fill="#e8b44c" stroke="#f7efd9" stroke-width="3"/>
        <circle cx="120" cy="108" r="5" fill="#6b472d"/>
        <!-- Large Invisible Hit Circle -->
        <circle cx="120" cy="108" r="95" fill="transparent"/>
      </g>
    </svg>`;
  }

  function svgCottageMeadow() {
    return `
    <svg viewBox="0 0 150 112" fill="none">
      <!-- Wooden Fence -->
      <line x1="10" y1="92" x2="140" y2="92" stroke="#8b603b" stroke-width="4"/>
      <line x1="10" y1="102" x2="140" y2="102" stroke="#8b603b" stroke-width="4"/>
      ${[18, 46, 108, 134].map(x => `<rect x="${x}" y="82" width="6" height="28" rx="1.5" fill="#754e2e"/>`).join('')}
      <!-- Small Meadow Barn -->
      <rect x="44" y="48" width="66" height="58" rx="3" fill="#d6c098" stroke="#f5ebd4" stroke-width="2.8"/>
      <polygon points="36,52 77,18 118,52" fill="#b84a39" stroke="#f5ebd4" stroke-width="2.8" stroke-linejoin="round"/>
      <rect x="66" y="70" width="22" height="36" rx="2" fill="#7a5337"/>
      <rect x="52" y="58" width="10" height="10" rx="1.5" fill="#ffe188"/>
      <rect x="92" y="58" width="10" height="10" rx="1.5" fill="#ffe188"/>
      <!-- Golden Wheat Tufts -->
      <g class="wheat-sway">
        <path d="M16 108L12 74M22 108L24 72M28 108L34 76M118 108L114 74M125 108L128 70" stroke="#e2ad47" stroke-width="3.2" stroke-linecap="round"/>
      </g>
    </svg>`;
  }

  function svgLighthouse() {
    const towerClipId = uid('towerClip');
    const beamLId = uid('beamLeftGrad');
    const beamRId = uid('beamRightGrad');
    return `
    <svg viewBox="0 0 230 295" fill="none" class="lighthouse-root">
      <!-- Sweeping Golden Light Beams (Activated when lever is lifted!) -->
      <g class="lighthouse-beam">
        <polygon points="112,90 -180,28 -180,152" fill="url(#${beamLId})"/>
        <polygon points="112,90 360,36 360,144" fill="url(#${beamRId})"/>
      </g>

      <!-- Red & White Striped Lighthouse Tower -->
      <clipPath id="${towerClipId}">
        <polygon points="78,116 146,116 164,284 60,284"/>
      </clipPath>
      <polygon points="78,116 146,116 164,284 60,284" fill="#f5ecd6" stroke="#faf3e3" stroke-width="4" stroke-linejoin="round"/>
      <g clip-path="url(#${towerClipId})">
        <rect x="50" y="138" width="130" height="30" fill="#b84a39"/>
        <rect x="50" y="198" width="130" height="30" fill="#b84a39"/>
        <rect x="50" y="256" width="130" height="30" fill="#b84a39"/>
        <polygon points="112,116 146,116 164,284 112,284" fill="#000" opacity="0.09"/>
      </g>

      <!-- Gallery Balcony -->
      <rect x="64" y="108" width="96" height="12" rx="3" fill="#46372b" stroke="#f5ecd6" stroke-width="2"/>
      <line x1="72" y1="96" x2="152" y2="96" stroke="#46372b" stroke-width="2.5"/>
      ${[74, 92, 112, 132, 150].map(x => `<line x1="${x}" y1="96" x2="${x}" y2="108" stroke="#46372b" stroke-width="2"/>`).join('')}

      <!-- Lantern Room Glass & Interactive Brass Lantern Orb -->
      <rect x="82" y="66" width="60" height="42" rx="4" fill="#2a3f4a" stroke="#f5ecd6" stroke-width="2.5"/>
      <g class="lighthouse-orb interactive-glow" data-action="flash-lantern">
        <circle cx="112" cy="88" r="17" fill="#ffd86b" stroke="#fff6d1" stroke-width="2.5"/>
        <circle cx="107" cy="83" r="6" fill="#fff9de" opacity="0.8"/>
        <circle cx="112" cy="88" r="28" fill="transparent"/>
      </g>

      <!-- Red Dome Roof & Spire -->
      <path d="M74 68C78 38 146 38 150 68Z" fill="#b84a39" stroke="#f5ecd6" stroke-width="3"/>
      <line x1="112" y1="16" x2="112" y2="42" stroke="#46372b" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="112" cy="18" r="4.5" fill="#e8b44c"/>

      <!-- Doorway & Interactive Red Lever -->
      <path d="M96 284V242C96 230 128 230 128 242V284Z" fill="#4e3726" stroke="#f5ecd6" stroke-width="2.2"/>
      <!-- Lever Housing -->
      <rect x="84" y="242" width="16" height="20" rx="3" fill="#32241a" stroke="#e8b44c" stroke-width="1.6"/>
      <g class="lighthouse-lever-arm interactive-glow" data-action="pull-lever">
        <line x1="92" y1="252" x2="64" y2="236" stroke="#d9d1c0" stroke-width="4.5" stroke-linecap="round"/>
        <circle cx="62" cy="235" r="8" fill="#d14938" stroke="#faf3e3" stroke-width="2.2"/>
        <circle cx="68" cy="240" r="26" fill="transparent"/>
      </g>

      <defs>
        <linearGradient id="${beamLId}" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stop-color="#ffe794" stop-opacity="0.88"/>
          <stop offset="100%" stop-color="#ffe794" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="${beamRId}" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="#ffe794" stop-opacity="0.72"/>
          <stop offset="100%" stop-color="#ffe794" stop-opacity="0"/>
        </linearGradient>
      </defs>
    </svg>`;
  }

  function svgSailboat() {
    return `
    <svg viewBox="0 0 140 128" fill="none" class="anim-boat boat-root">
      <!-- Mast & Sails -->
      <line x1="68" y1="16" x2="68" y2="86" stroke="#6b472d" stroke-width="4" stroke-linecap="round"/>
      <polygon points="68,20 116,74 68,78" fill="#f5ecd6" stroke="#d6c6a4" stroke-width="2.2" stroke-linejoin="round"/>
      <polygon points="64,26 28,74 64,76" fill="#c24b3a" stroke="#f5ecd6" stroke-width="2.2" stroke-linejoin="round"/>
      <!-- Wooden Hull -->
      <path d="M18 82H122L106 108H34Z" fill="#b84a39" stroke="#f5ecd6" stroke-width="3" stroke-linejoin="round"/>
      <path d="M24 92H116" stroke="#f5ecd6" stroke-width="3"/>
      <!-- Answering Signal Lantern on Bow -->
      <g class="boat-answer-light">
        <circle cx="114" cy="76" r="18" fill="#ffe184" opacity="0.4"/>
        <circle cx="114" cy="76" r="7" fill="#fff0a6" stroke="#e8b44c" stroke-width="2"/>
      </g>
      <!-- Paper Waves -->
      <path d="M10 112Q28 104 46 112T82 112T118 112T134 112" stroke="#85c4c7" stroke-width="4" stroke-linecap="round" fill="none"/>
    </svg>`;
  }

  // ---------- Printed Base Map Pages (470 x 590 each) ----------

  function pageFrameSVG(side, label, plate, bodyMarkup) {
    const isLeft = side === 'left';
    return `
    <svg viewBox="0 0 470 590" preserveAspectRatio="none">
      <!-- Subtle Page Border Rule -->
      <rect x="18" y="18" width="434" height="554" rx="4" fill="none" stroke="#c8b691" stroke-width="1.2" opacity="0.65"/>
      <rect x="24" y="24" width="422" height="542" rx="2" fill="none" stroke="#d5c5a3" stroke-width="0.8" opacity="0.5"/>
      ${bodyMarkup}
      <!-- Bottom Map Typography -->
      ${isLeft
        ? `<text x="38" y="556" font-family="'JetBrains Mono', monospace" font-size="11.5" letter-spacing="3.5" fill="#7d684b" font-weight="600">${label}</text>`
        : `<text x="432" y="556" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="11.5" letter-spacing="3" fill="#7d684b" font-weight="600">${plate}</text>`
      }
    </svg>`;
  }

  function mapGateLeft() {
    return pageFrameSVG('left', 'LANTERN VALLEY', '', `
      <path d="M0 160C110 140 190 210 290 250C360 278 420 268 470 284V480C390 456 290 490 190 472C110 458 45 478 0 454Z" fill="#d9d8b5" opacity="0.72"/>
      <!-- Winding Golden Path -->
      <path d="M52 512C110 448 165 408 260 398C340 390 412 372 470 364" fill="none" stroke="#e2cfa0" stroke-width="56" stroke-linecap="round"/>
      <path d="M52 512C110 448 165 408 260 398C340 390 412 372 470 364" fill="none" stroke="#9e7f52" stroke-width="2.2" stroke-dasharray="7 9" opacity="0.72" class="map-route-dash"/>
      <!-- Meadow Contour Lines -->
      <path d="M40 310C100 290 160 302 220 326" fill="none" stroke="#b9b28a" stroke-width="1.5"/>
      <circle cx="96" cy="490" r="3.5" fill="#9c7e52" opacity="0.55"/>
    `);
  }

  function mapGateRight() {
    return pageFrameSVG('right', '', 'PLATE 01', `
      <path d="M0 284C90 272 180 230 290 245C370 256 430 220 470 240V468C390 492 260 478 160 486C80 492 30 470 0 480Z" fill="#d9d8b5" opacity="0.72"/>
      <path d="M0 364C92 356 172 342 256 368C326 390 388 416 434 454" fill="none" stroke="#e2cfa0" stroke-width="58" stroke-linecap="round"/>
      <path d="M0 364C92 356 172 342 256 368C326 390 388 416 434 454" fill="none" stroke="#9e7f52" stroke-width="2.2" stroke-dasharray="7 9" opacity="0.72" class="map-route-dash"/>
      <!-- Gatehouse Courtyard Stone Paving -->
      <ellipse cx="210" cy="340" rx="112" ry="52" fill="#dfd2b1" stroke="#c2b089" stroke-width="1.5"/>
    `);
  }

  function mapBridgeLeft() {
    return pageFrameSVG('left', 'RIBBON RIVER', '', `
      <path d="M0 190C120 170 220 220 310 240C370 254 410 300 400 590H0Z" fill="#d3d8b4" opacity="0.68"/>
      <!-- Sparkling Teal River Edge Entering From Spine -->
      <path d="M366 0C390 120 342 246 378 368C404 454 368 530 350 590H470V0Z" fill="#78b1b3"/>
      <path d="M388 40C404 140 366 250 400 370C422 448 394 520 380 578" fill="none" stroke="#b9e0de" stroke-width="3" stroke-dasharray="14 14" stroke-linecap="round" opacity="0.7"/>
      <!-- Path to Left Bridge Post -->
      <path d="M76 476C150 426 248 394 374 378" fill="none" stroke="#e3cfa2" stroke-width="46" stroke-linecap="round"/>
      <path d="M76 476C150 426 248 394 374 378" fill="none" stroke="#9e7f52" stroke-width="2.2" stroke-dasharray="7 9" opacity="0.65"/>
    `);
  }

  function mapBridgeRight() {
    return pageFrameSVG('right', '', 'PLATE 02', `
      <!-- River Continuing Across Right Page -->
      <path d="M0 0H188C164 134 218 258 184 396C162 480 184 542 204 590H0Z" fill="#78b1b3"/>
      <path d="M44 26C28 140 72 252 46 382C26 476 58 536 74 580" fill="none" stroke="#b9e0de" stroke-width="3.2" stroke-dasharray="16 14" stroke-linecap="round" opacity="0.75" class="map-route-dash"/>
      <path d="M126 70C114 166 150 264 128 386C114 460 132 522 146 572" fill="none" stroke="#a6d5d5" stroke-width="2.4" stroke-dasharray="10 12" stroke-linecap="round" opacity="0.65" class="map-route-dash"/>
      <!-- Drifting Flood Planks Floating Down the River -->
      <g class="river-drift">
        <rect x="64" y="60" width="26" height="10" rx="2" transform="rotate(-14 77 65)" fill="#b9844e" stroke="#f4e9d0" stroke-width="1.5"/>
        <rect x="110" y="180" width="22" height="9" rx="2" transform="rotate(19 121 184)" fill="#c9955e" stroke="#f4e9d0" stroke-width="1.5"/>
      </g>
      <g class="river-drift" style="animation-delay: -3.2s">
        <rect x="86" y="100" width="24" height="10" rx="2" transform="rotate(11 98 105)" fill="#b9844e" stroke="#f4e9d0" stroke-width="1.5"/>
      </g>
      <!-- Far Meadow & Trail -->
      <path d="M188 0H470V590H204C184 542 162 480 184 396C218 258 164 134 188 0Z" fill="#d8dab8" opacity="0.62"/>
      <path d="M188 378C268 382 344 410 416 442" fill="none" stroke="#e3cfa2" stroke-width="46" stroke-linecap="round"/>
      <path d="M188 378C268 382 344 410 416 442" fill="none" stroke="#9e7f52" stroke-width="2.2" stroke-dasharray="7 9" opacity="0.65"/>
    `);
  }

  function mapLibraryLeft() {
    return pageFrameSVG('left', 'BOOKLEAF WOOD', '', `
      <path d="M0 170C140 160 250 210 380 230C424 236 450 246 470 258V500C340 486 190 502 0 472Z" fill="#d7d2ad" opacity="0.72"/>
      <path d="M58 468C164 412 296 382 470 374" fill="none" stroke="#e4d0a4" stroke-width="48" stroke-linecap="round"/>
      <path d="M58 468C164 412 296 382 470 374" fill="none" stroke="#9e7f52" stroke-width="2.2" stroke-dasharray="7 9" opacity="0.72" class="map-route-dash"/>
      <!-- Scattered Autumn Leaves -->
      <ellipse cx="144" cy="360" rx="8" ry="4" transform="rotate(-24 144 360)" fill="#c97d42" opacity="0.5"/>
      <ellipse cx="290" cy="442" rx="7" ry="3.5" transform="rotate(18 290 442)" fill="#b85b3b" opacity="0.5"/>
    `);
  }

  function mapLibraryRight() {
    return pageFrameSVG('right', '', 'PLATE 03', `
      <path d="M0 258C120 246 250 218 374 242C424 252 452 262 470 270V492C360 478 210 506 0 500Z" fill="#d7d2ad" opacity="0.72"/>
      <ellipse cx="220" cy="348" rx="126" ry="58" fill="#e2d3ae" stroke="#c3ae84" stroke-width="1.5"/>
      <path d="M0 374C100 372 190 384 294 406C354 418 400 434 434 456" fill="none" stroke="#e4d0a4" stroke-width="48" stroke-linecap="round"/>
      <path d="M0 374C100 372 190 384 294 406C354 418 400 434 434 456" fill="none" stroke="#9e7f52" stroke-width="2.2" stroke-dasharray="7 9" opacity="0.65"/>
    `);
  }

  function mapMillLeft() {
    return pageFrameSVG('left', 'COPPER MEADOW', '', `
      <path d="M0 180C120 156 260 198 470 220V504C310 492 160 510 0 478Z" fill="#e2d09c" opacity="0.74"/>
      <path d="M68 474C178 424 316 392 470 382" fill="none" stroke="#ecd9a9" stroke-width="50" stroke-linecap="round"/>
      <path d="M68 474C178 424 316 392 470 382" fill="none" stroke="#9e7a48" stroke-width="2.2" stroke-dasharray="7 9" opacity="0.72" class="map-route-dash"/>
      <!-- Contour Crop Stripes -->
      <path d="M40 270Q160 250 280 282M56 302Q176 282 296 314" fill="none" stroke="#cca85d" stroke-width="2" opacity="0.5"/>
    `);
  }

  function mapMillRight() {
    return pageFrameSVG('right', '', 'PLATE 04', `
      <path d="M0 220C140 208 310 190 470 236V496C340 508 170 486 0 504Z" fill="#e2d09c" opacity="0.74"/>
      <circle cx="210" cy="356" r="78" fill="#d9c491" stroke="#b99c62" stroke-width="1.6"/>
      <path d="M0 382C116 378 240 398 418 446" fill="none" stroke="#ecd9a9" stroke-width="48" stroke-linecap="round"/>
      <path d="M0 382C116 378 240 398 418 446" fill="none" stroke="#9e7a48" stroke-width="2.2" stroke-dasharray="7 9" opacity="0.65"/>
    `);
  }

  function mapBeaconLeft() {
    return pageFrameSVG('left', 'GULL POINT', '', `
      <!-- Coastal Sea Water -->
      <rect x="0" y="0" width="470" height="590" fill="#5e979c" opacity="0.88"/>
      <!-- Sandy Headland Entering from Right -->
      <path d="M470 246C386 254 316 296 286 356C258 412 288 478 364 510C406 528 444 532 470 532Z" fill="#dfd1ae" stroke="#f2e7cc" stroke-width="5"/>
      <!-- Wave Arcs -->
      <path d="M46 210Q86 196 126 210T206 210M70 338Q110 324 150 338T230 338M48 458Q94 442 140 458T232 458" fill="none" stroke="#9fd3d4" stroke-width="2.6" stroke-linecap="round" opacity="0.72"/>
      <!-- Boat Signal Path -->
      <path d="M180 340C244 352 310 368 470 380" fill="none" stroke="#fce29a" stroke-width="2.6" stroke-dasharray="6 9" opacity="0.9" class="map-route-dash"/>
    `);
  }

  function mapBeaconRight() {
    return pageFrameSVG('right', '', 'PLATE 05', `
      <!-- Sea on Outer Edges -->
      <rect x="0" y="0" width="470" height="590" fill="#5e979c" opacity="0.84"/>
      <!-- Gull Point Promontory -->
      <path d="M0 246C106 226 238 228 334 274C412 312 436 410 374 476C306 546 130 538 0 532Z" fill="#dfd1ae" stroke="#f2e7cc" stroke-width="5"/>
      <ellipse cx="206" cy="348" rx="92" ry="52" fill="#d2c199" stroke="#b6a073" stroke-width="1.5"/>
      <path d="M0 380C94 378 192 384 310 412" fill="none" stroke="#9e7f52" stroke-width="2.2" stroke-dasharray="7 9" opacity="0.65"/>
      <path d="M366 186Q402 174 438 186M340 536Q384 522 428 536" fill="none" stroke="#9fd3d4" stroke-width="2.6" stroke-linecap="round" opacity="0.7"/>
    `);
  }

  // ---------- Master Chapter Registry ----------

  window.ATLAS_CHAPTERS = [
    {
      id: 'gate',
      num: '01',
      tag: 'ENTRY',
      title: 'The Lantern Gate',
      location: 'Lantern Valley',
      plate: 'PLATE 01',
      theme: 'day',
      hint: 'Tap the brass bell hanging in the gate.',
      solvedHint: 'The gate bell rings across the valley. Turn the page to follow Pip.',
      story: 'The lighthouse is dark. Pip has until dusk to carry a signal across the island.',
      solvedStory: 'The brass chime wakes the valley lanterns. Pip slips past the gate toward Ribbon River.',
      prose: [
        'When the sunset lamp at Gull Point failed to kindle, the whole island held its breath. Down in Lantern Valley, young Pip packed a leather satchel, knotted a red scarf tight, and trotted up the gravel lane.',
        'At the valley crest stood the old Lantern Gate, its timber doors bolted against the sea breeze. Beneath its red-shingled peak hung a weathered brass bell that only answered a steady hand.',
        'One clear chime was all the keeper needed to hear — a promise that someone had set out to carry the island’s signal before dusk closed over the strait.'
      ],
      clue: 'Signal Step 1/5 · Ring the brass bell in Lantern Valley',
      baseLeftSVG: mapGateLeft,
      baseRightSVG: mapGateRight,
      leftPopups: [
        { id: 'g-sun', x: 325, y: 120, w: 126, h: 170, maxAngle: 86, shadowW: 36, shadowH: 12, html: svgSun(false) },
        { id: 'g-cloud-l', x: 145, y: 126, w: 108, h: 108, maxAngle: 86, shadowW: 30, shadowH: 10, html: svgCloud(0.92) },
        { id: 'g-pines-l', x: 162, y: 245, w: 185, h: 166, maxAngle: 86, shadowW: 150, shadowH: 34, html: svgPineCluster('green') },
        { id: 'g-lantern', x: 256, y: 318, w: 58, h: 98, maxAngle: 87, shadowW: 38, shadowH: 16, html: svgStreetLantern() },
        { id: 'g-pip', x: 340, y: 406, w: 112, h: 124, maxAngle: 87, shadowW: 72, shadowH: 24, role: 'pip', html: svgPipFox('default') }
      ],
      rightPopups: [
        { id: 'g-cloud-r', x: 310, y: 114, w: 100, h: 100, maxAngle: 86, shadowW: 26, shadowH: 9, html: svgCloud(0.85) },
        { id: 'g-pines-r', x: 346, y: 252, w: 178, h: 162, maxAngle: 86, shadowW: 140, shadowH: 32, html: svgPineCluster('green') },
        { id: 'g-gate', x: 176, y: 344, w: 242, h: 246, maxAngle: 88, shadowW: 210, shadowH: 48, interactive: true, kind: 'gate-bell', html: svgLanternGate() },
        { id: 'g-bear', x: 268, y: 422, w: 104, h: 114, maxAngle: 87, shadowW: 66, shadowH: 22, role: 'companion', html: svgCompanion('bear') },
        { id: 'g-sign', x: 368, y: 432, w: 104, h: 84, maxAngle: 86, shadowW: 54, shadowH: 18, html: svgSignpost('Valley Path') }
      ],
      walkSpec: {
        pip: { x1: 225, y1: 428, x2: 416, y2: 386, solvedX: 430, solvedY: 384, speed: 58 },
        companion: { x1: 252, y1: 422, x2: 294, y2: 426, speed: 24 }
      }
    },
    {
      id: 'bridge',
      num: '02',
      tag: 'CONTEXT',
      title: 'The Ribbon Bridge',
      location: 'Ribbon River',
      plate: 'PLATE 02',
      theme: 'day',
      hint: 'Catch the red ribbon and pull it to the far post.',
      solvedHint: 'The missing planks lock into place! Watch Pip walk across Ribbon River.',
      story: 'Two words survived the flood. Pip needs to carry them across the missing planks.',
      solvedStory: 'The red ribbon pulls taut and five cedar planks snap back across the current: "TWO FLASHES".',
      prose: [
        'High water from the autumn squall had swept the middle planks right out of the suspension bridge at Ribbon River. Only the festive pennants and two stout cedar posts remained above the turquoise rush.',
        'On the far bank, the ferry frog waved his red neckerchief in encouragement. Tucked inside Pip’s satchel was a silk messenger ribbon that bound the old crossing together.',
        'Pull the red ribbon firmly across the span to re-thread the bridge and recover the two words that survived the flood.'
      ],
      clue: 'Signal Step 2/5 · Pull the red ribbon across Ribbon River',
      baseLeftSVG: mapBridgeLeft,
      baseRightSVG: mapBridgeRight,
      leftPopups: [
        { id: 'b-sun', x: 326, y: 120, w: 126, h: 170, maxAngle: 86, shadowW: 36, shadowH: 12, html: svgSun(false) },
        { id: 'b-pines-l', x: 152, y: 248, w: 182, h: 164, maxAngle: 86, shadowW: 145, shadowH: 32, html: svgPineCluster('green') },
        { id: 'b-pip', x: 326, y: 404, w: 112, h: 124, maxAngle: 87, shadowW: 72, shadowH: 24, role: 'pip', html: svgPipFox('ribbon') }
      ],
      rightPopups: [
        { id: 'b-cloud-r', x: 262, y: 112, w: 108, h: 108, maxAngle: 86, shadowW: 28, shadowH: 10, html: svgCloud(0.9) },
        { id: 'b-pines-r', x: 344, y: 254, w: 178, h: 160, maxAngle: 86, shadowW: 140, shadowH: 32, html: svgPineCluster('green') },
        { id: 'b-bridge', x: 86, y: 374, w: 396, h: 194, maxAngle: 88, shadowW: 320, shadowH: 42, interactive: true, kind: 'ribbon-bridge', html: svgRibbonBridge() },
        { id: 'b-frog', x: 274, y: 416, w: 100, h: 108, maxAngle: 87, shadowW: 64, shadowH: 22, role: 'companion', html: svgCompanion('frog') },
        { id: 'b-sign', x: 378, y: 434, w: 106, h: 86, maxAngle: 86, shadowW: 54, shadowH: 18, html: svgSignpost('Ribbon Ferry') }
      ],
      walkSpec: {
        pip: { x1: 218, y1: 424, x2: 358, y2: 396, solvedX1: 318, solvedY1: 398, solvedX2: 646, solvedY2: 386, speed: 62 },
        companion: { x1: 264, y1: 416, x2: 304, y2: 422, speed: 26 }
      }
    },
    {
      id: 'library',
      num: '03',
      tag: 'LINKED NOTES',
      title: 'The Folded Library',
      location: 'Bookleaf Wood',
      plate: 'PLATE 03',
      theme: 'day',
      hint: 'Lift the wax-sealed letter in front of the library.',
      solvedHint: 'Route linked to [[Gull Point]]! Turn the page toward Copper Meadow.',
      story: 'A note in the margin leads Pip to the island’s oldest signal.',
      solvedStory: 'The route note unfolds: [[Gull Point]] is confirmed as the coastal destination.',
      prose: [
        'Deep in Bookleaf Wood, a timber cabin sat sheltered beneath the splayed pages of a giant hardcover roof. Inside, shelves of stitched ledgers hummed with the rustle of dry autumn leaves.',
        'The owl archivist pointed a feathered wing toward a kraft envelope pinned out front with a crimson wax seal. Every sea route on the island was cross-referenced in its margins.',
        'Break the wax seal to unfold the letter, then touch [[Gull Point]] inside to trace the hidden trail toward the signal mill.'
      ],
      clue: 'Signal Step 3/5 · Unseal the letter and follow [[Gull Point]]',
      baseLeftSVG: mapLibraryLeft,
      baseRightSVG: mapLibraryRight,
      leftPopups: [
        { id: 'l-sun', x: 334, y: 120, w: 126, h: 170, maxAngle: 86, shadowW: 36, shadowH: 12, html: svgSun(false) },
        { id: 'l-pines-l', x: 158, y: 248, w: 186, h: 164, maxAngle: 86, shadowW: 148, shadowH: 32, html: svgPineCluster('autumn') },
        { id: 'l-leaves', x: 268, y: 274, w: 140, h: 120, maxAngle: 86, shadowW: 0, shadowH: 0, html: svgAutumnLeaves() },
        { id: 'l-books', x: 214, y: 386, w: 116, h: 88, maxAngle: 86, shadowW: 88, shadowH: 24, html: svgBookStack() },
        { id: 'l-pip', x: 344, y: 412, w: 112, h: 124, maxAngle: 87, shadowW: 72, shadowH: 24, role: 'pip', html: svgPipFox('default') }
      ],
      rightPopups: [
        { id: 'l-cloud-r', x: 274, y: 110, w: 104, h: 104, maxAngle: 86, shadowW: 26, shadowH: 10, html: svgCloud(0.88) },
        { id: 'l-pines-r', x: 362, y: 256, w: 168, h: 154, maxAngle: 86, shadowW: 132, shadowH: 30, html: svgPineCluster('autumn') },
        { id: 'l-library', x: 204, y: 344, w: 254, h: 236, maxAngle: 88, shadowW: 218, shadowH: 48, html: svgFoldedLibrary() },
        { id: 'l-envelope', x: 64, y: 404, w: 132, h: 124, maxAngle: 88, shadowW: 76, shadowH: 22, interactive: true, kind: 'library-envelope', html: svgWaxEnvelope() },
        { id: 'l-owl', x: 262, y: 422, w: 100, h: 112, maxAngle: 87, shadowW: 62, shadowH: 22, role: 'companion', html: svgCompanion('owl') },
        { id: 'l-sign', x: 374, y: 432, w: 104, h: 84, maxAngle: 86, shadowW: 54, shadowH: 18, html: svgSignpost('The Archive') }
      ],
      walkSpec: {
        pip: { x1: 276, y1: 426, x2: 432, y2: 396, solvedX: 438, solvedY: 394, speed: 54 },
        companion: { x1: 248, y1: 422, x2: 288, y2: 424, speed: 22 }
      }
    },
    {
      id: 'mill',
      num: '04',
      tag: 'SCRIPTS',
      title: 'The Signal Mill',
      location: 'Copper Meadow',
      plate: 'PLATE 04',
      theme: 'day',
      hint: 'Turn the windmill by dragging a sail (or click to spin).',
      solvedHint: 'Pip’s coded signal strip (✦ · ✦) is printed! Turn to the final chapter.',
      story: 'The miller takes a count. One turn of the crank will print Pip’s signal strip.',
      solvedStory: 'With a crisp wooden click, the mill prints Pip’s coded paper strip: two bright stars.',
      prose: [
        'Where the woods opened onto Copper Meadow, golden grain swayed around a tall timber windmill. Its four lattice sails caught the late afternoon gust off the sea.',
        'Inside the millhouse, a brass stamping press was geared directly to the main wind-shaft. The mouse miller leaned on the doorframe, waiting for one full turn of the sails.',
        'Catch any wooden sail and spin it a full revolution so the mill can stamp Pip’s official signal strip before twilight falls.'
      ],
      clue: 'Signal Step 4/5 · Spin the Signal Mill one full turn',
      baseLeftSVG: mapMillLeft,
      baseRightSVG: mapMillRight,
      leftPopups: [
        { id: 'm-sun', x: 332, y: 122, w: 124, h: 168, maxAngle: 86, shadowW: 36, shadowH: 12, html: svgSun(false) },
        { id: 'm-pines-l', x: 152, y: 244, w: 178, h: 156, maxAngle: 86, shadowW: 138, shadowH: 30, html: svgPineCluster('autumn') },
        { id: 'm-cottage', x: 236, y: 344, w: 152, h: 114, maxAngle: 86, shadowW: 126, shadowH: 28, html: svgCottageMeadow() },
        { id: 'm-pip', x: 356, y: 412, w: 112, h: 124, maxAngle: 87, shadowW: 72, shadowH: 24, role: 'pip', html: svgPipFox('default') }
      ],
      rightPopups: [
        { id: 'm-cloud-r', x: 284, y: 114, w: 102, h: 102, maxAngle: 86, shadowW: 26, shadowH: 10, html: svgCloud(0.86) },
        { id: 'm-pines-r', x: 356, y: 262, w: 166, h: 152, maxAngle: 86, shadowW: 130, shadowH: 30, html: svgPineCluster('green') },
        { id: 'm-mill', x: 184, y: 356, w: 242, h: 268, maxAngle: 88, shadowW: 185, shadowH: 46, interactive: true, kind: 'signal-mill', html: svgSignalMill() },
        { id: 'm-mouse', x: 268, y: 422, w: 100, h: 108, maxAngle: 87, shadowW: 62, shadowH: 22, role: 'companion', html: svgCompanion('mouse') },
        { id: 'm-sign', x: 376, y: 432, w: 104, h: 84, maxAngle: 86, shadowW: 54, shadowH: 18, html: svgSignpost('Signal Mill') }
      ],
      walkSpec: {
        pip: { x1: 240, y1: 426, x2: 424, y2: 392, solvedX: 436, solvedY: 390, speed: 56 },
        companion: { x1: 248, y1: 422, x2: 298, y2: 425, speed: 30 }
      }
    },
    {
      id: 'beacon',
      num: '05',
      tag: 'RUN HISTORY',
      title: 'The Last Light',
      location: 'Gull Point',
      plate: 'PLATE 05',
      theme: 'dusk',
      hint: 'Lift the red lever on the lighthouse.',
      solvedHint: 'Touch the brass lantern anytime to repeat the two-flash signal.',
      story: 'Dusk finds Pip at Gull Point. A boat offshore is waiting for two quick flashes.',
      solvedStory: 'Last run: ✦ ✦. Touch the brass lantern to run it again.',
      prose: [
        'A crescent moon rose over Gull Point as Pip scrambled onto the rocky headland, clutching the stamped signal strip. Out beyond the surf, a red-sailed cutter bobbed patiently in the darkening swell.',
        'Towering above the promontory stood the red-and-white lighthouse, its brass lamp dark and silent. The sailor keeper nodded toward the heavy red lever bolted beside the door.',
        'Lift the red lever to send two crisp golden flashes across the water — and watch the waiting boat answer home.'
      ],
      clue: 'Signal Step 5/5 · Fire two flashes from Gull Point Lighthouse',
      baseLeftSVG: mapBeaconLeft,
      baseRightSVG: mapBeaconRight,
      leftPopups: [
        { id: 'e-moon', x: 326, y: 126, w: 128, h: 182, maxAngle: 86, shadowW: 32, shadowH: 12, html: svgSun(true) },
        { id: 'e-cloud-l', x: 136, y: 146, w: 100, h: 100, maxAngle: 86, shadowW: 24, shadowH: 9, html: svgCloud(0.84, true) },
        { id: 'e-gull-1', x: 254, y: 184, w: 66, h: 50, maxAngle: 86, shadowW: 0, shadowH: 0, role: 'gull-1', html: svgSeagull(0.95, 0) },
        { id: 'e-gull-2', x: 392, y: 198, w: 54, h: 42, maxAngle: 86, shadowW: 0, shadowH: 0, role: 'gull-2', html: svgSeagull(0.85, 0.32) },
        { id: 'e-boat', x: 188, y: 364, w: 146, h: 132, maxAngle: 87, shadowW: 112, shadowH: 26, role: 'boat-main', html: svgSailboat() },
        { id: 'e-pip', x: 358, y: 406, w: 112, h: 124, maxAngle: 87, shadowW: 72, shadowH: 24, role: 'pip', html: svgPipFox('lantern') }
      ],
      rightPopups: [
        { id: 'e-cloud-r', x: 286, y: 122, w: 98, h: 98, maxAngle: 86, shadowW: 24, shadowH: 9, html: svgCloud(0.82, true) },
        { id: 'e-gull-3', x: 96, y: 190, w: 52, h: 40, maxAngle: 86, shadowW: 0, shadowH: 0, role: 'gull-3', html: svgSeagull(0.8, 0.52) },
        { id: 'e-pines-r', x: 356, y: 274, w: 158, h: 144, maxAngle: 86, shadowW: 122, shadowH: 28, html: svgPineCluster('dusk') },
        { id: 'e-boat-small', x: 382, y: 344, w: 92, h: 82, maxAngle: 87, shadowW: 68, shadowH: 18, role: 'boat-small', html: svgSmallSailboat() },
        { id: 'e-lighthouse', x: 174, y: 354, w: 230, h: 292, maxAngle: 88, shadowW: 174, shadowH: 48, interactive: true, kind: 'lighthouse-beacon', html: svgLighthouse() },
        { id: 'e-sailor', x: 264, y: 420, w: 102, h: 112, maxAngle: 87, shadowW: 62, shadowH: 22, role: 'companion', html: svgCompanion('sailor') },
        { id: 'e-sign', x: 374, y: 432, w: 104, h: 84, maxAngle: 86, shadowW: 54, shadowH: 18, html: svgSignpost('Gull Point') }
      ],
      walkSpec: {
        pip: { x1: 312, y1: 422, x2: 436, y2: 386, solvedX: 430, solvedY: 388, speed: 52 },
        companion: { x1: 246, y1: 420, x2: 292, y2: 424, speed: 24 }
      }
    }
  ];

  // ---------- Island Atlas Map SVG (for Map Modal) ----------

  window.renderAtlasMapSVG = function (solvedSet, currentChapter) {
    const pins = [
      { idx: 0, x: 118, y: 248, name: 'Lantern Valley', plate: '01' },
      { idx: 1, x: 246, y: 214, name: 'Ribbon River', plate: '02' },
      { idx: 2, x: 372, y: 152, name: 'Bookleaf Wood', plate: '03' },
      { idx: 3, x: 492, y: 216, name: 'Copper Meadow', plate: '04' },
      { idx: 4, x: 604, y: 132, name: 'Gull Point', plate: '05' }
    ];

    return `
    <svg viewBox="0 0 700 360" fill="none">
      <!-- Ocean Backdrop -->
      <rect width="700" height="360" fill="#538a8f"/>
      <!-- Subtle Wave Texture -->
      <path d="M30 66Q60 56 90 66T150 66M520 306Q555 294 590 306T660 306M48 318Q80 308 112 318T176 318" stroke="#7fb7ba" stroke-width="2.5" stroke-linecap="round" opacity="0.55"/>

      <!-- Main Folded Island Mass -->
      <path d="M74 268C58 214 96 154 176 138C242 124 294 90 378 92C454 94 516 112 562 94C616 74 654 114 636 164C618 214 584 266 510 278C432 290 356 268 272 288C194 306 90 314 74 268Z"
            fill="#e5d7b5" stroke="#f7eed8" stroke-width="6"/>
      <!-- Inner Meadow & Woods Shading -->
      <path d="M126 242C136 192 198 168 276 162C354 156 410 116 492 146C554 168 564 228 498 248C418 270 320 242 230 264C168 278 118 278 126 242Z"
            fill="#cfd4ad" opacity="0.72"/>
      <!-- Ribbon River Crossing Island -->
      <path d="M234 116C260 162 232 222 264 292" stroke="#6aa5a8" stroke-width="18" stroke-linecap="round"/>

      <!-- Dotted Journey Trail -->
      <path d="M118 248 Q 182 238 246 214 T 372 152 T 492 216 T 604 132"
            stroke="#9c5633" stroke-width="3" stroke-dasharray="6 8" stroke-linecap="round"/>

      <!-- Compass Rose -->
      <g transform="translate(626, 286)" opacity="0.72">
        <circle cx="0" cy="0" r="24" stroke="#f5ebd4" stroke-width="1.5"/>
        <polygon points="0,-20 4,-4 0,0 -4,-4" fill="#f5ebd4"/>
        <polygon points="0,20 4,4 0,0 -4,4" fill="#d9cbb0"/>
        <polygon points="-20,0 -4,-4 0,0 -4,4" fill="#d9cbb0"/>
        <polygon points="20,0 4,-4 0,0 4,4" fill="#d9cbb0"/>
        <text x="0" y="-27" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" fill="#f5ebd4">N</text>
      </g>

      <!-- Interactive Chapter Pins -->
      ${pins.map(p => {
        const isSolved = solvedSet.has(p.idx);
        const isCurrent = p.idx === currentChapter;
        const fill = isSolved ? '#3c7352' : isCurrent ? '#d96b34' : '#b84a39';
        return `
        <g class="map-pin" data-jump-chapter="${p.idx}">
          ${isCurrent ? `<circle cx="${p.x}" cy="${p.y}" r="22" fill="#ffd86b" opacity="0.35"/>` : ''}
          <circle cx="${p.x}" cy="${p.y}" r="14" fill="${fill}" stroke="#faf3e2" stroke-width="3"/>
          <text x="${p.x}" y="${p.y + 4}" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="700" fill="#faf3e2">${isSolved ? '✓' : p.plate}</text>
          <rect x="${p.x - 54}" y="${p.y + 19}" width="108" height="20" rx="10" fill="#2b2016" fill-opacity="0.82"/>
          <text x="${p.x}" y="${p.y + 32.5}" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="600" fill="#f6eedb">${p.name}</text>
        </g>`;
      }).join('')}
    </svg>`;
  };
})();
