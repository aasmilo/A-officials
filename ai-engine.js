<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<title>A Officials — AI Studio</title>
<link rel="icon" href="data:,">
<style>
:root {
  --c-bg: #07070f;
  --c-surface: rgba(255,255,255,0.055);
  --c-surf2: rgba(255,255,255,0.10);
  --c-border: rgba(255,255,255,0.12);
  --c-border2: rgba(255,255,255,0.22);
  --c-text: rgba(255,255,255,0.92);
  --c-muted: rgba(255,255,255,0.45);
  --c-dim: rgba(255,255,255,0.20);
  --blue:#4f8fff; --purple:#9b6bff; --pink:#ff6bb8; --teal:#3fffd2;
  --grad-main: linear-gradient(135deg, var(--blue), var(--purple), var(--pink));
  --grad-edit: linear-gradient(135deg, #4f8fff, #9b6bff);
  --grad-chat: linear-gradient(135deg, #3fffd2, #4f8fff);
  --blur-glass: blur(28px) saturate(180%);
  --blur-sm: blur(12px) saturate(150%);
  --r:18px; --r-sm:10px;
  --trans: all .22s cubic-bezier(.4,0,.2,1);
  --font:'Inter','SF Pro Display',-apple-system,sans-serif;
  --font-mono:'JetBrains Mono','Fira Code','Courier New',monospace;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;overflow:hidden;font-family:var(--font);color:var(--c-text);background:var(--c-bg);}
button{font-family:var(--font);cursor:pointer;}
textarea,input{font-family:var(--font);}
img,video{max-width:100%;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:4px;}

#bg-layer{position:fixed;inset:0;z-index:0;pointer-events:none;
  background:radial-gradient(ellipse 60% 60% at 15% 20%, rgba(79,143,255,0.18) 0%, transparent 70%),
             radial-gradient(ellipse 50% 50% at 85% 80%, rgba(155,107,255,0.15) 0%, transparent 70%),
             radial-gradient(ellipse 40% 40% at 50% 50%, rgba(255,107,184,0.08) 0%, transparent 70%),
             var(--c-bg);
  animation:bgPulse 18s ease-in-out infinite alternate;}
@keyframes bgPulse{0%{filter:hue-rotate(0deg) brightness(1);}100%{filter:hue-rotate(18deg) brightness(1.08);}}

#app{position:relative;z-index:1;height:100vh;display:flex;flex-direction:column;}

/* ══ CUTSCENE ══ */
#cutscene{position:fixed;inset:0;z-index:9999;background:#000;display:flex;align-items:center;justify-content:center;overflow:hidden;}
#cutscene-particles{position:absolute;inset:0;pointer-events:none;}
#cutscene-content{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;}
.cs-logo-ring{width:120px;height:120px;border-radius:50%;background:var(--grad-main);display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 60px rgba(155,107,255,0.5),0 0 120px rgba(79,143,255,0.25);opacity:0;transform:scale(.3);
  transition:opacity 1.2s ease,transform 1.2s cubic-bezier(.34,1.56,.64,1);margin-bottom:32px;flex-shrink:0;}
.cs-logo-ring.in{opacity:1;transform:scale(1);}
.cs-logo-inner{width:96px;height:96px;border-radius:50%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;
  font-size:40px;font-weight:900;letter-spacing:-2px;background:linear-gradient(135deg,#fff,rgba(255,255,255,0.7));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.cs-company{font-size:clamp(28px,6vw,52px);font-weight:800;letter-spacing:-1px;opacity:0;transform:translateY(20px);
  transition:opacity 1s ease .6s,transform 1s ease .6s;background:var(--grad-main);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;}
.cs-company.in{opacity:1;transform:translateY(0);}
.cs-tagline{font-size:clamp(13px,2vw,17px);color:var(--c-muted);letter-spacing:3px;text-transform:uppercase;margin-top:10px;
  opacity:0;transition:opacity 1s ease 1.2s;}
.cs-tagline.in{opacity:1;}
.cs-divider{width:0;height:1px;background:linear-gradient(90deg,transparent,var(--blue),var(--purple),transparent);
  margin:32px 0;transition:width 1.2s ease 1.6s;}
.cs-divider.in{width:280px;}
.cs-product{font-size:clamp(14px,2.5vw,20px);font-weight:600;color:rgba(255,255,255,0.75);letter-spacing:1px;
  opacity:0;transform:translateY(10px);transition:opacity .8s ease 2.4s,transform .8s ease 2.4s;}
.cs-product.in{opacity:1;transform:translateY(0);}
.cs-loading{margin-top:48px;display:flex;gap:8px;opacity:0;transition:opacity .6s ease 3s;}
.cs-loading.in{opacity:1;}
.cs-dot{width:7px;height:7px;border-radius:50%;background:var(--purple);animation:csDot 1.4s ease-in-out infinite;}
.cs-dot:nth-child(2){background:var(--blue);animation-delay:.2s;}
.cs-dot:nth-child(3){background:var(--pink);animation-delay:.4s;}
@keyframes csDot{0%,80%,100%{transform:scale(.6);opacity:.3}40%{transform:scale(1);opacity:1}}
.cs-skip{position:absolute;bottom:28px;right:28px;z-index:3;padding:8px 16px;border-radius:50px;
  border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:var(--c-muted);
  font-size:12px;font-weight:600;cursor:pointer;transition:var(--trans);}
.cs-skip:hover{background:rgba(255,255,255,0.1);color:var(--c-text);}

/* ══ LOGIN ══ */
#login-screen{position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;padding:16px;overflow-y:auto;}
#login-screen.show{display:flex;}
.login-card{width:100%;max-width:400px;background:var(--c-surface);backdrop-filter:var(--blur-glass);-webkit-backdrop-filter:var(--blur-glass);
  border:1px solid var(--c-border2);border-radius:28px;padding:40px 32px;
  box-shadow:0 24px 80px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.12);
  display:flex;flex-direction:column;gap:22px;animation:loginIn .5s cubic-bezier(.4,0,.2,1);margin:auto;}
@keyframes loginIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
.login-logo{display:flex;align-items:center;gap:12px;}
.login-logo-mark{width:44px;height:44px;border-radius:14px;background:var(--grad-main);display:flex;align-items:center;justify-content:center;
  font-size:22px;font-weight:900;color:#fff;flex-shrink:0;box-shadow:0 4px 20px rgba(155,107,255,0.35);}
.login-logo-text{font-size:20px;font-weight:800;letter-spacing:-0.5px;}
.login-logo-sub{font-size:12px;color:var(--c-muted);font-weight:500;margin-top:2px;}
.login-title{font-size:24px;font-weight:700;letter-spacing:-0.5px;}
.login-sub{font-size:13px;color:var(--c-muted);margin-top:4px;}
.login-fields{display:flex;flex-direction:column;gap:12px;}
.field-wrap{display:flex;flex-direction:column;gap:6px;}
.field-label{font-size:12px;font-weight:600;color:var(--c-muted);}
.field-input{width:100%;padding:12px 14px;background:rgba(0,0,0,0.3);border:1px solid var(--c-border);
  border-radius:var(--r-sm);color:var(--c-text);font-size:14px;outline:none;transition:var(--trans);}
.field-input:focus{border-color:var(--purple);box-shadow:0 0 0 3px rgba(155,107,255,0.15);}
.field-input::placeholder{color:var(--c-muted);}
.field-error{font-size:12px;color:#ff8585;min-height:14px;}
.login-btn{width:100%;padding:13px;border-radius:var(--r-sm);border:none;background:var(--grad-main);color:#fff;
  font-size:15px;font-weight:700;cursor:pointer;transition:var(--trans);box-shadow:0 4px 20px rgba(155,107,255,0.3);
  display:flex;align-items:center;justify-content:center;gap:8px;}
.login-btn:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 8px 30px rgba(155,107,255,0.4);}
.login-btn:disabled{opacity:.6;cursor:default;transform:none;}
.login-divider{display:flex;align-items:center;gap:12px;}
.login-divider::before,.login-divider::after{content:'';flex:1;height:1px;background:var(--c-border);}
.login-divider span{font-size:12px;color:var(--c-muted);white-space:nowrap;}
.login-social{display:flex;flex-direction:column;gap:10px;}
.social-btn{width:100%;padding:11px;border-radius:var(--r-sm);background:#fff;border:1px solid var(--c-border);
  color:#1a1a1a;font-size:13px;font-weight:600;cursor:pointer;transition:var(--trans);
  display:flex;align-items:center;justify-content:center;gap:10px;}
.social-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,0.2);}
.social-btn.apple{background:#000;color:#fff;border-color:#000;}
.social-btn.google{background:#fff;color:#1a1a1a;}
.login-footer{text-align:center;font-size:12px;color:var(--c-muted);}
.login-footer a{color:var(--purple);text-decoration:none;cursor:pointer;}
.login-tab-row{display:flex;background:rgba(0,0,0,0.2);border-radius:var(--r-sm);padding:3px;}
.login-tab{flex:1;padding:8px;border-radius:8px;border:none;background:transparent;color:var(--c-muted);
  font-size:13px;font-weight:600;cursor:pointer;transition:var(--trans);}
.login-tab.active{background:var(--c-surf2);color:var(--c-text);}
.demo-banner{font-size:11px;color:#ffd166;background:rgba(255,209,102,0.1);border:1px solid rgba(255,209,102,0.25);
  border-radius:var(--r-sm);padding:8px 12px;line-height:1.5;display:none;}
.demo-banner.show{display:block;}

/* ══ HUB ══ */
#hub{position:fixed;inset:0;z-index:50;display:none;flex-direction:column;align-items:center;justify-content:center;padding:24px;gap:40px;overflow-y:auto;}
#hub.show{display:flex;}
.hub-header{text-align:center;}
.hub-greeting{font-size:clamp(28px,5vw,44px);font-weight:800;letter-spacing:-1px;line-height:1.1;}
.hub-greeting span{background:var(--grad-main);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hub-sub{font-size:15px;color:var(--c-muted);margin-top:8px;}
.hub-cards{display:flex;gap:20px;width:100%;max-width:760px;flex-wrap:wrap;justify-content:center;}
.hub-card{flex:1;min-width:280px;max-width:360px;padding:36px 28px;background:var(--c-surface);
  backdrop-filter:var(--blur-glass);-webkit-backdrop-filter:var(--blur-glass);border:1px solid var(--c-border);
  border-radius:28px;cursor:pointer;transition:var(--trans);display:flex;flex-direction:column;gap:16px;
  box-shadow:0 8px 40px rgba(0,0,0,0.3);position:relative;overflow:hidden;}
.hub-card::before{content:'';position:absolute;inset:0;opacity:0;transition:opacity .3s;border-radius:28px;}
.hub-card.editor::before{background:radial-gradient(ellipse at 30% 30%, rgba(79,143,255,0.12), transparent 70%);}
.hub-card.chat::before{background:radial-gradient(ellipse at 70% 30%, rgba(63,255,210,0.10), transparent 70%);}
.hub-card:hover{transform:translateY(-6px);border-color:var(--c-border2);box-shadow:0 20px 60px rgba(0,0,0,0.45);}
.hub-card:hover::before{opacity:1;}
.hub-card:hover .hub-card-arrow{transform:translateX(4px);}
.hub-card-icon{width:60px;height:60px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;}
.hub-card.editor .hub-card-icon{background:linear-gradient(135deg, rgba(79,143,255,0.2), rgba(155,107,255,0.2));}
.hub-card.chat .hub-card-icon{background:linear-gradient(135deg, rgba(63,255,210,0.2), rgba(79,143,255,0.2));}
.hub-card-title{font-size:22px;font-weight:700;letter-spacing:-0.4px;}
.hub-card-desc{font-size:13px;color:var(--c-muted);line-height:1.6;}
.hub-card-tags{display:flex;gap:6px;flex-wrap:wrap;}
.hub-tag{padding:3px 10px;border-radius:50px;font-size:11px;font-weight:600;background:rgba(255,255,255,0.07);
  border:1px solid var(--c-border);color:var(--c-muted);}
.hub-card-arrow{font-size:20px;margin-top:auto;color:var(--c-muted);transition:transform .2s;}
.hub-card.editor .hub-card-arrow{color:var(--blue);}
.hub-card.chat .hub-card-arrow{color:var(--teal);}
.hub-footer{font-size:12px;color:var(--c-dim);}

/* ══ TOPNAV ══ */
#topnav{display:none;align-items:center;gap:12px;padding:10px 16px;background:rgba(7,7,15,0.8);
  backdrop-filter:var(--blur-glass);-webkit-backdrop-filter:var(--blur-glass);border-bottom:1px solid var(--c-border);
  flex-shrink:0;z-index:10;}
#topnav.show{display:flex;}
.nav-logo{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.nav-logo-mark{width:30px;height:30px;border-radius:9px;background:var(--grad-main);display:flex;align-items:center;justify-content:center;
  font-size:14px;font-weight:900;color:#fff;}
.nav-logo-text{font-size:15px;font-weight:800;letter-spacing:-0.3px;}
.nav-sep{width:1px;height:24px;background:var(--c-border);flex-shrink:0;}
.nav-mode{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--c-muted);}
.nav-mode-badge{padding:3px 10px;border-radius:50px;font-size:11px;font-weight:700;color:#fff;}
.nav-mode-badge.editor{background:var(--grad-edit);}
.nav-mode-badge.chat{background:var(--grad-chat);color:#0a2a20;}
.nav-right{margin-left:auto;display:flex;gap:8px;align-items:center;}
.nav-btn{padding:6px 14px;border-radius:50px;border:1px solid var(--c-border);background:var(--c-surface);color:var(--c-text);
  font-size:12px;font-weight:600;cursor:pointer;transition:var(--trans);display:flex;align-items:center;gap:6px;white-space:nowrap;}
.nav-btn:hover{background:var(--c-surf2);border-color:var(--c-border2);}
.nav-avatar{width:30px;height:30px;border-radius:50%;background:var(--grad-main);display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:700;cursor:pointer;flex-shrink:0;box-shadow:0 0 0 2px rgba(155,107,255,0.3);position:relative;}
.nav-menu{position:absolute;top:calc(100% + 8px);right:0;background:rgba(14,14,26,0.97);border:1px solid var(--c-border2);
  border-radius:14px;padding:8px;min-width:170px;display:none;flex-direction:column;gap:2px;
  box-shadow:0 12px 40px rgba(0,0,0,0.5);z-index:200;backdrop-filter:var(--blur-glass);}
.nav-menu.show{display:flex;}
.nav-menu-item{padding:9px 12px;border-radius:9px;font-size:12.5px;font-weight:600;color:var(--c-text);
  cursor:pointer;transition:var(--trans);background:transparent;border:none;text-align:left;}
.nav-menu-item:hover{background:rgba(255,255,255,0.08);}
.nav-menu-item.danger{color:#ff8585;}

/* ══ EDITOR AREA ══ */
#editor-area{display:none;flex:1;overflow:hidden;flex-direction:row;}
#editor-area.show{display:flex;}
.ed-sidebar{width:60px;background:rgba(0,0,0,0.3);backdrop-filter:var(--blur-sm);-webkit-backdrop-filter:var(--blur-sm);
  border-right:1px solid var(--c-border);display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 8px;
  flex-shrink:0;overflow-y:auto;}
.ed-tool{width:42px;height:42px;border-radius:13px;border:1px solid transparent;background:transparent;color:var(--c-muted);
  cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;transition:var(--trans);
  position:relative;flex-shrink:0;}
.ed-tool:hover{background:var(--c-surf2);color:var(--c-text);border-color:var(--c-border);}
.ed-tool.active{background:rgba(79,143,255,0.15);border-color:rgba(79,143,255,0.4);color:var(--blue);box-shadow:0 0 12px rgba(79,143,255,0.2);}
.ed-sep{width:28px;height:1px;background:var(--c-border);margin:4px 0;flex-shrink:0;}
.ed-tooltip{position:absolute;left:calc(100% + 10px);top:50%;transform:translateY(-50%);background:rgba(10,10,20,0.95);
  border:1px solid var(--c-border2);padding:4px 10px;border-radius:8px;font-size:11px;font-weight:600;white-space:nowrap;
  opacity:0;pointer-events:none;transition:opacity .15s;z-index:99;}
.ed-tool:hover .ed-tooltip{opacity:1;}

.ed-canvas-zone{flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative;}
.ed-canvas-scroll{flex:1;display:flex;align-items:center;justify-content:center;padding:24px;overflow:auto;position:relative;}
#dropzone{width:100%;max-width:880px;aspect-ratio:16/9;min-height:200px;border-radius:20px;border:2px dashed rgba(255,255,255,0.14);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;cursor:pointer;transition:var(--trans);
  background:rgba(255,255,255,0.02);position:relative;overflow:hidden;}
#dropzone.drag-over{border-color:var(--blue);background:rgba(79,143,255,0.07);}
#dropzone.loaded{border-style:solid;border-color:transparent;background:transparent;padding:0;cursor:default;}
.dz-icon{font-size:44px;pointer-events:none;}
.dz-label{font-size:15px;font-weight:600;color:var(--c-muted);pointer-events:none;}
.dz-sub{font-size:12px;color:var(--c-dim);pointer-events:none;text-align:center;}
.dz-btn{padding:9px 22px;border-radius:50px;border:1px solid var(--c-border2);background:var(--c-surface);color:var(--c-text);
  font-size:13px;font-weight:600;cursor:pointer;transition:var(--trans);pointer-events:all;}
.dz-btn:hover{background:var(--c-surf2);}
#ed-img{width:100%;height:100%;object-fit:contain;border-radius:18px;display:none;transition:filter .3s;}
#ed-img.show{display:block;}
#ed-video{width:100%;height:100%;object-fit:contain;border-radius:18px;display:none;}
#ed-video.show{display:block;}
#ed-code-wrap{display:none;width:100%;height:100%;}
#ed-code-wrap.show{display:flex;}
#ed-code{flex:1;background:rgba(0,0,0,0.55);border-radius:18px;border:1px solid var(--c-border);color:#c8d3f5;
  font-family:var(--font-mono);font-size:13px;padding:20px;resize:none;outline:none;line-height:1.65;tab-size:2;overflow:auto;}
#ed-fx-canvas{position:absolute;inset:0;pointer-events:none;border-radius:18px;opacity:0;transition:opacity .3s;}
#ed-fx-canvas.on{opacity:1;}
#ed-progress-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.6);border-radius:18px;display:none;
  flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:5;backdrop-filter:blur(4px);}
#ed-progress-overlay.show{display:flex;}
.ed-spinner{width:38px;height:38px;border-radius:50%;border:3px solid rgba(255,255,255,0.15);border-top-color:var(--blue);
  animation:spin 0.8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
#ed-progress-text{font-size:13px;color:var(--c-text);font-weight:600;}

#ed-timeline-bar{display:none;flex-direction:column;gap:6px;padding:10px 16px;border-top:1px solid var(--c-border);background:rgba(0,0,0,0.25);}
#ed-timeline-bar.show{display:flex;}
#ed-timeline{width:100%;height:30px;background:rgba(0,0,0,0.3);border-radius:8px;border:1px solid var(--c-border);
  position:relative;cursor:pointer;overflow:hidden;}
#ed-tl-prog{height:100%;background:var(--grad-edit);width:0%;border-radius:8px;opacity:.7;}
#ed-tl-handle{position:absolute;top:0;left:0%;width:3px;height:100%;background:#fff;border-radius:2px;}
.tl-row{display:flex;justify-content:space-between;font-size:11px;color:var(--c-muted);}

#ed-actions{display:flex;align-items:center;gap:8px;padding:10px 16px;background:rgba(0,0,0,0.25);
  border-top:1px solid var(--c-border);overflow-x:auto;flex-shrink:0;}
.ed-act-group{display:flex;gap:6px;align-items:center;flex-shrink:0;}
.ed-act-sep{width:1px;height:26px;background:var(--c-border);flex-shrink:0;}
.abt{padding:7px 14px;border-radius:50px;border:1px solid var(--c-border);background:var(--c-surface);color:var(--c-text);
  font-size:12px;font-weight:600;cursor:pointer;transition:var(--trans);white-space:nowrap;display:flex;align-items:center;gap:5px;}
.abt:hover{background:var(--c-surf2);border-color:var(--c-border2);transform:translateY(-1px);}
.abt.primary{background:var(--grad-edit);border-color:transparent;color:#fff;box-shadow:0 2px 16px rgba(79,143,255,0.3);}
.abt.primary:hover{opacity:.9;}
.abt:disabled{opacity:.5;cursor:default;transform:none;}

.ed-panel{width:270px;flex-shrink:0;background:rgba(0,0,0,0.25);backdrop-filter:var(--blur-sm);-webkit-backdrop-filter:var(--blur-sm);
  border-left:1px solid var(--c-border);display:flex;flex-direction:column;overflow:hidden;}
.ed-panel-hd{padding:14px 16px;border-bottom:1px solid var(--c-border);font-size:13px;font-weight:700;color:var(--c-text);flex-shrink:0;}
.ed-panel-body{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px;}
.panel-block{border-radius:var(--r-sm);overflow:hidden;border:1px solid var(--c-border);background:rgba(255,255,255,0.03);}
.panel-block-hd{padding:8px 12px;font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--c-muted);
  border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);}
.panel-block-body{padding:10px 12px;display:flex;flex-direction:column;gap:8px;}
.sl-row{display:flex;align-items:center;gap:8px;}
.sl-label{font-size:11px;color:var(--c-muted);width:66px;flex-shrink:0;}
.sl-val{font-size:11px;color:var(--c-text);width:26px;text-align:right;flex-shrink:0;}
input[type=range]{flex:1;-webkit-appearance:none;height:3px;border-radius:2px;background:rgba(255,255,255,0.12);outline:none;cursor:pointer;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border-radius:50%;
  background:linear-gradient(135deg,var(--blue),var(--purple));box-shadow:0 0 8px rgba(79,143,255,0.5);cursor:pointer;}
.preset-chips,.fx-chips{display:flex;gap:5px;flex-wrap:wrap;}
.chip{padding:4px 10px;border-radius:50px;border:1px solid var(--c-border);background:rgba(255,255,255,0.04);color:var(--c-muted);
  font-size:11px;font-weight:600;cursor:pointer;transition:var(--trans);}
.chip:hover,.chip.active{background:rgba(79,143,255,0.18);color:#9fc6ff;border-color:rgba(79,143,255,0.35);}
.ai-box-in{width:100%;background:rgba(0,0,0,0.3);border:1px solid var(--c-border);border-radius:var(--r-sm);padding:8px 10px;
  color:var(--c-text);font-size:12px;outline:none;resize:none;}
.ai-box-in:focus{border-color:var(--purple);box-shadow:0 0 0 2px rgba(155,107,255,0.15);}
.ai-box-in::placeholder{color:var(--c-muted);}
#panel-ai-result{font-size:12px;line-height:1.65;color:var(--c-text);background:rgba(0,0,0,0.25);
  border:1px solid rgba(155,107,255,0.2);border-radius:var(--r-sm);padding:10px;min-height:50px;
  white-space:pre-wrap;word-break:break-word;display:none;}
#panel-ai-result.show{display:block;}
.engine-tag{font-size:9.5px;color:var(--c-dim);text-align:center;padding-top:2px;}

/* ══ CHAT AREA ══ */
#chat-area{display:none;flex:1;flex-direction:row;overflow:hidden;}
#chat-area.show{display:flex;}
.chat-sidebar{width:220px;flex-shrink:0;background:rgba(0,0,0,0.3);backdrop-filter:var(--blur-sm);-webkit-backdrop-filter:var(--blur-sm);
  border-right:1px solid var(--c-border);display:flex;flex-direction:column;padding:12px;gap:10px;overflow-y:auto;}
.chat-new-btn{width:100%;padding:11px;border-radius:var(--r-sm);border:1px solid var(--c-border2);background:var(--c-surface);
  color:var(--c-text);font-size:13px;font-weight:700;cursor:pointer;transition:var(--trans);display:flex;align-items:center;gap:8px;justify-content:center;}
.chat-new-btn:hover{background:var(--c-surf2);}
.chat-hist-label{font-size:10px;font-weight:700;color:var(--c-dim);letter-spacing:.8px;text-transform:uppercase;}
.chat-hist-item{padding:9px 10px;border-radius:var(--r-sm);cursor:pointer;transition:var(--trans);font-size:12px;color:var(--c-muted);
  background:transparent;border:1px solid transparent;display:flex;align-items:center;gap:8px;line-height:1.3;}
.chat-hist-item:hover{background:var(--c-surface);border-color:var(--c-border);color:var(--c-text);}
.chat-hist-item.active{background:rgba(79,143,255,0.10);border-color:rgba(79,143,255,0.25);color:var(--c-text);}
.chat-hist-dot{width:6px;height:6px;border-radius:50%;background:var(--teal);flex-shrink:0;}
.chat-sidebar-btm{margin-top:auto;display:flex;flex-direction:column;gap:6px;}
.chat-mode-chip{padding:8px 10px;border-radius:var(--r-sm);border:1px solid var(--c-border);background:var(--c-surface);
  font-size:11px;font-weight:600;cursor:pointer;color:var(--c-muted);transition:var(--trans);text-align:center;}
.chat-mode-chip:hover,.chat-mode-chip.active{color:var(--teal);border-color:rgba(63,255,210,0.3);background:rgba(63,255,210,0.07);}

.chat-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
#chat-messages{flex:1;overflow-y:auto;padding:24px 20px;display:flex;flex-direction:column;gap:16px;}
.msg{display:flex;gap:12px;max-width:100%;animation:msgIn .25s ease;}
@keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.msg.user{flex-direction:row-reverse;}
.msg-avatar{width:34px;height:34px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:15px;}
.msg.ai .msg-avatar{background:linear-gradient(135deg,rgba(63,255,210,0.2),rgba(79,143,255,0.2));}
.msg.user .msg-avatar{background:var(--grad-main);}
.msg-bubble{max-width:75%;padding:12px 16px;border-radius:18px;font-size:13.5px;line-height:1.65;position:relative;}
.msg.ai .msg-bubble{background:var(--c-surface);border:1px solid var(--c-border);border-bottom-left-radius:4px;}
.msg.user .msg-bubble{background:linear-gradient(135deg, rgba(79,143,255,0.25), rgba(155,107,255,0.25));
  border:1px solid rgba(155,107,255,0.3);border-bottom-right-radius:4px;color:var(--c-text);}
.msg-bubble pre{background:rgba(0,0,0,0.4);border-radius:8px;padding:12px;font-family:var(--font-mono);font-size:12px;
  overflow-x:auto;margin:8px 0;border:1px solid var(--c-border);}
.msg-bubble code{font-family:var(--font-mono);font-size:12px;color:#9fc6ff;}
.chat-typing{display:flex;gap:5px;align-items:center;padding:4px 0;}
.chat-typing span{width:7px;height:7px;border-radius:50%;background:var(--teal);opacity:.3;animation:typingDot 1.2s ease-in-out infinite;}
.chat-typing span:nth-child(2){animation-delay:.2s;background:var(--blue);}
.chat-typing span:nth-child(3){animation-delay:.4s;background:var(--purple);}
@keyframes typingDot{0%,80%,100%{opacity:.2;transform:scale(.7)}40%{opacity:1;transform:scale(1)}}

#chat-input-wrap{padding:14px 20px;border-top:1px solid var(--c-border);background:rgba(0,0,0,0.2);
  backdrop-filter:var(--blur-sm);-webkit-backdrop-filter:var(--blur-sm);display:flex;flex-direction:column;gap:10px;}
.chat-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
.chat-tool-btn{padding:6px 12px;border-radius:50px;border:1px solid var(--c-border);background:var(--c-surface);
  color:var(--c-muted);font-size:11px;font-weight:600;cursor:pointer;transition:var(--trans);display:flex;align-items:center;gap:5px;}
.chat-tool-btn:hover{background:var(--c-surf2);color:var(--c-text);border-color:var(--c-border2);}
.chat-tool-btn.active{background:rgba(63,255,210,0.12);color:var(--teal);border-color:rgba(63,255,210,0.3);}
.chat-input-row{display:flex;gap:10px;align-items:flex-end;}
#chat-input{flex:1;background:rgba(0,0,0,0.35);border:1px solid var(--c-border);border-radius:16px;padding:12px 16px;
  color:var(--c-text);font-size:14px;outline:none;resize:none;line-height:1.5;max-height:140px;overflow-y:auto;transition:var(--trans);}
