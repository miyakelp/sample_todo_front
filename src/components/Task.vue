<script>
export default {
  name: 'Task',
  props: {
    'taskId': Number,
    'taskBody': String,
  }
}
</script>

<template>
  <div :id=taskId class="board-item"><div class="board-item-content">{{ taskBody }}</div></div>
</template>
