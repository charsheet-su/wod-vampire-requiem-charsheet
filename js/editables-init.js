$(function () {

    //defaults
    $.fn.editable.defaults.url = '/api/save/';

    //enable / disable
    /*
     $('#enable').click(function() {
     $('#user .editable').editable('toggleDisabled');
     });*/

    //editables 
    $('span[data-name="char_name"]').editable();
    $('span[data-name="player_name"]').editable();
    $('span[data-name="chronicle"]').editable();
    $('span[data-name="concept"]').editable();
    $('span[data-name="residence"]').editable();
    $('span[data-name="experience"]').editable({
        emptytext: '&nbsp;'
    });



    $('span[data-name="sex"]').editable({
        autotext: 'never',
        name: 'sex',
        source: [
            {value: 'M', text: 'M'},
            {value: 'F', text: 'F'}
        ]
    });


    $('.health-table').find('span').editable({
        //$('#health[0]').editable({
        //prepend: "□",
        emptytext: '&nbsp;',
        title: 'select damage',
        pk: 1,
        type: 'select',
        source: [
            {value: ' ',text: ' '},
            {value: '/',text: '/'},
            {value: 'X',text: 'X'},
            {value: '*',text: '*'}
        ]
    });


    $('span[data-name="nature"]').editable();
    $('span[data-name="demeanor"]').editable();
    $('span[data-name="age"]').editable();

});