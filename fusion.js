"use strict";
(() => {
const $=id=>document.getElementById(id);
const root=$("result"),form=$("profile");if(!root||!form)return;
const signNames=["摩羯","水瓶","雙魚","牡羊","金牛","雙子","巨蟹","獅子","處女","天秤","天蠍","射手","摩羯"];
const western=["土","風","水","火","土","風","水","火","土","風","水","火","土"];
const breaks=[20,19,21,20,21,21,23,23,23,23,22,22];
const animals=["猴","雞","狗","豬","鼠","牛","虎","兔","龍","蛇","馬","羊"];
const animalElements={"猴":"金","雞":"金","狗":"土","豬":"水","鼠":"水","牛":"土","虎":"木","兔":"木","龍":"土","蛇":"火","馬":"火","羊":"土"};
const themes={1:["開創","自主與行動"],2:["連結","關係與協作"],3:["表達","創造與溝通"],4:["奠基","計畫與紀律"],5:["探索","變動與適應"],6:["承擔","照顧與責任"],7:["沉澱","研究與省思"],8:["推進","資源與成果"],9:["收整","回顧與整合"]};
const paths={1:"自主開創",2:"合作協調",3:"創意表達",4:"穩定實踐",5:"自由探索",6:"責任關懷",7:"觀察思辨",8:"目標管理",9:"理想整合",11:"直覺啟發",22:"宏觀建設",33:"支持陪伴"};
const stages=[[0,12,"童年","基礎學習、家庭支持與興趣養成"],[13,19,"青春期","同儕互動、自我認同與界線"],[20,29,"成年探索","學習、工作、關係與獨立能力"],[30,39,"職涯定位","專業累積、關係磨合與財務紀律"],[40,49,"整合轉型","領導、家庭協調與長期資源管理"],[50,59,"成熟傳承","角色調整、知識傳承與健康習慣"],[60,69,"退休轉銜","生活節奏、社會參與及財務安排"],[70,89,"生活品質","自主生活、人際支持與興趣延續"]];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sum=n=>String(n).split("").reduce((a,b)=>a+Number(b),0);
function reduce(n,master){while(n>9&&!(master&&[11,22,33].includes(n)))n=sum(n);return n}
function get(){
const match=/^(\d{4})-(\d\d)-(\d\d)$/.exec($("birth-date").value);if(!match)return null;
const y=+match[1],m=+match[2],d=+match[3],test=new Date(Date.UTC(y,m-1,d));
if(test.getUTCFullYear()!==y||test.getUTCMonth()!==m-1||test.getUTCDate()!==d)return null;
const ix=d>=breaks[m-1]?m:m-1,ln=reduce(sum(match[1]+match[2]+match[3]),true);
let lunar=null;try{
const parts=new Intl.DateTimeFormat("en-u-ca-chinese",{year:"numeric",month:"numeric",day:"numeric",timeZone:"UTC"}).formatToParts(new Date(Date.UTC(y,m-1,d,12)));
const val=k=>parts.find(x=>x.type===k)?.value;const mon=val("month");
lunar={year:Number(val("relatedYear")||val("year")),month:parseInt(mon,10),day:Number(val("day")),leap:/bis|leap|閏/i.test(mon)};
if(!(lunar.year>0&&lunar.month>=1&&lunar.month<=12))lunar=null;
}catch{}
const animal=lunar?animals[(lunar.year%12+12)%12]:null;
return{y,m,d,ln,date:$("birth-date").value,sign:signNames[ix]+"座",element:western[ix],lunar,animal,animalElement:animal?animalElements[animal]:null};
}
function make(tag,cls,text,parent=root){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;parent.append(e);return e}
let selectedYear=new Date().getFullYear(),enabled=false;
function yearNumber(p,y){return reduce(sum(String(p.m)+String(p.d)+String(y)),false)}
function show(){
const p=get();if(!p)return;
selectedYear=Math.max(p.y,Math.min(selectedYear,Math.min(2100,p.y+89)));
document.querySelectorAll("[data-mode]").forEach(b=>b.classList.remove("active"));
$("current-title").textContent="✦ 七大智慧交叉分析 · 人生與流年";
root.replaceChildren();
const card=(title,text)=>{const box=make("section","fusion-card");make("h4","",title,box);make("p","",text,box)};
const summary=make("div","summary");
for(const [k,v] of [["生命靈數",p.ln],["太陽星座",p.sign],["農曆生肖",p.animal||"待換算"]]){const m=make("div","metric",undefined,summary);make("small","",k,m);make("strong","",String(v),m)}
make("p","fusion-sub","填寫一次生日，整合可計算的生命靈數、太陽星座與農曆生肖；並呈現各命理傳統之間的異同。尚未完成的專業排盤不會用虛構結果填補。");
const personal=yearNumber(p,selectedYear),ct=themes[personal];
card("跨系統對照", "生命靈數 "+p.ln+" 的象徵主題是「"+paths[p.ln]+"」；西洋太陽星座 "+p.sign+" 屬「"+p.element+"」元素。"+(p.animal?"農曆生肖 "+p.animal+" 使用「"+p.animalElement+"」五行意象。":"尚無可用的農曆生肖換算。")+"兩者五行與西洋四元素源自不同文化，不可以視為相同的測量系統。");
const chooser=make("div","fusion-select");make("label","","選擇流年",chooser);const sel=make("select","",undefined,chooser);sel.setAttribute("aria-label","選擇流年");for(let y=Math.max(1900,p.y);y<=Math.min(2100,p.y+89);y++){let o=make("option","",y+" 年",sel);o.value=y}sel.value=selectedYear;sel.addEventListener("change",()=>{selectedYear=Number(sel.value);show()});
const main=make("section","fusion-feature");make("h3","",selectedYear+" 年度命理主題",main);make("div","fusion-num",String(personal),main);make("h4","",ct[0]+" · "+ct[1],main);
make("p","","個人年 "+personal+" 是生日月份、日期與分析年份數字相加後縮減的結果。可以以「"+ct[1]+"」作為今年回顧、設定目標及討論選擇的象徵主題；它不是年度吉凶或發生機率的科學預測。",main);
const age=selectedYear-p.y,stage=stages.find(x=>age>=x[0]&&age<=x[1])||stages.at(-1);
card("當年人生階段 · 約 "+age+" 歲",stage[2]+"：可關注 "+stage[3]+"。此為一般人生議題，不是對個人經歷的預言。");
make("h3","fusion-heading","從小到大的人生時間軸");
const timeline=make("div","fusion-stages");stages.forEach(([a,b,title,focus])=>{let button=make("button","fusion-stage"+(age>=a&&age<=b?" current":""),undefined,timeline);button.type="button";make("b","",title+"｜"+a+"–"+b+" 歲",button);make("small","",(p.y+a)+"–"+(p.y+b)+" 年",button);make("span","",focus,button);button.addEventListener("click",()=>{selectedYear=p.y+a;show()})});
make("h3","fusion-heading","逐年流年主題");
const annual=make("div","fusion-years"),start=Math.max(p.y,Math.min(selectedYear-2,p.y+80));
for(let y=start;y<=Math.min(start+9,p.y+89,2100);y++){let n=yearNumber(p,y),b=make("button","fusion-year"+(y===selectedYear?" current":""),undefined,annual);b.type="button";make("strong","",String(y),b);make("small","","個人年 "+n,b);make("span","",themes[n][0],b);b.addEventListener("click",()=>{selectedYear=y;show()})}
make("h3","fusion-heading","七大命理的資料完整性");
const statuses=[
["紫微斗數",p.lunar?"可依農曆月和時辰定位十二宮；十四主星、大限與流年未完成":"農曆換算不可用，尚未定位"],
["姓名學","需指定字典及姓名筆畫後才能進行可信的五格對照"],
["五行",p.animalElement?"本版僅有生肖五行意象，尚未完成四柱、日主及喜用神":"尚未完成四柱八字"],
["西洋星座","太陽星座採日期近似值，完整本命星盤尚未完成"],
["生肖",p.animal?"依農曆新年判定為 "+p.animal:"農曆換算不可用"],
["易經","起卦屬個別隨機文化體驗，不推定為出生資訊的必然結果"],
["數字命理","已計算生命靈數 "+p.ln+" 與逐年個人年數字"]
];
for(const [k,v] of statuses){const b=make("div","fusion-status");make("b","",k,b);make("span","",v,b)}
const warning=make("div","callout","本版已將可計算資訊統整成一份報告，但不是七套完整專業命盤。流年與生命階段只呈現傳統文化象徵及一般反思方向，不能當作未來發生事件、健康、財富、婚姻或升遷的可靠預測。");
const copy=make("button","btn","複製分析摘要");copy.type="button";copy.addEventListener("click",async()=>{const text=["天機玄府綜合分析",p.date,p.sign,p.animal||"生肖未定","生命靈數 "+p.ln,selectedYear+" 年個人年 "+personal+"："+ct[0],stage[2]+"："+stage[3],warning.textContent].join("\n");try{await navigator.clipboard.writeText(text);copy.textContent="已複製"}catch{copy.textContent="複製功能受限"}});
}
const style=document.createElement("style");style.textContent='.fusion-sub{font-size:12px;line-height:1.8;color:#c7b9d5}.fusion-card{margin:13px 0;border:1px solid #baa07866;border-radius:12px;padding:13px;background:#10132b}.fusion-card h4,.fusion-heading{font:22px serif;color:#f1d29b;margin:14px 0 8px}.fusion-card p{line-height:1.85;color:#d5c9db;font-size:13px}.fusion-select{display:flex;gap:15px;align-items:center;margin:17px 0}.fusion-select label{margin:0}.fusion-select select{width:165px}.fusion-feature{text-align:center;border:1px solid #e4c38f;border-radius:15px;padding:17px;background:radial-gradient(circle at center,#453168,#10142d)}.fusion-feature h3,.fusion-feature h4{color:#f6d49f}.fusion-num{font:65px serif;color:#ffe2a2;text-shadow:0 0 25px #e4ae6d}.fusion-feature p{color:#e0d5e4;line-height:1.85}.fusion-stages{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.fusion-stage,.fusion-year{background:#12172e;border:1px solid #a18b9a9b;color:#e7dfef;border-radius:9px;padding:11px;text-align:left}.fusion-stage{display:flex;flex-direction:column;gap:4px}.fusion-stage b{color:#e9ca97}.fusion-stage small{font-size:10px;color:#bfb5cf}.fusion-stage span{font-size:12px}.fusion-stage.current,.fusion-year.current{border-color:#ffe0a2;background:#342b50}.fusion-years{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.fusion-year{text-align:center;display:grid;gap:4px;padding:9px 3px}.fusion-year strong{color:#f4d397}.fusion-year small{font-size:10px}.fusion-year span{font-size:11px}.fusion-status{display:grid;grid-template-columns:95px 1fr;gap:9px;border-bottom:1px solid #9c8cac55;padding:10px 0;font-size:12px}.fusion-status b{color:#f0cf95}.fusion-status span{color:#d0c4dd}@media(max-width:600px){.fusion-stages{grid-template-columns:1fr}.fusion-years{grid-template-columns:repeat(2,1fr)}}';document.head.append(style);
const launch=document.createElement("button");launch.className="btn";launch.type="button";launch.textContent="✦ 一鍵生成七大智慧整合報告";launch.style.cssText="width:100%;margin-top:12px";form.after(launch);launch.addEventListener("click",()=>{enabled=true;show()});
const link=document.createElement("button");link.className="btn";link.type="button";link.textContent="✦ 綜合流年與人生分析";link.style.cssText="display:block;margin:20px auto";$("module-list").after(link);link.addEventListener("click",()=>{enabled=true;show();$("analysis").scrollIntoView({behavior:"smooth"})});
form.addEventListener("submit",()=>{if(enabled)setTimeout(show,0)});
})();