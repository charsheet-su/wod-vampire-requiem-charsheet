const Promise = require('bluebird');
const requestPromise = require('request-promise');
const sheetData = require('../../data/index');

const isDevel = (window.location.href.indexOf('charsheet.su/') === -1);
const isRevision = (window.location.pathname.split('/').length === 6);
const viewModes = {edit: 0};


/**
 * just a little something to show while loading
 * @type {{show, hide}}
 */
const loadingPannel = (function loadingPannel() {
  const lpDialog = $(`
    <div class='modal' id='lpDialog' data-backdrop='static' data-keyboard='false'>
    <div class='modal-dialog' >
    <div class='modal-content'>
    <div class='modal-header'><b>Loading...</b></div>
    <div class='modal-body'>
    <div class='progress'>
    <div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuenow='100' 
    aria-valuemin='100' aria-valuemax='100' style='width:100%'>
    Please Wait...
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>`);
  return {
    show() {
      lpDialog.modal('show');
    },
    hide() {
      lpDialog.modal('hide');
    },
  };
}());

/**
 * we use it to show errors
 * @type {{show, hide}}
 */
const ErrorPannel = (function ErrorPannel() {
  const lpDialog = $(`<div class='modal' id='lpDialog' data-backdrop='static' data-keyboard='false'>
    <div class='modal-dialog' >
    <div class='modal-content'>
    <div class='modal-header'><b>Error!</b></div>
    <div class='modal-body'>
    <div class='alert alert-danger' role='alert'>
    Some error text
    </div>
    <div class='modal-footer'>
    <button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>
    </div>
    </div>
    </div>
    </div>
    </div>`);
  return {
    show(error) {

      lpDialog.find('.alert').html(error);
      lpDialog.modal('show');
    },
    hide() {
      lpDialog.modal('hide');
    },
  };
}());


// here we send dot values to server with ajax
function sendDots(attr, value) {
  // var data = {};
  // attr=attr.replace('[','%5B').replace(']','%5D');
  // data[attr] = value;
  if (isDevel) {
    console.log(`Saving ${attr} = ${value}`);
    return;
  }
  if (isRevision) {
    ErrorPannel.show('You can not edit revision data! If you want it - restore revision and edit it.');
    return;
  }
  const options = {
    method: 'POST',
    uri: `${window.location.protocol}//${window.location.hostname}/api/save/`,
    form: {
      name: attr, value,
    },
    json: true,
    headers: {},
  };

  requestPromise(options)
    .then((data)=> {
      if (data.error !== undefined) {
        ErrorPannel.show(`Error sending dots: ${data.error}`);
      }
      // POST succeeded...
    })
    .catch((err)=> {
      ErrorPannel.show(`Error sending dots: ${JSON.stringify(err)}`);
      // POST failed...
    });
}


function createDots(mainContainer, name, elClass, caption, points) {
  elClass = elClass || 'attr';
  points = points || 5;
  // name near the select
  if (caption !== undefined && caption !== '') {
    const div1 = $(`<div>${caption}</div>`);
    div1.attr('class', elClass);
    mainContainer.append(div1);
  }
  const select = $('<select><option value=""></option></select>');
  // var i = 0;
  for (let i = 1; i <= points; i++) {
    select.append(`<option value="${i}">${i}</option>`);
  }
  const div2 = $('<div></div>');
  div2.attr('class', `${elClass}_value`);
  div2.append(select);

  div2.find('select').barrating('show', {
    theme: 'wod-dots',
    showSelectedRating: false,
    allowEmpty: true,
    deselectable: true,
    silent: true,
    onSelect(value, text) {
      sendDots(name, value);
    },
  })
    .attr('name', name);
  mainContainer.append(div2);
}

// load simple data like attributes
function setData(list, elClass, mainContainer) {
  for (let n = 0; n < list[0].length; n++) {
    for (let i = 0; i < list.length; i++) {
      $(mainContainer).append(createDots($(mainContainer), list[i][n], elClass, list[i][n]));
    }
  }
  return Promise.resolve();
}

// load data with editable name
function loadProps(json, title, field, container, dots, max) {
  const sp = $('<span></span>');
  sp.attr('data-title', `Select ${title}`)
    .attr('data-type', 'select')
    .attr('data-pk', '1')
    .attr('data-prepend', 'None')
    .attr('data-emptytext', 'None')
    .attr('data-emptyclass', '');
  const div = $('<div></div>');
  div.attr('class', `${field}_name`);
  div.append(sp);
  const maxNum = max || 6;
  for (let i = 0; i < maxNum; i++) {
    const div2 = div.clone();
    div2.find('span')
      .attr('data-name', `${field}_name[${i}]`)
      // .attr('data-source', json)
      .editable({source: json});
    $(container).append(div2);
    createDots($(container), `${field}_value[${i}]`, field, undefined, dots);
  }
  return Promise.resolve();
}


