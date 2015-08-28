// To be able to pass an array of promises
if (jQuery.when.all === undefined) {
    jQuery.when.all = function (deferreds) {
        var deferred = new jQuery.Deferred();
        $.when.apply(jQuery, deferreds).then(
            function () {
                deferred.resolve(Array.prototype.slice.call(arguments));
            },
            function () {
                deferred.fail(Array.prototype.slice.call(arguments));
            });

        return deferred;
    }
}

//just a little something to show while loading
var loadingPannel;
loadingPannel = loadingPannel || (function () {
    var lpDialog = $("" +
    "<div class='modal' id='lpDialog' data-backdrop='static' data-keyboard='false'>" +
    "<div class='modal-dialog' >" +
    "<div class='modal-content'>" +
    "<div class='modal-header'><b>Loading...</b></div>" +
    "<div class='modal-body'>" +
    "<div class='progress'>" +
    "<div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuenow='100' aria-valuemin='100' aria-valuemax='100' style='width:100%'> " +
    "Please Wait..." +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>");
    return {
        show: function () {
            lpDialog.modal('show');
        },
        hide: function () {
            lpDialog.modal('hide');
        }
    };
})();

//we use it to show errors
var ErrorPannel;
ErrorPannel = ErrorPannel || (function () {
    var lpDialog = $("" +
    "<div class='modal' id='lpDialog' data-backdrop='static' data-keyboard='false'>" +
    "<div class='modal-dialog' >" +
    "<div class='modal-content'>" +
    "<div class='modal-header'><b>Error!</b></div>" +
    "<div class='modal-body'>" +
    "<div class='alert alert-danger' role='alert'> " +
    "Some error text" +
    "</div>" +
    "<div class='modal-footer'>" +
    "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>");
    return {
        show: function (error) {

            lpDialog.find('.alert').html(error);
            lpDialog.modal('show');
        },
        hide: function () {
            lpDialog.modal('hide');
        }
    };
})();

//here we send dot values to server with ajax
function send_dots(attr, value) {
    //var data = {};
    //attr=attr.replace('[','%5B').replace(']','%5D');
    //data[attr] = value;
    if (check_devel()) {
        console.log('Saving ' + attr + ' = ' + value);
        return;
    }
    if (if_revision()) {
        ErrorPannel.show('You can not edit revision data! If you want it - restore revision and edit it.');
        return;
    }
    var data = new FormData();
    data.append('name', attr);
    data.append('value', value);
    $.ajax({
        url: '/api/save/',
        type: 'post',
        data: data,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (data) {
            console.info(data);
            if (data.error !== undefined) {
                ErrorPannel.show(data.error);
                return;
            }
        },
        error: function (data) {
            alert("Error saving " + attr + "!");
        }
    });
}


function create_dots(main_container, name, el_class, caption, points) {
    el_class = el_class || 'attr';
    points = points || 5;
    //name near the select
    if (caption != undefined && caption != '') {
        var div1 = $('<div>' + caption + '</div>');
        div1.attr('class', el_class);
        main_container.append(div1);
    }
    var select = $('<select><option value=""></option></select>');
    //var i = 0;
    for (var i = 1; i <= points; i++)
        select.append('<option value="' + i + '">' + i + '</option>');
    var div2 = $('<div></div>');
    div2.attr('class', el_class + '_value');
    div2.append(select);

    div2.find('select').barrating('show', {
        wrapperClass: 'br-wrapper-f',
        showSelectedRating: false,
        onSelect: function (value, text) {
            send_dots(name, value);
        }
    })
        .attr('name', name);
    main_container.append(div2);
}

//load simple data like attributes
function set_data(list, el_class, main_container, complete) {
    var data = {};
    //function get_data(deferred, path) {
    //}
    var deferreds = [];
    $.each(list, function (i, path) {
        var deferred = new $.Deferred();
        deferreds.push(deferred);
        //get_data(deferred, item);

        var jqxhr = $.get("get/" + path)
            .success(function (res) {
                data[path] = res;
            })
            .error(function () {
                alert("Error getting " + path + "!");
            })
            .complete(function () {
                deferred.resolve();
            });
    });
    $.when.all(deferreds).then(function () {
        $.each(data[list[0]], function (i) {//only take item index. could be a simple loop
            $.each(list, function (index, arr) {
                var item = data[arr][i];
                //var id = item.replace(/ /g, '_');
                $(main_container).append(create_dots($(main_container), item, el_class, item));
            });
        })
        complete.resolve();
    })
}


$(document).ready(function () {
    load_all();
});

//load data with editable name
function load_props(complete, json, title, field, container, dots, max) {
    if (max == undefined)
        max = 6;
    var sp = $('<span></span>');
    sp.attr('data-title', 'Select ' + title)
        .attr('data-type', 'select')
        .attr('data-pk', '1')
        .attr('data-prepend', 'None')
        .attr('data-emptytext', 'None')
        .attr('data-emptyclass', '')
        .attr('data-source', json);
    var div = $('<div></div>');
    div.attr('class', field + '_name');
    div.append(sp);
    for (i = 0; i < max; i++) {
        var div2 = div.clone();
        div2.find('span')
            .attr('data-name', field + '_name[' + i + ']')
            .editable();
        $(container).append(div2);
        create_dots($(container), field + '_value[' + i + ']', field, undefined, dots);
    }
    complete.resolve();
}


function set_traits(secondary, complete) {
    var sp = $('<span></span>');
    sp.attr('data-title', 'Select trait')
        .attr('data-type', 'select')
        .attr('data-pk', '1')
        .attr('data-prepend', 'None')
        .attr('data-emptytext', 'None')
        .attr('data-emptyclass', '');
    var div = $('<div></div>');
    div.attr('class', 'trait_name');
    div.append(sp);
    for (i = 0; i < 10; i++) {
        var div2 = div.clone();
        div2.find('span')
            .attr('data-name', 'trait_name[' + i + ']')
            .editable({'source': secondary});
        $('.other_traits').append(div2);
        create_dots($('.other_traits'), 'trait_value[' + i + ']', 'trait');
    }
    complete.resolve();
}

function load_custom_props(complete) {
    var sp = $('<span></span>');
    sp.attr('data-title', 'Your custom prop ')
        .attr('data-type', 'text')
        .attr('data-pk', '1')
        .attr('data-emptytext', 'None')
        .attr('data-emptyclass', '');
    var div = $('<div></div>');
    div.attr('class', 'custom_prop_name');
    div.append(sp);
    for (i = 0; i < 8; i++) {
        var div0 = $('<div></div>');
        div0.attr('class', 'custom_prop_holder');
        var div2 = div.clone();
        div2.find('span')
            .attr('data-name', 'custom_prop_name[' + i + ']')
            .editable();
        div0.append(div2);
        create_dots(div0, 'custom_prop_value[' + i + ']', 'custom_prop', undefined, 7);
        $('.custom_props').append(div0);
    }
    complete.resolve();
}

function load_traits(complete) {
    var list = ['secondary/talents.json', 'secondary/skills.json', 'secondary/knowledges.json'];
    var data = {};
    //function get_data(deferred, path) {
    //}
    var deferreds = [];
    $.each(list, function (i, path) {
        var deferred = new $.Deferred();
        deferreds.push(deferred);
        //get_data(deferred, item);

        var jqxhr = $.get("get/" + path)
            .success(function (res) {
                data[path] = res;
            })
            .error(function () {
                alert("Error getting " + path + "!");
            })
            .complete(function () {
                deferred.resolve();
            });
    });
    $.when.all(deferreds).then(function () {
        var res = [];
        $.each(list, function (index, arr) {
            res.push({text: '---'});
            $.each(data[list[index]], function (i) { //only take item index. could be a simple loop
                var item = data[arr][i];
                res.push({text: item, value: item})
                //console.log(item);
            });
        });
        set_traits(res, complete)
    })
}
function load_all() {
    loadingPannel.show();
    set_editable_fields();
    var deferreds = [];

    //set abilities
    var a = new $.Deferred();
    deferreds.push(a);
    set_data(['abilities/talents.json', 'abilities/skills.json', 'abilities/knowledges.json'], 'abl', '.abilities', a);

    //set attributes
    a = new $.Deferred();
    deferreds.push(a);
    set_data(['attributes/physical.json', 'attributes/social.json', 'attributes/mental.json'], 'attr', '.attributes', a);

    //set virtues
    a = new $.Deferred();
    deferreds.push(a);
    //set_data(['advantages/virtues.json'], 'virtue', '.virtues', a);
    load_props(a, 'get/advantages/virtues.json', 'virtue', 'virtue', '.virtues', 5, 3);

    //set disciplines
    a = new $.Deferred();
    deferreds.push(a);
    load_props(a, 'get/advantages/disciplines.json', 'discipline', 'discipline', '.disciplines');


    a = new $.Deferred();
    deferreds.push(a);
    load_props(a, 'get/advantages/backgrounds.json', 'background', 'background', '.backgrounds');


    a = new $.Deferred();
    deferreds.push(a);
    load_traits(a);

    a = new $.Deferred();
    deferreds.push(a);
    load_props(a, 'get/merits.json', 'merit', 'merit', '.merits', 7);


    a = new $.Deferred();
    deferreds.push(a);
    load_props(a, 'get/flaws.json', 'flaw', 'flaw', '.flaws', 7);

    a = new $.Deferred();
    deferreds.push(a);
    load_custom_props(a);


    //when all settings are loaded, we load charsheet data:
    $.when.all(deferreds).then(function () {
        deferreds = [];
        a = new $.Deferred();
        deferreds.push(a);
        load_saved(a);
        load_useful();//load bottom panel

        $.when.all(deferreds).then(function () {
            set_dots_fields();
            //when everything is loaded, we display it
            loadingPannel.hide();
            $('.list-align').css('display', 'block');
        });
    });
}

//set simple fields
function set_dots_fields() {
    $('select[name="Humanity"]').barrating('show', {
        wrapperClass: 'br-wrapper-f',
        showSelectedRating: false,
        onSelect: function (value, text) {
            send_dots('Humanity', value);
        }
    });


    $('select[name="Willpower"]').barrating('show', {
        wrapperClass: 'br-wrapper-f',
        showSelectedRating: false,
        onSelect: function (value, text) {
            send_dots('Willpower', value);
        }
    });

    $('select[name="Willpower_current"]').barrating('show', {
        wrapperClass: 'br-wrapper-f2',
        showSelectedRating: false,
        selectedImage: 'img/checkbox_big_1.png',
        unSelectedImage: 'img/checkbox_big_0.png',
        onSelect: function (value, text) {
            send_dots('Willpower_current', value);
        }
    });

    var s = $('select[name="Bloodpool"]');
    s.barrating('destroy').barrating('show', {
        wrapperClass: 'br-wrapper-f2',
        showSelectedRating: false,
        selectedImage: 'img/checkbox_big_1.png',
        unSelectedImage: 'img/checkbox_big_0.png',
        onSelect: function (value, text) {
            send_dots('Bloodpool', value);
        }
    });
}

//check if script is running from development environment
function check_devel() {
    if (window.location.href.indexOf('charsheet.su/') === -1)
        return true;
    return false;
}

function load_useful() {
    if (check_devel())
        return;//do not load for development environment
    $.ajax({
        url: '/js/useful.html',
        type: 'get',
        contentType: false,
        processData: false,
        success: function (data) {
            $('.useful_things').html(data);
        },
        error: function (data) {
            alert("Error loading useful things!");
        }
    });
}

function set_editable_fields() {
    //defaults
    if (check_devel()) {//just display message about saving
        $.fn.editable.defaults.success = function (response, newValue) {
            console.log('Saving ' + $(this).attr('data-name') + ' = ' + newValue);
        };
    }
    else {
        $.fn.editable.defaults.url = '/api/save/';
        $.fn.editable.defaults.mode = 'popup';
        $.fn.editable.defaults.success = function (response, newValue) {
            if (response.error != undefined)
                ErrorPannel.show(response.error);
            return response;
        };
    }

    $.fn.editable.defaults.validate = function (value) {

        if (check_devel()) {
            return;//nothing to do for local development
        }

        if (if_revision()) {
            return 'You can not edit revision data! If you want it - restore revision and edit it.';
        }
    }

    $('span[data-name="experience"]').editable({
        emptytext: '&nbsp;'
    });


    $('span[data-name="sex"]').editable({
        autotext: 'never',
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
            {value: ' ', text: ' '},
            {value: '/', text: '/'},
            {value: 'X', text: 'X'},
            {value: '*', text: '*'}
        ]
    });

    //init simple editables which do not require params
    var e = ['weakness', 'embrace_date', 'path', 'clan', 'generation', 'sire', 'nature', 'demeanor', 'age', 'derangements',
        'languages', 'languages', 'allies', 'influence', 'contacts-major',
        'mentor', 'residence', 'concept', 'chronicle', 'player_name', 'char_name', 'fame', 'status', 'resources',
        'contacts-minor', 'other1_name', 'other2_name', 'other1_value', 'other2_value', 'gear', 'equipment', 'vehicles',
        'misc', 'residence_details', 'prelude', 'goals', 'description', 'date_of_birth', 'place_of_birth', 'apparent_age',
        'hair', 'eyes', 'nationality', 'race', 'height', 'weight'];
    e.forEach(function (entry) {
        $('span[data-name="' + entry + '"]').editable();
    });


    $('span[data-name="bloodpool_size"]').editable({
        success: function (response, newValue) {
            setBloodPoolSize(newValue);
        }
    });

    var t = $('.combat tbody');
    for (var x = 0; x < 4; x++) {
        var tr = $('<tr></tr>');
        for (var y = 0; y < 7; y++) {
            var span = $('<span data-name="combat[' + x + '][' + y + ']"  data-emptyclass=""' +
            ' data-type="text" data-pk="1" data-emptytext="None" data-title="Enter"></span>');
            var td = $('<td>&nbsp;</td>');
            span.editable();
            td.append(span);
            tr.append(td);
        }
        t.append(tr);
    }


    var t = $('.armor tbody');
    for (var x = 0; x < 2; x++) {
        var tr = $('<tr></tr>');
        for (var y = 0; y < 7; y++) {
            var span = $('<span data-name="armor[' + x + '][' + y + ']"  data-emptyclass=""' +
            ' data-type="text" data-pk="1" data-emptytext="None" data-title="Enter"></span>');
            var td = $('<td>&nbsp;</td>');
            span.editable();
            td.append(span);
            tr.append(td);
        }
        t.append(tr);
    }
}