#chat-input:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(79,143,255,0.12);}
#chat-input::placeholder{color:var(--c-muted);}
#chat-send{width:44px;height:44px;border-radius:14px;border:none;flex-shrink:0;background:var(--grad-chat);color:#0a2a20;
  font-size:18px;font-weight:700;cursor:pointer;transition:var(--trans);display:flex;align-items:center;justify-content:center;
  box-shadow:0 2px 16px rgba(63,255,210,0.25);}
#chat-send:hover{transform:scale(1.07);box-shadow:0 4px 24px rgba(63,255,210,0.4);}
#chat-send:disabled{opacity:.5;transform:none;cursor:default;}
.chat-hint{font-size:11px;color:var(--c-dim);text-align:center;}

/* ══ TOAST ══ */
#toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(12px);background:rgba(18,18,32,0.95);
  backdrop-filter:var(--blur-glass);-webkit-backdrop-filter:var(--blur-glass);border:1px solid var(--c-border2);
  border-radius:50px;padding:10px 22px;font-size:13px;color:var(--c-text);opacity:0;pointer-events:none;z-index:9998;
  transition:all .3s;box-shadow:0 8px 32px rgba(0,0,0,0.4);max-width:90vw;text-align:center;}
#toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

#file-input{display:none;}
.hidden{display:none !important;}

