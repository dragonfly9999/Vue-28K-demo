import { defineStore } from 'pinia';
import { ref } from 'vue';


export const useCsStore = defineStore('cs', () => {
  const chats = ref<Array<ChatRes>>([]);
  const setChats = (args: Array<ChatRes>) => (chats.value = args);
  const addChats = (chat: ChatRes) => chats.value.push(chat);
  const getChats = () => chats.value;

  return {
    setChats,
    addChats,
    getChats
  };
});
