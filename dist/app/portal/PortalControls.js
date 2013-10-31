/*!
 *  landscape-modeler-js
 *  @version 0.0.1
 *  @author Tom Wayson <twayson@esri.com> (http://tomwayson.com)
 *
 *  A JavaScript web application for designing, running, and saving weighted overlay models using the Esri ArcGIS API for JavaScript and ArcGIS Server image services.
 */
define(["dojo/_base/declare","dojo/_base/lang","dojo/_base/array","dojo/on","dojo/Evented","dojo/Deferred","dijit/_WidgetBase","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin","esri/arcgis/Portal","./portalUtils","./ModelItemEditor","./ModelItemList","dojo/text!./templates/PortalControls.html","dojo/i18n!../nls/resources","dijit/form/Button","dijit/Dialog"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var p=["Web Map"];return a([g,h,i,e],{templateString:n,i18n:o,baseClass:"mdlrPortalControls",typeKeyword:"",_setModelItemAttr:function(a){if(void 0===a.type&&(a.type=p[0]),!c.some(p,function(b){return a.type===b}))throw"Expected one of these item types: "+p;this.modelItem=a,this.titleNode.innerHTML=this.modelItem.title||""},_setModelAttr:function(a){this.model=a,this.saveButton.set("disabled",!this.model)},postCreate:function(){var a=this;this.inherited(arguments),this.own(d(this.saveButton,"Click",function(){a.showSaveModelDialog()}))},_onLoadClick:function(){this.showLoadModelDialog()},showSaveModelDialog:function(){var a=this;this.modelItemEditor||(this.modelItemEditor=new l({onSave:function(){a.modelItem=a.modelItemEditor.itemInfo,a.saveModelItem().then(function(b){a.loadModelItem(b.id),a.saveDialog.hide()})},onCancel:function(){a.saveDialog.hide()}},this.saveModelNode),this.modelItemEditor.startup(),this.modelItemEditor.populateCategories(this.getCategoryOptions())),!this.modelItem.description&&this.model&&(this.modelItem.description=this.createItemDescription()),this.modelItemEditor.set("itemInfo",this.modelItem),this.saveDialog.show()},createItemDescription:function(){var a="";return c.forEach(this.model.overlayLayers,function(b){a+=b.title+": "+b.weight+"%\n"}),a},showLoadModelDialog:function(){var a=this;a.portal.signIn().then(function(){a.portal.queryItems({q:'type: ("'+p.join('" OR "')+'") AND typekeywords:"'+a.typeKeyword+'"'}).then(function(b){a.modelItemList?(a.modelItemList.refreshGrid(b),a.modelItemList.refreshCategories()):(a.modelItemList=new m({onLoadSelectedModel:function(b){b&&(a.loadModelItem(b),a.loadDialog.hide())},onCancel:function(){a.loadDialog.hide()}}),a.modelItemList.populateCategories(a.getCategoryOptions()),a.modelItemList.populateGrid(b),a.modelItemList.placeAt(a.queryResultsNode),a.modelItemList.startup(),a.modelItemList.resizeGrid())}),a.loadDialog.show()})},loadModelItem:function(a){var b=this;return k.getItem(b.portal,a).then(function(a){return b.set("modelItem",a.item),b.emit("item-loaded",a),a})},saveModelItem:function(){var a,c,d=this,e=this.modelItem;return e&&this.weightedOverlayService&&this.weightedOverlayService.imageServiceLayer&&this.model?this.portal.signIn().then(function(f){return e.typeKeywords=[d.typeKeyword],e.tags=e.tags.join(","),"Image Service"===e.type?(a="?uid="+(new Date).getTime(),e.url=d.weightedOverlayService.imageServiceLayer.url+a,c=d.weightedOverlayService.modelToImageServiceLayer(d.model,{modelTitle:e.title})):(c=k.createWebMapItemData(d.map),c.operationalLayers=[d.weightedOverlayService.modelToImageServiceLayer(d.model,{modelTitle:e.title})]),delete e.id,delete e.item,k.addItem(f,b.mixin(e,{text:JSON.stringify(c),extent:k.webMercatorExtentToItemExtent(d.map.extent)})).then(function(a){return a})}):(new f).reject("Item info, weighted overlay service, image layer, and/or model is undefined.")},getCategoryOptions:function(){return c.map(this.categoryTags,function(a){return{value:a,label:a}})},setPortalUrl:function(a){this.portal=new j.Portal(a)},signIn:function(){if(this.portal)return this.portal.signIn();throw"Portal is not initialized"},getTitle:function(){return this.titleNode.innerHTML}})});