@media (max-width:768px){
  .ed-panel,.chat-sidebar{display:none;}
  .ed-sidebar{width:50px;}
  .ed-tool{width:36px;height:36px;font-size:16px;}
  .hub-cards{flex-direction:column;align-items:center;}
  .hub-card{min-width:unset;max-width:100%;width:100%;}
}
@media (max-width:480px){
  .ed-sidebar{display:none;}
  .abt span{display:none;}
  .abt{padding:7px 10px;}
  #chat-input-wrap{padding:10px 12px;}
}
</style>
</head>
<body>
<div id="bg-layer"></div>

<!-- ██ CUTSCENE ██ -->
<div id="cutscene">
  <canvas id="cutscene-particles"></canvas>
  <div id="cutscene-content">
    <div class="cs-logo-ring" id="cs-ring"><div class="cs-logo-inner">A</div></div>
    <div class="cs-company" id="cs-company">A Officials</div>
    <div class="cs-tagline" id="cs-tagline">Creative AI · Est. 2025</div>
    <div class="cs-divider" id="cs-divider"></div>
    <div class="cs-product" id="cs-product">Introducing AI Studio — Create Without Limits</div>
    <div class="cs-loading" id="cs-loading"><div class="cs-dot"></div><div class="cs-dot"></div><div class="cs-dot"></div></div>
  </div>
  <button class="cs-skip" onclick="skipCutscene()">Skip ⏭</button>
