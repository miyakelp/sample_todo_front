import Vue from 'vue';
import axios from 'axios';
import Muuri from 'muuri';

import Task from './components/Task'

new Vue({
  el: '#app',
  components: { Task },
  data: {
    itemContainers: [].slice.call(document.querySelectorAll('.board-column-content')),
    columnGrids: [],
    boardGrid: null,
    new_todo: null,
    status_dict: {
      'todo': 0,
      'working': 1,
      'done': 2,
    },
  },

  mounted: function() {
    this.boardGrid = new Muuri('.board', {
      layoutDuration: 400,
      layoutEasing: 'ease',
      dragEnabled: false,
      dragSortInterval: 0,
      dragStartPredicate: {
        handle: '.board-column-header'
      },
      dragReleaseDuration: 400,
      dragReleaseEasing: 'ease'
    });
    axios.get('/api/v1/tasks?status=0').then(function(response) {
      this.initList('todo', response.data.tasks);
    }.bind(this));
    axios.get('/api/v1/tasks?status=1').then(function(response) {
      this.initList('working', response.data.tasks);
    }.bind(this));
    axios.get('/api/v1/tasks?status=2').then(function(response) {
      this.initList('done', response.data.tasks);
    }.bind(this));
  },

  methods: {
    add: function(list, id, body) {
        let c = Vue.extend(Task);
        let instance = new c({
          propsData: {
            task_id: id,
            task_body: body,
          }
        }).$mount();
        document.getElementById(list).appendChild(instance.$el);
    },

    initList: function(name, tasks) {
      for (const task of tasks) {
        this.add(name, task.id, task.body);
      }
      this.$nextTick(function() {
        this.refresh(name);
      });
    },

    refresh: function(id) {
      var container = document.getElementById(id);
      var grid = new Muuri(container, {
        items: '.board-item',
        layoutDuration: 400,
        layoutEasing: 'ease',
        dragEnabled: true,
        dragSort: function () {
          return this.columnGrids;
        }.bind(this),
        dragSortInterval: 0,
        dragContainer: document.body,
        dragReleaseDuration: 400,
        dragReleaseEasing: 'ease'
      })
      .on('dragStart', function (item) {
        item.getElement().style.width = item.getWidth() + 'px';
        item.getElement().style.height = item.getHeight() + 'px';
      })
      .on('dragReleaseEnd', function (item) {
        item.getElement().style.width = '';
        item.getElement().style.height = '';
        this.columnGrids.forEach(function (grid) {
          grid.refreshItems();
        }.bind(this));
      }.bind(this))
      .on('receive', function(data) {
        var task_id = data.item.getElement().id;
        var params = {
          'before': this.status_dict[data.fromGrid.getElement().id],
          'after': this.status_dict[data.toGrid.getElement().id],
        };
        axios.post('/api/v1/tasks/' + task_id, params);
      }.bind(this))
      .on('layoutStart', function () {
        this.boardGrid.refreshItems().layout();
      }.bind(this));
      this.columnGrids.push(grid);
    },

    create_task: function() {
      var body = this.new_todo.trim();
      if (body !== '') {
        axios.post('/api/v1/task', { 'body': body }).then(function(response) {
          let task = response.data.task;
          this.add('todo', task.id, task.body);
          this.$nextTick(function() {
            this.refresh('todo');
          });
        }.bind(this));
      }
    },
  },
})