function setBloodPoolSize(x) {
    var s = $('select[name="Bloodpool"]');
    var val = s.val();
    s.empty();
    s.append('<option value=""></option>');
    for (var i = 0; i < x; i++) {
        s.append('<option value="' + i + '">' + i + '</option>');
    }
    s.barrating('destroy');
    s.barrating('show', {
        wrapperClass: 'br-wrapper-f2',
        showSelectedRating: false,
        selectedImage: 'img/checkbox_big_1.png',
        unSelectedImage: 'img/checkbox_big_0.png',
        initialRating: val,
        onSelect: function (value, text) {
            send_dots('Bloodpool', value);
        }
    });
}
function load_saved(complete) {
    if (check_devel()) {
        complete.resolve();
        return;//do not load for development environment
    }
    var jqxhr = $.get("/api/load")
        .success(function (data) {
            if (data.error != undefined) {
                ErrorPannel.show(data.error);
                return;
            }
            $.each(data, function (index, val) {
                    if (index == 'char_name')
                        document.title = val + ' - CharSheet.su';
                    if (index === 'character_sketch') {
                        $('img[class="character_sketch"]').attr('src', val).css('display', 'block');
                    }
                    if (index === 'group_chart') {
                        $('img[class="group_chart"]').attr('src', val).css('display', 'block');
                    }
                    //load editables

                    var a = $('span[data-name="' + index + '"]');
                    if (a != undefined && val) {
                        a.editable('setValue', val);
                        if (index == 'bloodpool_size')
                            setBloodPoolSize(val);
                    }

                    //try to set dots
                    a = $('select[name="' + index + '"]');

                    if (a != undefined && a.is('select')) {
                        a.barrating('set', val);
                    }
                }
            )
            complete.resolve();
        }
    )

}