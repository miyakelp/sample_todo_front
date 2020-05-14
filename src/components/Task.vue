<script>
export default {
  name: 'Task',
  props: {
    'task_id': Number,
    'task_body': String,
  }
}
</script>

<template>
  <div :id=task_id class="board-item"><div class="board-item-content">{{ task_body }}</div></div>
</template>
