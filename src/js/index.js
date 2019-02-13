import '../css/custom/charlist.css';
import 'charsheet-dots';
import '../css/custom/list1.css';
import '../css/custom/list2.css';
import '../css/custom/list3.css';
import '../css/custom/list4.css';
import '../css/custom/print.css';

import '../../node_modules/x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css';
import '../../node_modules/x-editable/src/inputs/datetime/bootstrap-datetimepicker/css/datetimepicker.css';
import '../../node_modules/x-editable/src/inputs/select2/lib/select2-bootstrap.css';
import '../../node_modules/x-editable/dist/inputs-ext/typeaheadjs/lib/typeahead.js-bootstrap.css';

import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';

import '../../node_modules/select2/dist/css/select2.css';

import LazyLoad from 'vanilla-lazyload';

const myLazyLoad = new LazyLoad({
  elements_selector: '.lazy',
});

const $ = require('jquery');

window.$ = $;
window.jQuery = $;
require('bootstrap');
require('./images');
require('jquery-bar-rating');
require('./init');


require('x-editable/src/inputs/datetime/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js');
require('x-editable/dist/bootstrap3-editable/js/bootstrap-editable');

require('jquery-ui');
require('moment');
require('select2');
require('typeahead.js');
