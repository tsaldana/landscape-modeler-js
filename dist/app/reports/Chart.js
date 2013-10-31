/*!
 *  landscape-modeler-js
 *  @version 0.0.1
 *  @author Tom Wayson <twayson@esri.com> (http://tomwayson.com)
 *
 *  A JavaScript web application for designing, running, and saving weighted overlay models using the Esri ArcGIS API for JavaScript and ArcGIS Server image services.
 */
define(["dojo/_base/declare","dijit/_WidgetBase","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin","dojo/text!./templates/Chart.html","dojo/i18n!../nls/resources","dojo/_base/lang","dojo/_base/array","dojo/_base/Color","dojo/topic","dojo/dom-style","dojo/dom-class","dojo/dom-construct","dojo/on","dojo/Evented","dojo/store/Memory","dojo/store/Observable","dijit/registry","dijit/Tooltip","dojox/charting/Chart","dojox/charting/Theme","dojox/charting/widget/Legend","dojox/charting/plot2d/Pie","dojox/charting/plot2d/ClusteredColumns","dojox/charting/action2d/Magnify","dojox/charting/action2d/Tooltip","dojox/charting/action2d/MoveSlice","dojox/charting/StoreSeries","esri/map","dojox/charting/axis2d/Default","dojox/charting/plot2d/Default"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B){var C=a([b,c,d,o],{appContext:null,i18n:f,templateString:e,header:null,type:"Pie",_type:null,chart:!1,legend:!1,_theme:null,_strokeStyle:null,_shadow:null,data:null,_newData:null,dataStore:null,keyType:null,dataType:"area",_unit:" Acres",fPolygonLayer:null,selectedFieldName:null,postCreate:function(){this.inherited(arguments),this._type="Donut"===this.type?"Pie":this.type,this.header?this.chartTitleNode.innerHTML=this.header:k.set(this.chartTitleNode,"display","none"),l.add(this.chartContainer,this.type),"columns"===this.type.toLowerCase()&&(this._strokeStyle={color:"#555",width:1}),this._theme=new dojox.charting.Theme({colors:["#68C6E6","#FA916C","#9ADB70","#EB490B","#F2D780","#E44960"]}),this._theme.chart.fill="transparent",this._theme.plotarea.fill="transparent",this._create(this.type.toLowerCase())},_create:function(a){this.chart=new t(this.chartContainerNode),this.chart.setTheme(this._theme);var b={type:this._type,labels:!1,stroke:this._strokeStyle};if("donut"===a&&(b.startAngle=90),"columns"===a&&(b.gap=4,b.maxBarSize=25,this.data)){var c=127,d=this.data.dataset.length;d>=7?(b.gap=1,c=202):d>4&&7>d&&(c=127+25*(d-4)),this._resizeColumnsContainer(c)}switch(this.chart.addPlot("default",b),a){case"pie":new A(this.chart,"default");break;case"donut":k.set(this.donutChartValueNode,"display","block"),new y(this.chart,"default",{scale:1.1}),new z(this.chart,"default");break;case"columns":this.chart.addAxis("x",{type:"Invisible",fixLower:"minor",fixUpper:"minor",natural:!0}).addAxis("y",{type:"Invisible",vertical:!0,fixLower:"minor",fixUpper:"minor",includeZero:!0}),new z(this.chart,"default")}this._newData=this._createData(a,this.data),this.dataStore=q(new p({idProperty:"name",data:this._newData})),this.chart.addSeries("",new B(this.dataStore,{query:{}},g.hitch(this,this._valueTrans))),this.chart.render(),this._connectChartEvents(),"area"==this.dataType?this.own(j.subscribe("/charts/area/Refreshed",g.hitch(this,function(a,b){this.data=b.data,this._refresh(b.removedFieldValues,b.data)}))):"count"==this.dataType&&this.own(j.subscribe("/charts/histogram/Refreshed",g.hitch(this,function(a,b){console.log(b),this.data=b.data,b.data&&(b.data.dataset?this._refresh(b.removedFieldValues,b.data):this._refresh(b.removedFieldValues,null)),this.chartTitleNode.innerHTML=b.title}))),console.log(this.type+"chart added")},_valueTrans:function(a){var b,c=a.value;return c=c>1e4?(c/1e3).toFixed(2)+"K":c.toFixed(0),b="Pie"===this.type?a.name+": "+(100*a.percentage).toFixed(2)+"%":a.name+": ~"+c+this._unit,{text:a.name,y:a.value,fill:a.fill,tooltip:b}},_createData:function(a,b){var c;if(b)if("columns"===a)c=h.map(b.dataset,g.hitch(this,function(a){return{name:a.name,value:a.value,fill:b.colors[a.name]}}));else{for(var d=0,e=0;e<b.dataset.length;e++)d+=b.dataset[e].value;if("pie"===a)c=h.map(b.dataset,g.hitch(this,function(a){return{name:a.name,value:a.value,percentage:a.value/d,fill:b.colors[a.name]}}));else{c=[];var f,i=!1;h.forEach(b.dataset,g.hitch(this,function(a,e){if(a.name===this.keyType&&(i=!0,f=b.colors?b.colors[a.name]:this._theme.colors[e],d)){var g=(100*(a.value/d)).toFixed(1);this.donutChartValueNode.innerHTML=g+"%",c.push({name:a.name,value:a.value,fill:f,tooltip:a.name+": "+g+"%"});var h=d-a.value;c.push({name:"rest",value:h,fill:"transparent",tooltip:"rest: "+(100-g)+"%"})}})),i||(this.donutChartValueNode.innerHTML="0%",c.push({name:this.keyType,value:0,fill:"transparent",tooltip:""}),c.push({name:"rest",value:d,fill:"transparent",tooltip:"rest: 100%"}))}}return c},_refresh:function(a,b){b&&"Columns"==this.type,b?(h.forEach(a,g.hitch(this,function(a){"Donut"!=this.type&&this.dataStore.remove(a)})),this._newData=this._createData(this.type.toLowerCase(),this.data),h.forEach(this._newData,g.hitch(this,function(a){this.dataStore.put(a)}))):("Donut"==this.type&&(this.dataStore.remove(this.keyType),this.dataStore.remove("rest"),this.donutChartValueNode.innerHTML="0%"),h.forEach(this._newData,g.hitch(this,function(a){this.dataStore.remove(a.name)})))},_resizeColumnsContainer:function(a){a+="px",k.set(this.chartContainerNode,"width",a),this.chart.resize(),k.set(this.chartTitleNode,"max-width",a)},_connectChartEvents:function(){var a,b=this;this.chart.connectToPlot("default",g.hitch(this,function(c){var d=c.type;if("onplotreset"!=d){var e=(c.shape,c.run),f=e.data[c.index].text;if("onclick"==d){if("area"==this.dataType){var i=[],j=this.fPolygonLayer;h.forEach(j.graphics,g.hitch(this,function(a){a.attributes[this.selectedFieldName]===f&&i.push(a.geometry)})),b.emit("type-select",{type:f,geometries:i})}}else"onmouseover"==d?"Pie"===this.type&&(a||(a=m.create("div",{"class":"pieTooltip"},this.domNode)),a.innerHTML=e.data[c.index].tooltip,k.set(a,{display:"",top:c.event.layerY-a.clientHeight+"px",left:c.event.layerX-a.clientWidth/2+"px"})):"onmouseout"==d&&"Pie"===this.type&&k.set(a,"display","none")}}))}});return C});