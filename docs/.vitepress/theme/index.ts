import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import TimeoutDemo from './components/TimeoutDemo.vue'
import DeepCopyDemo from './components/DeepCopyDemo.vue'
import PrototypeChainDemo from './components/PrototypeChainDemo.vue'
import InheritanceDemo from './components/InheritanceDemo.vue'
import ArrayMethodsDemo from './components/ArrayMethodsDemo.vue'
import EventPropagationDemo from './components/EventPropagationDemo.vue'
import DebounceThrottleDemo from './components/DebounceThrottleDemo.vue'
import CssBoxModelDemo from './components/CssBoxModelDemo.vue'
import HtmlDragDropDemo from './components/HtmlDragDropDemo.vue'
import HttpStatusDemo from './components/HttpStatusDemo.vue'
import SecurityXSSDemo from './components/SecurityXSSDemo.vue'
import TcpHandshakeDemo from './components/TcpHandshakeDemo.vue'
import VueLifecycleDemo from './components/VueLifecycleDemo.vue'
import VueCommunicationDemo from './components/VueCommunicationDemo.vue'
import VueReactivityDemo from './components/VueReactivityDemo.vue'
import EChartsDemo from './components/EChartsDemo.vue'
import CesiumDemo from './components/CesiumDemo.vue'
import ThreeDemo from './components/ThreeDemo.vue'
import './style.css'

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('TimeoutDemo', TimeoutDemo)
    app.component('DeepCopyDemo', DeepCopyDemo)
    app.component('PrototypeChainDemo', PrototypeChainDemo)
    app.component('InheritanceDemo', InheritanceDemo)
    app.component('ArrayMethodsDemo', ArrayMethodsDemo)
    app.component('EventPropagationDemo', EventPropagationDemo)
    app.component('DebounceThrottleDemo', DebounceThrottleDemo)
    app.component('CssBoxModelDemo', CssBoxModelDemo)
    app.component('HtmlDragDropDemo', HtmlDragDropDemo)
    app.component('HttpStatusDemo', HttpStatusDemo)
    app.component('SecurityXSSDemo', SecurityXSSDemo)
    app.component('TcpHandshakeDemo', TcpHandshakeDemo)
    app.component('VueLifecycleDemo', VueLifecycleDemo)
    app.component('VueCommunicationDemo', VueCommunicationDemo)
    app.component('VueReactivityDemo', VueReactivityDemo)
    app.component('EChartsDemo', EChartsDemo)
    app.component('CesiumDemo', CesiumDemo)
    app.component('ThreeDemo', ThreeDemo)
  }
}
