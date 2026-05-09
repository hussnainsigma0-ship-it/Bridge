import { useState, useEffect, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --sage:#4a7c59; --sage2:#6aaa7f; --cream:#f5f0e8; --warm:#e8dcc8;
    --ink:#1c1c1c; --muted:#6b6560; --danger:#c0392b; --amber:#d4880a;
    --r1:#e57373; --r2:#ff8a65; --r3:#ffb74d; --r4:#fff176;
    --r5:#aed581; --r6:#81c784; --r7:#4db6ac; --r8:#4fc3f7; --r9:#7986cb;
  }
  body { font-family:'DM Mono',monospace; background:var(--cream); color:var(--ink); overflow-x:hidden; }
  .app { min-height:100vh; display:flex; flex-direction:column; }

  /* ── LOGIN ── */
  .login-root { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; }
  @media(max-width:700px){ .login-root{grid-template-columns:1fr} .login-left{display:none} }

  .login-left {
    background:var(--ink); display:flex; flex-direction:column; justify-content:center;
    padding:60px 52px; position:relative; overflow:hidden;
  }
  .login-left::before {
    content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse at 25% 65%,rgba(74,124,89,.38) 0%,transparent 60%),
               radial-gradient(ellipse at 80% 15%,rgba(106,170,127,.14) 0%,transparent 50%);
  }
  .orb { position:absolute; border-radius:50%; filter:blur(55px); pointer-events:none; }
  .orb1 { width:260px; height:260px; background:rgba(74,124,89,.18); bottom:-70px; left:-70px; }
  .orb2 { width:130px; height:130px; background:rgba(106,170,127,.12); top:30px; right:10px; }
  .ll { position:relative; z-index:1; }
  .brand { font-family:'Fraunces',serif; font-size:2.9rem; font-weight:300; color:var(--cream); line-height:1.05; margin-bottom:18px; }
  .brand em { font-style:italic; color:var(--sage2); }
  .tagline { font-size:.8rem; color:#888; line-height:1.85; max-width:330px; margin-bottom:38px; }
  .feats { display:flex; flex-direction:column; gap:14px; }
  .feat { display:flex; align-items:center; gap:12px; }
  .feat-icon { width:34px; height:34px; border-radius:8px; background:rgba(74,124,89,.22); border:1px solid rgba(74,124,89,.38); display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; }
  .feat-text { font-size:.76rem; color:#999; }
  .feat-text strong { color:var(--cream); display:block; font-size:.78rem; }

  .login-right { background:var(--cream); display:flex; align-items:center; justify-content:center; padding:40px 28px; }
  .login-box { width:100%; max-width:400px; }
  .login-title { font-family:'Fraunces',serif; font-size:1.85rem; font-weight:400; margin-bottom:6px; }
  .login-sub { font-size:.76rem; color:var(--muted); margin-bottom:28px; line-height:1.65; }

  .auth-tabs { display:flex; background:var(--warm); border-radius:10px; padding:3px; margin-bottom:24px; }
  .auth-tab { flex:1; padding:8px; border:none; background:none; cursor:pointer; border-radius:7px; font-family:'DM Mono',monospace; font-size:.76rem; color:var(--muted); transition:all .2s; }
  .auth-tab.active { background:white; color:var(--ink); box-shadow:0 1px 6px rgba(0,0,0,.1); }

  .google-btn {
    width:100%; display:flex; align-items:center; justify-content:center; gap:12px;
    padding:13px 20px; border-radius:10px; border:1.5px solid var(--warm);
    background:white; cursor:pointer; font-family:'DM Mono',monospace; font-size:.82rem;
    color:var(--ink); transition:all .2s; box-shadow:0 1px 4px rgba(0,0,0,.06);
  }
  .google-btn:hover { border-color:var(--sage); box-shadow:0 3px 12px rgba(74,124,89,.18); transform:translateY(-1px); }
  .google-btn:disabled { opacity:.55; cursor:not-allowed; transform:none; }
  .gicon { width:20px; height:20px; flex-shrink:0; }

  .or-row { display:flex; align-items:center; gap:12px; margin:18px 0; }
  .or-row::before,.or-row::after { content:''; flex:1; height:1px; background:var(--warm); }
  .or-row span { font-size:.68rem; color:var(--muted); }

  .field { margin-bottom:14px; }
  .field label { display:block; font-size:.7rem; color:var(--muted); margin-bottom:5px; letter-spacing:.04em; }
  .field input { width:100%; padding:11px 14px; border:1.5px solid var(--warm); border-radius:8px; font-family:'DM Mono',monospace; font-size:.8rem; background:white; outline:none; transition:border-color .18s; color:var(--ink); }
  .field input:focus { border-color:var(--sage); }

  .auth-submit { width:100%; padding:13px; border-radius:10px; border:none; background:var(--sage); color:white; font-family:'DM Mono',monospace; font-size:.83rem; font-weight:500; cursor:pointer; transition:all .2s; letter-spacing:.04em; margin-top:4px; }
  .auth-submit:hover { background:var(--sage2); }
  .auth-submit:disabled { opacity:.5; cursor:not-allowed; }

  .auth-note { font-size:.66rem; color:var(--muted); text-align:center; margin-top:18px; line-height:1.65; }
  .auth-note a { color:var(--sage); text-decoration:none; }

  .err-box { background:#fff5f5; border:1px solid #fca5a5; border-radius:8px; padding:9px 13px; font-size:.74rem; color:var(--danger); margin-bottom:12px; }

  .spin { display:inline-block; width:14px; height:14px; border:2px solid rgba(255,255,255,.3); border-top-color:white; border-radius:50%; animation:spin .7s linear infinite; vertical-align:middle; margin-right:7px; }
  .gspin { border-color:rgba(74,124,89,.2); border-top-color:var(--sage); }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
  .shake { animation:shake .38s ease; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0);} }
  .fadein { animation:fadeUp .3s ease both; }

  /* ── PICKER MODAL ── */
  .overlay { position:fixed; inset:0; background:rgba(0,0,0,.52); z-index:500; display:flex; align-items:center; justify-content:center; padding:20px; animation:fadeIn .2s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .picker { background:white; border-radius:20px; width:100%; max-width:370px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,.22); animation:slideUp .25s ease; }
  @keyframes slideUp { from{transform:translateY(18px);opacity:0} to{transform:translateY(0);opacity:1} }
  .picker-head { background:var(--ink); padding:22px 26px; text-align:center; }
  .picker-logo { font-family:'Fraunces',serif; color:var(--cream); font-size:1.05rem; margin-bottom:3px; }
  .picker-logo span { color:var(--sage2); }
  .picker-sub { font-size:.7rem; color:#888; }
  .picker-section { padding:14px 26px 6px; font-size:.68rem; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; }
  .picker-acc { display:flex; align-items:center; gap:13px; padding:13px 26px; cursor:pointer; border:none; background:none; width:100%; text-align:left; transition:background .15s; }
  .picker-acc:hover { background:var(--cream); }
  .picker-av { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1rem; font-weight:600; color:white; font-family:'Fraunces',serif; flex-shrink:0; }
  .picker-name { font-size:.83rem; font-weight:500; color:var(--ink); }
  .picker-email { font-size:.7rem; color:var(--muted); }
  .picker-sep { height:1px; background:var(--warm); margin:0 26px; }
  .picker-add { display:flex; align-items:center; gap:13px; padding:13px 26px 18px; cursor:pointer; font-size:.78rem; color:var(--muted); border:none; background:none; width:100%; }
  .picker-add:hover { color:var(--sage); }
  .picker-foot { padding:12px 26px; font-size:.65rem; color:var(--muted); text-align:center; border-top:1px solid var(--warm); }

  /* ── APP NAV ── */
  nav { display:flex; align-items:center; justify-content:space-between; padding:13px 26px; background:var(--ink); position:sticky; top:0; z-index:100; border-bottom:3px solid var(--sage); gap:10px; flex-wrap:wrap; }
  .nav-logo { font-family:'Fraunces',serif; font-size:1.35rem; color:var(--cream); letter-spacing:-1px; flex-shrink:0; }
  .nav-logo span { color:var(--sage2); }
  .nav-tabs { display:flex; gap:4px; flex-wrap:wrap; }
  .nav-tab { padding:6px 13px; border-radius:6px; border:1.5px solid transparent; cursor:pointer; font-family:'DM Mono',monospace; font-size:.73rem; letter-spacing:.05em; transition:all .2s; color:#aaa; background:none; }
  .nav-tab:hover { color:var(--cream); border-color:#444; }
  .nav-tab.active { background:var(--sage); color:var(--cream); border-color:var(--sage); }
  .nav-badge { background:var(--danger); color:white; font-size:.56rem; padding:1px 5px; border-radius:10px; margin-left:4px; vertical-align:middle; }

  /* USER CHIP */
  .uchip { display:flex; align-items:center; gap:7px; cursor:pointer; position:relative; flex-shrink:0; }
  .uav { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.82rem; font-weight:600; color:white; font-family:'Fraunces',serif; border:2px solid var(--sage2); flex-shrink:0; }
  .uname { font-size:.72rem; color:#ccc; max-width:80px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  @media(max-width:600px){ .uname{display:none} }
  .udrop { position:absolute; top:42px; right:0; background:white; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,.15); border:1.5px solid var(--warm); min-width:195px; z-index:200; overflow:hidden; animation:fadeUp .18s ease; }
  .udrop-head { padding:14px 16px; border-bottom:1px solid var(--warm); }
  .udrop-name { font-size:.83rem; font-weight:500; }
  .udrop-email { font-size:.7rem; color:var(--muted); margin-top:1px; }
  .udrop-item { display:flex; align-items:center; gap:9px; padding:10px 16px; font-size:.76rem; cursor:pointer; transition:background .15s; border:none; background:none; width:100%; text-align:left; color:var(--ink); }
  .udrop-item:hover { background:var(--cream); }
  .udrop-item.red { color:var(--danger); }

  /* ── CONTENT ── */
  .section { max-width:960px; margin:0 auto; padding:30px 20px; width:100%; }
  .card { background:white; border-radius:16px; padding:22px; box-shadow:0 2px 16px rgba(0,0,0,.07); border:1.5px solid var(--warm); margin-bottom:18px; }
  .card-title { font-family:'Fraunces',serif; font-size:1.08rem; font-weight:600; color:var(--ink); margin-bottom:13px; display:flex; align-items:center; gap:8px; }
  .g2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
  @media(max-width:640px){ .g2,.g3{grid-template-columns:1fr} }
  .stat { text-align:center; padding:18px; background:var(--cream); border-radius:12px; }
  .sv { font-family:'Fraunces',serif; font-size:2.1rem; font-weight:600; color:var(--sage); }
  .sl { font-size:.7rem; color:var(--muted); letter-spacing:.08em; text-transform:uppercase; margin-top:4px; }
  .mood-row { display:flex; gap:7px; flex-wrap:wrap; margin:9px 0; }
  .mood-btn { width:42px; height:42px; border-radius:50%; border:3px solid transparent; cursor:pointer; font-size:1.3rem; transition:all .15s; display:flex; align-items:center; justify-content:center; background:var(--cream); }
  .mood-btn:hover { transform:scale(1.15); }
  .mood-btn.sel { border-color:var(--ink); transform:scale(1.2); }
  .mchart { display:flex; align-items:flex-end; gap:6px; height:88px; margin-top:9px; }
  .mwrap { display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; }
  .mbar { width:100%; border-radius:4px 4px 0 0; transition:height .4s ease; min-height:4px; }
  .mlbl { font-size:.58rem; color:var(--muted); }
  .ex-grid { display:grid; grid-template-columns:1fr 1fr; gap:11px; }
  @media(max-width:600px){ .ex-grid{grid-template-columns:1fr} }
  .excard { border-radius:12px; padding:17px; cursor:pointer; border:2px solid transparent; transition:all .2s; background:var(--cream); position:relative; overflow:hidden; }
  .excard:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,.09); }
  .excard.act { border-color:var(--sage); background:white; }
  .extag { font-size:.62rem; text-transform:uppercase; letter-spacing:.1em; color:var(--muted); margin-bottom:5px; }
  .extitle { font-family:'Fraunces',serif; font-size:.97rem; margin-bottom:3px; }
  .exdesc { font-size:.73rem; color:var(--muted); line-height:1.5; }
  .exdur { position:absolute; top:13px; right:13px; font-size:.65rem; color:var(--sage); background:rgba(74,124,89,.11); padding:2px 7px; border-radius:20px; }
  .modover { position:fixed; inset:0; background:rgba(28,28,28,.6); z-index:200; display:flex; align-items:center; justify-content:center; padding:18px; }
  .modbox { background:white; border-radius:20px; padding:34px; max-width:510px; width:100%; max-height:85vh; overflow-y:auto; position:relative; }
  .modtitle { font-family:'Fraunces',serif; font-size:1.45rem; margin-bottom:7px; }
  .modbody { font-size:.83rem; line-height:1.82; color:var(--muted); }
  .modstep { background:var(--cream); border-radius:9px; padding:11px 15px; margin:9px 0; font-size:.8rem; line-height:1.6; }
  .modstep strong { color:var(--sage); }
  .modclose { position:absolute; top:14px; right:14px; background:none; border:none; font-size:1.35rem; cursor:pointer; color:var(--muted); }
  .bc { width:128px; height:128px; border-radius:50%; background:var(--sage); margin:18px auto; display:flex; align-items:center; justify-content:center; color:white; font-family:'Fraunces',serif; font-size:.92rem; transition:all 1s ease-in-out; box-shadow:0 0 0 0 rgba(74,124,89,.4); }
  .bc.ex { transform:scale(1.4); box-shadow:0 0 0 28px rgba(74,124,89,.1); }
  .chat-area { background:var(--cream); border-radius:11px; padding:15px; height:275px; overflow-y:auto; display:flex; flex-direction:column; gap:9px; margin-bottom:11px; }
  .chat-area::-webkit-scrollbar { width:4px; }
  .chat-area::-webkit-scrollbar-thumb { background:var(--warm); border-radius:2px; }
  .cmsg { max-width:80%; padding:9px 13px; border-radius:12px; font-size:.78rem; line-height:1.6; }
  .cmsg.user { background:var(--sage); color:white; align-self:flex-end; border-radius:12px 12px 2px 12px; }
  .cmsg.ai { background:white; color:var(--ink); align-self:flex-start; border-radius:12px 12px 12px 2px; border:1.5px solid var(--warm); }
  .cmsg.load { opacity:.6; font-style:italic; }
  .cinrow { display:flex; gap:7px; }
  .cinput { flex:1; padding:9px 13px; border:1.5px solid var(--warm); border-radius:8px; font-family:'DM Mono',monospace; font-size:.78rem; background:white; outline:none; }
  .cinput:focus { border-color:var(--sage); }
  .btn { padding:9px 20px; border-radius:8px; border:none; cursor:pointer; font-family:'DM Mono',monospace; font-size:.78rem; font-weight:500; letter-spacing:.04em; transition:all .18s; }
  .btn-p { background:var(--sage); color:white; }
  .btn-p:hover { background:var(--sage2); }
  .btn-s { background:var(--cream); color:var(--ink); border:1.5px solid var(--warm); }
  .btn-s:hover { border-color:var(--sage); }
  .btn-sm { padding:6px 13px; font-size:.7rem; }
  .btn:disabled { opacity:.5; cursor:not-allowed; }
  .prow { display:flex; align-items:center; gap:11px; padding:13px 0; border-bottom:1px solid var(--warm); cursor:pointer; }
  .prow:last-child { border-bottom:none; }
  .pav { width:40px; height:40px; border-radius:50%; background:var(--sage); display:flex; align-items:center; justify-content:center; color:white; font-family:'Fraunces',serif; font-size:.97rem; flex-shrink:0; }
  .pname { font-size:.83rem; font-weight:500; }
  .pmeta { font-size:.7rem; color:var(--muted); }
  .rpill { padding:3px 9px; border-radius:20px; font-size:.65rem; font-weight:500; text-transform:uppercase; margin-left:auto; }
  .rlo { background:rgba(74,124,89,.14); color:var(--sage); }
  .rme { background:rgba(212,136,10,.14); color:var(--amber); }
  .rhi { background:rgba(192,57,43,.14); color:var(--danger); }
  .jta { width:100%; min-height:135px; border:1.5px solid var(--warm); border-radius:9px; padding:13px; font-family:'DM Mono',monospace; font-size:.78rem; line-height:1.7; resize:vertical; outline:none; background:white; }
  .jta:focus { border-color:var(--sage); }
  .jentry { border-left:3px solid var(--sage); padding:9px 13px; margin:9px 0; background:var(--cream); border-radius:0 8px 8px 0; }
  .jdate { font-size:.66rem; color:var(--muted); margin-bottom:3px; }
  .jtext { font-size:.78rem; line-height:1.6; }
  .sdots { display:flex; gap:5px; flex-wrap:wrap; margin-top:9px; }
  .sdot { width:27px; height:27px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:.58rem; color:white; }
  .sdot.done { background:var(--sage); }
  .sdot.now { background:var(--sage2); border:2px solid var(--ink); }
  .sdot.miss { background:var(--warm); color:var(--muted); }
  .crisis { background:#fff5f5; border:2px solid #fca5a5; border-radius:12px; padding:15px 18px; display:flex; align-items:center; gap:13px; margin-bottom:18px; }
  .cicon { font-size:1.45rem; }
  .ctxt { font-size:.78rem; line-height:1.6; }
  .ctxt strong { color:var(--danger); display:block; margin-bottom:1px; }
  .tag { display:inline-block; padding:2px 9px; border-radius:20px; font-size:.66rem; background:rgba(74,124,89,.12); color:var(--sage); }
  .hero { background:var(--ink); color:var(--cream); padding:32px; text-align:center; border-bottom:3px solid var(--sage); }
  .hero h1 { font-family:'Fraunces',serif; font-size:1.9rem; font-weight:300; margin-bottom:7px; }
  .hero h1 em { font-style:italic; color:var(--sage2); }
  .hero p { font-size:.8rem; color:#aaa; max-width:480px; margin:0 auto; line-height:1.7; }
  .sh { margin-bottom:22px; }
  .sh h2 { font-family:'Fraunces',serif; font-size:1.55rem; font-weight:400; }
  .sh p { font-size:.78rem; color:var(--muted); margin-top:3px; }
  .divider { height:1px; background:var(--warm); margin:18px 0; }
  .tm { color:var(--muted); font-size:.76rem; }
  .mt10 { margin-top:10px; }

  /* welcome */
  .wbanner { background:linear-gradient(135deg,var(--sage) 0%,var(--sage2) 100%); border-radius:15px; padding:22px 26px; margin-bottom:22px; display:flex; align-items:center; gap:17px; color:white; box-shadow:0 4px 20px rgba(74,124,89,.28); }
  .wav { width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.35rem; font-weight:700; color:white; font-family:'Fraunces',serif; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.38); flex-shrink:0; }
  .wtext h3 { font-family:'Fraunces',serif; font-size:1.15rem; font-weight:400; margin-bottom:3px; }
  .wtext p { font-size:.73rem; opacity:.85; line-height:1.5; }
`;

// ... rest of the bridge-saas.jsx code here (see your provided content)
