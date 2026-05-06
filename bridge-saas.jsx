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
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
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

const GOOGLE_ACCOUNTS = [
  { name:"Alex Johnson", email:"alex.johnson@gmail.com", color:"#4a7c59", initials:"AJ" },
  { name:"Priya Sharma",  email:"priya.sharma@gmail.com",  color:"#7986cb", initials:"PS" },
  { name:"Tom Williams",  email:"tom.w@googlemail.com",   color:"#ff8a65", initials:"TW" },
];

const MOODS = [
  { val:1, emoji:"😔", label:"Very low", color:"var(--r1)" },
  { val:2, emoji:"😟", label:"Low",      color:"var(--r2)" },
  { val:3, emoji:"😐", label:"Neutral",  color:"var(--r4)" },
  { val:4, emoji:"🙂", label:"Good",     color:"var(--r6)" },
  { val:5, emoji:"😊", label:"Great",    color:"var(--r9)" },
];

const EXERCISES = [
  { id:"box", tag:"Anxiety", title:"Box Breathing", desc:"Regulate your nervous system in 4 minutes.", duration:"4 min", type:"breathe",
    steps:["Inhale for 4 counts","Hold for 4 counts","Exhale for 4 counts","Hold for 4 counts"],
    intro:"Box breathing is used by Navy SEALs and therapists alike. It activates your parasympathetic nervous system, slowing your heart rate and calming anxiety within minutes." },
  { id:"ground", tag:"Grounding", title:"5-4-3-2-1 Senses", desc:"Anchor yourself to the present moment.", duration:"5 min", type:"guided",
    steps:["Name 5 things you can SEE right now","Name 4 things you can physically FEEL","Name 3 things you can HEAR","Name 2 things you can SMELL","Name 1 thing you can TASTE"],
    intro:"Grounding techniques interrupt anxiety spirals by redirecting attention to the present. Evidence-based for panic, dissociation, and overwhelm." },
  { id:"cbt", tag:"CBT", title:"Thought Record", desc:"Challenge unhelpful thinking patterns.", duration:"8 min", type:"guided",
    steps:["Write down the automatic thought causing distress","Rate how strongly you believe it (0–100%)","List evidence FOR this thought (facts only)","List evidence AGAINST this thought","Write a balanced alternative thought","Re-rate your belief in the original thought"],
    intro:"Cognitive restructuring is the core of CBT. By examining evidence for and against thoughts, you weaken cognitive distortions like catastrophising." },
  { id:"pmr", tag:"Relaxation", title:"Progressive Muscle Relaxation", desc:"Release tension stored in your body.", duration:"10 min", type:"guided",
    steps:["Tense feet 5s, release","Tense calves 5s, release","Tense thighs 5s, release","Tense abdomen 5s, release","Tense fists 5s, release","Shoulders to ears 5s, release"],
    intro:"PMR is a first-line treatment for anxiety and insomnia. Systematically tensing and releasing teaches you to recognise and release physical tension." },
  { id:"act", tag:"ACT", title:"Values Clarification", desc:"Reconnect with what matters most to you.", duration:"12 min", type:"guided",
    steps:["List 5 life areas that matter (family, health, work…)","Write what you want to stand for in each area","Rate how much you're living by each value (1–10)","Pick the lowest-scoring area","Write one small action you could take today"],
    intro:"ACT uses values as a compass when depression narrows your world. Connecting to values reduces suffering even when circumstances cannot change." },
  { id:"safe", tag:"Imagery", title:"Safe Place Visualisation", desc:"Create an inner refuge from distress.", duration:"7 min", type:"guided",
    steps:["Close your eyes, breathe slowly for 1 minute","Imagine a place where you feel completely safe","Notice what you can see there in detail","Notice what sounds are present","Feel the temperature and textures around you","Stay for 3–5 minutes, then return gently"],
    intro:"Safe place imagery is used in EMDR and trauma therapy. Regular practice makes calm feelings easier to access during difficult moments." },
];

const PATIENTS = [
  { id:1, name:"Sarah M.", init:"SM", weeks:14, risk:"high", avg:2.1, logins:22, last:"today",      flag:"Mood declined 3 days in a row" },
  { id:2, name:"James T.", init:"JT", weeks:8,  risk:"med",  avg:3.4, logins:18, last:"yesterday",  flag:null },
  { id:3, name:"Priya K.", init:"PK", weeks:5,  risk:"low",  avg:4.1, logins:14, last:"2 days ago", flag:null },
  { id:4, name:"David L.", init:"DL", weeks:19, risk:"high", avg:1.8, logins:6,  last:"4 days ago", flag:"Low engagement + mood <2 for 10 days" },
  { id:5, name:"Emma W.",  init:"EW", weeks:3,  risk:"low",  avg:3.8, logins:12, last:"today",      flag:null },
];