</div>

<!-- ██ LOGIN ██ -->
<div id="login-screen">
  <div class="login-card">
    <div class="login-logo">
      <div class="login-logo-mark">A</div>
      <div><div class="login-logo-text">A Officials</div><div class="login-logo-sub">AI Studio</div></div>
    </div>
    <div class="demo-banner show" id="demo-banner">🔒 Your account is saved securely in this browser — 100% free, no server needed. Use the same browser to stay signed in.</div>
    <div class="login-tab-row">
      <button class="login-tab active" id="lt-signin" onclick="loginTab('signin')">Sign In</button>
      <button class="login-tab" id="lt-signup" onclick="loginTab('signup')">Create Account</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div>
        <div class="login-title" id="login-title">Welcome back</div>
        <div class="login-sub" id="login-sub">Sign in to your A Officials account</div>
      </div>
      <div class="login-fields">
        <div class="field-wrap" id="name-field" style="display:none;">
          <div class="field-label">Full Name</div>
          <input class="field-input" id="inp-name" type="text" placeholder="Your name"/>
        </div>
        <div class="field-wrap">
          <div class="field-label">Email</div>
          <input class="field-input" id="inp-email" type="email" placeholder="you@example.com"/>
        </div>
        <div class="field-wrap">
          <div class="field-label">Password</div>
          <input class="field-input" id="inp-pass" type="password" placeholder="••••••••"/>
        </div>
        <div class="field-error" id="login-error"></div>
      </div>
      <button class="login-btn" onclick="doLogin()" id="login-submit">Sign In →</button>
      <div class="login-divider"><span>or continue with</span></div>
      <div class="login-social">
        <button class="social-btn google" onclick="doGoogle()">
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
      </div>
      <div class="login-footer">
        <span id="login-switch-text">Don't have an account? </span>
        <a onclick="loginTab(currentLoginTab==='signin'?'signup':'signin')" id="login-switch-link">Create one</a>
      </div>
    </div>
  </div>
