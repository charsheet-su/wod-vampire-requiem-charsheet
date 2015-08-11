function change_mode(mode) {
    if (mode == 0)//edit
    {
        //just reload character data from scratch
        load_saved();
        //display back all elements


        //display editables
        $('.list span.editable').each(function () {
            if ($(this).css('display') == 'none')
                $(this).css('display', 'inline-block');
        });
        //show empty dots
        show_dots('.other_traits_container');
        show_dots('.advantages');
        show_dots('.merits');
        show_dots('.flaws');
        show_dots('.custom_props');

    }
    else //hide some elements and set some values to zero
    {
        //reset health
        $('.health-table').find('span').editable('setValue', "");
        //reset experience
        $('span[data-name="experience"]').editable('setValue', "");
        //reset used willpower
        $('select[name="Willpower_current"]')
            .barrating('set', 0)
            .barrating('clear');

        //hide all non used editables
        $('.list span.editable').each(function () {
            if ($(this).html() == 'None')
                $(this).css('display', 'none');
        });
        //hide all empty dots
        hide_dots('.other_traits_container');
        hide_dots('.advantages');
        hide_dots('.merits');
        hide_dots('.flaws');
        hide_dots('.custom_props');

    }

}
function hide_dots(container) {
    $(container + ' select option[value=""]:selected').each(function () {
        //console.log($(this));
        $(this).parent().barrating('destroy');
        $(this).parent().css('display', 'none');
    });
}
function show_dots(container) {
    //display empty dots
    $(container + ' select option[value=""]:selected').each(function () {
        var a = $(this).parent().next();
        if (a.attr('class') != 'br-widget') {
            $(this).parent().css('display', 'inline-block');
            $(this).parent().barrating('show', {
                wrapperClass: 'br-wrapper-f',
                showSelectedRating: false,
                onSelect: function (value, text) {
                    send_dots($(this).parent().attr('name'), value);
                }
            });
        }
    });
}