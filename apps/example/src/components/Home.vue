<template>
    <section class="home">

        <div class="counter">
            <h2>Count: {{ count }}</h2>

            <div class="actions">
                <button type="button" @click="count--">Decrement</button>
                <button type="button" @click="count++">Increment</button>
                <button type="button" @click="count = 0">Reset</button>
            </div>

        </div>

        <div>
            <h2>To-do list</h2>

            <input type="text" v-model="newTask">

            <button @click="addTask()" type="button">Add Task</button>

            <ul class="list">
                <li v-for="task in filteredTasks" :key="task.id">
                    <label>
                        <input v-model="task.done" type="checkbox"/>
                        <span :class="{ done: task.done }">{{ task.title }}</span>
                    </label>
                </li>
            </ul>
        </div>

    </section>
</template>

<script setup>
import {computed, ref} from "vue";

const count = ref(0);
const newTask = ref("");

const tasks = ref([
    {id: 1, title: "Include example site", done: true},
    {id: 2, title: "Release version 1", done: false}
]);

const addTask = () => {

    tasks.value.push({
        id: (tasks.value.length + 1),
        title: newTask.value,
        done: false
    });

    newTask.value = "";
};

const filteredTasks = computed(() => {
    return tasks.value;
});

</script>

<style lang="css" scoped>

</style>