</div>

<!-- ██ HUB ██ -->
<div id="hub">
  <div class="hub-header">
    <div class="hub-greeting">Good to see you, <span id="hub-name">Creator</span>.</div>
    <div class="hub-sub">What are you building today?</div>
  </div>
  <div class="hub-cards">
    <div class="hub-card editor" onclick="openArea('editor')">
      <div class="hub-card-icon">🎨</div>
      <div class="hub-card-title">Studio Editor</div>
      <div class="hub-card-desc">Edit images and videos with real AI — background removal, upscaling, auto-enhance — running directly on your device. Like Photoshop + CapCut, powered by open-source AI.</div>
      <div class="hub-card-tags">
        <span class="hub-tag">Image Edit</span><span class="hub-tag">Video</span>
        <span class="hub-tag">AI Enhance</span><span class="hub-tag">FX</span><span class="hub-tag">Export</span>
      </div>
      <div class="hub-card-arrow">→</div>
    </div>
    <div class="hub-card chat" onclick="openArea('chat')">
      <div class="hub-card-icon">✦</div>
      <div class="hub-card-title">A GPT</div>
      <div class="hub-card-desc">Chat with A Officials' AI — write scripts, generate image prompts, get working code, ask anything. Your intelligent creative partner, always on.</div>
      <div class="hub-card-tags">
        <span class="hub-tag">AI Chat</span><span class="hub-tag">Scripts</span>
        <span class="hub-tag">Images</span><span class="hub-tag">Code</span>
      </div>
      <div class="hub-card-arrow">→</div>
    </div>
  </div>
  <div class="hub-footer">A Officials AI Studio · v2.1</div>
