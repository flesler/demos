/**
 * Rotator - Generic class to rotate different kind of collections.
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 2/20/2008
 * @version 1.0.0
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;function Rotator(a,b,c){this.collection(a);switch(typeof b){case'string':this.setter=function(v){this[b]=v};break;case'undefined':b=Rotator.defaultSetter;case'function':this.setter=b}switch(typeof c){case'string':this.getter=function(){return this[c]};break;case'undefined':c=Rotator.defaultGetter;case'function':this.getter=c}};Rotator.toArray=function(a){if(a.split)return a.split('');var b=[],l=a.length;while(l--)b[l]=a[l];return b};Rotator.defaultGetter=function(){return this};Rotator.defaultSetter=function(a){return a};Rotator.prototype={constructor:Rotator,collection:function(c){if(c===undefined)return this._c_;this._c_=Rotator.toArray(c)},_getValues:function(){var a=[];for(var i=0,l=this._c_.length;i<l;i++)a[i]=this.getter.call(this._c_[i]);return a},_setValues:function(a){for(var i=0,l=a.length;i<l;i++){var b=this.setter.call(this._c_[i],a[i]);if(b!==undefined)this._c_[i]=b}},left:function(){var a=this._getValues();a.push(a.shift());this._setValues(a)},right:function(){var a=this._getValues();a.unshift(a.pop());this._setValues(a)}};