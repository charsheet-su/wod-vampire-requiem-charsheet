import * as sheetData from 'wod-data-vampire';
import * as commons from 'charsheet-commons';
import $ from 'jquery';
import mockData from '../../data/mock.json';

const {loadingPanel, errorPanel} = commons.panels;
window.jQuery = $;
window.$ = $;

const viewModes = {edit: 0};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function barratingValidator(value) {

  if (commons.options.isDevel()) {
    return null;// nothing to do for local development
  }

  if (commons.options.isRevision()) {
    return 'You can not edit revision data! If you want it - restore revision and edit it.';
  }
  return null;
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
    validate: barratingValidator,
    silent: true,
    onSelect(value, text) {
      commons.dataClient.sendDot(name, value);
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
}


function setTraits(secondary) {
  const sp = $('<span></span>');
  const otherTraits = $('.other_traits');
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
    otherTraits.append(div2);
    createDots(otherTraits, `trait_value[${i}]`, 'trait');
  }
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
    validate: barratingValidator,
    silent: true,
    selectedImage: 'img/checkbox_big_1.png',
    unSelectedImage: 'img/checkbox_big_0.png',
    initialRating: val,
    onSelect(value, text) {
      commons.dataClient.sendDot('Bloodpool', value);
    },
  });
}

function setEditableFields() {
  // defaults
  if (commons.options.isDevel()) { // just display message about saving
    $.fn.editable.defaults.success = function (response, newValue) {
      console.log(`Saving ${$(this).attr('data-name')} = ${newValue}`);
    };
  } else {
    $.fn.editable.defaults.url = '/api/save/';
    $.fn.editable.defaults.mode = 'popup';
    $.fn.editable.defaults.success = function (response, newValue) {
      if (response.error !== undefined) {
        errorPanel.show(`Error saving data: ${response.error}`);
      }
      return response;
    };
  }

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


async function loadSaved() {
  try {
    const data = await commons.dataClient.load(mockData);
    if (data.error !== undefined) {
      errorPanel.show(`Error fetching data: ${data.error}`);
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
    });
  }
  catch (err)
  {
    errorPanel.show(`Error fetching data: ${err.toString()}`);
  }
}

// set simple fields
function setDotsFields() {
  $('select[name="Humanity"]').barrating('show', {
    theme: 'wod-dots',
    showSelectedRating: false,
    allowEmpty: true,
    deselectable: true,
    validate: barratingValidator,
    silent: true,
    onSelect(value, text) {
      commons.dataClient.sendDot('Humanity', value);
    },
  });


  $('select[name="Willpower"]').barrating('show', {
    theme: 'wod-dots',
    showSelectedRating: false,
    allowEmpty: true,
    validate: barratingValidator,
    deselectable: true,
    silent: true,
    onSelect(value, text) {
      commons.dataClient.sendDot('Willpower', value);
    },
  });

  $('select[name="Willpower_current"]').barrating('show', {
    theme: 'wod-checkbox',
    showSelectedRating: false,
    allowEmpty: true,
    deselectable: true,
    validate: barratingValidator,
    silent: true,
    selectedImage: 'img/checkbox_big_1.png',
    unSelectedImage: 'img/checkbox_big_0.png',
    onSelect(value, text) {
      commons.dataClient.sendDot('Willpower_current', value);
    },
  });

  const s = $('select[name="Bloodpool"]');
  s.barrating('destroy').barrating('show', {
    theme: 'wod-checkbox',
    showSelectedRating: false,
    allowEmpty: true,
    deselectable: true,
    validate: barratingValidator,
    silent: true,
    selectedImage: 'img/checkbox_big_1.png',
    unSelectedImage: 'img/checkbox_big_0.png',
    onSelect(value, text) {
      commons.dataClient.sendDot('Bloodpool', value);
    },
  });
}


function loadAll() {
  console.log('loading defaults');
  loadingPanel.show();
  setEditableFields();

  // set abilities
  setData([sheetData.talents, sheetData.skills, sheetData.knowledges], 'abl', '.abilities');

  // set attributes
  setData([sheetData.physical, sheetData.social, sheetData.mental], 'attr', '.attributes');

  // set virtues
  loadProps(sheetData.virtues, 'virtue', 'virtue', '.virtues', 5, 3);

  // set disciplines
  loadProps(sheetData.disciplines, 'discipline', 'discipline', '.disciplines');


  loadProps(sheetData.backgrounds, 'background', 'background', '.backgrounds');


  loadTraits();
  const meritsFormatted = Object.keys(sheetData.merits).reduce((res, type)=>{
    res.push('--');
    res.push(`${capitalizeFirstLetter(type)}:`);
    res = res.concat(sheetData.merits[type]);
    return res;
  }, []);
  loadProps(meritsFormatted, 'merit', 'merit', '.merits', 7);

  const flawsFormatted = Object.keys(sheetData.flaws).reduce((res, type)=>{
    res.push('--');
    res.push(`${capitalizeFirstLetter(type)}:`);
    res = res.concat(sheetData.flaws[type]);
    return res;
  }, []);
  loadProps(flawsFormatted, 'flaw', 'flaw', '.flaws', 7);

  loadCustomProps();

  loadSaved().then(() => {
    // when everything is loaded, we display it
    setDotsFields();
    commons.onReady();
    $('.list-align').css('display', 'block');
    loadingPanel.hide();
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
        validate: barratingValidator,
        allowEmpty: true,
        deselectable: true,
        silent: true,
        onSelect(value, text) {
          commons.dataClient.sendDot($(this).parent().attr('name'), value);
        },
      });
    }
  });
}

async function changeMode(mode) {
  if (mode === viewModes.edit) {
    // just reload character data from scratch
    await loadSaved();
    // display back all elements


    // display editables
    $('.list span.editable').each(function () {
      if ($(this).css('display') === 'none') {
        $(this).css('display', 'inline-block');
      }
    });
    // show empty dots
    showDots('.other_traits');
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
    hideDots('.other_traits');
    hideDots('.advantages');
    hideDots('.merits');
    hideDots('.flaws');
    hideDots('.custom_props');
  }
}

window.changeMode = changeMode;

$(document).ready(() => {
  console.log('document ready!');
  loadAll();
});