</div>

<!-- ██ TOPNAV ██ -->
<div id="topnav">
  <div class="nav-logo"><div class="nav-logo-mark">A</div><div class="nav-logo-text">A Officials</div></div>
  <div class="nav-sep"></div>
  <div class="nav-mode"><span id="nav-area-name">Studio</span><span class="nav-mode-badge" id="nav-area-badge">Editor</span></div>
  <div class="nav-right">
    <button class="nav-btn" onclick="goHub()">← Hub</button>
    <button class="nav-btn" onclick="exportFile()" id="nav-export">⬇ Export</button>
    <div style="position:relative;">
      <div class="nav-avatar" id="nav-avatar" onclick="toggleNavMenu()">A</div>
      <div class="nav-menu" id="nav-menu">
        <button class="nav-menu-item" id="nav-menu-name" style="font-weight:700;cursor:default;">Creator</button>
        <button class="nav-menu-item danger" onclick="doLogout()">Sign Out</button>
      </div>
    </div>
  </div>
</div>

<!-- ██ EDITOR AREA ██ -->
<div id="editor-area">
  <div class="ed-sidebar">
    <button class="ed-tool active" onclick="setTool(this,'select')">↖<span class="ed-tooltip">Select</span></button>
    <button class="ed-tool" onclick="setTool(this,'crop')">✂<span class="ed-tooltip">Crop</span></button>
    <button class="ed-tool" onclick="setTool(this,'brush')">🖌<span class="ed-tooltip">Brush</span></button>
    <button class="ed-tool" onclick="setTool(this,'text')">T<span class="ed-tooltip">Text</span></button>
    <div class="ed-sep"></div>
    <button class="ed-tool" onclick="setTool(this,'filter')">🎨<span class="ed-tooltip">Filters</span></button>
    <button class="ed-tool" onclick="setTool(this,'fx')">✨<span class="ed-tooltip">Special FX</span></button>
    <button class="ed-tool" onclick="setTool(this,'ai')">🤖<span class="ed-tooltip">AI Wand</span></button>
    <div class="ed-sep"></div>
    <button class="ed-tool" onclick="setTool(this,'cut')">⚡<span class="ed-tooltip">Cut/Trim</span></button>
    <button class="ed-tool" onclick="setTool(this,'audio')">🎵<span class="ed-tooltip">Audio</span></button>
  </div>

  <div class="ed-canvas-zone">
    <div class="ed-canvas-scroll">
      <div id="dropzone" onclick="if(!this.classList.contains('loaded')) document.getElementById('file-input').click()"
        ondragover="dzOver(event)" ondragleave="dzLeave(event)" ondrop="dzDrop(event)">
        <div id="dz-inner">
          <div class="dz-icon">🗂</div>
          <div class="dz-label">Drop your file here</div>
          <div class="dz-sub">Images · Videos · Code · Any format · All devices</div>
          <button class="dz-btn" onclick="event.stopPropagation();document.getElementById('file-input').click()">Browse Files</button>
        </div>
        <button class="dz-btn" id="dz-swap-btn" style="display:none;position:absolute;top:10px;right:10px;z-index:6;"
          onclick="event.stopPropagation();document.getElementById('file-input').click()">⤵ Load Different File</button>
        <img id="ed-img" alt=""/>
        <video id="ed-video" controls></video>
        <div id="ed-code-wrap"><textarea id="ed-code" spellcheck="false" placeholder="// Code loaded here — AI tools ready below."></textarea></div>
        <canvas id="ed-fx-canvas"></canvas>
        <div id="ed-progress-overlay"><div class="ed-spinner"></div><div id="ed-progress-text">Loading AI model...</div></div>
      </div>
    </div>

    <div id="ed-timeline-bar">
      <div id="ed-timeline" onclick="seekVid(event)"><div id="ed-tl-prog"></div><div id="ed-tl-handle"></div></div>
      <div class="tl-row"><span id="tl-cur">0:00</span><span id="tl-name" style="color:var(--c-dim)">No clip</span><span id="tl-dur">0:00</span></div>
    </div>

    <div id="ed-actions">
      <div class="ed-act-group" id="bar-img">
        <button class="abt primary" onclick="aiEdit('enhance')">✨ <span>AI Enhance</span></button>
        <button class="abt" onclick="aiEdit('remove-bg')">🔳 <span>Remove BG</span></button>
        <button class="abt" onclick="aiEdit('upscale')">⬆ <span>Upscale 4x</span></button>
        <button class="abt" onclick="aiEdit('colorize')">🌈 <span>Colorize</span></button>
        <div class="ed-act-sep"></div>
        <button class="abt" onclick="runFX('glitch')">⚡ <span>Glitch</span></button>
        <button class="abt" onclick="runFX('particles')">✦ <span>Particles</span></button>
        <button class="abt" onclick="runFX('vhs')">📼 <span>VHS</span></button>
        <button class="abt" onclick="runFX('chromatic')">🌈 <span>Chromatic</span></button>
      </div>
      <div class="ed-act-group hidden" id="bar-vid">
        <button class="abt primary" onclick="aiEdit('caption')">💬 <span>AI Captions</span></button>
        <button class="abt" onclick="aiEdit('trim')">✂ <span>Smart Trim</span></button>
        <button class="abt" onclick="aiEdit('subtitle')">📄 <span>Subtitles</span></button>
        <div class="ed-act-sep"></div>
        <button class="abt" onclick="runFX('vhs')">📼 <span>VHS</span></button>
        <button class="abt" onclick="runFX('scanlines')">📺 <span>Scanlines</span></button>
      </div>
      <div class="ed-act-group hidden" id="bar-code">
        <button class="abt primary" onclick="aiCode('explain')">🤖 <span>Explain</span></button>
        <button class="abt" onclick="aiCode('fix')">🔧 <span>Fix Bugs</span></button>
        <button class="abt" onclick="aiCode('optimize')">⚡ <span>Optimize</span></button>
        <button class="abt" onclick="aiCode('document')">📝 <span>Add Docs</span></button>
        <button class="abt" onclick="aiCode('tests')">✅ <span>Write Tests</span></button>
        <button class="abt" onclick="aiCode('refactor')">♻ <span>Refactor</span></button>
      </div>
    </div>
  </div>

  <div class="ed-panel">
    <div class="ed-panel-hd">🎛 Controls</div>
    <div class="ed-panel-body">
      <div class="panel-block">
        <div class="panel-block-hd">Adjustments</div>
        <div class="panel-block-body">
          <div class="sl-row"><span class="sl-label">Brightness</span><input type="range" min="-100" max="100" value="0" oninput="adj('brightness',this.value,this)"/><span class="sl-val">0</span></div>
          <div class="sl-row"><span class="sl-label">Contrast</span><input type="range" min="-100" max="100" value="0" oninput="adj('contrast',this.value,this)"/><span class="sl-val">0</span></div>
          <div class="sl-row"><span class="sl-label">Saturation</span><input type="range" min="-100" max="100" value="0" oninput="adj('saturation',this.value,this)"/><span class="sl-val">0</span></div>
          <div class="sl-row"><span class="sl-label">Hue</span><input type="range" min="-180" max="180" value="0" oninput="adj('hue',this.value,this)"/><span class="sl-val">0</span></div>
          <div class="sl-row"><span class="sl-label">Blur</span><input type="range" min="0" max="20" value="0" oninput="adj('blur',this.value,this)"/><span class="sl-val">0</span></div>
        </div>
      </div>
      <div class="panel-block">
        <div class="panel-block-hd">Filter Presets</div>
        <div class="panel-block-body">
          <div class="preset-chips">
            <button class="chip active" onclick="preset('none',this)">None</button>
            <button class="chip" onclick="preset('vivid',this)">Vivid</button>
            <button class="chip" onclick="preset('fade',this)">Fade</button>
            <button class="chip" onclick="preset('film',this)">Film</button>
            <button class="chip" onclick="preset('cool',this)">Cool</button>
            <button class="chip" onclick="preset('warm',this)">Warm</button>
            <button class="chip" onclick="preset('noir',this)">Noir</button>
            <button class="chip" onclick="preset('neon',this)">Neon</button>
            <button class="chip" onclick="preset('sepia',this)">Sepia</button>
          </div>
        </div>
      </div>
      <div class="panel-block">
        <div class="panel-block-hd">Special FX</div>
        <div class="panel-block-body">
          <div class="fx-chips">
            <button class="chip" onclick="runFX('glitch')">⚡ Glitch</button>
            <button class="chip" onclick="runFX('vhs')">📼 VHS</button>
            <button class="chip" onclick="runFX('particles')">✦ Particles</button>
            <button class="chip" onclick="runFX('scanlines')">📺 Scan</button>
            <button class="chip" onclick="runFX('chromatic')">🌈 RGB</button>
            <button class="chip" onclick="stopFX()">✕ Stop</button>
          </div>
          <div class="sl-row"><span class="sl-label">Intensity</span><input type="range" min="0" max="100" value="60" oninput="fxIntensity=this.value/100;this.nextElementSibling.textContent=this.value"/><span class="sl-val">60</span></div>
        </div>
      </div>
      <div class="panel-block">
        <div class="panel-block-hd">AI Assistant</div>
        <div class="panel-block-body">
          <textarea class="ai-box-in" id="panel-ai-input" rows="3" placeholder="Ask AI to edit your file...&#10;e.g. 'Make this look cinematic'"></textarea>
          <button class="abt primary" style="width:100%;justify-content:center;" onclick="panelAI()">✦ Run AI</button>
          <div id="panel-ai-result"></div>
          <div class="engine-tag" id="engine-tag">Engine: real in-browser AI (free) + Claude for chat/code</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ██ CHAT AREA ██ -->
