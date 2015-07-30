function change_mode(mode) {
    if (mode == 0)//edit
    {
        //just reload everything from scratch
        load_saved();
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

        //hide non used traits

        //hide non used backgrouds

        //hide non used numina
    }

}