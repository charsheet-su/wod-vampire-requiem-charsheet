$(function(){
  
   //defaults
   $.fn.editable.defaults.url = '/post'; 

    //enable / disable
    /*
   $('#enable').click(function() {
       $('#user .editable').editable('toggleDisabled');
   });*/
    
    //editables 
    $('#char_name').editable({
        url: '/post',
        type: 'text',
        pk: 1,
        name: 'char_name',
        title: 'Enter character name'
    });


    $('#experience').editable({
        emptytext: '&nbsp;',
        url: '/post',
        type: 'text',
        pk: 1,
        name: 'experience',
        title: 'Enter experience'
    });

    $('#player_name').editable({
        url: '/post',
        type: 'text',
        pk: 1,
        name: 'player_name',
        title: 'Enter player name'
    });

    $('#chronicle').editable({
        url: '/post',
        type: 'text',
        pk: 1,
        name: 'chronicle',
        title: 'Enter chronicle'
    });

    $('#concept').editable({
        url: '/post',
        type: 'text',
        pk: 1,
        name: 'concept',
        title: 'Enter concept'
    });

    $('#residence').editable({
        url: '/post',
        type: 'text',
        pk: 1,
        name: 'residence',
        title: 'Enter residence'
    });

    
    $('#sex').editable({
        prepend: "not selected",
        source: [
            {value: 1, text: 'M'},
            {value: 2, text: 'F'}
        ]
    });


    $('.health-table').find('span').editable({
        //$('#health[0]').editable({
            //prepend: "□",
        emptytext: '&nbsp;',
            source: [
                {value: 1, text: ' '},
                {value: 2, text: '/'},
                {value: 3, text: 'X'},
                {value: 4, text: '*'}
            ]
    });


    $('#nature').editable({
        showbuttons: false
    });


    $('#demeanor').editable({
        showbuttons: false
    });



    $('#age').editable({
        url: '/post',
        type: 'text',
        pk: 1,
        name: 'age',
        title: 'Enter character age'
    });



   $('#user .editable').on('hidden', function(e, reason){
        if(reason === 'save' || reason === 'nochange') {
            var $next = $(this).closest('tr').next().find('.editable');
            if ($('#autoopen').is(':checked')) {
                setTimeout(function () {
                    $next.editable('show');
                }, 300);
            } else {
                $next.focus();
            }
        }})

});