<div id="chat-area">
  <div class="chat-sidebar">
    <button class="chat-new-btn" onclick="newChat()">＋ New Chat</button>
    <div class="chat-hist-label">Recent</div>
    <div id="chat-history"></div>
    <div class="chat-sidebar-btm">
      <div class="chat-hist-label" style="margin-bottom:4px">Mode</div>
      <button class="chat-mode-chip active" id="mode-general" onclick="setChatMode('general',this)">💬 General</button>
      <button class="chat-mode-chip" id="mode-script" onclick="setChatMode('script',this)">📜 Scriptwriter</button>
      <button class="chat-mode-chip" id="mode-image" onclick="setChatMode('image',this)">🖼 Image Gen</button>
      <button class="chat-mode-chip" id="mode-code" onclick="setChatMode('code',this)">💻 Coder</button>
    </div>
  </div>
  <div class="chat-main">
    <div id="chat-messages"></div>
    <div id="chat-input-wrap">
      <div class="chat-toolbar">
        <button class="chat-tool-btn" onclick="document.getElementById('file-input').click()">📎 Attach</button>
        <button class="chat-tool-btn" onclick="insertTemplate('script')">📜 Script</button>
        <button class="chat-tool-btn" onclick="insertTemplate('image')">🖼 Image</button>
      </div>
      <div class="chat-input-row">
        <textarea id="chat-input" rows="1" placeholder="Message A GPT..." onkeydown="chatKey(event)" oninput="autoGrow(this)"></textarea>
        <button id="chat-send" onclick="sendChat()">↑</button>
      </div>
      <div class="chat-hint">A GPT by A Officials · AI can make mistakes</div>
    </div>
  </div>
</div>

<input type="file" id="file-input" accept="*/*" onchange="loadFile(event)"/>
<div id="toast"></div>

<script src="config.js"></script>
<script src="ai-engine.js"></script>
<script src="app.js"></script>
</body>
</html>