function gc(v){ const c=["","var(--r1)","var(--r3)","var(--r4)","var(--r6)","var(--r9)"]; return c[Math.round(v)]||"#ddd"; }
function tod(){ return new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}); }
function seed(){ const d=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]; return d.map(x=>({day:x,val:Math.round(Math.random()*3+1.5)})); }
function fn(n){ return n?.split(" ")[0]||"there"; }

function GIcon(){
  return <svg className="gicon" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>;
}

function Picker({ onSelect, onClose }){
  return <div className="overlay" onClick={onClose}>
    <div className="picker" onClick={e=>e.stopPropagation()}>
      <div className="picker-head">
        <div className="picker-logo">Bridge<span>.</span></div>
        <div className="picker-sub">Choose an account to continue to Bridge</div>
      </div>
      <div className="picker-section">Saved accounts</div>
      {GOOGLE_ACCOUNTS.map((a,i)=>(
        <button key={i} className="picker-acc" onClick={()=>onSelect(a)}>
          <div className="picker-av" style={{background:a.color}}>{a.initials}</div>
          <div><div className="picker-name">{a.name}</div><div className="picker-email">{a.email}</div></div>
        </button>
      ))}
      <div className="picker-sep"/>
      <button className="picker-add"><span style={{fontSize:"1.05rem"}}>＋</span> Use another account</button>
      <div className="picker-foot">By continuing you agree to Bridge's Terms & Privacy Policy</div>
    </div>
  </div>;
}

