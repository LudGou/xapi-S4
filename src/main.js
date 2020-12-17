// Import Bootstrap
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

// Import JQuery
import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

// Import our classes
import XapiClient from './XapiClient'
import Dataset from './Dataset'
import Formatter from './Formatter' 
import Processor from './Processor'

// Expose our APIs
window.xapi = new XapiClient()
window.dataset = new Dataset(window.xapi)
window.formatter = new Formatter()
window.processor = new Processor()

// LRS config.
window.xapi.config('https://lrs.learnxapi.fr/trax/api/f108ce59-bc64-4a89-b13f-166a12c26ba1/xapi/std/', btoa('moodle:password'))
window.xapi.extend('https://lrs.learnxapi.fr/trax/api/f108ce59-bc64-4a89-b13f-166a12c26ba1/xapi/ext/', btoa('moodle:password'))

// Activity ID: change it if you want to make your own dataset.
window.dataset.activityId = 'http://learnxapi.fr/activities/quiz/785785785'

