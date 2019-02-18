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

import 'jquery';
import 'bootstrap';
import 'jquery-bar-rating';
import './init';


import 'x-editable/src/inputs/datetime/bootstrap-datetimepicker/js/bootstrap-datetimepicker';
import 'x-editable/dist/bootstrap3-editable/js/bootstrap-editable';

import 'jquery-ui';
import 'moment';
import 'select2';
import 'typeahead.js';

const myLazyLoad = new LazyLoad({
  elements_selector: '.lazy',
});