function LoginScreen({ onLogin }){
  const [mode, setMode] = useState("signin");
  const [picker, setPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gloading, setGloading] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [shk, setShk] = useState(false);

  function shake(){ setShk(true); setTimeout(()=>setShk(false),400); }

  function handleGPick(acc){ setPicker(false); setGloading(true); setTimeout(()=>{ setGloading(false); onLogin(acc); },1400); }

  function handleSubmit(){
    setErr("");
    if(mode==="signup"&&!name.trim()){ setErr("Please enter your name."); shake(); return; }
    if(!email.includes("@")){ setErr("Please enter a valid email address."); shake(); return; }
    if(pass.length<6){ setErr("Password must be at least 6 characters."); shake(); return; }
    setLoading(true);
    const parts = (mode==="signup"?name.trim():email.split("@")[0]).split(" ");
    const initials = parts.map(w=>w[0]?.toUpperCase()||"").join("").slice(0,2)||"?";
    const colors = ["#4a7c59","#7986cb","#ff8a65","#4db6ac","#f06292"];
    const color = colors[Math.floor(Math.random()*colors.length)];
    setTimeout(()=>{ setLoading(false); onLogin({ name: mode==="signup"?name.trim():email.split("@")[0], email, color, initials }); },1200);
  }

  return <>
    <style>{CSS}</style>
    <div className="login-root">
      {/* LEFT */}
      <div className="login-left">
        <div className="orb orb1"/><div className="orb orb2"/>
        <div className="ll">
          <div className="brand">Bridge<br/><em>Mental Health</em></div>
          <p className="tagline">Evidence-based support for people on NHS waiting lists — mood tracking, guided exercises, an AI companion, and a clinician dashboard that keeps you visible while you wait.</p>
          <div className="feats">
            {[["🧠","AI Support Companion","Talk to Bridge anytime — trained in CBT, ACT & mindfulness"],
              ["📊","Mood Tracking","Log daily moods, see patterns, share with your clinician"],
              ["🧘","Guided Exercises","Box breathing, thought records, grounding & more"],
              ["📔","Private Journal","Write freely — encrypted, only you can read it"],
              ["👩‍⚕️","Clinician Dashboard","Your therapist sees your trends before your first appointment"]
            ].map(([ic,t,d])=>(
              <div className="feat" key={t}>
                <div className="feat-icon">{ic}</div>
                <div className="feat-text"><strong>{t}</strong>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="login-right">
        <div className={`login-box fadein${shk?" shake":""}`}>
          <div className="login-title">{mode==="signin"?"Welcome back":"Create account"}</div>
          <p className="login-sub">{mode==="signin"
            ?"Sign in to continue your progress and check in with your mood."
            :"Join Bridge to get support while you wait for NHS therapy."}</p>

          <div className="auth-tabs">
            <button className={`auth-tab${mode==="signin"?" active":""}`} onClick={()=>{setMode("signin");setErr("");}}>Sign in</button>
            <button className={`auth-tab${mode==="signup"?" active":""}`} onClick={()=>{setMode("signup");setErr("");}}>Sign up</button>
          </div>

          <button className="google-btn" onClick={()=>setPicker(true)} disabled={gloading||loading}>
            {gloading?<><span className="spin gspin"/>Connecting to Google…</>:<><GIcon/>Continue with Google</>}
          </button>

          <div className="or-row"><span>or continue with email</span></div>

          {err&&<div className="err-box">⚠ {err}</div>}
          {mode==="signup"&&<div className="field"><label>Full name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name"/></div>}
          <div className="field"><label>Email address</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></div>
          <div className="field"><label>Password</label><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder={mode==="signup"?"Create a password (6+ chars)":"Your password"} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/></div>

          <button className="auth-submit" onClick={handleSubmit} disabled={loading||gloading}>
            {loading?<><span className="spin"/>{mode==="signin"?"Signing in…":"Creating account…"}</>:mode==="signin"?"Sign in →":"Create account →"}
          </button>

          <p className="auth-note">
            By continuing you agree to Bridge's <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.<br/>
            Bridge does not replace professional mental health care.
          </p>
        </div>
      </div>
    </div>
    {picker&&<Picker onSelect={handleGPick} onClose={()=>setPicker(false)}/>}
  </>;
}

function Breathe({ steps }){
  const [ph,setPh]=useState(0); const [on,setOn]=useState(false); const [cy,setCy]=useState(0);
  const t=useRef(null);
  useEffect(()=>{
    if(!on)return;
    t.current=setInterval(()=>setPh(p=>{ if(p===3)setCy(c=>c+1); return(p+1)%4; }),4000);
    return()=>clearInterval(t.current);
  },[on]);
  return <div style={{textAlign:"center"}}>
    <div className={`bc${ph===0&&on?" ex":""}`}>{on?steps[ph]:"Tap Start"}</div>
    <p style={{fontSize:".73rem",color:"var(--muted)",marginBottom:9}}>{on?`Cycle ${cy+1}`:"4 counts each phase"}</p>
    <button className="btn btn-p btn-sm" onClick={()=>{setOn(o=>!o);setPh(0);setCy(0);}}>{on?"Stop":"Start"}</button>
  </div>;
}

function ExModal({ ex, onClose }){
  return <div className="modover" onClick={onClose}>
    <div className="modbox" onClick={e=>e.stopPropagation()}>
      <button className="modclose" onClick={onClose}>✕</button>
      <div style={{marginBottom:5}}><span className="tag">{ex.tag}</span></div>
      <div className="modtitle">{ex.title}</div>
      <p className="modbody">{ex.intro}</p>
      <div className="divider"/>
      {ex.type==="breathe"?<Breathe steps={ex.steps}/>:ex.steps.map((s,i)=><div className="modstep" key={i}><strong>Step {i+1}.</strong> {s}</div>)}
    </div>
  </div>;
}

function AIChat({ user }){
  const [msgs,setMsgs]=useState([{role:"ai",text:`Hi ${fn(user.name)} 👋 I'm your Bridge companion. How are you feeling today?`}]);
  const [inp,setInp]=useState(""); const [ld,setLd]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{ if(ref.current)ref.current.scrollTop=ref.current.scrollHeight; },[msgs]);
  async function send(){
    if(!inp.trim()||ld)return;
    const m=inp.trim(); setInp(""); setLd(true);
    setMsgs(ms=>[...ms,{role:"user",text:m}]);
    const sys=`You are Bridge, a compassionate mental health support companion for NHS waiting list patients. User's name is ${user.name}. Listen empathetically, offer brief CBT/ACT/mindfulness strategies (2-4 sentences). If crisis: immediately give Samaritans 116 123 and 999. Never diagnose or replace a therapist.`;
    const hist=msgs.map(x=>({role:x.role==="ai"?"assistant":"user",content:x.text}));
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[...hist,{role:"user",content:m}]})});
      const d=await r.json();
      setMsgs(ms=>[...ms,{role:"ai",text:d.content?.map(b=>b.text||"").join("")||"I'm here with you."}]);
    }catch{ setMsgs(ms=>[...ms,{role:"ai",text:"Connection issue — please try again."}]); }
    setLd(false);
  }
  return <div>
    <div className="chat-area" ref={ref}>
      {msgs.map((m,i)=><div key={i} className={`cmsg ${m.role}`}>{m.text}</div>)}
      {ld&&<div className="cmsg ai load">Bridge is thinking…</div>}
    </div>
    <div className="cinrow">
      <input className="cinput" value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type and press Enter…"/>
      <button className="btn btn-p btn-sm" onClick={send} disabled={ld||!inp.trim()}>Send</button>
    </div>
  </div>;
}