function setTraits(secondary) {
  const sp = $('<span></span>');
  sp.attr('data-title', 'Select trait')
    .attr('data-type', 'select')
    .attr('data-pk', '1')
    .attr('data-prepend', 'None')
    .attr('data-emptytext', 'None')
    .attr('data-emptyclass', '');
  const div = $('<div></div>');
  div.attr('class', 'trait_name');
  div.append(sp);
  for (let i = 0; i < 10; i++) {
    const div2 = div.clone();
    div2.find('span')
      .attr('data-name', `trait_name[${i}]`)
      .editable({source: secondary});
    $('.other_traits').append(div2);
    createDots($('.other_traits'), `trait_value[${i}]`, 'trait');
  }
  return Promise.resolve();
}

function loadCustomProps() {
  const sp = $('<span></span>');
  sp.attr('data-title', 'Your custom prop ')
    .attr('data-type', 'text')
    .attr('data-pk', '1')
    .attr('data-emptytext', 'None')
    .attr('data-emptyclass', '');
  const div = $('<div></div>');
  div.attr('class', 'custom_prop_name');
  div.append(sp);
  for (let i = 0; i < 8; i++) {
    const div0 = $('<div></div>');
    div0.attr('class', 'custom_prop_holder');
    const div2 = div.clone();
    div2.find('span')
      .attr('data-name', `custom_prop_name[${i}]`)
      .editable();
    div0.append(div2);
    createDots(div0, `custom_prop_value[${i}]`, 'custom_prop', undefined, 7);
    $('.custom_props').append(div0);
  }
  return Promise.resolve();
}

function loadTraits() {
  const list = [sheetData.secondary.talents,
    sheetData.secondary.skills,
    sheetData.secondary.knowledges];
  const res = [];
  list.forEach((items)=> {
    // $.each(list, (index, items) => {
    res.push({text: '---'});
    // $.each(items, (i, item) => { // only take item index. could be a simple loop
    items.forEach((item)=> {
      res.push({text: item, value: item});
    });
  });
  return setTraits(res);
}


function setBloodPoolSize(x) {
  const s = $('select[name="Bloodpool"]');
  const val = s.val();
  s.empty();
  s.append('<option value=""></option>');
  for (let i = 0; i < x; i++) {
    s.append(`<option value="${i}">${i}</option>`);
  }
  s.barrating('destroy');
  s.barrating('show', {
    theme: 'wod-checkbox',
    showSelectedRating: false,
    allowEmpty: true,
    deselectable: true,
    silent: true,
    selectedImage: 'img/checkbox_big_1.png',
    unSelectedImage: 'img/checkbox_big_0.png',
    initialRating: val,
    onSelect(value, text) {
      sendDots('Bloodpool', value);
    },
  });
}

