/**
  * stylebot.style
  * 
  * Generation and application of CSS rules
  **/

stylebot.style = {

    /*  cache of custom CSS rules applied to elements on the current page
        e.g.: 
        rule = { 
            selector: 'a', 
            styles:  [{
                property: 'color',
                value: '#fff'
                }]
            }
    */
    rules:[],
    
    // apply a new style to selected elements
    apply: function(selector, property, value){
        if(!selector)
            return true;
        var el = $(selector);

        /* TODO: Any original inline CSS should remain unaltered */
        var origCSS = el.attr('style');
        origCSS = (typeof(origCSS) == "undefined") ? "" : origCSS;
        
        this.applyInlineCSS(el, this.getInlineCSS(selector, property, value));
        this.saveRule(selector, property, value);
    },
    
    // add/update rule to CSS rules cache
    saveRule: function(selector, property, value){
        // check if the selector already exists in the list
        var index = stylebot.utils.search(this.rules, "selector", selector);
        if(index != null)
        {
            console.log("Rule already exists at index "+ index + "\n");
            var rule = this.rules[index];
            // check if the property exists
            index = stylebot.utils.search(rule.styles, "property", property);
            if(index != null)
            {
                console.log("Property already exists in rule at index "+ index + "\n");
                if(value == "")                     // if value is empty, remove the property
                    rule.styles.splice(index, 1);
                else                                // else update value
                    rule.styles[index].value = value;
            }
            else
                rule.styles[rule.styles.length] = {property: property, value: value};
        }
        else if(value != "")
        {
            console.log("Nothing found. Creating a new rule \n");
            this.rules[this.rules.length] = {selector: selector, styles:[{property: property, value: value}]};
        }

        for(var i=0;i < this.rules.length; i++)
            console.log("Rule " + i + " Selector: " + this.rules[i].selector+"\n");
    },
    
    // generate inline CSS
    getInlineCSS: function(selector, property, value){
        /* TODO: Try using $.each for iteration here */
        var index = stylebot.utils.search(this.rules, "selector", selector);
        if(index != null)
        {
            var css = "";
            var rule = this.rules[index];
            var len = rule.styles.length;
            var isPropertyPresent = false;
            for(var i=0; i<len; i++)
            {
                if(rule.styles[i].property == property && !isPropertyPresent)
                {
                    rule.styles[i].value = value;
                    isPropertyPresent = true;
                }
                css += this.getCSSDeclaration(rule.styles[i].property, rule.styles[i].value, true);
            }
            if(!isPropertyPresent)
                css += this.getCSSDeclaration(property, value, true);
            return css;
        }
        else
            return this.getCSSDeclaration(property, value, true);
    },
    
    // apply inline CSS to an element
    applyInlineCSS: function(el, css){
        el.attr({
            style: css,
            'stylebot-css': css //save stylebot css in a separate attribute
        });
    },
    
    // reset inline CSS for an element
    clearInlineCSS: function(el){
        $(selector).attr({
            style:'',
            'stylebot-css': ''
        });
    },
    
    // get all the custom CSS rules set for a selector
    getStyles: function(selector){
        var index = stylebot.utils.search(this.rules, "selector", selector);
        if(index != null)
            return this.rules[index].styles;
        else
            return null;
    },
    
    // generate CSS for all the rules in cache
    crunchCSS: function(){
        var len = this.rules.length;
        var css = '';
        for(var i=0; i<len; i++)
        {
            var rule = this.rules[i];
            var styles_len = rule.styles.length;
            if(styles_len != 0)
            {
                css += rule.selector + "{ " + "\n";
                for(var j=0; j<styles_len; j++)
                {
                    css += "\t" + this.getCSSDeclaration(rule.styles[j].property, rule.styles[j].value) + "\n";
                }
                css += "}" + "\n";
            }
        }
        return css;
    },
    
    getCSSDeclaration: function(property, value, setImportant){
        if(setImportant)
            return property + ": " + value + " !important;";
        else
            return property + ": " + value + ";";
    }
}