function Journal(){
  const [txt,setTxt]=useState("");
  const [ents,setEnts]=useState([
    {date:"3 May 2026",text:"Had a difficult morning but used the breathing exercise. Felt better after 5 minutes."},
    {date:"1 May 2026",text:"Anxious about the appointment delay. Wrote out my worries and it helped a bit."},
  ]);
  function save(){ if(!txt.trim())return; setEnts(e=>[{date:tod(),text:txt.trim()},...e]); setTxt(""); }
  return <div>
    <textarea className="jta" value={txt} onChange={e=>setTxt(e.target.value)} placeholder="Write freely — this is your private space. No one else can see this…"/>
    <div style={{textAlign:"right",marginTop:8}}><button className="btn btn-p btn-sm" onClick={save}>Save entry</button></div>
    <div className="divider"/>
    {ents.map((e,i)=><div className="jentry" key={i}><div className="jdate">{e.date}</div><div className="jtext">{e.text}</div></div>)}
  </div>;
}

function Dashboard({ user, mh, setTab }){
  const days=["M","T","W","T","F","S","S"]; const l7=[true,true,false,true,true,true,true];
  return <div>
    <div className="wbanner">
      <div className="wav">{user.initials}</div>
      <div className="wtext">
        <h3>Welcome back, {fn(user.name)}</h3>
        <p>Week 18 on the waiting list · 12-day check-in streak 🔥 · Progress saved to your account.</p>
      </div>
    </div>
    <div className="crisis">
      <div className="cicon">🆘</div>
      <div className="ctxt"><strong>In crisis? Please reach out now.</strong>Samaritans: <strong>116 123</strong> (free, 24/7) · Text SHOUT to <strong>85258</strong> · Emergency: <strong>999</strong></div>
    </div>
    <div className="g3" style={{marginBottom:18}}>
      <div className="stat"><div className="sv">18</div><div className="sl">weeks waiting</div></div>
      <div className="stat"><div className="sv" style={{color:"var(--sage)"}}>12</div><div className="sl">day streak 🔥</div></div>
      <div className="stat"><div className="sv">3.4</div><div className="sl">avg mood</div></div>
    </div>
    <div className="card">
      <div className="card-title">📊 This week's mood</div>
      <div className="mchart">{mh.map((d,i)=><div className="mwrap" key={i}><div className="mbar" style={{height:`${(d.val/5)*80}px`,background:gc(d.val)}}/><div className="mlbl">{d.day}</div></div>)}</div>
    </div>
    <div className="card">
      <div className="card-title">🔥 Check-in streak</div>
      <div className="sdots">{l7.map((done,i)=><div key={i} className={`sdot ${i===6?"now":done?"done":"miss"}`}>{days[i]}</div>)}</div>
      <p className="tm mt10">Every check-in helps your clinician understand how you're doing before your first appointment.</p>
    </div>
    <div className="card">
      <div className="card-title">💡 Recommended for you</div>
      <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
        <button className="btn btn-s btn-sm" onClick={()=>setTab("exercises")}>Try Box Breathing</button>
        <button className="btn btn-s btn-sm" onClick={()=>setTab("chat")}>Talk to Bridge AI</button>
        <button className="btn btn-s btn-sm" onClick={()=>setTab("journal")}>Write in Journal</button>
      </div>
    </div>
  </div>;
}