function setEditableFields() {
  // defaults
  if (isDevel) { // just display message about saving
    $.fn.editable.defaults.success = function (response, newValue) {
      console.log(`Saving ${$(this).attr('data-name')} = ${newValue}`);
    };
  } else {
    $.fn.editable.defaults.url = '/api/save/';
    $.fn.editable.defaults.mode = 'popup';
    $.fn.editable.defaults.success = function (response, newValue) {
      if (response.error !== undefined) {
        ErrorPannel.show(`Error saving data: ${response.error}`);
      }
      return response;
    };
  }

  $.fn.editable.defaults.validate = (value)=> {

    if (isDevel) {
      return null;// nothing to do for local development
    }

    if (isRevision) {
      return 'You can not edit revision data! If you want it - restore revision and edit it.';
    }
    return null;
  };

  $('span[data-name="experience"]').editable({
    emptytext: '&nbsp;',
  });


  $('span[data-name="sex"]').editable({
    autotext: 'never',
    source: [
      {value: 'M', text: 'M'},
      {value: 'F', text: 'F'},
    ],
  });


  $('.health-table').find('span').editable({
    // $('#health[0]').editable({
    // prepend: "□",
    emptytext: '&nbsp;',
    title: 'select damage',
    pk: 1,
    type: 'select',
    source: [
      {value: ' ', text: ' '},
      {value: '/', text: '/'},
      {value: 'X', text: 'X'},
      {value: '*', text: '*'},
    ],
  });

  // init simple editables which do not require params
  const e = ['weakness', 'embrace_date', 'path', 'clan', 'generation', 'sire', 'nature', 'demeanor', 'age', 'derangements',
    'languages', 'languages', 'allies', 'influence', 'contacts-major',
    'mentor', 'residence', 'concept', 'chronicle', 'player_name', 'char_name', 'fame', 'status', 'resources',
    'contacts-minor', 'other1_name', 'other2_name', 'other1_value', 'other2_value', 'gear', 'equipment', 'vehicles',
    'misc', 'residence_details', 'prelude', 'goals', 'description', 'date_of_birth', 'place_of_birth', 'apparent_age',
    'hair', 'eyes', 'nationality', 'race', 'height', 'weight'];
  e.forEach((entry) => {
    const source = sheetData[entry] || [];
    $(`span[data-name="${entry}"]`).editable({source});
  });


  $('span[data-name="bloodpool_size"]').editable({
    success(response, newValue) {
      setBloodPoolSize(newValue);
    },
  });

  (function setCombat() {
    const t = $('.combat tbody');
    for (let x = 0; x < 4; x++) {
      const tr = $('<tr></tr>');
      for (let y = 0; y < 7; y++) {
        const span = $(`<span data-name="combat[${x}][${y}]"  data-emptyclass=""`
          + ' data-type="text" data-pk="1" data-emptytext="None" data-title="Enter"></span>');
        const td = $('<td>&nbsp;</td>');
        span.editable();
        td.append(span);
        tr.append(td);
      }
      t.append(tr);
    }
  }());

  (function setArmor() {
    const t = $('.armor tbody');
    for (let x = 0; x < 2; x++) {
      const tr = $('<tr></tr>');
      for (let y = 0; y < 7; y++) {
        const span = $(`<span data-name="armor[${x}][${y}]"  data-emptyclass=""`
          + ' data-type="text" data-pk="1" data-emptytext="None" data-title="Enter"></span>');
        const td = $('<td>&nbsp;</td>');
        span.editable();
        td.append(span);
        tr.append(td);
      }
      t.append(tr);
    }
  }());
}

function fetchSavedData() {

  if (isDevel) {
    // do not load for development environment
    return Promise.resolve(sheetData.mock);
  }
  const options = {
    uri: `${window.location.protocol}//${window.location.hostname}/api/load`,
    json: true, // Automatically parses the JSON string in the response
  };

  return requestPromise(options);
}

function loadSaved() {
  fetchSavedData().then((data)=> {
    if (data.error !== undefined) {
      ErrorPannel.show(`Error fetching data: ${data.error}`);
      return;
    }
    const keys = Object.keys(data);
    keys.forEach((index)=> {
      const val = data[index];
      if (index === 'char_name') {
        document.title = `${val} - CharSheet.su`;
      }
      if (index === 'character_sketch') {
        $('img[class="character_sketch"]').attr('src', val).css('display', 'block');
      }
      if (index === 'group_chart') {
        $('img[class="group_chart"]').attr('src', val).css('display', 'block');
      }
      // load editables

      let a = $(`span[data-name="${index}"]`);
      if (a !== undefined && val) {
        a.editable('setValue', val);
        if (index === 'bloodpool_size') {
          setBloodPoolSize(val);
        }
      }

      // try to set dots
      a = $(`select[name="${index}"]`);

      if (a !== undefined && a.is('select')) {
        a.val(val);
        a.barrating('set', val);
      }
    },
    );
  },
  )
    .catch(err=> ErrorPannel.show(`Error fetching data: ${err.toString()}`),
    );
}

function loadUseful() {
  if (isDevel) {
    return Promise.resolve();
  }// do not load for development environment


  const options = {
    uri: `${window.location.protocol}//${window.location.hostname}/js/useful.php`,
    json: false, // Automatically parses the JSON string in the response
  };

  return requestPromise(options)
    .then((data)=> {
      $('.useful_things').html(data);
    })
    .catch(err=> alert(`Error loading useful things! ${JSON.stringify(err)}`));
}


