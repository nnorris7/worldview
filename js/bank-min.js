SOTE.namespace("SOTE.widget.Bank");SOTE.widget.Bank.prototype=new SOTE.widget.Component;SOTE.widget.Bank=function(a,b){this.container=document.getElementById(a);if(this.container==null){this.setStatus("Error: element '"+a+"' not found!",true);return}this.id=a;this.containerId=a;if(b===undefined){b={}}if(b.title===undefined){b.title="My Bank"}if(b.categories===undefined){b.categories=["Category 1","Category 2"]}if(b.callback===undefined){b.callback=null}if(b.state===undefined){b.state="geographic"}this.values=null;this.state=b.state;this.selected=b.selected;this.dataSourceUrl=b.dataSourceUrl;this.title=b.title;this.callback=b.callback;this.selector=b.selector;this.meta=new Object;this.buildMetaDone=false;this.categories=b.categories;this.initRenderComplete=false;this.dataSourceUrl=b.dataSourceUrl;this.statusStr="";this.init()};SOTE.widget.Bank.prototype.buildMeta=function(a,b){SOTE.util.getJSON("data/"+this.state+"_"+this.dataSourceUrl,{self:this,callback:a,val:b},SOTE.widget.Bank.handleMetaSuccess,SOTE.widget.Bank.handleUpdateFailure)};SOTE.widget.Bank.handleMetaSuccess=function(f,a,g,d){var b=d.self;for(var e in f){if(e!="palettes"){for(var c=0;c<f[e].length;c++){b.meta[f[e][c].value]={label:f[e][c].label,sublabel:f[e][c].sublabel}}}}for(var e in f.palettes){b.meta[e].units=f.palettes[e].units;b.meta[e].min=f.palettes[e].min;b.meta[e].max=f.palettes[e].max;b.meta[e].palette=f.palettes[e].palette}if(d.callback){d.callback({self:b,val:d.val})}else{b.values=null;b.values=b.unserialize(b.selected[b.state]);b.render();b.fire()}b.buildMetaDone=true};SOTE.widget.Bank.prototype.init=function(){this.buildMeta();if(REGISTRY){REGISTRY.register(this.id,this)}else{alert("No REGISTRY found!  Cannot register Bank!")}};SOTE.widget.Bank.prototype.render=function(){this.container.innerHTML="";var b=document.createElement("div");b.setAttribute("class","bank");var h=document.createElement("div");var n=document.createElement("h2");n.innerHTML=this.title;var d=document.createElement("a");d.setAttribute("id","callSelectorLink");d.setAttribute("class","callSelectorLink");h.appendChild(n);h.appendChild(d);b.appendChild(h);$("#"+this.id).delegate(".callSelectorLink","click",{selector:this.selector},this.callback);for(var k=0;k<this.categories.length;k++){var f=this.categories[k].replace(/\s/g,"");var c=document.createElement("ul");c.setAttribute("id",f.toLowerCase());c.setAttribute("class",this.id+"category category");var q=document.createElement("li");var a=document.createElement("h3");a.setAttribute("class","head");a.innerHTML=this.categories[k];q.appendChild(a);c.appendChild(q);if(this.values!==null&&this.values[f.toLowerCase()]){for(var g=0;g<this.values[f.toLowerCase()].length;g++){var p=document.createElement("li");p.setAttribute("id",f.toLowerCase()+"-"+this.values[f.toLowerCase()][g].value);p.setAttribute("class",this.id+"item item");p.innerHTML="<a><img class='close' id='"+this.values[f.toLowerCase()][g].value.replace(/:/g,"colon")+"' src='images/close.png' /></a>";if(this.meta!==null&&this.meta[this.values[f.toLowerCase()][g].value]){p.innerHTML+="<h4>"+this.meta[this.values[f.toLowerCase()][g].value].label+"</h4>";p.innerHTML+="<p>"+this.meta[this.values[f.toLowerCase()][g].value].sublabel+"</p>";var e=this.meta[this.values[f.toLowerCase()][g].value];if(e.palette){var l="<span class='palette'><span class='p-min' style='margin-right:10px;'>"+e.min+"</span><canvas id='canvas"+this.values[f.toLowerCase()][g].value+"' width=100px height=14px'></canvas><span class='p-max' style='margin-left:10px;'>"+e.max+"</span>";if(e.units&&e.units!=""){l+="<span class='units' style='margin-left:3px;'>("+e.units+")</span></span>"}p.innerHTML+=l}}else{p.innerHTML+="<h4>"+this.values[f.toLowerCase()][g].value+"</h4>"}c.appendChild(p)}}b.appendChild(c)}this.container.appendChild(b);this.renderCanvases();var o=document.createElement("a");o.setAttribute("class","accordionToggler atcollapse");this.isCollapsed=false;this.container.appendChild(o);$(".accordionToggler").bind("click",{self:this},SOTE.widget.Bank.toggle);$("#"+this.id).delegate(".close","click",{self:this},SOTE.widget.Bank.removeValue);$("."+this.id+"category").sortable({items:"li:not(.head)"});$("."+this.id+"category li").disableSelection();$("."+this.id+"category").bind("sortstop",{self:this},SOTE.widget.Bank.handleSort);if((this.initRenderComplete===false)&&REGISTRY){this.initRenderComplete=true;REGISTRY.markComponentReady(this.id)}};SOTE.widget.Bank.prototype.renderCanvases=function(){for(var l=0;l<this.categories.length;l++){var f=this.categories[l].replace(/\s/g,"");if(this.values!==null&&this.values[f.toLowerCase()]){for(var h=0;h<this.values[f.toLowerCase()].length;h++){var d=this.values[f.toLowerCase()][h].value;var e=this.meta[this.values[f.toLowerCase()][h].value];if(e.palette){var a=100/e.palette.length;var c=document.getElementById("canvas"+d);var b=c.getContext("2d");for(var g=0;g<e.palette.length;++g){b.fillStyle="rgba("+e.palette[g]+")";b.fillRect(a*g,0,a,14)}}}}}};SOTE.widget.Bank.toggle=function(c,b){var a=c.data.self;if(a.isCollapsed){$(".accordionToggler").removeClass("atexpand").addClass("atcollapse");$(".accordionToggler").attr("title","Hide Products");$(".bank").css("display","block");a.isCollapsed=false}else{$(".accordionToggler").removeClass("atcollapse").addClass("atexpand");$(".accordionToggler").attr("title","Show Products");$(".bank").css("display","none");a.isCollapsed=true}};SOTE.widget.Bank.handleSort=function(f,d){var a=f.data.self;a.values=new Object;for(var b=0;b<a.categories.length;b++){var c=a.categories[b].replace(/\s/g,"");c=c.toLowerCase();a.values[c]=new Array();jQuery('li[id|="'+c+'"]').each(function(){var e=jQuery(this);var i=e.attr("id");var g=i.split("-");var h=g.splice(0,1);h=g.join("-");a.values[c].push({value:h})})}a.fire()};SOTE.widget.Bank.removeValue=function(f){var a=f.data.self;var g=f.target.id.replace(/colon/g,":");for(var c=0;c<a.categories.length;c++){var d=a.categories[c].replace(/\s/g,"");d=d.toLowerCase();for(var b=0;b<a.values[d].length;b++){if(a.values[d][b].value==g){a.values[d].splice(b,1)}}}var h=g.replace(/:/g,"colon");$("#"+a.id+" #"+h).parent().parent().remove();a.fire()};SOTE.widget.Bank.prototype.fire=function(){if(REGISTRY){REGISTRY.fire(this)}else{alert("No REGISTRY found! Cannot fire to REGISTRY from Bank!")}};SOTE.widget.Bank.prototype.setValue=function(a){this.values=this.unserialize(a);this.render();this.fire()};SOTE.widget.Bank.prototype.getValue=function(){var a=this.serialize(this.values);return this.id+"="+a};SOTE.widget.Bank.prototype.serialize=function(a){var e="";for(var c=0;c<this.categories.length;c++){if(c>0){e+="~"}var d=this.categories[c].replace(/\s/g,"");d=d.toLowerCase();e+=d;if(a[d]){for(var b=0;b<a[d].length;b++){e+="."+a[d][b].value}}}return e};SOTE.widget.Bank.prototype.unserialize=function(d){var f=new Object;var b=d.split("~");for(var e=0;e<b.length;e++){var a=b[e].split(".");f[a[0]]=new Array;for(var c=1;c<a.length;c++){f[a[0]].push({value:a[c]})}}return f};SOTE.widget.Bank.prototype.updateComponent=function(b){var a=(b===undefined)?"":b;SOTE.widget.Bank.handleUpdateSuccess(this,a)};SOTE.widget.Bank.handleUpdateSuccess=function(b,a){if(SOTE.util.extractFromQuery("switch",a)==b.state){var c=SOTE.util.extractFromQuery("selectorbox",a);b.values=b.unserialize(c);b.render();b.fire()}else{b.state=SOTE.util.extractFromQuery("switch",a);b.buildMeta()}};SOTE.widget.Bank.handleUpdateFailure=function(d,a,c,b){alert("Failed to load data accessor: "+c)};SOTE.widget.Bank.prototype.loadFromQuery=function(a){var b=SOTE.util.extractFromQuery("switch",a);if(this.state!=b){this.state=b;this.buildMeta(SOTE.widget.Bank.loadValue,SOTE.util.extractFromQuery(this.id,a))}else{this.sleep(SOTE.util.extractFromQuery(this.id,a))}};SOTE.widget.Bank.prototype.sleep=function(a){setTimeout(SOTE.widget.Bank.loadValue,100,{self:this,val:a})};SOTE.widget.Bank.loadValue=function(a){if(a.self.buildMetaDone==true){a.self.setValue(a.val)}else{a.self.sleep(a.val)}};SOTE.widget.Bank.prototype.validate=function(){var a=true;return a};SOTE.widget.Bank.prototype.setDataSourceUrl=function(a){this.dataSourceUrl=a};SOTE.widget.Bank.prototype.getDataSourceUrl=function(){return this.dataSourceUrl};SOTE.widget.Bank.prototype.setStatus=function(a){this.statusStr=a};SOTE.widget.Bank.prototype.getStatus=function(){return this.statusStr};