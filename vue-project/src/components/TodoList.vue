<template>
    <div>
        <h1>To do List</h1>
        <input v-model="newTodo" placeholder="Add a new todo"/>
        <button @click="addTodo">Add todo</button>
        <ul>
            <li v-for="todo in todos" :key="todo.id">
                <input type="checkbox" v-model="todo.done" />
                <span :class="{ done: todo.done }">{{ todo.text }}</span>
                <button @click="removeTodo(todo)">X</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
    import { ref } from 'vue'

    let id = 0

    const todos = ref([
        { id: id++, text: 'Cleaning', done: false },
        { id: id++, text: 'Cooking', done: false },
        { id: id++, text: 'Learn Vue.js', done: false },
    ])

    const newTodo = ref('')

    const addTodo = () => {
        todos.value.push({
            id: id++,
            text: newTodo.value,
            done: false,
        })
        // console.log(newTodo.value)
        newTodo.value = ''
    }

    const removeTodo = (todo) => {
        todos.value = todos.value.filter((item) => item.id !== todo.id)
    }

</script>

<style lang="scss" scoped>
    .done {
        text-decoration: line-through;
    }
</style>