// set simple fields
function setDotsFields() {
  $('select[name="Humanity"]').barrating('show', {
    theme: 'wod-dots',
    showSelectedRating: false,
    allowEmpty: true,
    deselectable: true,
    silent: true,
    onSelect(value, text) {
      sendDots('Humanity', value);
    },
  });


  $('select[name="Willpower"]').barrating('show', {
    theme: 'wod-dots',
    showSelectedRating: false,
    allowEmpty: true,
    deselectable: true,
    silent: true,
    onSelect(value, text) {
      sendDots('Willpower', value);
    },
  });

  $('select[name="Willpower_current"]').barrating('show', {
    theme: 'wod-checkbox',
    showSelectedRating: false,
    allowEmpty: true,
    deselectable: true,
    silent: true,
    selectedImage: 'img/checkbox_big_1.png',
    unSelectedImage: 'img/checkbox_big_0.png',
    onSelect(value, text) {
      sendDots('Willpower_current', value);
    },
  });

  const s = $('select[name="Bloodpool"]');
  s.barrating('destroy').barrating('show', {
    theme: 'wod-checkbox',
    showSelectedRating: false,
    allowEmpty: true,
    deselectable: true,
    silent: true,
    selectedImage: 'img/checkbox_big_1.png',
    unSelectedImage: 'img/checkbox_big_0.png',
    onSelect(value, text) {
      sendDots('Bloodpool', value);
    },
  });
}


function loadAll() {
  console.log('loading defaults');
  loadingPannel.show();
  setEditableFields();
  let promises = [];

  // set abilities
  let a = setData([sheetData.talents, sheetData.skills, sheetData.knowledges], 'abl', '.abilities');
  promises.push(a);

  // set attributes
  a = setData([sheetData.physical, sheetData.social, sheetData.mental], 'attr', '.attributes');
  promises.push(a);

  // set virtues
  a = loadProps(sheetData.virtues, 'virtue', 'virtue', '.virtues', 5, 3);
  promises.push(a);

  // set disciplines
  a = loadProps(sheetData.disciplines, 'discipline', 'discipline', '.disciplines');
  promises.push(a);


  a = loadProps(sheetData.backgrounds, 'background', 'background', '.backgrounds');
  promises.push(a);


  a = loadTraits();
  promises.push(a);

  a = loadProps(sheetData.merits, 'merit', 'merit', '.merits', 7);
  promises.push(a);


  a = loadProps(sheetData.flaws, 'flaw', 'flaw', '.flaws', 7);
  promises.push(a);

  a = loadCustomProps(a);
  promises.push(a);


  // when all settings are loaded, we load charsheet data:
  Promise.all(promises).then(() => {
    promises = [];
    a = loadSaved();
    promises.push(a);
    loadUseful();// load bottom panel

    Promise.all(promises).then(() => {
      // when everything is loaded, we display it
      setDotsFields();
      loadingPannel.hide();
      $('.list-align').css('display', 'block');
    });
  });
}


function hideDots(container) {
  $(`${container} select option[value=""]:selected`).each(function () {
    // console.log($(this));
    $(this).parent().barrating('destroy');
    $(this).parent().css('display', 'none');
  });
}

function showDots(container) {
  // display empty dots
  $(`${container} select option[value=""]:selected`).each(function () {
    const a = $(this).parent().next();
    if (a.attr('class') !== 'br-widget') {
      $(this).parent().css('display', 'inline-block');
      $(this).parent().barrating('show', {
        theme: 'wod-dots',
        showSelectedRating: false,
        allowEmpty: true,
        deselectable: true,
        silent: true,
        onSelect(value, text) {
          sendDots($(this).parent().attr('name'), value);
        },
      });
    }
  });
}

function changeMode(mode) {
  if (mode === viewModes.edit) {
    // just reload character data from scratch
    loadSaved();
    // display back all elements


    // display editables
    $('.list span.editable').each(function () {
      if ($(this).css('display') === 'none') {
        $(this).css('display', 'inline-block');
      }
    });
    // show empty dots
    showDots('.other_traits_container');
    showDots('.advantages');
    showDots('.merits');
    showDots('.flaws');
    showDots('.custom_props');

  } else { // hide some elements and set some values to zero
    // reset health
    $('.health-table').find('span').editable('setValue', '');
    // reset experience
    $('span[data-name="experience"]').editable('setValue', '');
    // reset used willpower
    $('select[name="Willpower_current"]')
      .barrating('set', 0)
      .barrating('clear');

    $('select[name="Bloodpool"]')
      .barrating('clear');
    // hide all non used editables
    $('.list span.editable').each(function () {
      if ($(this).html() === 'None') {
        $(this).css('display', 'none');
      }
    });
    // hide all empty dots
    hideDots('.other_traits_container');
    hideDots('.advantages');
    hideDots('.merits');
    hideDots('.flaws');
    hideDots('.custom_props');
  }
}

window.changeMode = changeMode;
window.sendDots = sendDots;
window.loadSaved = loadSaved;

$(document).ready(() => {
  console.log('document ready!');
  loadAll();
});
