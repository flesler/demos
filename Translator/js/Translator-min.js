/**
 * Translator - JS Class to translate text nodes.
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Licensed under BSD (http://www.opensource.org/licenses/bsd-license.php)
 * Date: 5/26/2008
 * @author Ariel Flesler
 * @version 1.0.1
 */
function Translator(a,b){this.parse=a;this.filter=b};Translator.prototype={translate:function(b){if(this.sync)this.replace(b,this.parse(b.nodeValue));else{var c=this;this.parse(b.nodeValue,function(a){c.replace(b,a)})}},makeNode:function(a){if(a&&a.split)a=document.createTextNode(a);return a},replace:function(a,b){if(b!=null&&b!=a.nodeValue){var c=a.parentNode;if(b.splice){for(var i=0,l=b.length-1;i<l;)c.insertBefore(this.makeNode(b[i++]),a);b=this.makeNode(b[l]||'')}else b=this.makeNode(b);c.replaceChild(b,a)}},valid:/\S/,sync:true,traverse:function(a){var b=a.childNodes,l=b.length,c;while(l--){c=b[l];if(c.nodeType==3){if(this.valid.test(c.nodeValue))this.translate(c)}else if(c.nodeType==1&&(!this.filter||this.filter(c)))this.traverse(c)}}};