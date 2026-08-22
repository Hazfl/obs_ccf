/* ============================================================
   ccfolia OBS CSS 빌더
   - 화면에서 값을 바꾸면 그때그때 CSS 코드를 새로 만들어서 보여줌
   - 실제 요소 숨김/표시 로직은 yudukiak/ccfoliaCSS 엔진(@import)에 맡기고,
     이 페이지는 그 위에서 제공되는 CSS 변수(:root)를 조립하는 역할만 함
   - ccfolia가 업데이트되어 화면 구조가 바뀌어도, 엔진 쪽만 최신화되면
     이 빌더로 만든 코드는 계속 정상 동작함
   ============================================================ */

const ENGINE = "https://yudukiak.github.io/ccfoliaCSS/CSS";

/* ---------- 공통 유틸 ---------- */
function hexToRgba(hex, alphaPct = 100) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const a = Math.round((alphaPct / 100) * 100) / 100;
  if (a >= 1) return `rgb(${r}, ${g}, ${b})`;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
const val = (id) => document.getElementById(id).value;
const checked = (id) => document.getElementById(id).checked;

/* ---------- 탭 전환 ---------- */
document.querySelectorAll('.rail-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.rail-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
  });
});

/* ---------- 자유 CSS 블록 (모든 출력에 공통 첨부) ---------- */
function customBlock() {
  const c = val('custom-css').trim();
  if (!c) return '';
  return `\n/* ---------- 자유 CSS (05 탭에서 작성) ---------- */\n${c}\n`;
}

/* ================= 01 보드 ================= */
function generateBoard() {
  const lines = [];
  lines.push(`@import url("${ENGINE}/board.css");`);
  if (checked('board-merge')) {
    lines.push(`@import url("${ENGINE}/balloon.css");`);
  }
  if (checked('board-hidetag')) {
    const word = val('board-hidetag-word') || '비공개';
    lines.push('');
    lines.push(`/* 캐릭터 메모에 "${word}" 문구가 있으면 OBS 화면에서만 숨김 (보드 위에서는 그대로 보임) */`);
    lines.push(`img[aria-label*="${word}"] { display: none !important; }`);
  }
  lines.push(customBlock());
  return lines.join('\n').trim() + '\n';
}

/* ================= 02 말풍선 ================= */
function generateBalloon() {
  const bg = hexToRgba(val('bl-bg'), 100);
  const pad = val('bl-pad');
  const borderOn = checked('bl-border-on');
  const borderColor = borderOn ? hexToRgba(val('bl-border-color'), 100) : 'rgba(0,0,0,0)';
  const borderW = borderOn ? val('bl-border-w') : '0';
  const radius = val('bl-radius');
  const width = val('bl-width');
  const nameSize = val('bl-name-size');
  const nameColor = hexToRgba(val('bl-name-color'), 100);
  const mainSize = val('bl-main-size');
  const mainColor = hexToRgba(val('bl-main-color'), 100);
  const iconOn = checked('bl-icon');
  const iconSize = val('bl-icon-size');
  const diceOn = checked('bl-dice');
  const skipOn = checked('bl-skip');
  const closeOn = checked('bl-close');
  const titleOn = checked('bl-title');

  const css = `@import url("${ENGINE}/balloon/main.css");

:root {
  /* 박스 */
  --balloon-background-color: ${bg};
  --balloon-background-padding: ${pad}px ${pad}px ${pad}px ${pad}px;
  --balloon-border-color: ${borderColor};
  --balloon-border-width: ${borderW}px;
  --balloon-border-radius: ${radius}px;
  --balloon-width: ${width}px;

  /* 텍스트 */
  --font-size-name: ${nameSize}rem;
  --font-color-name: ${nameColor};
  --font-size-main: ${mainSize}rem;
  --font-color-main: ${mainColor};
  --title-display: ${titleOn ? 'flex' : 'none'};

  /* 아이콘 & 버튼 */
  --image-display: ${iconOn ? 'block' : 'none'};
  --image-width: ${iconSize}px;
  --image-height: ${iconSize}px;
  --dice-display: ${diceOn ? 'block' : 'none'};
  --skip-display: ${skipOn ? 'inline-flex' : 'none'};
  --close-display: ${closeOn ? 'inline-flex' : 'none'};
}
${customBlock()}`;
  return css.trim() + '\n';
}