function MoodTracker({ mh, setMh }){
  const [sel,setSel]=useState(null); const [note,setNote]=useState(""); const [sv,setSv]=useState(false);
  function log(){ if(!sel)return; const u=[...mh]; u[6]={day:"Sun",val:sel.val}; setMh(u); setSv(true); setTimeout(()=>setSv(false),2000); setNote(""); setSel(null); }
  return <div>
    <div className="card">
      <div className="card-title">😌 How are you feeling right now?</div>
      <div className="mood-row">{MOODS.map(m=>(
        <button key={m.val} className={`mood-btn${sel?.val===m.val?" sel":""}`}
          style={{borderColor:sel?.val===m.val?m.color:"transparent",background:sel?.val===m.val?m.color+"22":""}}
          onClick={()=>setSel(m)} title={m.label}>{m.emoji}</button>
      ))}</div>
      {sel&&<p style={{fontSize:".78rem",color:"var(--muted)",marginTop:5}}>Feeling <strong>{sel.label}</strong></p>}
      <textarea className="jta" style={{minHeight:68,marginTop:11}} value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a note (optional)…"/>
      <div style={{marginTop:9,display:"flex",alignItems:"center",gap:11}}>
        <button className="btn btn-p" onClick={log} disabled={!sel}>Log mood</button>
        {sv&&<span style={{color:"var(--sage)",fontSize:".78rem"}}>✓ Saved to your account</span>}
      </div>
    </div>
    <div className="card">
      <div className="card-title">📊 7-day overview</div>
      <div className="mchart">{mh.map((d,i)=><div className="mwrap" key={i}><div className="mbar" style={{height:`${(d.val/5)*80}px`,background:gc(d.val)}}/><div className="mlbl">{d.day}</div></div>)}</div>
      <p className="tm mt10">Average: <strong>{(mh.reduce((a,b)=>a+b.val,0)/7).toFixed(1)}</strong> / 5</p>
    </div>
  </div>;
}

function Exercises(){
  const [act,setAct]=useState(null);
  return <div>
    <div className="ex-grid">{EXERCISES.map(ex=>(
      <div key={ex.id} className={`excard${act===ex.id?" act":""}`} onClick={()=>setAct(ex.id)}>
        <div className="extag">{ex.tag}</div>
        <div className="extitle">{ex.title}</div>
        <div className="exdesc">{ex.desc}</div>
        <div className="exdur">{ex.duration}</div>
      </div>
    ))}</div>
    {act&&<ExModal ex={EXERCISES.find(e=>e.id===act)} onClose={()=>setAct(null)}/>}
  </div>;
}

function Clinician({ user }){
  const [sel,setSel]=useState(null); const [note,setNote]=useState(""); const [sv,setSv]=useState(false);
  const hi=PATIENTS.filter(p=>p.risk==="high");
  function save(){ setSv(true); setTimeout(()=>{setSv(false);setNote("");},2000); }
  return <div>
    <div style={{background:"var(--ink)",color:"var(--cream)",padding:"15px 18px",borderRadius:12,marginBottom:18}}>
      <div style={{fontFamily:"'Fraunces',serif",fontSize:"1rem",marginBottom:3}}>Clinician Dashboard</div>
      <div style={{fontSize:".72rem",color:"#aaa"}}>Dr. {user.name} · IAPT Step 3 · {tod()}</div>
    </div>
    {hi.length>0&&<div style={{background:"#fff5f5",border:"1.5px solid #fca5a5",borderRadius:12,padding:"13px 17px",marginBottom:18}}>
      <div style={{fontFamily:"'Fraunces',serif",color:"var(--danger)",marginBottom:7}}>⚠ High-Risk Alerts</div>
      {hi.map(p=><div key={p.id} style={{fontSize:".76rem",padding:"5px 0",borderBottom:"1px solid #fecaca"}}><strong>{p.name}</strong> · {p.flag}</div>)}
    </div>}
    <div className="g3" style={{marginBottom:18}}>
      <div className="stat"><div className="sv">{PATIENTS.length}</div><div className="sl">patients</div></div>
      <div className="stat"><div className="sv" style={{color:"var(--danger)"}}>2</div><div className="sl">high risk</div></div>
      <div className="stat"><div className="sv">84%</div><div className="sl">weekly active</div></div>
    </div>
    <div className="card">
      <div className="card-title">👥 Patient List</div>
      {PATIENTS.map(p=><div key={p.id} className="prow" onClick={()=>setSel(sel?.id===p.id?null:p)}>
        <div className="pav">{p.init}</div>
        <div><div className="pname">{p.name}</div><div className="pmeta">Week {p.weeks} · {p.logins} sessions · {p.last}</div></div>
        <div className={`rpill ${p.risk==="high"?"rhi":p.risk==="med"?"rme":"rlo"}`}>{p.risk}</div>
      </div>)}
    </div>
    {sel&&<div className="card">
      <div className="card-title">📋 {sel.name}</div>
      <div className="g2">
        <div className="stat"><div className="sv">{sel.avg.toFixed(1)}</div><div className="sl">avg mood</div></div>
        <div className="stat"><div className="sv">{sel.logins}</div><div className="sl">sessions</div></div>
      </div>
      {sel.flag&&<div style={{background:"#fff5f5",border:"1px solid #fca5a5",borderRadius:8,padding:"9px 13px",marginTop:11,fontSize:".76rem",color:"var(--danger)"}}>⚠ {sel.flag}</div>}
      <div className="divider"/>
      <textarea className="jta" style={{minHeight:76}} value={note} onChange={e=>setNote(e.target.value)} placeholder="Clinical notes (private to you)…"/>
      <div style={{display:"flex",gap:9,marginTop:9}}>
        <button className="btn btn-p btn-sm" onClick={save}>Save note</button>
        {sv&&<span style={{color:"var(--sage)",fontSize:".76rem"}}>✓ Saved</span>}
      </div>
    </div>}
  </div>;
}

