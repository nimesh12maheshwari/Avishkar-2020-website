$(".slogan").children().andSelf().contents().each(function(){
    if (this.nodeType == 3) {
        var $this = $(this);
        $this.replaceWith($this.text().replace(/(\w)/g, "<span>$&</span>"));
    }
});