/* ================= 03 채팅로그 ================= */
function generateChat() {
  const count = val('ch-count');
  const nameOn = checked('ch-name');
  const horizontalOn = checked('ch-horizontal');
  const anim = val('ch-anim');
  const bg = hexToRgba(val('ch-bg'), val('ch-bg-alpha'));
  const borderColor = hexToRgba(val('ch-border-color'), 100);
  const borderW = val('ch-border-w');
  const radius = val('ch-radius');
  const width = val('ch-width');
  const fontColor = hexToRgba(val('ch-font-color'), 100);
  const fontSize = val('ch-font-size');
  const lineClamp = val('ch-lineclamp');

  const lines = [`@import url("${ENGINE}/chat/main.css");`];
  if (nameOn) lines.push(`@import url("${ENGINE}/chat/option_name.css");`);
  if (horizontalOn) lines.push(`@import url("${ENGINE}/chat/option_horizontal.css");`);
  if (anim !== 'none') lines.push(`@import url("${ENGINE}/chat/option_animation_${anim}.css");`);

  lines.push('');
  lines.push(':root {');
  lines.push(`  --background-color: ${bg};`);
  lines.push(`  --border-color: ${borderColor};`);
  lines.push(`  --border-width: ${borderW}px;`);
  lines.push(`  --border-radius: ${radius}px;`);
  lines.push(`  --font-color: ${fontColor};`);
  lines.push(`  --font-size: ${fontSize}rem;`);
  lines.push(`  --width: ${width}px;`);
  lines.push(`  --line-clamp: ${lineClamp};`);
  lines.push('}');
  lines.push('');
  lines.push(`/* 최근 채팅 ${count}개까지 표시 (숫자를 늘리면 더 많이 보임) */`);
  lines.push(`.MuiList-root>div:nth-child(1)>div>div:nth-last-child(-n+${count})>div {`);
  lines.push('  display: flex !important;');
  lines.push('}');
  lines.push(customBlock());
  return lines.join('\n').trim() + '\n';
}

/* ================= 04 스탯카드 ================= */
function generateStatus() {
  const avatarOn = checked('st-avatar');
  const avatarSize = val('st-avatar-size');
  const avatarBg = hexToRgba('#000000', val('st-avatar-alpha'));
  const avatarBorderW = val('st-avatar-border-w');
  const avatarBorderColor = hexToRgba(val('st-avatar-border-color'), 100);
  const avatarRadius = val('st-avatar-radius');
  const column = val('st-column');
  const height = val('st-height');
  const bg = hexToRgba(val('st-bg'), 100);
  const fontSize = val('st-font-size');
  const fontColor = hexToRgba(val('st-font-color'), 100);
  const dangerColor = hexToRgba(val('st-font-danger'), 100);
  const borderW = val('st-border-w');
  const borderColor = hexToRgba(val('st-border-color'), 100);
  const radius = val('st-radius');

  const css = `@import url("${ENGINE}/status/main.css");

:root {
  /* 아바타 */
  --avatar-height: ${avatarSize}px;
  --avatar-width: ${avatarSize}px;
  --avatar-background: ${avatarBg};
  --avatar-border-size: ${avatarBorderW}px;
  --avatar-border-color: ${avatarBorderColor};
  --avatar-border-radius: ${avatarRadius}px;
  ${!avatarOn ? '--avatar-display: none;\n  --avatar-padding: 0;' : ''}

  /* 스탯 목록 */
  --status-column: ${column};
  --status-height: ${height}px;
  --status-background: ${bg};
  --status-font-size: ${fontSize}rem;
  --status-font-color: ${fontColor};
  --status-font-secondary-color: ${dangerColor};
  --status-border-width: ${borderW}px;
  --status-border-color: ${borderColor};
  --status-border-radius: ${radius}px;
}
${customBlock()}`;
  return css.trim() + '\n';
}

/* ---------- 스니펫 ---------- */
const SNIPPETS = {
  hidechar: `/* "비공개" 태그가 붙은 말을 OBS 화면에서만 숨김 */\nimg[aria-label*="비공개"] { display: none !important; }`,
  nooutline: `/* 보드에서 말을 선택했을 때 생기는 테두리 제거 */\ndiv[style^="transform: translate"]>div[style^="transform: scale"]>div[style] {\n  outline: unset !important;\n}`,
  scrollbar: `/* 스크롤바 숨기기 */\n::-webkit-scrollbar { display: none !important; }`,
  font: `/* 전체 폰트 강제 지정 (Google Fonts 주소는 직접 바꿔서 사용) */\n@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap');\n* { font-family: 'Noto Sans KR', sans-serif !important; }`
};
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const ta = document.getElementById('custom-css');
    const snippet = SNIPPETS[chip.dataset.snippet];
    ta.value = (ta.value.trim() ? ta.value.trim() + '\n\n' : '') + snippet;
    updateAll();
  });
});

/* ---------- 전체 갱신 ---------- */
function updateAll() {
  document.getElementById('out-board').textContent = generateBoard();
  document.getElementById('out-balloon').textContent = generateBalloon();
  document.getElementById('out-chat').textContent = generateChat();
  document.getElementById('out-status').textContent = generateStatus();
}

document.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('input', updateAll);
  el.addEventListener('change', updateAll);
});

/* range 슬라이더 숫자 표시 */
['ch-bg-alpha', 'st-avatar-alpha'].forEach(id => {
  const el = document.getElementById(id);
  const out = document.getElementById(id + '-v');
  el.addEventListener('input', () => { out.textContent = el.value; });
});

/* ---------- 복사 버튼 ---------- */
document.querySelectorAll('.copybtn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = document.getElementById(btn.dataset.copy).textContent;
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    const original = btn.textContent;
    btn.textContent = '복사됨!';
    btn.classList.add('done');
    setTimeout(() => { btn.textContent = original; btn.classList.remove('done'); }, 1400);
  });
});

/* ---------- 초기 실행 ---------- */
updateAll();