function UserMenu({ user, onLogout }){
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    function h(e){ if(ref.current&&!ref.current.contains(e.target))setOpen(false); }
    document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h);
  },[]);
  return <div className="uchip" ref={ref} onClick={()=>setOpen(o=>!o)}>
    <div className="uav" style={{background:user.color}}>{user.initials}</div>
    <span className="uname">{fn(user.name)}</span>
    <span style={{color:"#666",fontSize:".62rem"}}>▾</span>
    {open&&<div className="udrop" onClick={e=>e.stopPropagation()}>
      <div className="udrop-head">
        <div className="udrop-name">{user.name}</div>
        <div className="udrop-email">{user.email}</div>
      </div>
      <button className="udrop-item">⚙ Account settings</button>
      <button className="udrop-item">📊 Export my data</button>
      <button className="udrop-item">🔔 Notifications</button>
      <div className="divider" style={{margin:"3px 0"}}/>
      <button className="udrop-item red" onClick={onLogout}>↩ Sign out</button>
    </div>}
  </div>;
}

export default function App(){
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState("dashboard");
  const [mh,setMh]=useState(()=>seed());

  if(!user) return <LoginScreen onLogin={setUser}/>;

  const TABS=[
    {id:"dashboard",label:"Dashboard"},
    {id:"mood",label:"Mood"},
    {id:"exercises",label:"Exercises"},
    {id:"journal",label:"Journal"},
    {id:"chat",label:"Bridge AI"},
    {id:"clinician",label:"Clinician",badge:2},
  ];

  return <>
    <style>{CSS}</style>
    <div className="app">
      <div className="hero">
        <h1>Bridge <em>Mental Health</em></h1>
        <p>Support for people on NHS waiting lists — and tools for the clinicians who care for them.</p>
      </div>
      <nav>
        <div className="nav-logo">Bridge<span>.</span></div>
        <div className="nav-tabs">{TABS.map(t=>(
          <button key={t.id} className={`nav-tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
            {t.label}{t.badge&&<span className="nav-badge">{t.badge}</span>}
          </button>
        ))}</div>
        <UserMenu user={user} onLogout={()=>setUser(null)}/>
      </nav>

      <div className="section">
        <div className="sh">
          <h2>{TABS.find(t=>t.id===tab)?.label}</h2>
          <p>
            {tab==="dashboard"&&`Welcome back, ${fn(user.name)} · Week 18 of waiting`}
            {tab==="mood"&&"Log how you're feeling and track your patterns"}
            {tab==="exercises"&&"Evidence-based tools to help right now"}
            {tab==="journal"&&"Private reflections — only you can read these"}
            {tab==="chat"&&"Talk to your AI support companion"}
            {tab==="clinician"&&"Patient monitoring dashboard — clinical view"}
          </p>
        </div>
        {tab==="dashboard"&&<Dashboard user={user} mh={mh} setTab={setTab}/>}
        {tab==="mood"&&<MoodTracker mh={mh} setMh={setMh}/>}
        {tab==="exercises"&&<Exercises/>}
        {tab==="journal"&&<div className="card"><div className="card-title">📔 Journal</div><Journal/></div>}
        {tab==="chat"&&<div className="card"><div className="card-title">🤖 Bridge AI Companion</div><AIChat user={user}/></div>}
        {tab==="clinician"&&<Clinician user={user}/>}
      </div>
    </div>
  </>;
}